import { getResumeHTML } from "./resumeTemplates";

interface PrintableResume {
  profile: Record<string, any>;
  skills: any[];
  education: any[];
  projects: any[];
  achievements: any[];
  [key: string]: any;
}

/**
 * ResumePrint — PDF-only renderer.
 *
 * Renders the selected resume template into an offscreen, isolated iframe and
 * hands it to the browser's native print pipeline (Save as PDF). Nothing from
 * the app shell (nav, buttons, tooltips, animations) exists inside the iframe,
 * and the output keeps real vector text, embedded fonts and clickable links —
 * no html2canvas rasterisation.
 */
export async function printResume(templateKey: string, content: PrintableResume): Promise<void> {
  const html = getResumeHTML(templateKey, content);

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute("title", "Resume print document");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  iframe.style.border = "0";
  iframe.style.zIndex = "-2147483647";
  document.body.appendChild(iframe);

  const cleanup = () => {
    // Delay removal so the print dialog can finish reading the document.
    setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 1000);
  };

  try {
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) throw new Error("Unable to prepare the print document.");

    doc.open();
    doc.write(html);
    doc.close();

    // Wait for the document, webfonts and images before printing.
    await new Promise<void>((resolve) => {
      if (doc.readyState === "complete") return resolve();
      win.addEventListener("load", () => resolve(), { once: true });
      setTimeout(resolve, 3000);
    });

    try {
      await (doc as any).fonts?.ready;
    } catch {
      /* fonts API unavailable — continue */
    }

    const images = Array.from(doc.images);
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
            setTimeout(resolve, 4000);
          })
      )
    );

    // Small settle tick for layout/reflow after fonts + images.
    await new Promise((r) => setTimeout(r, 150));

    win.focus();
    win.print();
  } finally {
    cleanup();
  }
}

export default printResume;
