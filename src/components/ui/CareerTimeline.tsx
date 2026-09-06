"use client";

import React, { useState } from "react";
import { Sliders, Clock, Film, Sparkles, Quote } from "lucide-react";
import { CareerTimelineStage } from "@/types";
import { CAREER_TIMELINE_STAGES } from "@/data/timelineData";
import { soundEngine } from "@/audio/soundEngine";

interface CareerTimelineProps {
  onStageSelect?: (stage: CareerTimelineStage) => void;
}

export default function CareerTimeline({ onStageSelect }: CareerTimelineProps) {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const activeStage = CAREER_TIMELINE_STAGES[activeStageIdx];

  const handleStageChange = (idx: number) => {
    soundEngine.playFilmSprocketTick();
    setActiveStageIdx(idx);
    if (onStageSelect) {
      onStageSelect(CAREER_TIMELINE_STAGES[idx]);
    }
  };

  return (
    <section id="timeline" className="relative w-full py-24 px-4 md:px-12 bg-gradient-to-b from-transparent via-[rgba(8,9,14,0.82)] to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.08)] mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#d4af37] text-xs font-mono tracking-[0.3em] uppercase mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>INTERACTION 05 — THE EDITING ROOM TIMELINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-serif uppercase tracking-tight">
              CAREER TIMELINE
            </h2>
            <p className="text-sm md:text-base text-[rgba(255,255,255,0.6)] font-light mt-2 max-w-2xl">
              13+ years and 80+ productions scrubbed across an interactive NLE timeline. Scrub through each career chapter to transform the studio atmosphere.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(16,16,22,0.8)] font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[rgba(255,255,255,0.5)]">ERA:</span>
            <span className="text-white font-bold tracking-wider">{activeStage.era}</span>
          </div>
        </div>

        {/* The NLE Timeline Scrubbing Interface */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0d0e14] p-4 sm:p-6 mb-12 shadow-2xl overflow-hidden font-mono">
          {/* Timeline Ruler & Playhead */}
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)] text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e74c3c]" />
              <span className="text-white font-bold">PLAYHEAD AT: {activeStage.category}</span>
            </div>
            <span>MASTER SEQUENCE • 24.00 FPS</span>
          </div>

          {/* Scrubbable Chapters Track (Video Track V1) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 py-4">
            {CAREER_TIMELINE_STAGES.map((stage, idx) => {
              const isActive = idx === activeStageIdx;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageChange(idx)}
                  className={`relative p-3 rounded-lg border text-left transition-all duration-300 group overflow-hidden ${
                    isActive
                      ? "border-[#d4af37] bg-[rgba(212,175,55,0.15)] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,28,0.5)] hover:border-[rgba(255,255,255,0.25)]"
                  }`}
                >
                  {/* Top Color Accent Pip */}
                  <div
                    className="w-full h-1 rounded-full mb-2"
                    style={{ backgroundColor: stage.lightingColor }}
                  />
                  <span className="text-[9px] text-[rgba(255,255,255,0.4)] block">
                    0{idx + 1} • {stage.era}
                  </span>
                  <span
                    className={`text-xs font-bold tracking-tight block truncate mt-1 ${
                      isActive ? "text-white" : "text-[rgba(255,255,255,0.7)] group-hover:text-white"
                    }`}
                  >
                    {stage.category}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 right-2 text-[8px] text-[#d4af37] font-bold">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Audio Track A1 / A2 Visual Representation */}
          <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[9px] text-[rgba(255,255,255,0.4)]">
            <span className="flex items-center gap-2">
              <Film className="w-3 h-3 text-[#d4af37]" />
              <span>ATMOSPHERE: {activeStage.atmosphere}</span>
            </span>
            <span className="text-[#d4af37]">CLICK ANY ERA TO SCRUB</span>
          </div>
        </div>

        {/* Selected Era Highlight Card */}
        <div
          className="rounded-2xl border p-6 md:p-10 transition-all duration-500 bg-gradient-to-r from-[#0d0e14] to-[#12131b]"
          style={{ borderColor: activeStage.accentColor }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded text-black font-mono font-bold text-xs tracking-widest uppercase"
                  style={{ backgroundColor: activeStage.lightingColor }}
                >
                  {activeStage.category}
                </span>
                <span className="font-mono text-sm text-[rgba(255,255,255,0.4)]">
                  {activeStage.era}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight uppercase">
                {activeStage.headline}
              </h3>

              <h4 className="text-sm sm:text-base text-[#d4af37] font-mono tracking-wide">
                {activeStage.subhead}
              </h4>

              <p className="text-sm sm:text-base text-[rgba(255,255,255,0.75)] font-light leading-relaxed">
                {activeStage.description}
              </p>

              <div className="pt-2">
                <span className="text-xs font-mono text-[rgba(255,255,255,0.4)] block uppercase">
                  LANDMARK RELEASES:
                </span>
                <span className="text-white font-mono font-semibold text-sm">
                  {activeStage.keyWork}
                </span>
              </div>

              {/* Director's Personal Note */}
              <div className="p-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.06)] flex items-start gap-3 mt-4">
                <Quote className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[rgba(255,255,255,0.85)] italic font-serif">
                  {activeStage.directorNote}
                </p>
              </div>
            </div>

            {/* Era Metrics Column */}
            <div className="flex flex-col justify-between p-6 rounded-xl bg-[rgba(18,19,26,0.6)] border border-[rgba(255,255,255,0.08)] font-mono">
              <div>
                <span className="text-xs text-[rgba(255,255,255,0.4)] tracking-widest uppercase block mb-4 border-b border-[rgba(255,255,255,0.08)] pb-2">
                  CHAPTER IMPACT METRICS
                </span>
                <div className="space-y-6">
                  {activeStage.stats.map((st, i) => (
                    <div key={i}>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white block tracking-tight">
                        {st.value}
                      </span>
                      <span className="text-[11px] text-[rgba(255,255,255,0.5)] uppercase tracking-wider">
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.08)] text-[10px] text-[#d4af37]">
                STUDIO KEY LIGHT TUNED TO {activeStage.category}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
