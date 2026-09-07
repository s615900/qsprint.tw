import Image from "next/image";

interface PhotoTileProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function PhotoTile({ src, alt, priority = false, className = "" }: PhotoTileProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-paper-3 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
