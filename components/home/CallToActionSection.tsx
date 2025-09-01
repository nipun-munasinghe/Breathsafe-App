import { ChevronsRight, MessageCircle, Sparkles, Shield, Zap } from "lucide-react";

export default function CallToActionSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-emerald-950 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-lime-600 to-emerald-600 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-lime-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-lime-600/20 to-emerald-600/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#D9F99D] backdrop-blur-sm border border-lime-600/30">
              <Sparkles className="w-4 h-4" />
              Start Your Journey
            </span>
          </div>

          <h2 className="text-5xl font-bold text-white sm:text-6xl mb-8 animate-slide-in-left">
            Ready to breathe easier?
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-white/90 leading-relaxed mb-12 animate-slide-in-right">
            Join thousands of users who trust BreathSafe to monitor their air quality. 
            Start monitoring in minutes and see real-time insights that help you take action with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in-up delay-300">
            <a
              href="#get-started"
              className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#65A30D] to-lime-500 px-10 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:from-lime-500 hover:to-emerald-500 hover:shadow-lime-500/25 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D9F99D]/50"
            >
              <Zap className="mr-3 w-6 h-6 transition-transform group-hover:rotate-12" />
              Get Started Now
              <ChevronsRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
            </a>
            <button className="group inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-10 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40">
              <MessageCircle className="mr-3 w-6 h-6 transition-transform group-hover:scale-110" />
              Talk to Sales
            </button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in-up delay-500">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105">
              <Shield className="w-8 h-8 text-[#D9F99D] mb-3" />
              <div className="text-2xl font-bold text-white mb-1">99.9%</div>
              <div className="text-sm text-white/70">Uptime Guarantee</div>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105">
              <Sparkles className="w-8 h-8 text-[#D9F99D] mb-3" />
              <div className="text-2xl font-bold text-white mb-1">2 Min</div>
              <div className="text-sm text-white/70">Setup Time</div>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105">
              <MessageCircle className="w-8 h-8 text-[#D9F99D] mb-3" />
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-white/70">Expert Support</div>
            </div>
          </div>

          {/* Final message */}
          <div className="mt-16 animate-fade-in-up delay-700">
            <p className="text-white/70 text-lg">
              Start your free trial today. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
