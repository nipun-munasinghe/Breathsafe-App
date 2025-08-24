"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronsRight } from "lucide-react";

export type HeroSectionProps = {
  label?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  images?: { src: string; alt: string }[];
  rotateMs?: number;
  align?: "left" | "center";
};

export default function HeroSection({
  label = "BreathSafe - Air You Can Trust",
  title = "Know Your Air, Protect Your Future.",
  subtitle =
    "Smart monitoring that helps you and your community breathe clean.",
  primaryCta = { label: "Get Started", href: "#get-started" },
  images = [
    { src: "/hero-planet.png", alt: "Dashboard preview with charts" },
    { src: "/hero-plant.png", alt: "Team collaborating around a laptop" },
  ],
  rotateMs = 5500,
  align = "left",
}: HeroSectionProps) {
  const safeImages = useMemo(() => images.slice(0, 2), [images]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((n) => (n === 0 ? 1 : 0));
    }, Math.max(2500, rotateMs));
    return () => clearInterval(id);
  }, [rotateMs]);

  const isCenter = align === "center";

  return (
    <section className="relative min-h-screen overflow-hidden" aria-label="Hero">
      {/* Underlayer: rotating images */}
      <div className="absolute inset-0">
        {safeImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              active === idx ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={active !== idx}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-[75%] md:object-center"
            />
          </div>
        ))}
        {/* Dark overlay for readability */}
        <div className="absolute md:hidden inset-0 bg-black/60" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-16 md:py-24">
        <div
          className={
            isCenter
              ? "mx-auto max-w-3xl text-center"
              : "ml-0 max-w-2xl md:max-w-3xl text-left"
          }
        >
          {/* Green box label */}
          {label && (
            <span className="inline-block mb-4 text-sm font-semibold uppercase tracking-wide text-[#65A30D]">
              {label}
            </span>
          )}

          <h1 className="font-bold text-4xl leading-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-base text-white/90 sm:text-lg">
            {subtitle}
          </p>

          <div
            className={`mt-8 flex flex-col gap-3 sm:flex-row ${
              isCenter ? "sm:justify-center" : "sm:items-center"
            }`}
          >
            <a
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-[#65A30D] px-12 py-4 text-lg text-white transition-colors hover:bg-[#064E3B] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D9F99D]"
            >
              {primaryCta.label}
              <ChevronsRight className="ml-2 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Controls: centered at bottom for mobile; bottom-left for md+ */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2">
        {safeImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            aria-label={`Show image ${idx + 1}`}
            className={`h-2.5 w-8 rounded-full transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 ${
              active === idx
                ? "bg-white/90 shadow"
                : "bg-white/60 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
