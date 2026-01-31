import { supabase } from "@/integrations/supabase/client";

interface DeviceInfo {
  deviceType: string;
  browser: string;
  os: string;
  fingerprint: string;
}

const getDeviceInfo = (): DeviceInfo => {
  const ua = navigator.userAgent;
  
  // Detect device type
  let deviceType = "desktop";
  if (/mobile/i.test(ua)) deviceType = "mobile";
  else if (/tablet|ipad/i.test(ua)) deviceType = "tablet";

  // Detect browser
  let browser = "Unknown";
  if (ua.includes("Chrome") && !ua.includes("Edge")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edge")) browser = "Edge";

  // Detect OS
  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  // Generate a simple device fingerprint
  const fingerprint = btoa(`${navigator.language}-${screen.width}x${screen.height}-${deviceType}-${browser}-${os}`).substring(0, 16);

  return { deviceType, browser, os, fingerprint };
};

export const logActivity = async (
  userId: string,
  action: string,
  metadata?: Record<string, any>
) => {
  const deviceInfo = getDeviceInfo();
  
  try {
    await supabase.from("activity_logs").insert({
      user_id: userId,
      action,
      user_agent: navigator.userAgent,
      device_type: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      device_fingerprint: deviceInfo.fingerprint,
      metadata
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

export const checkSuspiciousActivity = async (userId: string): Promise<{
  isSuspicious: boolean;
  reason?: string;
  newDevice?: boolean;
}> => {
  const deviceInfo = getDeviceInfo();

  // Get recent activity logs
  const { data: recentLogs } = await supabase
    .from("activity_logs")
    .select("device_fingerprint, created_at, action")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!recentLogs || recentLogs.length === 0) {
    return { isSuspicious: false };
  }

  // Check for new device
  const knownFingerprints = new Set(recentLogs.map(log => log.device_fingerprint).filter(Boolean));
  const isNewDevice = !knownFingerprints.has(deviceInfo.fingerprint);

  // Check for unusual login frequency (more than 10 logins in last hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentLogins = recentLogs.filter(
    log => log.action === "login" && new Date(log.created_at) > oneHourAgo
  );
  const unusualFrequency = recentLogins.length > 10;

  const isSuspicious = unusualFrequency;
  let reason: string | undefined;

  if (unusualFrequency) {
    reason = "Unusual number of login attempts detected";
  }

  return {
    isSuspicious,
    reason,
    newDevice: isNewDevice
  };
};

export const useActivityLogger = () => {
  return {
    logActivity,
    checkSuspiciousActivity,
    getDeviceInfo
  };
};

export default useActivityLogger;
