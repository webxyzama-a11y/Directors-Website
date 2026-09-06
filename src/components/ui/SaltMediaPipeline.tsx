"use client";

import React, { useState } from "react";
import { Sparkles, Layers, ArrowRight, Video, Flame, Film } from "lucide-react";
import { PRODUCTION_PIPELINE_STEPS, SALT_MEDIA_METRICS, SALT_SERVICES } from "@/data/saltMediaData";
import { soundEngine } from "@/audio/soundEngine";
import CinematicReveal from "@/components/ui/CinematicReveal";

export default function SaltMediaPipeline() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const activeStep = PRODUCTION_PIPELINE_STEPS[activeStepIdx];

  const handleStepClick = (i: number) => {
    soundEngine.playFilmSprocketTick();
    setActiveStepIdx(i);
  };

  return (
    <section id="salt-media" className="relative w-full py-28 px-4 md:px-12 bg-gradient-to-b from-transparent via-[rgba(7,8,12,0.85)] to-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <CinematicReveal effect="rack-focus" className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-mono tracking-[0.3em] uppercase mb-4 px-3 py-1 rounded bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)]">
            <Film className="w-3.5 h-3.5" />
            <span>THE PRODUCTION ENGINE</span>
          </div>

          <h2 className="text-4xl sm:text-7xl md:text-8xl font-extrabold text-white font-serif uppercase tracking-tight mb-4 leading-none">
            SALT MEDIA
          </h2>

          <blockquote className="text-lg sm:text-2xl md:text-3xl font-light text-[rgba(255,255,255,0.85)] font-serif italic max-w-2xl mx-auto">
            &ldquo;From scribbles on a napkin to full-blown productions, anything with a play button.&rdquo;
          </blockquote>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            <span>CONCEPTS</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>CASTING</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>CREATIVE</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>PRODUCTION</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>POST-PRODUCTION</span>
          </div>
        </CinematicReveal>

        {/* Cinematic Scale Metrics (Huge, Dramatic Numbers) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {SALT_MEDIA_METRICS.map((metric, i) => (
            <CinematicReveal key={i} delay={i * 100} effect="rack-focus">
              <div
                className="relative p-8 sm:p-10 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(14,15,22,0.7)] shadow-2xl overflow-hidden group hover:border-[#d4af37] transition-all duration-500 h-full"
              >
              {/* Background ambient sheen */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[radial-gradient(circle,_rgba(212,175,55,0.1)_0%,_transparent_70%)] group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              <span className="font-mono text-[10px] text-[#d4af37] tracking-[0.25em] uppercase block mb-2">
                SCALE BENCHMARK
              </span>
              <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight font-serif mb-2 group-hover:text-[#d4af37] transition-colors">
                {metric.number}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-mono mb-2">
                {metric.label}
              </h3>
              <p className="text-xs sm:text-sm text-[rgba(255,255,255,0.6)] font-light leading-relaxed">
                {metric.subtext}
              </p>
              </div>
            </CinematicReveal>
          ))}
        </div>

        {/* Interactive Production Pipeline */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[rgba(255,255,255,0.08)] mb-8">
            <div>
              <span className="font-mono text-xs text-[#d4af37] tracking-widest uppercase block mb-1">
                END-TO-END WORKFLOW
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-serif uppercase tracking-tight">
                THE 6-PHASE PRODUCTION PIPELINE
              </h3>
            </div>
            <span className="font-mono text-xs text-[rgba(255,255,255,0.4)] tracking-widest uppercase mt-2 sm:mt-0">
              CLICK ANY PHASE TO INSPECT DELIVERABLES
            </span>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8 font-mono">
            {PRODUCTION_PIPELINE_STEPS.map((step, idx) => {
              const isSelected = idx === activeStepIdx;
              return (
                <button
                  key={step.step}
                  onClick={() => handleStepClick(idx)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    isSelected
                      ? "border-[#d4af37] bg-[rgba(212,175,55,0.15)] text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(16,17,24,0.5)] text-[rgba(255,255,255,0.5)] hover:border-[rgba(255,255,255,0.25)] hover:text-white"
                  }`}
                >
                  <span className="text-[10px] text-[#d4af37] font-bold block mb-1">
                    PHASE {step.step}
                  </span>
                  <span className="text-sm font-bold tracking-wider block">
                    {step.phase}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Phase Card */}
          <div className="p-8 sm:p-12 rounded-2xl border border-[rgba(212,175,55,0.3)] bg-gradient-to-r from-[#10121a] to-[#0c0e14] shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <span className="font-mono text-xs text-[#d4af37] tracking-widest uppercase">
                  PHASE {activeStep.step} • {activeStep.tagline}
                </span>
                <h4 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight uppercase">
                  {activeStep.phase}
                </h4>
                <p className="text-sm sm:text-base text-[rgba(255,255,255,0.8)] font-light leading-relaxed">
                  {activeStep.description}
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.4)] font-mono min-w-[280px]">
                <span className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase block mb-1">
                  PHASE DELIVERABLE
                </span>
                <div className="text-sm text-white font-bold tracking-wide">
                  {activeStep.deliverable}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salt Media Services Grid */}
        <div>
          <div className="pb-6 border-b border-[rgba(255,255,255,0.08)] mb-8">
            <span className="font-mono text-xs text-[#d4af37] tracking-widest uppercase block mb-1">
              COMPREHENSIVE CAPABILITIES
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-serif uppercase tracking-tight">
              SPECIALIZED PRODUCTION SERVICES
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SALT_SERVICES.map((srv, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(14,15,22,0.5)] hover:border-[#d4af37] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-widest bg-[rgba(212,175,55,0.15)] text-[#d4af37] border border-[rgba(212,175,55,0.3)]">
                      {srv.tag}
                    </span>
                    <Video className="w-4 h-4 text-[rgba(255,255,255,0.3)] group-hover:text-[#d4af37] transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-serif tracking-tight mb-2">
                    {srv.title}
                  </h4>
                  <p className="text-xs text-[rgba(255,255,255,0.65)] font-light leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Ending Signature */}
          <div className="text-center mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)]">
            <blockquote className="text-xl sm:text-2xl font-serif text-white italic">
              &ldquo;If it tells a story, we&apos;ve got it covered.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
