import { socialLinks } from "@/lib/content";

interface SocialLinksProps {
  className?: string;
  size?: "sm" | "md";
}

export default function SocialLinks({ className = "", size = "md" }: SocialLinksProps) {
  const sizeClasses =
    size === "sm" ? "h-6 w-6 text-[0.58rem]" : "h-8 w-8 text-[0.68rem]";

  return (
    <div className={`flex gap-2 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target={social.href.startsWith("http") ? "_blank" : undefined}
          rel={social.href.startsWith("http") ? "noopener" : undefined}
          aria-label={social.label}
          title={social.label}
          className={`flex items-center justify-center rounded-full font-bold text-white no-underline transition-opacity hover:opacity-80 ${sizeClasses}`}
          style={{ backgroundColor: social.bg }}
        >
          {social.short}
        </a>
      ))}
    </div>
  );
}
