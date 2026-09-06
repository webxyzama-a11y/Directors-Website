"use client";

import React, { useState } from "react";
import { SlidersHorizontal, Eye, Clapperboard, Sparkles } from "lucide-react";
import { soundEngine } from "@/audio/soundEngine";

export default function StoryboardCompare() {
  const [sliderPos, setSliderPos] = useState(50); // 0 = Storyboard, 50 = BTS, 100 = Final Film
  const [activeStage, setActiveStage] = useState<"storyboard" | "bts" | "film">("bts");

  const handleStageSelect = (stage: "storyboard" | "bts" | "film", pos: number) => {
    soundEngine.playLensRack();
    setActiveStage(stage);
    setSliderPos(pos);
  };

  return (
    <section id="process" className="relative w-full py-24 px-4 md:px-12 bg-[rgba(6,6,8,0.85)] border-t border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-mono tracking-[0.3em] uppercase mb-3 px-3 py-1 rounded bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE DIRECTING METHOD</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif uppercase tracking-tight mb-4">
            STORYBOARD → BTS → FINAL FILM
          </h2>
          <p className="text-sm sm:text-base text-[rgba(255,255,255,0.65)] font-light leading-relaxed">
            Drag the interactive slider below to witness how Farhan P. Zamma transforms an abstract narrative idea into a multi-camera field production and ultimately an unforgettable cinematic image.
          </p>
        </div>

        {/* Phase Selectors */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8 font-mono text-[10px] sm:text-xs tracking-widest uppercase">
          <button
            onClick={() => handleStageSelect("storyboard", 10)}
            className={`px-3 sm:px-4 py-2 rounded-lg border transition-all ${
              activeStage === "storyboard"
                ? "bg-white text-black font-bold border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                : "bg-[rgba(20,20,24,0.6)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.6)] hover:text-white hover:border-[rgba(255,255,255,0.3)]"
            }`}
          >
            01 STORYBOARD
          </button>
          <span className="text-[rgba(255,255,255,0.2)] hidden sm:inline">→</span>
          <button
            onClick={() => handleStageSelect("bts", 50)}
            className={`px-3 sm:px-4 py-2 rounded-lg border transition-all ${
              activeStage === "bts"
                ? "bg-[#d4af37] text-black font-bold border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                : "bg-[rgba(20,20,24,0.6)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.6)] hover:text-white hover:border-[rgba(255,255,255,0.3)]"
            }`}
          >
            02 BTS
          </button>
          <span className="text-[rgba(255,255,255,0.2)] hidden sm:inline">→</span>
          <button
            onClick={() => handleStageSelect("film", 90)}
            className={`px-3 sm:px-4 py-2 rounded-lg border transition-all ${
              activeStage === "film"
                ? "bg-[#e74c3c] text-white font-bold border-[#e74c3c] shadow-[0_0_20px_rgba(231,76,60,0.4)]"
                : "bg-[rgba(20,20,24,0.6)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.6)] hover:text-white hover:border-[rgba(255,255,255,0.3)]"
            }`}
          >
            03 FINAL FILM
          </button>
        </div>

        {/* Visual Transformation Frame (Responsive Aspect Ratio) */}
        <div className="relative aspect-[16/10] sm:aspect-[2.39/1] min-h-[280px] sm:min-h-0 w-full rounded-xl overflow-hidden border border-[rgba(212,175,55,0.3)] bg-black shadow-2xl select-none group">
          {/* Layer 1: Storyboard (Pencil Sketch & Camera Marks) */}
          <div className="absolute inset-0 bg-[#16161b] flex items-center justify-center p-3 sm:p-8">
            <div className="relative w-full h-full border-2 border-dashed border-[rgba(255,255,255,0.25)] rounded p-3 sm:p-6 flex flex-col justify-between font-mono bg-[#111116]">
              <div className="flex justify-between text-[10px] sm:text-xs text-[#d4af37]">
                <span>SCENE 44 • SHOT 02B</span>
                <span className="hidden xs:inline">CAM: 24MM ANAMORPHIC</span>
              </div>
              <div className="text-center my-auto space-y-1 sm:space-y-2">
                <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto border-2 border-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-serif text-white/40">
                  ✎
                </div>
                <h4 className="text-sm sm:text-lg text-white font-serif tracking-wider">
                  &ldquo;ARIF MEETS GULSHAN IN THE PIRACY BASEMENT&rdquo;
                </h4>
                <p className="text-[10px] sm:text-xs text-[rgba(255,255,255,0.5)] max-w-md mx-auto line-clamp-2 sm:line-clamp-none">
                  Camera dollies forward past VHS magnetic tapes as dim amber light spills from doorway.
                </p>
              </div>
              <div className="flex justify-between text-[9px] sm:text-[10px] text-[rgba(255,255,255,0.4)]">
                <span>STAGE: CONCEPT</span>
                <span>PENCIL TREATMENT</span>
              </div>
            </div>
          </div>

          {/* Layer 2: Behind The Scenes (Production in Progress) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${Math.max(0, 100 - sliderPos * 1.5)}% 0 0)` }}
          >
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=80"
              alt="Behind The Scenes"
              className="w-full h-full object-cover filter contrast-90 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 font-mono text-xs space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-[#d4af37] text-black font-bold text-[10px] tracking-widest uppercase">
                ON SET: MULTI-CAMERA RIG
              </span>
              <p className="text-white text-sm font-semibold">
                Farhan P. Zamma orchestrating actors and lighting team on location
              </p>
            </div>
          </div>

          {/* Layer 3: Final 4K Color-Graded Film */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${Math.max(0, 100 - (sliderPos - 40) * 2)}%)` }}
          >
            <img
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80"
              alt="Final Film Master"
              className="w-full h-full object-cover filter contrast-125 saturate-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6 font-mono text-xs text-right space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-[#e74c3c] text-white font-bold text-[10px] tracking-widest uppercase">
                4K ACES MASTER GRADE
              </span>
              <p className="text-white text-sm font-semibold">
                Final cinematic release frame as delivered to Amazon MX Player
              </p>
            </div>
          </div>

          {/* Interactive Drag Line Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(255,255,255,0.8)] z-30"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Invisible Range Input for Dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSliderPos(val);
              if (val < 33) setActiveStage("storyboard");
              else if (val < 66) setActiveStage("bts");
              else setActiveStage("film");
            }}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-40"
          />
        </div>

        {/* Caption below */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[rgba(255,255,255,0.4)]">
          <span>DRAG THE SLIDER HORIZONTALLY TO REVEAL TRANSFORMATION</span>
          <span className="text-[#d4af37]">IDEA → STORY → PRODUCTION → FILM</span>
        </div>
      </div>
    </section>
  );
}
