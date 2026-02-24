// Resume template styles - 4 distinct two-column corporate CV layouts
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
    portfolio_url?: string;
    avatar_url?: string;
  };
  skills: Array<{ name: string; proficiency_level?: string; category?: string }>;
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

// SVG icons for contact items
const icons = {
  location: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  email: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  github: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  linkedin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  portfolio: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
};

const avatarCircle = (name: string, bgColor: string, textColor: string) => `
  <div style="width:110px;height:110px;border-radius:50%;background:${bgColor};display:flex;align-items:center;justify-content:center;margin:0 auto 18px;">
    <span style="font-size:36pt;font-weight:600;color:${textColor};line-height:1;">${(name || "?")[0].toUpperCase()}</span>
  </div>`;

// ─── TEMPLATE 1: Professional ────────────────────────────────────────
// Traditional corporate style. Dark sidebar, serif accents, muted blue.
function professionalResume(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
@page { margin: 0; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Source Sans 3', sans-serif; font-size: 10pt; line-height: 1.55; color: #333; background: #fff; }
.page { display: grid; grid-template-columns: 240px 1fr; min-height: 11in; }

/* Left Column */
.left { background: #2c3e50; color: #d5dce4; padding: 40px 28px; }
.avatar { width: 110px; height: 110px; border-radius: 50%; background: #3d5269; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; border: 3px solid rgba(255,255,255,0.15); }
.avatar span { font-size: 36pt; font-weight: 600; color: #a0b4c8; line-height: 1; }
.name { font-family: 'Playfair Display', serif; font-size: 18pt; font-weight: 700; color: #fff; text-align: center; line-height: 1.2; margin-bottom: 4px; }
.subtitle { font-size: 8pt; text-transform: uppercase; letter-spacing: 2px; text-align: center; color: rgba(255,255,255,0.4); margin-bottom: 30px; }

.left-sec { margin-bottom: 24px; }
.left-sec-title { font-size: 8pt; text-transform: uppercase; letter-spacing: 2.5px; color: #7aabe0; font-weight: 600; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.contact-item { display: flex; align-items: center; gap: 10px; font-size: 9pt; color: #bcc8d4; margin-bottom: 8px; line-height: 1.4; }
.contact-item svg { flex-shrink: 0; color: #7aabe0; }
.contact-item a { color: #93bfe8; text-decoration: none; }
.skill-item { font-size: 9pt; color: #c8d2dc; padding: 4px 0; line-height: 1.5; }
.skill-item::before { content: "•"; color: #7aabe0; margin-right: 8px; }

/* Right Column */
.right { padding: 40px 36px; }
.sec { margin-bottom: 22px; }
.sec-title { font-family: 'Playfair Display', serif; font-size: 12pt; font-weight: 600; color: #2c3e50; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1.5px solid #e0e6ec; letter-spacing: 0.3px; }
.bio { font-size: 10pt; color: #555; line-height: 1.75; }
.item { margin-bottom: 14px; page-break-inside: avoid; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
.item-title { font-weight: 600; font-size: 10.5pt; color: #222; }
.item-date { font-size: 8.5pt; color: #888; }
.item-sub { font-size: 9.5pt; color: #666; }
.item-desc { font-size: 9.5pt; color: #555; margin-top: 3px; line-height: 1.6; }
.tech { font-size: 8.5pt; color: #7aabe0; margin-top: 3px; }

@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body><div class="page">

<div class="left">
  <div class="avatar"><span>${(p?.full_name || "?")[0].toUpperCase()}</span></div>
  <div class="name">${p?.full_name || "Your Name"}</div>
  <div class="subtitle">Professional Resume</div>

  <div class="left-sec">
    <div class="left-sec-title">Contact</div>
    ${p?.location ? `<div class="contact-item">${icons.location} ${p.location}</div>` : ""}
    ${p?.phone ? `<div class="contact-item">${icons.phone} ${p.phone}</div>` : ""}
    ${p?.email ? `<div class="contact-item">${icons.email} ${p.email}</div>` : ""}
    ${p?.github_url ? `<div class="contact-item">${icons.github} <a href="${p.github_url}">GitHub</a></div>` : ""}
    ${p?.linkedin_url ? `<div class="contact-item">${icons.linkedin} <a href="${p.linkedin_url}">LinkedIn</a></div>` : ""}
    ${p?.portfolio_url ? `<div class="contact-item">${icons.portfolio} <a href="${p.portfolio_url}">Portfolio</a></div>` : ""}
  </div>

  ${skills.length ? `<div class="left-sec">
    <div class="left-sec-title">Skills</div>
    ${skills.map(s => `<div class="skill-item">${s.name}</div>`).join("")}
  </div>` : ""}
</div>

<div class="right">
  ${p?.bio ? `<div class="sec"><div class="sec-title">Summary</div><p class="bio">${p.bio}</p></div>` : ""}

  ${education.length ? `<div class="sec"><div class="sec-title">Education</div>${education.map(e => `<div class="item"><div class="item-header"><span class="item-title">${e.degree}${e.field_of_study ? `, ${e.field_of_study}` : ""}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.grade ? ` · ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}

  ${projects.length ? `<div class="sec"><div class="sec-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">Technologies: ${p2.technologies.join(", ")}</div>` : ""}</div>`).join("")}</div>` : ""}

  ${achievements.length ? `<div class="sec"><div class="sec-title">Awards & Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
</div>

</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── TEMPLATE 2: Modern ─────────────────────────────────────────────
// Contemporary with soft gray sidebar, blue accents, clean sans-serif.
function modernResume(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@page { margin: 0; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; font-size: 9.5pt; line-height: 1.5; color: #1a1a1a; background: #fff; }
.page { display: grid; grid-template-columns: 220px 1fr; min-height: 11in; }

/* Left Column */
.left { background: #f4f6f8; padding: 38px 24px; border-right: 1px solid #e8ecf0; }
.avatar { width: 100px; height: 100px; border-radius: 50%; background: #dce3ea; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.avatar span { font-size: 32pt; font-weight: 600; color: #7a8da0; line-height: 1; }
.name { font-size: 16pt; font-weight: 700; color: #1a1a1a; text-align: center; line-height: 1.2; margin-bottom: 2px; }
.subtitle { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 2.5px; text-align: center; color: #3b82f6; margin-bottom: 28px; font-weight: 500; }

.left-sec { margin-bottom: 22px; }
.left-sec-title { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; font-weight: 600; margin-bottom: 10px; }
.contact-item { display: flex; align-items: center; gap: 8px; font-size: 8.5pt; color: #555; margin-bottom: 7px; }
.contact-item svg { flex-shrink: 0; color: #3b82f6; }
.contact-item a { color: #2563eb; text-decoration: none; }
.skill-item { font-size: 8.5pt; color: #444; padding: 3px 0; }
.skill-item::before { content: "·"; color: #3b82f6; margin-right: 8px; font-weight: 700; }

/* Right Column */
.right { padding: 38px 34px; }
.sec { margin-bottom: 20px; }
.sec-title { font-size: 10pt; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 2px solid #3b82f6; text-transform: uppercase; letter-spacing: 1px; font-size: 9pt; }
.bio { font-size: 9.5pt; color: #444; line-height: 1.7; }
.item { margin-bottom: 12px; page-break-inside: avoid; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
.item-title { font-weight: 600; font-size: 10pt; color: #111; }
.item-date { font-size: 8pt; color: #888; background: #f0f4ff; padding: 1px 8px; border-radius: 8px; }
.item-sub { font-size: 9pt; color: #666; }
.item-desc { font-size: 9pt; color: #555; margin-top: 3px; line-height: 1.6; }
.tech { font-size: 8pt; color: #3b82f6; margin-top: 2px; }

@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body><div class="page">

<div class="left">
  <div class="avatar"><span>${(p?.full_name || "?")[0].toUpperCase()}</span></div>
  <div class="name">${p?.full_name || "Your Name"}</div>
  <div class="subtitle">Resume</div>

  <div class="left-sec">
    <div class="left-sec-title">Contact</div>
    ${p?.location ? `<div class="contact-item">${icons.location} ${p.location}</div>` : ""}
    ${p?.phone ? `<div class="contact-item">${icons.phone} ${p.phone}</div>` : ""}
    ${p?.email ? `<div class="contact-item">${icons.email} ${p.email}</div>` : ""}
    ${p?.github_url ? `<div class="contact-item">${icons.github} <a href="${p.github_url}">GitHub</a></div>` : ""}
    ${p?.linkedin_url ? `<div class="contact-item">${icons.linkedin} <a href="${p.linkedin_url}">LinkedIn</a></div>` : ""}
    ${p?.portfolio_url ? `<div class="contact-item">${icons.portfolio} <a href="${p.portfolio_url}">Portfolio</a></div>` : ""}
  </div>

  ${skills.length ? `<div class="left-sec">
    <div class="left-sec-title">Skills</div>
    ${skills.map(s => `<div class="skill-item">${s.name}</div>`).join("")}
  </div>` : ""}
</div>

<div class="right">
  ${p?.bio ? `<div class="sec"><div class="sec-title">Summary</div><p class="bio">${p.bio}</p></div>` : ""}

  ${education.length ? `<div class="sec"><div class="sec-title">Education</div>${education.map(e => `<div class="item"><div class="item-header"><span class="item-title">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.grade ? ` · ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}

  ${projects.length ? `<div class="sec"><div class="sec-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">${p2.technologies.join(" · ")}</div>` : ""}</div>`).join("")}</div>` : ""}

  ${achievements.length ? `<div class="sec"><div class="sec-title">Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
</div>

</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── TEMPLATE 3: Minimal ────────────────────────────────────────────
// Ultra-clean two-column. White sidebar, thin borders, maximum whitespace.
function minimalResume(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
@page { margin: 0; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'IBM Plex Sans', sans-serif; font-size: 9.5pt; line-height: 1.55; color: #333; background: #fff; }
.page { display: grid; grid-template-columns: 210px 1fr; min-height: 11in; }

/* Left Column */
.left { padding: 44px 24px; border-right: 1px solid #e5e5e5; }
.avatar { width: 90px; height: 90px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.avatar span { font-size: 28pt; font-weight: 300; color: #999; line-height: 1; }
.name { font-size: 15pt; font-weight: 500; color: #222; text-align: center; line-height: 1.25; margin-bottom: 2px; letter-spacing: -0.3px; }
.subtitle { font-size: 7pt; text-transform: uppercase; letter-spacing: 3px; text-align: center; color: #bbb; margin-bottom: 32px; }

.left-sec { margin-bottom: 24px; }
.left-sec-title { font-size: 7pt; text-transform: uppercase; letter-spacing: 3px; color: #aaa; font-weight: 500; margin-bottom: 10px; }
.contact-item { display: flex; align-items: center; gap: 8px; font-size: 8.5pt; color: #666; margin-bottom: 7px; font-weight: 300; }
.contact-item svg { flex-shrink: 0; color: #aaa; }
.contact-item a { color: #555; text-decoration: none; }
.skill-item { font-size: 8.5pt; color: #555; padding: 3px 0; font-weight: 300; }

/* Right Column */
.right { padding: 44px 36px; }
.sec { margin-bottom: 26px; }
.sec-title { font-size: 8pt; font-weight: 500; color: #999; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 3px; }
.bio { font-size: 9.5pt; color: #555; line-height: 1.8; font-weight: 300; }
.item { margin-bottom: 16px; page-break-inside: avoid; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; }
.item-title { font-weight: 500; font-size: 10pt; color: #222; }
.item-date { font-size: 8pt; color: #bbb; }
.item-sub { font-size: 9pt; color: #888; }
.item-desc { font-size: 9pt; color: #666; margin-top: 4px; line-height: 1.65; font-weight: 300; }
.tech { font-size: 8pt; color: #bbb; margin-top: 3px; font-weight: 300; }

@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body><div class="page">

<div class="left">
  <div class="avatar"><span>${(p?.full_name || "?")[0].toUpperCase()}</span></div>
  <div class="name">${p?.full_name || "Your Name"}</div>
  <div class="subtitle">Resume</div>

  <div class="left-sec">
    <div class="left-sec-title">Contact</div>
    ${p?.location ? `<div class="contact-item">${icons.location} ${p.location}</div>` : ""}
    ${p?.phone ? `<div class="contact-item">${icons.phone} ${p.phone}</div>` : ""}
    ${p?.email ? `<div class="contact-item">${icons.email} ${p.email}</div>` : ""}
    ${p?.github_url ? `<div class="contact-item">${icons.github} <a href="${p.github_url}">GitHub</a></div>` : ""}
    ${p?.linkedin_url ? `<div class="contact-item">${icons.linkedin} <a href="${p.linkedin_url}">LinkedIn</a></div>` : ""}
    ${p?.portfolio_url ? `<div class="contact-item">${icons.portfolio} <a href="${p.portfolio_url}">Portfolio</a></div>` : ""}
  </div>

  ${skills.length ? `<div class="left-sec">
    <div class="left-sec-title">Skills</div>
    ${skills.map(s => `<div class="skill-item">${s.name}</div>`).join("")}
  </div>` : ""}
</div>

<div class="right">
  ${p?.bio ? `<div class="sec"><div class="sec-title">Summary</div><p class="bio">${p.bio}</p></div>` : ""}

  ${education.length ? `<div class="sec"><div class="sec-title">Education</div>${education.map(e => `<div class="item"><div class="item-header"><span class="item-title">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.grade ? ` · ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}

  ${projects.length ? `<div class="sec"><div class="sec-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">${p2.technologies.join(", ")}</div>` : ""}</div>`).join("")}</div>` : ""}

  ${achievements.length ? `<div class="sec"><div class="sec-title">Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
</div>

</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`;
}

// ─── TEMPLATE 4: Creative ───────────────────────────────────────────
// Dark charcoal sidebar with teal accents, bold typography, dense skills.
function creativeResume(d: ResumeData): string {
  const { profile: p, skills, education, projects, achievements } = d;

  // Group skills by category
  const grouped: Record<string, string[]> = {};
  skills.forEach(s => {
    const cat = s.category || s.proficiency_level || "Skills";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s.name);
  });

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${p?.full_name || "Resume"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@page { margin: 0; size: letter; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Space Grotesk', sans-serif; font-size: 9.5pt; line-height: 1.5; color: #1e1e1e; background: #fff; }
.page { display: grid; grid-template-columns: 235px 1fr; min-height: 11in; }

/* Left Column */
.left { background: #1a1a2e; color: #c8cfe0; padding: 36px 24px; }
.avatar { width: 100px; height: 100px; border-radius: 50%; background: #2a2a4a; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 2px solid #3d3d6b; }
.avatar span { font-size: 30pt; font-weight: 600; color: #5eead4; line-height: 1; }
.name { font-size: 17pt; font-weight: 700; color: #fff; text-align: center; line-height: 1.2; margin-bottom: 3px; }
.subtitle { font-family: 'JetBrains Mono', monospace; font-size: 7pt; text-transform: uppercase; letter-spacing: 2.5px; text-align: center; color: #5eead4; margin-bottom: 28px; }

.left-sec { margin-bottom: 22px; }
.left-sec-title { font-family: 'JetBrains Mono', monospace; font-size: 7pt; text-transform: uppercase; letter-spacing: 2px; color: #5eead4; font-weight: 500; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.contact-item { display: flex; align-items: center; gap: 8px; font-size: 8.5pt; color: #a0aec0; margin-bottom: 7px; }
.contact-item svg { flex-shrink: 0; color: #5eead4; }
.contact-item a { color: #7dd3c8; text-decoration: none; }
.skill-group { margin-bottom: 10px; }
.skill-label { font-family: 'JetBrains Mono', monospace; font-size: 7pt; color: #5eead4; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.skill-items { font-size: 8.5pt; color: #a0aec0; line-height: 1.6; }

/* Right Column */
.right { padding: 36px 34px; }
.sec { margin-bottom: 20px; }
.sec-title { font-size: 10pt; font-weight: 600; color: #1a1a2e; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 2px solid #1a1a2e; text-transform: uppercase; letter-spacing: 1px; font-size: 9pt; }
.bio { font-size: 9.5pt; color: #444; line-height: 1.75; }
.item { margin-bottom: 13px; page-break-inside: avoid; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
.item-title { font-weight: 600; font-size: 10pt; color: #111; }
.item-date { font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; color: #999; }
.item-sub { font-size: 9pt; color: #666; }
.item-desc { font-size: 9pt; color: #555; margin-top: 3px; line-height: 1.6; }
.tech { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.tech span { font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; background: #f0fdf4; color: #059669; padding: 2px 8px; border-radius: 3px; border: 1px solid #bbf7d0; }

@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body><div class="page">

<div class="left">
  <div class="avatar"><span>${(p?.full_name || "?")[0].toUpperCase()}</span></div>
  <div class="name">${p?.full_name || "Your Name"}</div>
  <div class="subtitle">Creative Resume</div>

  <div class="left-sec">
    <div class="left-sec-title">Contact</div>
    ${p?.location ? `<div class="contact-item">${icons.location} ${p.location}</div>` : ""}
    ${p?.phone ? `<div class="contact-item">${icons.phone} ${p.phone}</div>` : ""}
    ${p?.email ? `<div class="contact-item">${icons.email} ${p.email}</div>` : ""}
    ${p?.github_url ? `<div class="contact-item">${icons.github} <a href="${p.github_url}">GitHub</a></div>` : ""}
    ${p?.linkedin_url ? `<div class="contact-item">${icons.linkedin} <a href="${p.linkedin_url}">LinkedIn</a></div>` : ""}
    ${p?.portfolio_url ? `<div class="contact-item">${icons.portfolio} <a href="${p.portfolio_url}">Portfolio</a></div>` : ""}
  </div>

  ${skills.length ? `<div class="left-sec">
    <div class="left-sec-title">Tech Stack</div>
    ${Object.entries(grouped).map(([cat, names]) => `<div class="skill-group"><div class="skill-label">${cat}</div><div class="skill-items">${names.join(", ")}</div></div>`).join("")}
  </div>` : ""}
</div>

<div class="right">
  ${p?.bio ? `<div class="sec"><div class="sec-title">Summary</div><p class="bio">${p.bio}</p></div>` : ""}

  ${projects.length ? `<div class="sec"><div class="sec-title">Projects</div>${projects.map(p2 => `<div class="item"><div class="item-title">${p2.title}</div>${p2.description ? `<div class="item-desc">${p2.description}</div>` : ""}${p2.technologies?.length ? `<div class="tech">${p2.technologies.map(t => `<span>${t}</span>`).join("")}</div>` : ""}</div>`).join("")}</div>` : ""}

  ${education.length ? `<div class="sec"><div class="sec-title">Education</div>${education.map(e => `<div class="item"><div class="item-header"><span class="item-title">${e.degree}${e.field_of_study ? ` — ${e.field_of_study}` : ""}</span><span class="item-date">${e.start_date || ""} – ${e.end_date || "Present"}</span></div><div class="item-sub">${e.institution}${e.grade ? ` · ${e.grade}` : ""}</div></div>`).join("")}</div>` : ""}

  ${achievements.length ? `<div class="sec"><div class="sec-title">Achievements</div>${achievements.map(a => `<div class="item"><div class="item-title">${a.title}</div>${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ""}${a.description ? `<div class="item-desc">${a.description}</div>` : ""}</div>`).join("")}</div>` : ""}
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
  layout: "sidebar";
  sidebarBg: string;
  sidebarText: string;
  avatarBg: string;
  avatarText: string;
};

export const templatePreviewStyles: Record<string, TemplatePreviewStyle> = {
  professional: {
    headerClass: "text-center mb-4",
    nameClass: "text-xl font-bold text-white",
    contactClass: "text-xs text-gray-300",
    sectionTitleClass: "text-xs font-semibold uppercase tracking-[1.5px] text-gray-800 mb-2 pb-1 border-b border-gray-200",
    skillClass: "text-xs text-gray-300",
    accentColor: "text-blue-400",
    layout: "sidebar",
    sidebarBg: "bg-[#2c3e50]",
    sidebarText: "text-gray-300",
    avatarBg: "bg-[#3d5269]",
    avatarText: "text-[#a0b4c8]",
  },
  modern: {
    headerClass: "text-center mb-4",
    nameClass: "text-xl font-bold text-gray-900",
    contactClass: "text-xs text-gray-500",
    sectionTitleClass: "text-xs font-semibold uppercase tracking-[1px] text-gray-800 mb-2 pb-1 border-b-2 border-blue-500",
    skillClass: "text-xs text-gray-600",
    accentColor: "text-blue-500",
    layout: "sidebar",
    sidebarBg: "bg-gray-50",
    sidebarText: "text-gray-600",
    avatarBg: "bg-gray-200",
    avatarText: "text-gray-500",
  },
  minimal: {
    headerClass: "text-center mb-4",
    nameClass: "text-lg font-medium text-gray-800 tracking-tight",
    contactClass: "text-xs text-gray-400",
    sectionTitleClass: "text-[9px] font-medium uppercase tracking-[3px] text-gray-400 mb-3",
    skillClass: "text-xs text-gray-500 font-light",
    accentColor: "text-gray-400",
    layout: "sidebar",
    sidebarBg: "bg-white border-r",
    sidebarText: "text-gray-500",
    avatarBg: "bg-gray-100",
    avatarText: "text-gray-400",
  },
  creative: {
    headerClass: "text-center mb-4",
    nameClass: "text-xl font-bold text-white",
    contactClass: "text-xs text-gray-400",
    sectionTitleClass: "text-[10px] font-semibold uppercase tracking-[1px] text-gray-800 mb-2 pb-1 border-b-2 border-gray-800",
    skillClass: "px-2 py-0.5 text-[9px] font-mono bg-emerald-50 border border-emerald-200 rounded text-emerald-700",
    accentColor: "text-emerald-500",
    layout: "sidebar",
    sidebarBg: "bg-[#1a1a2e]",
    sidebarText: "text-gray-300",
    avatarBg: "bg-[#2a2a4a]",
    avatarText: "text-emerald-400",
  },
};
