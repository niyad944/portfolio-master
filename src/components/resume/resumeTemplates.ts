// Resume template styles - 4 genuinely distinct layouts
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

// ─── TEMPLATE 1: Professional ────────────────────────────────────────
// Traditional single-column, top-down layout. Conservative serif headings,
// strong horizontal rules separating sections. ATS-optimized.
function professionalResume(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;
  const contact = [...contactLine(p), ...contactLinks(p)].join("  ·  ");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
@page { margin: 0.7in 0.75in; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Source Sans 3', 'Segoe UI', sans-serif; font-size: 10.5pt; line-height: 1.55; color: #222; background: #fff; }
.page { max-width: 7.5in; margin: 0 auto; padding: 0.6in 0; }

/* Header - centered, traditional */
.header { text-align: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #222; }
.name { font-family: 'Merriweather', Georgia, serif; font-size: 24pt; font-weight: 700; color: #111; letter-spacing: 1px; margin-bottom: 6px; }
.contact { font-size: 9.5pt; color: #555; letter-spacing: 0.3px; }
.contact a { color: #555; }

/* Sections */
.section { margin-bottom: 18px; }
.section-title { font-family: 'Merriweather', Georgia, serif; font-size: 11pt; font-weight: 700; color: #111; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #bbb; }
.bio { font-size: 10pt; color: #333; line-height: 1.7; }

/* Skills - inline pipe-separated */
.skills-inline { font-size: 10pt; color: #333; line-height: 1.8; }

/* Items */
.item { margin-bottom: 12px; page-break-inside: avoid; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
.item-title { font-weight: 700; font-size: 10.5pt; color: #111; }
.item-date { font-size: 9pt; color: #666; font-style: italic; }
.item-sub { font-size: 9.5pt; color: #555; }
.item-desc { font-size: 9.5pt; color: #444; margin-top: 3px; line-height: 1.55; }
.tech { font-size: 9pt; color: #666; margin-top: 2px; }

@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { padding: 0; } }
</style></head><body><div class="page">

<div class="header">
  <div class="name">${p?.full_name || "Your Name"}</div>
  <div class="contact">${contact}</div>
</div>

${p?.bio ? `<div class="section"><div class="section-title">Professional Summary</div><p class="bio">${p.bio}</p></div>` : ""}

${skills.length ? `<div class="section"><div class="section-title">Core Competencies</div><p class="skills-inline">${skills.map(s => s.name).join("  |  ")}</p></div>` : ""}

${education.length ? `<div class="section"><div class="section-title">Education</div>${education.map(e => `<div class="item"><div class="item-header"><span class="item-title">${e.degree}${e.field_of_study ? `, ${e.field_of_study}` : ""}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.grade ? ` — ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}

${projects.length ? `<div class="section"><div class="section-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">Technologies: ${p2.technologies.join(", ")}</div>` : ""}</div>`).join("")}</div>` : ""}

${achievements.length ? `<div class="section"><div class="section-title">Awards & Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}

</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── TEMPLATE 2: Modern ─────────────────────────────────────────────
// Left sidebar with contact + skills. Main content right. Bold accent line.
// Contemporary sans-serif throughout with colored section markers.
function modernResume(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;

  const skillLevel = (s: { proficiency_level?: string }) => {
    if (s.proficiency_level === "Expert") return 5;
    if (s.proficiency_level === "Advanced") return 4;
    if (s.proficiency_level === "Intermediate") return 3;
    return 2;
  };

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
@page { margin: 0; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Outfit', sans-serif; font-size: 10pt; line-height: 1.5; color: #1a1a2e; background: #fff; }
.page { display: grid; grid-template-columns: 230px 1fr; min-height: 11in; }

/* Sidebar */
.sidebar { background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%); color: #d0d0e8; padding: 44px 26px 40px; }
.sidebar .name { font-size: 19pt; font-weight: 700; color: #fff; line-height: 1.15; margin-bottom: 2px; }
.sidebar .subtitle { font-size: 9pt; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 32px; }
.sidebar .sec-title { font-size: 8pt; text-transform: uppercase; letter-spacing: 2.5px; color: #5b8dee; margin-bottom: 10px; font-weight: 600; }
.sidebar .sec { margin-bottom: 26px; }
.sidebar .contact-item { font-size: 9pt; color: #b8b8d0; margin-bottom: 5px; }
.sidebar .contact-item a { color: #7ea8ff; text-decoration: none; }
.sidebar .skill-item { display: flex; justify-content: space-between; align-items: center; font-size: 9pt; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.sidebar .skill-dots { display: flex; gap: 3px; }
.sidebar .dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.15); }
.sidebar .dot.filled { background: #5b8dee; }

/* Main */
.main { padding: 44px 40px 40px; }
.main .sec { margin-bottom: 22px; }
.main .sec-title { font-size: 10pt; font-weight: 600; color: #1a1a2e; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; padding-left: 14px; border-left: 3px solid #5b8dee; }
.bio { font-size: 10pt; color: #444; line-height: 1.7; }
.item { margin-bottom: 14px; page-break-inside: avoid; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; }
.item-title { font-weight: 600; font-size: 10.5pt; color: #1a1a2e; }
.item-date { font-size: 8.5pt; color: #888; background: #f0f4ff; padding: 1px 10px; border-radius: 10px; }
.item-sub { font-size: 9.5pt; color: #666; }
.item-desc { font-size: 9.5pt; color: #555; margin-top: 4px; line-height: 1.55; }
.tech-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
.tech-tags span { font-size: 8pt; background: #eef2ff; color: #4366b0; padding: 2px 9px; border-radius: 10px; }

@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body><div class="page">

<div class="sidebar">
  <div class="name">${p?.full_name || "Your Name"}</div>
  <div class="subtitle">Resume</div>

  <div class="sec">
    <div class="sec-title">Contact</div>
    ${p?.email ? `<div class="contact-item">${p.email}</div>` : ""}
    ${p?.phone ? `<div class="contact-item">${p.phone}</div>` : ""}
    ${p?.location ? `<div class="contact-item">${p.location}</div>` : ""}
    ${p?.linkedin_url ? `<div class="contact-item"><a href="${p.linkedin_url}">LinkedIn</a></div>` : ""}
    ${p?.github_url ? `<div class="contact-item"><a href="${p.github_url}">GitHub</a></div>` : ""}
  </div>

  ${skills.length ? `<div class="sec"><div class="sec-title">Skills</div>${skills.map(s => {
    const level = skillLevel(s);
    const dots = Array.from({length: 5}, (_, i) => `<div class="dot${i < level ? ' filled' : ''}"></div>`).join('');
    return `<div class="skill-item"><span>${s.name}</span><div class="skill-dots">${dots}</div></div>`;
  }).join("")}</div>` : ""}
</div>

<div class="main">
  ${p?.bio ? `<div class="sec"><div class="sec-title">About</div><p class="bio">${p.bio}</p></div>` : ""}

  ${education.length ? `<div class="sec"><div class="sec-title">Education</div>${education.map(e => `<div class="item"><div class="item-header"><span class="item-title">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.grade ? ` · ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}

  ${projects.length ? `<div class="sec"><div class="sec-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech-tags">${p2.technologies.map(t => `<span>${t}</span>`).join("")}</div>` : ""}</div>`).join("")}</div>` : ""}

  ${achievements.length ? `<div class="sec"><div class="sec-title">Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
</div>

</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── TEMPLATE 3: Minimal ────────────────────────────────────────────
// Ultra-clean single column. No borders, no boxes, no color. Pure whitespace
// and typography hierarchy. Generous margins and line-height.
function minimalResume(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;
  const contactParts = [...contactLine(p), ...contactLinks(p)];

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
@page { margin: 0.9in 1in; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'IBM Plex Sans', 'Helvetica Neue', sans-serif; font-size: 10pt; line-height: 1.65; color: #333; background: #fff; }
.page { max-width: 6.5in; margin: 0 auto; padding: 0.5in 0; }

/* Header - left aligned, airy */
.header { margin-bottom: 36px; }
.name { font-size: 28pt; font-weight: 300; color: #111; letter-spacing: -0.5px; margin-bottom: 8px; }
.contact { font-size: 9pt; color: #999; }
.contact a { color: #999; }
.contact span + span::before { content: "  ·  "; color: #ccc; }

/* Sections - minimal dividers */
.section { margin-bottom: 28px; }
.section-title { font-size: 9pt; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 14px; }
.bio { font-size: 10pt; color: #555; line-height: 1.8; font-weight: 300; }

/* Skills - comma list */
.skills-text { font-size: 10pt; color: #555; font-weight: 300; line-height: 1.8; }

/* Items - spacious */
.item { margin-bottom: 18px; page-break-inside: avoid; }
.item-title { font-weight: 500; font-size: 10.5pt; color: #222; }
.item-meta { font-size: 9pt; color: #999; margin-top: 1px; }
.item-desc { font-size: 9.5pt; color: #666; margin-top: 4px; line-height: 1.65; font-weight: 300; }
.tech { font-size: 9pt; color: #aaa; margin-top: 3px; font-weight: 300; }

@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { padding: 0; } }
</style></head><body><div class="page">

<div class="header">
  <div class="name">${p?.full_name || "Your Name"}</div>
  <div class="contact">${contactParts.map(c => `<span>${c}</span>`).join("")}</div>
</div>

${p?.bio ? `<div class="section"><div class="section-title">Summary</div><p class="bio">${p.bio}</p></div>` : ""}

${skills.length ? `<div class="section"><div class="section-title">Skills</div><p class="skills-text">${skills.map(s => s.name).join(", ")}</p></div>` : ""}

${education.length ? `<div class="section"><div class="section-title">Education</div>${education.map(e => `<div class="item"><div class="item-title">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}</div><div class="item-meta">${e.institution}${e.grade ? ` · ${e.grade}` : ""} · ${e.start_date || ""} – ${e.end_date || "Present"}</div></div>`).join("")}</div>` : ""}

${projects.length ? `<div class="section"><div class="section-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">${p2.technologies.join(", ")}</div>` : ""}</div>`).join("")}</div>` : ""}

${achievements.length ? `<div class="section"><div class="section-title">Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-meta">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}

</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── TEMPLATE 4: Creative ───────────────────────────────────────────
// Bold header band with name on dark background. Two-column body below.
// Skills as colored chips, monospace accents, asymmetric layout.
function creativeResume(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;

  // Group skills by category
  const grouped: Record<string, string[]> = {};
  skills.forEach(s => {
    const cat = s.proficiency_level || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s.name);
  });

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
@page { margin: 0; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Space Grotesk', sans-serif; font-size: 9.5pt; line-height: 1.5; color: #1e1e1e; background: #fff; }

/* Hero header band */
.header-band { background: #111; color: #fff; padding: 36px 44px 32px; display: flex; justify-content: space-between; align-items: flex-end; }
.header-left .name { font-size: 26pt; font-weight: 700; letter-spacing: -0.5px; line-height: 1.1; }
.header-left .tagline { font-family: 'DM Mono', monospace; font-size: 9pt; color: rgba(255,255,255,0.45); margin-top: 6px; letter-spacing: 1px; }
.header-right { text-align: right; font-size: 8.5pt; color: rgba(255,255,255,0.65); line-height: 1.7; }
.header-right a { color: #6ee7b7; text-decoration: none; }

/* Body */
.body { padding: 28px 44px 40px; }
.bio-bar { font-size: 10pt; color: #444; line-height: 1.75; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #e5e5e5; }

/* Two column layout */
.columns { display: grid; grid-template-columns: 1fr 280px; gap: 36px; }
.col-main {}
.col-side {}

.sec { margin-bottom: 22px; }
.sec-title { font-family: 'DM Mono', monospace; font-size: 8.5pt; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; color: #10b981; margin-bottom: 10px; }
.sec-title::before { content: "→ "; }

.item { margin-bottom: 12px; page-break-inside: avoid; }
.item-title { font-weight: 600; font-size: 10pt; color: #111; }
.item-sub { font-size: 8.5pt; color: #888; }
.item-date { font-family: 'DM Mono', monospace; font-size: 8pt; color: #aaa; }
.item-desc { font-size: 9pt; color: #555; margin-top: 3px; line-height: 1.55; }
.tech-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
.tech-chips span { font-family: 'DM Mono', monospace; font-size: 7.5pt; background: #f0fdf4; color: #059669; padding: 2px 8px; border-radius: 3px; border: 1px solid #bbf7d0; }

/* Side skills */
.skill-group { margin-bottom: 10px; }
.skill-label { font-family: 'DM Mono', monospace; font-size: 7.5pt; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.skill-items { font-size: 9pt; color: #444; line-height: 1.7; }

@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>

<div class="header-band">
  <div class="header-left">
    <div class="name">${p?.full_name || "Your Name"}</div>
    <div class="tagline">Portfolio & Resume</div>
  </div>
  <div class="header-right">
    ${p?.email ? `<div>${p.email}</div>` : ""}
    ${p?.phone ? `<div>${p.phone}</div>` : ""}
    ${p?.location ? `<div>${p.location}</div>` : ""}
    ${p?.linkedin_url ? `<div><a href="${p.linkedin_url}">LinkedIn ↗</a></div>` : ""}
    ${p?.github_url ? `<div><a href="${p.github_url}">GitHub ↗</a></div>` : ""}
  </div>
</div>

<div class="body">
  ${p?.bio ? `<div class="bio-bar">${p.bio}</div>` : ""}

  <div class="columns">
    <div class="col-main">
      ${projects.length ? `<div class="sec"><div class="sec-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech-chips">${p2.technologies.map(t => `<span>${t}</span>`).join("")}</div>` : ""}</div>`).join("")}</div>` : ""}

      ${education.length ? `<div class="sec"><div class="sec-title">Education</div>${education.map(e => `<div class="item"><div class="item-title">${e.degree}${e.field_of_study ? ` — ${e.field_of_study}` : ""}</div><div class="item-sub">${e.institution}${e.grade ? ` · ${e.grade}` : ""}</div><div class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</div></div>`).join("")}</div>` : ""}

      ${achievements.length ? `<div class="sec"><div class="sec-title">Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
    </div>

    <div class="col-side">
      ${skills.length ? `<div class="sec"><div class="sec-title">Tech Stack</div>${Object.entries(grouped).map(([lvl, names]) => `<div class="skill-group"><div class="skill-label">${lvl}</div><div class="skill-items">${names.join(", ")}</div></div>`).join("")}</div>` : ""}
    </div>
  </div>
</div>

<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── Template map ────────────────────────────────────────────────────
export const resumeTemplateGenerators: Record<string, (d: ResumeData) => string> = {
  professional: professionalResume,
  modern: modernResume,
  creative: creativeResume,
  minimal: minimalResume,
  // Fallbacks for any template_key
  "minimal-corporate": professionalResume,
  "modern-creative": modernResume,
  "elegant-professional": minimalResume,
  "compact-technical": creativeResume,
};

export const getResumeHTML = (templateKey: string, data: ResumeData): string => {
  const generator = resumeTemplateGenerators[templateKey] || professionalResume;
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
    headerClass: "text-center mb-6 pb-4 border-b-2 border-gray-800",
    nameClass: "text-3xl font-bold tracking-wide text-gray-900",
    contactClass: "text-xs text-gray-500",
    sectionTitleClass: "text-xs font-bold uppercase tracking-[1.5px] text-gray-800 mb-2 pb-1 border-b border-gray-300",
    skillClass: "text-xs text-gray-600",
    accentColor: "text-gray-600",
    layout: "single",
  },
  modern: {
    headerClass: "text-left mb-6 pb-4",
    nameClass: "text-2xl font-bold text-gray-900",
    contactClass: "text-xs text-gray-500",
    sectionTitleClass: "text-xs font-semibold uppercase tracking-[1.5px] text-blue-600 mb-2 pl-3 border-l-[3px] border-blue-500",
    skillClass: "px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded-full",
    accentColor: "text-blue-600",
    layout: "sidebar",
  },
  minimal: {
    headerClass: "text-left mb-8",
    nameClass: "text-3xl font-light tracking-tight text-gray-900",
    contactClass: "text-xs text-gray-400",
    sectionTitleClass: "text-[9px] font-semibold uppercase tracking-[3px] text-gray-400 mb-3",
    skillClass: "text-xs text-gray-500 font-light",
    accentColor: "text-gray-400",
    layout: "single",
  },
  creative: {
    headerClass: "bg-gray-900 text-white -mx-8 -mt-8 px-8 py-6 mb-6 flex justify-between items-end rounded-t-lg",
    nameClass: "text-2xl font-bold text-white",
    contactClass: "text-[10px] text-gray-400 text-right",
    sectionTitleClass: "text-[10px] font-mono font-medium uppercase tracking-[2px] text-emerald-600 mb-2",
    skillClass: "px-2 py-0.5 text-[9px] font-mono bg-emerald-50 border border-emerald-200 rounded text-emerald-700",
    accentColor: "text-emerald-600",
    layout: "two-col",
  },
};
