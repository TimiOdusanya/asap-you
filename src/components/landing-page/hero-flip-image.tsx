"use client";

import Image from "next/image";

interface HeroFlipImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function HeroFlipImage({ src, alt, className }: HeroFlipImageProps) {
  return (
    <div
      className={`group/flip aspect-[8/9] w-full min-w-0 max-w-full cursor-pointer [perspective:1200px] ${className ?? ""}`}
    >
      <div className="relative aspect-[8/9] w-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] motion-reduce:transition-none group-hover/flip:[transform:rotateY(180deg)] group-focus-visible/flip:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Image
            src={src}
            alt={alt}
            width={320}
            height={400}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <Image
            src={src}
            alt=""
            width={320}
            height={400}
            aria-hidden
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
