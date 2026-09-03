import { useState } from "react";
import { Mail, MapPin, Send, Linkedin, Github, Globe } from "lucide-react";
import { GlassCard, MagneticButton, Reveal, Section, SectionHeading } from "./primitives";
import { toast } from "@/hooks/use-toast";

interface ContactProps {
  email?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  location?: string | null;
  fullName: string;
}

export const ContactSection = ({ email, linkedin, github, portfolio, location, fullName }: ContactProps) => {
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Portfolio inquiry from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
    if (email) {
      setBusy(true);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setTimeout(() => setBusy(false), 800);
      toast({ title: "Opening your email client", description: "Say hi — I read every message." });
    } else {
      toast({ title: "Contact not available", description: "This portfolio hasn't published an email." });
    }
  };

  return (
    <Section id="contact">
      <SectionHeading eyebrow="Let's talk" title={<>Get in <span className="text-slate-500">touch.</span></>} description="Have an idea, a role, or just want to say hi? The inbox is open." />

      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6">
        <Reveal>
          <GlassCard className="p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Name</span>
                  <input required name="name" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[hsl(var(--pf-cyan))]/60 focus:outline-none transition" placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Email</span>
                  <input required type="email" name="email" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[hsl(var(--pf-cyan))]/60 focus:outline-none transition" placeholder="you@example.com" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Message</span>
                <textarea required name="message" rows={5} className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[hsl(var(--pf-cyan))]/60 focus:outline-none transition" placeholder={`Hi ${fullName.split(" ")[0]}, I'd love to...`} />
              </label>
              <MagneticButton type="submit" disabled={busy} className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 mt-2">
                <Send className="h-4 w-4" />
                {busy ? "Sending…" : "Send message"}
              </MagneticButton>
            </form>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4 h-full">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Available now
              </div>
              <p className="mt-2 text-slate-700">Typically reply within a day.</p>
            </GlassCard>

            <GlassCard className="p-6 space-y-3">
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition">
                  <Mail className="h-4 w-4 text-[hsl(var(--pf-cyan))]" /> {email}
                </a>
              )}
              {location && (
                <p className="flex items-center gap-3 text-slate-600">
                  <MapPin className="h-4 w-4 text-[hsl(var(--pf-cyan))]" /> {location}
                </p>
              )}
              <div className="flex items-center gap-2 pt-2">
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    className="h-10 w-10 grid place-items-center rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {github && (
                  <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                    className="h-10 w-10 grid place-items-center rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition">
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {portfolio && (
                  <a href={portfolio} target="_blank" rel="noopener noreferrer" aria-label="Personal site"
                    className="h-10 w-10 grid place-items-center rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition">
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            </GlassCard>
          </div>
        </Reveal>
      </div>
    </Section>
  );
};
