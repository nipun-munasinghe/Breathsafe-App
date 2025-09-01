"use client";

import { Home, School, Factory, Building2, Zap } from "lucide-react";

const useCases = [
  {
    title: "Homes & Apartments",
    description: "Create healthier living spaces for your family with personalized air quality insights.",
    bullets: ["Allergy & asthma support", "Nursery monitoring", "Room-by-room insights"],
    icon: Home,
    gradient: "from-lime-500 to-emerald-500",
    stats: "10K+ homes protected",
  },
  {
    title: "Schools & Campuses",
    description: "Ensure optimal learning environments with transparent air quality monitoring.",
    bullets: ["Healthy classrooms", "Parent transparency", "District dashboards"],
    icon: School,
    gradient: "from-emerald-500 to-teal-500",
    stats: "500+ schools monitored",
  },
  {
    title: "Factories & Warehouses",
    description: "Maintain compliance and worker safety with industrial-grade monitoring solutions.",
    bullets: ["Compliance logging", "Shift-level alerts", "EHS tool integration"],
    icon: Factory,
    gradient: "from-teal-500 to-cyan-500",
    stats: "200+ facilities secured",
  },
  {
    title: "Cities & Public Spaces",
    description: "Enable data-driven urban planning with comprehensive environmental monitoring.",
    bullets: ["Urban hotspot mapping", "Community dashboards", "Open data portals"],
    icon: Building2,
    gradient: "from-cyan-500 to-blue-500",
    stats: "50+ cities connected",
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
          <h2 className="text-4xl font-bold text-[#0F172A] sm:text-5xl mb-6">
            Built for every environment
          </h2>
          <p className="text-xl text-[#71717A] leading-relaxed">
            From intimate home spaces to sprawling urban areas—our solutions scale to meet your unique monitoring needs.
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
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative">
                {/* Header with icon and stats */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <useCase.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-[#71717A] uppercase tracking-wide">Impact</div>
                    <div className="text-sm font-bold text-[#0F172A]">{useCase.stats}</div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[#0F172A] mb-3 group-hover:text-emerald-950 transition-colors duration-300">
                  {useCase.title}
                </h3>
                
                <p className="text-[#71717A] leading-relaxed mb-6">
                  {useCase.description}
                </p>

                <ul className="space-y-3">
                  {useCase.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r ${useCase.gradient} flex-shrink-0`} />
                      <span className="text-[#71717A] leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Call to action */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-lime-600 hover:text-emerald-950 transition-colors duration-300">
                    Learn more
                    <Zap className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Subtle border glow on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
