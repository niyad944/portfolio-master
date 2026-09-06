import { parseSdgId, sdgById } from "@/lib/sdgs";

/** Official UN SDG brand colours, indexed by goal number. */
export const SDG_COLORS: Record<number, string> = {
  1: "#E5243B",
  2: "#DDA63A",
  3: "#4C9F38",
  4: "#C5192D",
  5: "#FF3A21",
  6: "#26BDE2",
  7: "#FCC30B",
  8: "#A21942",
  9: "#FD6925",
  10: "#DD1367",
  11: "#FD9D24",
  12: "#BF8B2E",
  13: "#3F7E44",
  14: "#0A97D9",
  15: "#56C02B",
  16: "#00689D",
  17: "#19486A",
};

interface SDGLogoProps {
  /** SDG number, or any stored label such as "SDG 4: Quality Education". */
  sdg: number | string;
  /** Pixel size of the square logo tile. */
  size?: number;
  className?: string;
}

/**
 * Small official-style SDG logo tile: the goal's brand colour square with its
 * number, used immediately before an SDG badge. Never guesses — the number
 * always drives the colour, so logo and goal can never mismatch.
 */
export const SDGLogo = ({ sdg, size = 22, className = "" }: SDGLogoProps) => {
  const id = typeof sdg === "number" ? sdg : parseSdgId(sdg);
  if (!id) return null;
  const goal = sdgById(id);
  const color = SDG_COLORS[id];

  return (
    <span
      aria-label={goal ? `SDG ${id}: ${goal.name}` : `SDG ${id}`}
      title={goal ? `SDG ${id}: ${goal.name}` : `SDG ${id}`}
      className={`inline-flex shrink-0 items-center justify-center rounded-[4px] font-bold leading-none text-white ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: Math.round(size * (id > 9 ? 0.42 : 0.5)),
      }}
    >
      {id}
    </span>
  );
};

export default SDGLogo;
