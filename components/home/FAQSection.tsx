"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Which pollutants and environmental factors do you measure?",
    a: "Our sensors monitor PM2.5, PM10, CO₂, temperature, and humidity as standard. Advanced models also track NO₂, VOCs, and other harmful compounds. All readings are calibrated to international standards for accuracy you can trust."
  },
  {
    q: "How are alerts and notifications configured?",
    a: "Set custom thresholds for each location or sensor group through our intuitive dashboard. Alerts can be sent via email, SMS, webhooks, or mobile push notifications. You can also create automated responses and escalation rules."
  },
  {
    q: "Do you provide APIs for custom integrations?",
    a: "Yes! We offer comprehensive REST APIs for historical data access and WebSocket connections for real-time streaming. All API keys are scoped by user roles and permissions, with rate limiting and usage analytics included."
  },
  {
    q: "Is my data private and compliant with regulations?",
    a: "Absolutely. We support enterprise SSO, role-based access control, comprehensive audit logs, and regional data residency options. Our platform is compliant with GDPR, CCPA, and other privacy regulations. Contact us for detailed compliance documentation."
  },
  {
    q: "What's the accuracy and reliability of your sensors?",
    a: "Our sensors use laboratory-grade components with ±5% accuracy for particulate matter and ±2% for environmental readings. Each unit undergoes factory calibration and includes automatic drift correction to maintain precision over time."
  },
  {
    q: "Can I integrate with existing building management systems?",
    a: "Yes! Our platform integrates seamlessly with popular BMS platforms, HVAC systems, and IoT ecosystems through our open APIs. We also support MQTT, Modbus, and other industrial protocols for legacy system integration."
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
          <h2 className="text-4xl font-bold text-[#0F172A] sm:text-5xl mb-6">
            Frequently asked questions
          </h2>
          <p className="text-xl text-[#71717A] leading-relaxed">
            Everything you need to know about BreathSafe and air quality monitoring.
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
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-lime-600 to-emerald-600 flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                    isOpen ? 'rotate-180 scale-110' : 'group-hover:scale-110'
                  }`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-8 pb-8">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />
                    <p className="text-[#71717A] leading-relaxed text-lg">
                      {item.a}
                    </p>
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
              <p className="text-[#71717A] mb-4">
                Our team is here to help you get started with confidence.
              </p>
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#65A30D] to-lime-500 px-8 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:from-[#064E3B] hover:to-emerald-700 hover:shadow-2xl hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-lime-200">
                Contact Support
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
