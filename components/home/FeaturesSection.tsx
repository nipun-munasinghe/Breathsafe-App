"use client";

import { Activity, BellRing, BarChart3, PlugZap, ShieldCheck, Network } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
};

const features: Feature[] = [
  {
    title: "Real‑time air metrics",
    description: "Live PM2.5, PM10, CO₂, temperature, and humidity from your BreathSafe sensors — at a glance.",
    icon: Activity,
    gradient: "from-lime-500 to-emerald-500",
  },
  {
    title: "Subscribe to sensors",
    description: "Follow the sensors you care about (like YouTube). Get alerts only from rooms and devices you subscribe to.",
    icon: BellRing,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Clear trends & insights",
    description: "Daily and weekly patterns, quick comparisons across rooms, and simple summaries you can act on.",
    icon: BarChart3,
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    title: "Fast, simple setup",
    description: "Plug in, connect over Bluetooth or Wi‑Fi, and start monitoring in under two minutes.",
    icon: PlugZap,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Private & secure",
    description: "Local readings first, with secure sync. You control who sees which devices and data.",
    icon: ShieldCheck,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Open access options",
    description: "Export data or integrate when needed — no monthly plans required to use core features.",
    icon: Network,
    gradient: "from-indigo-500 to-purple-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-green-50/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-lime-600 to-emerald-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24">
        <header className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl mb-6">
            Everything you need to understand your air
          </h2>
          <p className="text-xl text-[#71717A] leading-relaxed">
            Works with BreathSafe sensors for homes, schools, offices, and more — without monthly fees.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-200/50 p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Icon with gradient background */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-[#0F172A] mb-4 group-hover:text-emerald-950 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-[#71717A] leading-relaxed">{feature.description}</p>

              {/* Subtle border glow on hover */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
