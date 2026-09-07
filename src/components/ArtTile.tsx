export type IconId =
  | "lanes"
  | "hurdle"
  | "baton"
  | "tape"
  | "podium"
  | "stopwatch"
  | "flags"
  | "stands"
  | "blocks";

interface ArtTileProps {
  toneA: string;
  toneB: string;
  icon: IconId;
  rounded?: boolean;
  className?: string;
}

export default function ArtTile({
  toneA,
  toneB,
  icon,
  rounded = false,
  className = "",
}: ArtTileProps) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-paper-3 ${
        rounded ? "rounded-[14px]" : ""
      } ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(135% 135% at 22% 15%, ${toneA} 0%, ${toneB} 72%)`,
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full text-ink/50 opacity-65"
        viewBox="0 0 400 300"
        aria-hidden="true"
      >
        <use href={`#s-${icon}`} />
      </svg>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_5vw_rgba(30,36,48,0.28)]" />
    </div>
  );
}
