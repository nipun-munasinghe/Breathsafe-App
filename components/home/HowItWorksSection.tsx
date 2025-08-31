"use client";

import { Wifi, Cloud, LineChart, Bell, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Place & Connect",
    desc: "Plug in sensor and connect to Wi-Fi. Auto-calibration happens instantly with zero configuration needed.",
    icon: Wifi,
    gradient: "from-lime-500 to-emerald-500",
  },
  {
    title: "Secure Data Stream",
    desc: "Encrypted telemetry flows securely to BreathSafe Cloud with enterprise-grade security and reliability.",
    icon: Cloud,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Analyze & Visualize",
    desc: "Beautiful dashboards reveal air quality trends, patterns, and insights with actionable recommendations.",
    icon: LineChart,
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    title: "Smart Actions",
    desc: "Receive intelligent notifications and trigger automated responses to maintain optimal air quality.",
    icon: Bell,
    gradient: "from-cyan-500 to-blue-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24">
        <header className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold text-[#0F172A] sm:text-5xl mb-6">
            How it works
          </h2>
          <p className="text-xl text-[#71717A] leading-relaxed">
            Get up and running in minutes with our streamlined process designed for simplicity and effectiveness.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connection line for desktop */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-8 z-10">
                  <ArrowRight className="w-6 h-6 text-lime-600/60 transform translate-x-1" />
                </div>
              )}

              <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200/50 p-8 text-center shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Step number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center text-sm font-bold text-[#0F172A] border border-lime-600/20">
                  {i + 1}
                </div>

                {/* Icon with gradient background */}
                <div className={`mx-auto mb-6 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${step.gradient} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-[#0F172A] mb-4 group-hover:text-emerald-950 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-[#71717A] leading-relaxed">
                  {step.desc}
                </p>

                {/* Subtle border glow on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`} />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline for mobile */}
        <div className="mt-16 lg:hidden">
          <div className="flex flex-col items-center">
            <div className="w-1 h-16 bg-gradient-to-b from-lime-600 to-emerald-600 rounded-full" />
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-100 to-orange-100 px-6 py-3 text-sm font-medium text-[#71717A] border border-lime-600/20">
                <div className="w-2 h-2 bg-lime-600 rounded-full animate-pulse" />
                Complete setup in under 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
