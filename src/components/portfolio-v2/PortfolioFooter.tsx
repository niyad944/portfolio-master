import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

export const PortfolioFooter = ({ name }: { name: string }) => (
  <footer className="relative border-t border-white/10 mt-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(var(--pf-cyan))] to-[hsl(var(--pf-violet))]" />
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} {name}. Crafted with care.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xs font-mono text-white/40 hover:text-white/70 transition">
          Powered by ProFolioX
        </Link>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-10 w-10 grid place-items-center rounded-full border border-white/15 text-white hover:bg-white/5"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  </footer>
);
