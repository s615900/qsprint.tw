export default function Eyebrow({
  children,
  tone = "coral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "coral" | "gold" | "paper";
  className?: string;
}) {
  const dotColor = tone === "gold" ? "bg-gold" : tone === "paper" ? "bg-paper" : "bg-coral";
  const textColor = tone === "gold" ? "text-gold" : tone === "paper" ? "text-paper" : "text-coral";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`h-2 w-2 flex-none ${dotColor}`} />
      <span className={`text-[0.72rem] font-bold tracking-[0.25em] ${textColor}`}>
        {children}
      </span>
    </span>
  );
}
