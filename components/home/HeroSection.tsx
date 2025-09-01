"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronsRight, Play } from "lucide-react";

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
    "Smart monitoring that helps you and your community breathe clean air with real-time insights and intelligent alerts.",
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" aria-label="Hero">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(101,163,13,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,249,157,0.2),transparent_50%)]" />
      </div>

      {/* Underlayer: rotating images */}
      <div className="absolute inset-0 opacity-20">
        {safeImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
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
      </div>

      {/* Content layer */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4">
        <div
          className={
            isCenter
              ? "mx-auto max-w-4xl text-center"
              : "ml-0 max-w-3xl text-left"
          }
        >
          {/* Green accent label */}
          {label && (
            <div className="mb-6 animate-fade-in">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-lime-600/20 to-emerald-600/20 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#D9F99D] backdrop-blur-sm border border-lime-600/30">
                {label}
              </span>
            </div>
          )}

          <h1 className="font-bold text-5xl leading-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl animate-slide-in-left">
            {title}
          </h1>
          <p className="mt-6 text-xl text-white/90 leading-relaxed animate-slide-in-left delay-200">
            {subtitle}
          </p>

          <div
            className={`mt-10 flex flex-col gap-4 sm:flex-row animate-fade-in-up delay-300 ${
              isCenter ? "sm:justify-center" : "sm:items-center"
            }`}
          >
            <a
              href={primaryCta.href}
              className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#65A30D] to-lime-500 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:from-[#064E3B] hover:to-emerald-700 hover:shadow-2xl hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D9F99D]/50"
            >
              {primaryCta.label}
              <ChevronsRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
            <button className="group inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40">
              <Play className="mr-2 w-5 h-5 transition-transform group-hover:scale-110" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced controls */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-8 z-10 flex justify-center gap-3">
        {safeImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            aria-label={`Show image ${idx + 1}`}
            className={`h-3 w-10 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 ${
              active === idx
                ? "bg-white shadow-lg scale-110"
                : "bg-white/50 hover:bg-white/80 hover:scale-105"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
