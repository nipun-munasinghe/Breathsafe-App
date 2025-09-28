"use client";

import { Home, School, Factory, Building2, Zap } from "lucide-react";

const useCases = [
  {
    title: "Homes & apartments",
    description:
      "Keep families comfortable and informed with room‑by‑room insights for bedrooms, kitchens, and living spaces.",
    bullets: ["Allergy & asthma awareness", "Cooking & cleaning spikes", "Sleep‑friendly CO₂ levels"],
    icon: Home,
    gradient: "from-lime-500 to-emerald-500",
    stats: "Room‑by‑room monitoring",
  },
  {
    title: "Schools & campuses",
    description:
      "Support healthy classrooms and transparency for parents and staff throughout the day.",
    bullets: ["Classroom CO₂ awareness", "Shared dashboards", "Easy device groups"],
    icon: School,
    gradient: "from-emerald-500 to-teal-500",
    stats: "Great fit for classrooms",
  },
  {
    title: "Workshops & facilities",
    description:
      "Track particulates and VOCs around tools and processes to improve safety and comfort.",
    bullets: ["PM/VOC hotspots", "Shift‑time patterns", "Export logs when needed"],
    icon: Factory,
    gradient: "from-teal-500 to-cyan-500",
    stats: "Supports activity logging",
  },
  {
    title: "Public & shared spaces",
    description:
      "Provide clear, actionable air information for libraries, gyms, studios, and community areas.",
    bullets: ["Simple status displays", "Community transparency", "Multi‑device groups"],
    icon: Building2,
    gradient: "from-cyan-500 to-blue-500",
    stats: "Community‑ready",
  },
];

export default function UseCasesSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-100 to-orange-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24">
        <header className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold text-[#0F172A] sm:text-5xl mb-6">Built for every environment</h2>
          <p className="text-xl text-[#71717A] leading-relaxed">
            From home rooms to shared spaces — add devices, subscribe to alerts, and see what matters at a glance.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {useCases.map((useCase, i) => (
            <div
              key={useCase.title}
              className="group relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              <div className="relative">
                {/* Header with icon and stats */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <useCase.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-[#71717A] uppercase tracking-wide">Tag</div>
                    <div className="text-sm font-bold text-[#0F172A]">{useCase.stats}</div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[#0F172A] mb-3 group-hover:text-emerald-950 transition-colors duration-300">
                  {useCase.title}
                </h3>

                <p className="text-[#71717A] leading-relaxed mb-6">{useCase.description}</p>

                <ul className="space-y-3">
                  {useCase.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r ${useCase.gradient} flex-shrink-0`} />
                      <span className="text-[#71717A] leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Call to action */}
                <div className="mt-8 pt-6 border-top border-gray-100">
                  <button className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-lime-600 hover:text-emerald-950 transition-colors duration-300">
                    Learn more
                    <Zap className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Subtle border glow on hover */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
