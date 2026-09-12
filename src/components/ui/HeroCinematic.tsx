"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Compass, Film, Sparkles } from "lucide-react";
import { soundEngine } from "@/audio/soundEngine";

interface HeroCinematicProps {
  onEnterWorld: () => void;
  onPlayShowreel: () => void;
}

/* ─── Animated Counter Hook ─── */
function useAnimatedCounter(target: number, suffix = "", duration = 2200) {
  const [val, setVal] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [hasStarted, target, duration]);

  return { val, suffix, start: () => setHasStarted(true) };
}

/* ─── Main Hero Component ─── */
export default function HeroCinematic({
  onEnterWorld,
  onPlayShowreel,
}: HeroCinematicProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const years = useAnimatedCounter(13, "+", 2000);
  const shows = useAnimatedCounter(80, "+", 2400);
  const views = useAnimatedCounter(12, "B+", 2600);

  // Trigger entrance animation + counter start on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      years.start();
      shows.start();
      views.start();
    }, 400); // slight delay for curtain reveal
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center sm:justify-end pt-16 sm:pt-24 pb-20 sm:pb-24 px-4 sm:px-8 md:px-16 overflow-hidden pointer-events-none"
    >
      {/* ─── Cinematic Vignette Gradients (Dark-to-light gradient merge) ─── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {/* Continuous bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[rgba(6,6,8,0.4)] to-transparent" />
        {/* Deep bottom gradient merge toward next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060608] via-[#060608]/75 to-transparent" />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,6,8,0.5)] via-transparent to-[rgba(6,6,8,0.3)]" />
        {/* Top subtle darkening */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(6,6,8,0.5)] via-transparent to-transparent" />
      </div>

      {/* ─── Animated golden scanline (moves slowly down) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        <div
          className="absolute left-0 right-0 h-px opacity-[0.06]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #d4af37 20%, #fff 50%, #d4af37 80%, transparent 100%)",
            animation: "heroScanline 8s linear infinite",
          }}
        />
      </div>

      {/* ─── Content ─── */}
      <div
        className="relative max-w-5xl pointer-events-auto -mt-6 sm:mt-0"
        style={{ zIndex: 10 }}
      >
        {/* Film Badge */}
        <div
          className={`inline-flex items-center gap-3 px-3.5 sm:px-4 py-1.5 rounded-full mb-3.5 sm:mb-5 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            background: "rgba(212, 175, 55, 0.08)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            backdropFilter: "blur(12px)",
            transitionDelay: "200ms",
          }}
        >
          <Film className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] uppercase text-[rgba(255,255,255,0.7)]">
            A FILM BY
          </span>
          <Sparkles className="w-3 h-3 text-[#d4af37] opacity-60" />
        </div>

        {/* Director Name - staggered letter reveal */}
        <h1
          className={`text-[32px] xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white mb-3 sm:mb-4 leading-none uppercase select-none font-serif transition-all duration-1200 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{
            transitionDelay: "500ms",
            textShadow: isVisible
              ? "0 0 80px rgba(212, 175, 55, 0.15), 0 4px 30px rgba(0,0,0,0.5)"
              : "none",
          }}
        >
          <span className="inline-block" style={{ transitionDelay: "500ms" }}>
            FARHAN P.
          </span>
          <br />
          <span
            className="inline-block bg-clip-text"
            style={{
              transitionDelay: "700ms",
              background: "linear-gradient(135deg, #ffffff 0%, #f0e6cc 40%, #d4af37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ZAMMA
          </span>
        </h1>

        {/* Roles Subhead with animated gold line */}
        <div
          className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm md:text-base font-mono tracking-[0.25em] uppercase text-[#d4af37] mb-4 sm:mb-6 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <span className="relative">
            DIRECTOR
            <span
              className="absolute -bottom-1 left-0 h-px bg-[#d4af37] transition-all duration-1000"
              style={{ width: isVisible ? "100%" : "0%", transitionDelay: "1400ms" }}
            />
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span>PRODUCER</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" style={{ animationDelay: "0.5s" }} />
          <span>STORYTELLER</span>
        </div>

        {/* Primary Positioning Quote */}
        <blockquote
          className={`text-base sm:text-2xl md:text-3xl font-light text-[rgba(255,255,255,0.9)] max-w-3xl leading-snug mb-5 sm:mb-8 pl-4 sm:pl-5 italic transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: "1100ms",
            borderLeft: "2px solid #d4af37",
            borderImage: "linear-gradient(to bottom, #d4af37, rgba(212,175,55,0.2)) 1",
          }}
        >
          &ldquo;13+ years of making stories move.&rdquo;
        </blockquote>

        {/* Supporting Metrics Badges - Animated Counters */}
        <div
          className={`grid grid-cols-3 max-w-md gap-2 sm:gap-4 mb-6 sm:mb-10 pt-4 sm:pt-6 font-mono transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: "1300ms",
            borderTop: "1px solid rgba(212, 175, 55, 0.15)",
          }}
        >
          {[
            { counter: years, label: "YEARS EXPERIENCE" },
            { counter: shows, label: "PRODUCED SHOWS" },
            { counter: views, label: "GLOBAL VIEWS" },
          ].map((item, idx) => (
            <div key={idx} className="group">
              <div className="text-lg xs:text-xl sm:text-3xl font-bold tracking-tight relative">
                <span
                  className="bg-clip-text"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 30%, #d4af37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {item.counter.val}
                  {item.counter.suffix}
                </span>
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs text-[rgba(255,255,255,0.4)] tracking-widest uppercase mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action CTAs with enhanced styling */}
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "1500ms" }}
        >
          <button
            onClick={() => {
              soundEngine.playWhoosh();
              onEnterWorld();
            }}
            className="group relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden w-full sm:w-auto"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f0e6cc 100%)",
              color: "#0a0a0d",
              boxShadow:
                "0 0 30px rgba(212, 175, 55, 0.25), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {/* Hover shimmer effect */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.3) 0%, transparent 50%, rgba(212,175,55,0.2) 100%)",
              }}
            />
            <Compass className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90 relative z-10" />
            <span className="relative z-10">ENTER THE WORLD →</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playWhoosh();
              onPlayShowreel();
            }}
            className="group px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500 backdrop-blur-md relative overflow-hidden w-full sm:w-auto"
            style={{
              background: "rgba(20, 20, 26, 0.7)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.6)");
              (e.currentTarget.style.boxShadow = "0 0 25px rgba(212, 175, 55, 0.15), inset 0 0 20px rgba(212, 175, 55, 0.05)");
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.2)");
              (e.currentTarget.style.boxShadow = "none");
            }}
          >
            <Play className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-125 relative z-10" />
            <span className="relative z-10">PLAY SHOWREEL</span>
          </button>
        </div>
      </div>

      {/* ─── Hero CSS Animations ─── */}
      <style jsx>{`
        @keyframes heroScanline {
          0% {
            top: -2px;
          }
          100% {
            top: 100%;
          }
        }
      `}</style>
    </section>
  );
}
