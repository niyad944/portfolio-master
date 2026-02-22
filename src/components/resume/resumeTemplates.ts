// Resume template styles - 4 distinct layouts
// Each returns full HTML for print/download

interface ResumeData {
  profile: {
    full_name?: string;
    bio?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    github_url?: string;
  };
  skills: Array<{ name: string; proficiency_level?: string }>;
  education: Array<{
    degree: string;
    institution: string;
    field_of_study?: string;
    start_date?: string;
    end_date?: string;
    grade?: string;
  }>;
  projects: Array<{
    title: string;
    description?: string;
    technologies?: string[];
  }>;
  achievements: Array<{
    title: string;
    description?: string;
    issuer?: string;
  }>;
}

const contactLine = (p: ResumeData["profile"]) => {
  const parts: string[] = [];
  if (p?.email) parts.push(p.email);
  if (p?.phone) parts.push(p.phone);
  if (p?.location) parts.push(p.location);
  return parts;
};

const contactLinks = (p: ResumeData["profile"]) => {
  const links: string[] = [];
  if (p?.linkedin_url) links.push(`<a href="${p.linkedin_url}" style="color:inherit;text-decoration:none;">LinkedIn</a>`);
  if (p?.github_url) links.push(`<a href="${p.github_url}" style="color:inherit;text-decoration:none;">GitHub</a>`);
  return links;
};

