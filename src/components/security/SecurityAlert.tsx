import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Smartphone,
  X,
  CheckCircle2
} from "lucide-react";

interface SecurityAlertProps {
  type: "new_device" | "suspicious";
  message?: string;
  onDismiss: () => void;
  onConfirm?: () => void;
}

const SecurityAlert = ({ type, message, onDismiss, onConfirm }: SecurityAlertProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isNewDevice = type === "new_device";

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4 duration-300 ${
      isNewDevice ? "bg-accent/10 border-accent/30" : "bg-secondary border-border"
    } border rounded-xl p-4 shadow-lg`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isNewDevice ? "bg-accent/20" : "bg-muted"
        }`}>
          {isNewDevice ? (
            <Smartphone className="w-5 h-5 text-accent" />
          ) : (
            <Shield className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1">
          <h4 className="font-medium mb-1 text-foreground">
            {isNewDevice ? "New Device Detected" : "Security Notice"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {message || (isNewDevice 
              ? "We noticed you're logging in from a new device. If this is you, no action needed!"
              : "We noticed some unusual activity. Just checking in to make sure it's you."
            )}
          </p>

          <div className="flex items-center gap-2 mt-3">
            {onConfirm && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onConfirm();
                  setDismissed(true);
                }}
                className="border-accent/50 text-accent hover:bg-accent/10"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                It's me
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                onDismiss();
                setDismissed(true);
              }}
              className="text-muted-foreground"
            >
              Dismiss
            </Button>
          </div>
        </div>

        <button
          onClick={() => {
            onDismiss();
            setDismissed(true);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SecurityAlert;
