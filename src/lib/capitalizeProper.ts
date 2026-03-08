/**
 * Capitalizes the first letter of each word while preserving known acronyms.
 * Trims extra spaces between words.
 */

const ACRONYMS = new Set([
  "HTML", "CSS", "SQL", "AI", "API", "AWS", "GCP", "UI", "UX", "REST",
  "SDK", "CLI", "JSON", "XML", "HTTP", "HTTPS", "DNS", "TCP", "IP",
  "SSH", "SSL", "TLS", "JWT", "OAuth", "SAML", "LDAP", "SMTP", "IMAP",
  "FTP", "SFTP", "CI", "CD", "DevOps", "IoT", "ML", "NLP", "CV",
  "PHP", "JS", "TS", "JSX", "TSX", "NPM", "YAML", "TOML", "PDF",
  "PNG", "JPG", "SVG", "GIF", "CSV", "XLS", "XLSX", "DOC", "DOCX",
  "SEO", "SEM", "CRM", "ERP", "SaaS", "PaaS", "IaaS", "NoSQL",
  "GraphQL", "gRPC", "WebGL", "OpenGL", "CUDA", "WASM",
]);

// Lowercase lookup map for fast matching
const ACRONYM_MAP = new Map<string, string>();
ACRONYMS.forEach((a) => ACRONYM_MAP.set(a.toLowerCase(), a));

export function capitalizeProper(input: string): string {
  if (!input) return input;

  return input
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      // Check if it's a known acronym
      if (ACRONYM_MAP.has(lower)) {
        return ACRONYM_MAP.get(lower)!;
      }
      // Check with common punctuation stripped (e.g. "html," → "HTML,")
      const stripped = lower.replace(/[^a-z]/g, "");
      if (ACRONYM_MAP.has(stripped)) {
        return word.replace(new RegExp(stripped, "i"), ACRONYM_MAP.get(stripped)!);
      }
      // Standard title case
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
