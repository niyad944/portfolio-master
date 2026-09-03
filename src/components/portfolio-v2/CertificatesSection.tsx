import { Link } from "react-router-dom";
import { ExternalLink, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard, Reveal, Section, SectionHeading, TiltCard } from "./primitives";

interface Cert {
  id: string;
  name: string;
  issuing_organization?: string | null;
  issue_date?: string | null;
  description?: string | null;
  file_path?: string | null;
  mime_type?: string | null;
  file_name?: string | null;
  sdg_goals?: string[] | null;
}

const previewUrl = (c: Cert) => {
  if (!c.file_path) return null;
  const { data } = supabase.storage.from("certificates").getPublicUrl(c.file_path);
  return data?.publicUrl || null;
};
const isImg = (c: Cert) => c.mime_type?.startsWith("image/") || !!c.file_name?.match(/\.(jpe?g|png|gif|webp)$/i);

export const CertificatesSection = ({ certificates, slug }: { certificates: Cert[]; slug: string }) => {
  if (!certificates.length) return null;

  return (
    <Section id="certificates">
      <SectionHeading
        eyebrow="Credentials"
        title={<>Certificates <span className="text-slate-400">& impact.</span></>}
        description="Recognized learning tied to real-world Sustainable Development Goals."
      />

      <div className="space-y-6 md:space-y-8">
        {certificates.map((c, i) => {
          const even = i % 2 === 0;
          const url = previewUrl(c);
          const image = url && isImg(c);
          return (
            <Reveal key={c.id} delay={i * 0.05}>
              <TiltCard max={4}>
                <Link to={`/p/${slug}/document/${c.id}`} className="block w-full text-left group">
                  <GlassCard className="overflow-hidden">
                    <div className={`grid md:grid-cols-2 ${even ? "" : "md:[direction:rtl]"}`}>
                      <div className="relative aspect-[16/10] md:aspect-auto min-h-[240px] overflow-hidden md:[direction:ltr] bg-slate-50">
                        {image ? (
                          <img
                            src={url!}
                            alt={c.name}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--pf-blue))]/10 via-[hsl(var(--pf-violet))]/10 to-slate-100 grid place-items-center">
                            {url ? (
                              <FileText className="h-14 w-14 text-slate-400" />
                            ) : (
                              <span className="font-display text-6xl text-slate-300">{c.name.slice(0, 1)}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-6 sm:p-8 md:[direction:ltr] flex flex-col justify-center">
                        {c.sdg_goals && c.sdg_goals.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {c.sdg_goals.map((s, j) => (
                              <span
                                key={j}
                                className="rounded-full border border-[hsl(var(--pf-blue))]/25 bg-gradient-to-r from-[hsl(var(--pf-cyan))]/12 to-[hsl(var(--pf-violet))]/12 px-4 py-1.5 text-sm sm:text-base font-extrabold tracking-tight bg-clip-text text-transparent [background-image:linear-gradient(90deg,hsl(var(--pf-blue)),hsl(var(--pf-violet)))] transition-transform duration-300 group-hover:scale-[1.03]"
                              >
                                {s.split(":")[0].trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                          {c.name}
                        </h3>
                        {c.issuing_organization && (
                          <p className="mt-2 text-sm sm:text-base font-medium text-slate-600">{c.issuing_organization}</p>
                        )}
                        {c.issue_date && (
                          <p className="mt-1 text-xs font-mono uppercase tracking-widest text-slate-400">
                            {new Date(c.issue_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </p>
                        )}
                        {c.description && (
                          <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed line-clamp-4">{c.description}</p>
                        )}
                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--pf-blue))]">
                          View certificate <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
};
