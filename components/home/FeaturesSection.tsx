"use client";

import {
  Activity,
  BellRing,
  BarChart3,
  PlugZap,
  ShieldCheck,
  Network,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
};

const features: Feature[] = [
  {
    title: "Real-time Air Quality",
    description: "Second-by-second PM2.5, PM10, CO₂, temperature & humidity readings with precision sensors.",
    icon: Activity,
    gradient: "from-lime-500 to-emerald-500",
  },
  {
    title: "Smart Alerts",
    description: "Intelligent notifications when air quality thresholds are exceeded, keeping you informed.",
    icon: BellRing,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Insightful Dashboards",
    description: "Beautiful trends, hotspot analysis and exportable reports at your fingertips.",
    icon: BarChart3,
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    title: "Easy Installation",
    description: "Plug in, connect Wi-Fi, start monitoring in under 2 minutes. No technical expertise required.",
    icon: PlugZap,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Enterprise Security",
    description: "Role-based access, SSO integration, audit logs, and bank-level secure data storage.",
    icon: ShieldCheck,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Open Integration",
    description: "REST & WebSocket APIs for seamless embedding into your existing tools and workflows.",
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
            From lightning-fast setup to deep analytics—built for homes, schools, offices, and entire cities.
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
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon with gradient background */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 group-hover:text-emerald-950 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-[#71717A] leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle border glow on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
