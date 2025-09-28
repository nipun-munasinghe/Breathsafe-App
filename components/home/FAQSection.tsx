"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Which sensors does BreathSafe work with?",
    a: "BreathSafe pairs with BreathSafe sensors to measure PM2.5, PM10, CO₂, temperature, and humidity. Some models also support VOCs. You can add multiple sensors and organize them by room or location.",
  },
  {
    q: "Do I need a subscription?",
    a: "No monthly subscription is required to use core features. You can subscribe to individual sensors (like YouTube) to follow them and receive alerts — that’s not a paid plan.",
  },
  {
    q: "What does “subscribe to a sensor” mean?",
    a: "Subscribing means you follow a sensor or a room to receive notifications and updates when its air quality crosses thresholds you care about.",
  },
  {
    q: "Do I need the internet for live readings?",
    a: "Live readings work over Bluetooth or local Wi‑Fi. You can enable secure cloud sync for backups and remote access when online.",
  },
  {
    q: "Can I export and share my data?",
    a: "Yes. You can export summaries and share reports for chosen time ranges, devices, or locations.",
  },
  {
    q: "Is my data private?",
    a: "Your data is encrypted in transit and at rest. You control access to your devices and can manage which people or apps can see your data.",
  },
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-slate-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-slate-600 to-gray-600 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-green-100 to-orange-100 px-6 py-3 mb-6 border border-lime-600/20">
            <HelpCircle className="w-5 h-5 text-lime-600" />
            <span className="text-sm font-semibold text-[#71717A] uppercase tracking-wide">FAQ</span>
          </div>
          <h2 className="text-4xl font-bold text-[#0F172A] sm:text-5xl mb-6">Frequently asked questions</h2>
          <p className="text-xl text-[#71717A] leading-relaxed">
            Everything you need to know about BreathSafe sensors, alerts, and data.
          </p>
        </header>

        <div className="space-y-4">
          {faqs.map((item, i) => {
            const isOpen = openItems.has(i);
            return (
              <div
                key={i}
                className="group overflow-hidden rounded-3xl border border-gray-200/50 bg-white shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-lime-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <button
                  className="relative flex w-full items-center justify-between p-8 text-left transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-lime-200"
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(i)}
                >
                  <span className="text-lg font-bold text-[#0F172A] pr-8 group-hover:text-emerald-950 transition-colors duration-300">
                    {item.q}
                  </span>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-lime-600 to-emerald-600 flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                      isOpen ? "rotate-180 scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-8 pb-8">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />
                    <p className="text-[#71717A] leading-relaxed text-lg">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="w-full mt-16 text-center">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-green-100 to-orange-100 p-8 border border-lime-600/20">
              <h3 className="text-xl font-bold text-[#0F172A]">Still have questions?</h3>
              <p className="text-[#71717A] mb-4">We can help you connect sensors and set up the alerts you want.</p>
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#65A30D] to-lime-500 px-8 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:from-lime-500 hover:to-emerald-500 hover:shadow-lime-500/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D9F99D]/50">
                Contact support
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