// ─── TEMPLATE 1: Minimal Corporate ───────────────────────────────────
function minimalCorporate(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;
  const contact = [...contactLine(p), ...contactLinks(p)].join("  |  ");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@page { margin: 0.6in 0.7in; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10.5pt; line-height: 1.55; color: #222; background: #fff; }
.page { max-width: 7.5in; margin: 0 auto; padding: 0.6in 0; }
.name { font-size: 22pt; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; color: #111; margin-bottom: 6px; }
.contact { font-size: 9pt; color: #666; letter-spacing: 0.5px; margin-bottom: 24px; }
.contact a { color: #666; }
.divider { border: none; border-top: 1px solid #ccc; margin: 0 0 20px 0; }
.section { margin-bottom: 20px; }
.section-title { font-size: 9pt; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #444; margin-bottom: 10px; }
.bio { font-size: 10pt; color: #444; line-height: 1.65; }
.skills-row { display: flex; flex-wrap: wrap; gap: 6px; }
.skill-tag { font-size: 9pt; color: #555; border: 1px solid #ddd; padding: 2px 10px; border-radius: 2px; }
.item { margin-bottom: 12px; page-break-inside: avoid; }
.item-row { display: flex; justify-content: space-between; align-items: baseline; }
.item-title { font-weight: 600; font-size: 10.5pt; color: #222; }
.item-date { font-size: 9pt; color: #888; }
.item-sub { font-size: 9.5pt; color: #555; }
.item-desc { font-size: 9.5pt; color: #555; margin-top: 3px; line-height: 1.5; }
.tech { font-size: 8.5pt; color: #777; margin-top: 2px; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { padding: 0; } }
</style></head><body><div class="page">
<div class="name">${p?.full_name || "Your Name"}</div>
<div class="contact">${contact}</div>
<hr class="divider">
${p?.bio ? `<div class="section"><div class="section-title">Summary</div><p class="bio">${p.bio}</p></div>` : ""}
${skills.length ? `<div class="section"><div class="section-title">Skills</div><div class="skills-row">${skills.map(s => `<span class="skill-tag">${s.name}</span>`).join("")}</div></div>` : ""}
${education.length ? `<div class="section"><div class="section-title">Education</div>${education.map(e => `<div class="item"><div class="item-row"><span class="item-title">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.grade ? ` · ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}
${projects.length ? `<div class="section"><div class="section-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">${p2.technologies.join(" · ")}</div>` : ""}</div>`).join("")}</div>` : ""}
${achievements.length ? `<div class="section"><div class="section-title">Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── TEMPLATE 2: Modern Creative ─────────────────────────────────────
function modernCreative(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@page { margin: 0; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.5; color: #1a1a2e; background: #fff; }
.page { display: grid; grid-template-columns: 220px 1fr; min-height: 11in; }
.sidebar { background: #1a1a2e; color: #e8e8f0; padding: 40px 24px; }
.sidebar .name { font-size: 18pt; font-weight: 700; color: #fff; margin-bottom: 4px; line-height: 1.2; }
.sidebar .tagline { font-size: 9pt; color: #a0a0c0; margin-bottom: 28px; }
.sidebar .section-title { font-size: 8pt; text-transform: uppercase; letter-spacing: 2px; color: #6c63ff; margin-bottom: 10px; font-weight: 600; }
.sidebar .contact-item { font-size: 9pt; color: #c8c8e0; margin-bottom: 6px; word-break: break-all; }
.sidebar .contact-item a { color: #8b83ff; text-decoration: none; }
.sidebar .skills-list { list-style: none; }
.sidebar .skills-list li { font-size: 9pt; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.sidebar .skill-bar { height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 3px; }
.sidebar .skill-fill { height: 100%; background: #6c63ff; border-radius: 2px; }
.sidebar .section { margin-bottom: 24px; }
.main { padding: 40px 36px; }
.main .section { margin-bottom: 22px; }
.main .section-title { font-size: 10pt; font-weight: 600; color: #6c63ff; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 6px; border-bottom: 2px solid #6c63ff; margin-bottom: 12px; }
.bio { font-size: 10pt; color: #444; line-height: 1.7; }
.item { margin-bottom: 14px; page-break-inside: avoid; }
.item-row { display: flex; justify-content: space-between; align-items: baseline; }
.item-title { font-weight: 600; font-size: 10.5pt; color: #1a1a2e; }
.item-date { font-size: 8.5pt; color: #999; background: #f4f3ff; padding: 1px 8px; border-radius: 10px; }
.item-sub { font-size: 9.5pt; color: #666; }
.item-desc { font-size: 9.5pt; color: #555; margin-top: 4px; }
.tech { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.tech span { font-size: 8pt; background: #f0eeff; color: #6c63ff; padding: 2px 8px; border-radius: 10px; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body><div class="page">
<div class="sidebar">
<div class="name">${p?.full_name || "Your Name"}</div>
<div class="tagline">Professional Resume</div>
<div class="section">
<div class="section-title">Contact</div>
${p?.email ? `<div class="contact-item">${p.email}</div>` : ""}
${p?.phone ? `<div class="contact-item">${p.phone}</div>` : ""}
${p?.location ? `<div class="contact-item">${p.location}</div>` : ""}
${p?.linkedin_url ? `<div class="contact-item"><a href="${p.linkedin_url}">LinkedIn</a></div>` : ""}
${p?.github_url ? `<div class="contact-item"><a href="${p.github_url}">GitHub</a></div>` : ""}
</div>
${skills.length ? `<div class="section"><div class="section-title">Skills</div><ul class="skills-list">${skills.map((s, i) => {
  const level = s.proficiency_level === "Expert" ? 100 : s.proficiency_level === "Advanced" ? 80 : s.proficiency_level === "Intermediate" ? 60 : 40;
  return `<li>${s.name}<div class="skill-bar"><div class="skill-fill" style="width:${level}%"></div></div></li>`;
}).join("")}</ul></div>` : ""}
</div>
<div class="main">
${p?.bio ? `<div class="section"><div class="section-title">About</div><p class="bio">${p.bio}</p></div>` : ""}
${education.length ? `<div class="section"><div class="section-title">Education</div>${education.map(e => `<div class="item"><div class="item-row"><span class="item-title">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.grade ? ` · ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}
${projects.length ? `<div class="section"><div class="section-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">${p2.technologies.map(t => `<span>${t}</span>`).join("")}</div>` : ""}</div>`).join("")}</div>` : ""}
${achievements.length ? `<div class="section"><div class="section-title">Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
</div>
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── TEMPLATE 3: Elegant Professional ────────────────────────────────
function elegantProfessional(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;
  const contact = [...contactLine(p), ...contactLinks(p)].join("  ·  ");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
@page { margin: 0.65in 0.8in; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Lato', sans-serif; font-size: 10pt; line-height: 1.55; color: #2c2c2c; background: #fff; }
.page { max-width: 7.5in; margin: 0 auto; padding: 0.5in 0; }
.header { text-align: center; margin-bottom: 32px; }
.name { font-family: 'Cormorant Garamond', serif; font-size: 30pt; font-weight: 600; color: #1a1a1a; letter-spacing: 3px; margin-bottom: 8px; }
.contact { font-size: 9pt; color: #888; letter-spacing: 1px; }
.contact a { color: #888; text-decoration: none; }
.header-line { width: 60px; height: 1px; background: #b8860b; margin: 16px auto 0; }
.section { margin-bottom: 24px; }
.section-title { font-family: 'Cormorant Garamond', serif; font-size: 13pt; font-weight: 600; color: #1a1a1a; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e0d8c8; }
.bio { font-size: 10pt; color: #444; line-height: 1.75; font-weight: 300; }
.skills-row { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag { font-size: 9pt; color: #555; background: #faf8f4; border: 1px solid #e8e2d8; padding: 3px 14px; border-radius: 20px; font-weight: 400; }
.item { margin-bottom: 16px; page-break-inside: avoid; }
.item-row { display: flex; justify-content: space-between; align-items: baseline; }
.item-title { font-weight: 700; font-size: 10.5pt; color: #1a1a1a; }
.item-date { font-size: 8.5pt; color: #aaa; font-style: italic; }
.item-sub { font-size: 9.5pt; color: #777; font-weight: 300; }
.item-desc { font-size: 9.5pt; color: #555; margin-top: 4px; line-height: 1.6; font-weight: 300; }
.tech { font-size: 8.5pt; color: #999; margin-top: 3px; font-style: italic; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { padding: 0; } }
</style></head><body><div class="page">
<div class="header">
<div class="name">${p?.full_name || "Your Name"}</div>
<div class="contact">${contact}</div>
<div class="header-line"></div>
</div>
${p?.bio ? `<div class="section"><div class="section-title">Professional Summary</div><p class="bio">${p.bio}</p></div>` : ""}
${skills.length ? `<div class="section"><div class="section-title">Expertise</div><div class="skills-row">${skills.map(s => `<span class="skill-tag">${s.name}</span>`).join("")}</div></div>` : ""}
${education.length ? `<div class="section"><div class="section-title">Education</div>${education.map(e => `<div class="item"><div class="item-row"><span class="item-title">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.grade ? ` · ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}
${projects.length ? `<div class="section"><div class="section-title">Selected Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">${p2.technologies.join(" · ")}</div>` : ""}</div>`).join("")}</div>` : ""}
${achievements.length ? `<div class="section"><div class="section-title">Honors & Awards</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── TEMPLATE 4: Compact Technical ───────────────────────────────────
function compactTechnical(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;

  // Group skills by proficiency
  const grouped: Record<string, string[]> = {};
  skills.forEach(s => {
    const lvl = s.proficiency_level || "Other";
    if (!grouped[lvl]) grouped[lvl] = [];
    grouped[lvl].push(s.name);
  });

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
@page { margin: 0.4in 0.5in; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; font-size: 9.5pt; line-height: 1.45; color: #1e1e1e; background: #fff; }
.page { max-width: 7.5in; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 10px; border-bottom: 2px solid #0ea5e9; margin-bottom: 14px; }
.name { font-size: 20pt; font-weight: 700; color: #0c4a6e; }
.contact-col { text-align: right; font-size: 8.5pt; color: #555; line-height: 1.6; }
.contact-col a { color: #0ea5e9; text-decoration: none; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
.section { margin-bottom: 14px; }
.section-title { font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #0ea5e9; margin-bottom: 8px; padding: 3px 0; border-bottom: 1px solid #e2e8f0; }
.bio { font-size: 9pt; color: #444; line-height: 1.55; }
.skill-group { margin-bottom: 6px; }
.skill-label { font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #0ea5e9; font-weight: 500; margin-bottom: 2px; }
.skill-items { font-size: 9pt; color: #333; }
.item { margin-bottom: 10px; page-break-inside: avoid; }
.item-row { display: flex; justify-content: space-between; align-items: baseline; }
.item-title { font-weight: 600; font-size: 9.5pt; color: #1e1e1e; }
.item-date { font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #888; }
.item-sub { font-size: 8.5pt; color: #666; }
.item-desc { font-size: 8.5pt; color: #555; margin-top: 2px; line-height: 1.45; }
.tech { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 3px; }
.tech span { font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; background: #f0f9ff; color: #0369a1; padding: 1px 6px; border-radius: 2px; border: 1px solid #bae6fd; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body><div class="page">
<div class="header">
<div class="name">${p?.full_name || "Your Name"}</div>
<div class="contact-col">
${p?.email ? `<div>${p.email}</div>` : ""}
${p?.phone ? `<div>${p.phone}</div>` : ""}
${p?.location ? `<div>${p.location}</div>` : ""}
${p?.linkedin_url ? `<div><a href="${p.linkedin_url}">LinkedIn</a></div>` : ""}
${p?.github_url ? `<div><a href="${p.github_url}">GitHub</a></div>` : ""}
</div>
</div>
${p?.bio ? `<div class="section"><div class="section-title">// Summary</div><p class="bio">${p.bio}</p></div>` : ""}
<div class="two-col">
<div>
${skills.length ? `<div class="section"><div class="section-title">// Tech Stack</div>${Object.entries(grouped).map(([lvl, names]) => `<div class="skill-group"><div class="skill-label">${lvl}</div><div class="skill-items">${names.join(", ")}</div></div>`).join("")}</div>` : ""}
${education.length ? `<div class="section"><div class="section-title">// Education</div>${education.map(e => `<div class="item"><div class="item-row"><span class="item-title">${e.degree}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.field_of_study ? ` · ${e.field_of_study}` : ""}${e.grade ? ` · ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}
</div>
<div>
${projects.length ? `<div class="section"><div class="section-title">// Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">${p2.technologies.map(t => `<span>${t}</span>`).join("")}</div>` : ""}</div>`).join("")}</div>` : ""}
${achievements.length ? `<div class="section"><div class="section-title">// Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
</div>
</div>
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── Template map ────────────────────────────────────────────────────
export const resumeTemplateGenerators: Record<string, (d: ResumeData) => string> = {
  professional: minimalCorporate,
  modern: modernCreative,
  creative: elegantProfessional,
  minimal: compactTechnical,
  // Fallbacks for any template_key
  "minimal-corporate": minimalCorporate,
  "modern-creative": modernCreative,
  "elegant-professional": elegantProfessional,
  "compact-technical": compactTechnical,
};

export const getResumeHTML = (templateKey: string, data: ResumeData): string => {
  const generator = resumeTemplateGenerators[templateKey] || minimalCorporate;
  return generator(data);
};

// Preview-friendly styles for each template (used in in-app preview)
export type TemplatePreviewStyle = {
  headerClass: string;
  nameClass: string;
  contactClass: string;
  sectionTitleClass: string;
  skillClass: string;
  accentColor: string;
  layout: "single" | "sidebar" | "two-col";
};

export const templatePreviewStyles: Record<string, TemplatePreviewStyle> = {
  professional: {
    headerClass: "text-left mb-6 pb-4 border-b border-border",
    nameClass: "text-2xl font-light tracking-[3px] uppercase text-foreground",
    contactClass: "text-xs text-muted-foreground tracking-wide",
    sectionTitleClass: "text-[10px] font-semibold uppercase tracking-[2px] text-muted-foreground mb-2 pb-1 border-b border-border",
    skillClass: "px-2 py-0.5 text-[10px] border border-border rounded-sm text-muted-foreground",
    accentColor: "text-muted-foreground",
    layout: "single",
  },
  modern: {
    headerClass: "text-left mb-6 pb-4",
    nameClass: "text-2xl font-bold text-foreground",
    contactClass: "text-xs text-muted-foreground",
    sectionTitleClass: "text-xs font-semibold uppercase tracking-[1.5px] text-purple-400 mb-2 pb-1 border-b-2 border-purple-400",
    skillClass: "px-2 py-0.5 text-[10px] bg-purple-500/10 text-purple-400 rounded-full",
    accentColor: "text-purple-400",
    layout: "sidebar",
  },
  creative: {
    headerClass: "text-center mb-8 pb-4",
    nameClass: "text-3xl font-display font-semibold tracking-[3px] text-foreground",
    contactClass: "text-xs text-muted-foreground tracking-wide",
    sectionTitleClass: "text-sm font-display font-semibold uppercase tracking-[2px] text-foreground mb-3 pb-2 border-b border-amber-600/30",
    skillClass: "px-3 py-1 text-[10px] bg-amber-500/5 border border-amber-600/20 rounded-full text-muted-foreground",
    accentColor: "text-amber-600",
    layout: "single",
  },
  minimal: {
    headerClass: "flex justify-between items-end mb-4 pb-2 border-b-2 border-sky-500",
    nameClass: "text-xl font-bold text-sky-700 dark:text-sky-400",
    contactClass: "text-[10px] text-muted-foreground text-right",
    sectionTitleClass: "text-[10px] font-mono font-semibold uppercase tracking-[1.5px] text-sky-500 mb-2 pb-1 border-b border-border",
    skillClass: "px-1.5 py-0.5 text-[9px] font-mono bg-sky-500/5 border border-sky-500/20 rounded-sm text-sky-600 dark:text-sky-400",
    accentColor: "text-sky-500",
    layout: "two-col",
  },
};
