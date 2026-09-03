import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
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
        title={<>Certificates <span className="text-slate-500">& impact.</span></>}
        description="Recognized learning tied to real-world Sustainable Development Goals."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map((c, i) => {
          const url = previewUrl(c);
          const image = url && isImg(c);
          return (
            <Reveal key={c.id} delay={i * 0.06}>
              <TiltCard max={5}>
                <GlassCard className="overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[hsl(var(--pf-blue))]/20 to-[hsl(var(--pf-violet))]/20">
                    {image ? (
                      <img src={url!} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center font-display text-4xl text-slate-400">
                        {c.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    {c.sdg_goals && c.sdg_goals.length > 0 && (
                      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                        {c.sdg_goals.slice(0, 3).map((s, j) => (
                          <span
                            key={j}
                            className="rounded-lg bg-white/85 backdrop-blur px-2.5 py-1 text-xs font-extrabold tracking-wide text-slate-900 border border-slate-200 shadow-[0_0_16px_hsl(var(--pf-cyan)/0.35)]"
                          >
                            {s.split(":")[0]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display text-lg font-semibold text-slate-900 line-clamp-2">{c.name}</h3>
                    {c.issuing_organization && (
                      <p className="mt-1 text-sm text-slate-500">{c.issuing_organization}</p>
                    )}
                    {c.issue_date && (
                      <p className="mt-1 text-xs font-mono text-slate-400">
                        {new Date(c.issue_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </p>
                    )}
                    <Link
                      to={`/p/${slug}/document/${c.id}`}
                      className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm text-[hsl(var(--pf-cyan))] hover:gap-2 transition-all"
                    >
                      View certificate <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </GlassCard>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
};
