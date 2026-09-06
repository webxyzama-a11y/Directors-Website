"use client";

import React, { useState } from "react";
import { CLIENT_CREDITS } from "@/data/creditsData";
import { Film, Award, Sparkles, Camera } from "lucide-react";
import { soundEngine } from "@/audio/soundEngine";

export default function RollingCredits() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="credits"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 bg-[rgba(5,5,8,0.95)] border-t border-[rgba(255,255,255,0.06)] overflow-hidden"
    >
      {/* Ambient Soundstage Spotlight Vignette */}
      <div className="absolute top-1/4 right-0 w-[650px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Responsive Layout: Left Credits, Right Director Portrait Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: COLLABORATORS & CREDITS LIST                                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col items-start text-left font-mono">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 text-[#d4af37] text-[11px] sm:text-xs tracking-[0.3em] uppercase mb-4 px-3.5 py-1 rounded-full bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.25)] backdrop-blur-md">
              <Film className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>COLLABORATORS & NETWORKS</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-serif uppercase tracking-tight mb-3">
              CREDITS
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[rgba(255,255,255,0.45)] tracking-widest uppercase mb-8 sm:mb-10 max-w-xl">
              BROADCASTERS • OTT PLATFORMS • BRANDS • PRODUCTION PARTNERS
            </p>

            {/* Rolling Credits List */}
            <div className="w-full divide-y divide-[rgba(255,255,255,0.05)] border-t border-b border-[rgba(255,255,255,0.08)]">
              {CLIENT_CREDITS.map((item, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => {
                      setHoveredIdx(idx);
                      soundEngine.playLensRack();
                    }}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`py-3.5 sm:py-4 px-2 sm:px-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all duration-300 group cursor-pointer ${
                      isHovered
                        ? "bg-[rgba(212,175,55,0.07)] pl-4 sm:pl-5 border-l-2 border-l-[#d4af37]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Index & Name */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-[10px] text-[#d4af37]/60 font-bold tracking-widest">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-base sm:text-lg font-bold tracking-[0.18em] uppercase font-serif transition-colors duration-200 ${
                          isHovered
                            ? "text-[#d4af37]"
                            : "text-white group-hover:text-white"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Category & Production Note */}
                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[rgba(255,255,255,0.4)]">
                      <span
                        className={`transition-colors duration-200 ${
                          isHovered ? "text-white/90" : "text-white/50"
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
                      <span
                        className={`transition-colors duration-200 ${
                          isHovered ? "text-[#d4af37]" : "text-[rgba(255,255,255,0.3)]"
                        }`}
                      >
                        {item.note}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Credits Telemetry Footnote */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-[10px] sm:text-[11px] text-white/40 tracking-wider">
              <div className="flex items-center gap-1.5 text-[#d4af37]">
                <Award className="w-3.5 h-3.5" />
                <span>13+ YEARS OF INDUSTRY CREDITS</span>
              </div>
              <span>•</span>
              <div>80+ BROADCAST PRODUCTIONS</div>
              <span>•</span>
              <div>12B+ AUDIENCE IMPRESSIONS</div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: DIRECTOR PORTRAIT IMAGE                                    */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 w-full flex items-center justify-center lg:sticky lg:top-24 pt-4 lg:pt-0">
            <div className="relative w-full max-w-[460px] mx-auto group">
              {/* Backlight Glow Spotlight */}
              <div className="absolute -inset-2 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.25)_0%,transparent_70%)] rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Main Portrait Card */}
              <div className="relative aspect-[4/5] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#0c0d14] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.15)] group-hover:border-[#d4af37]/70 transition-all duration-500">
                {/* Director Photo */}
                <img
                  src="/images/farhan-credits.jpg"
                  alt="Farhan P. Zamma — Director & Producer"
                  className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10 font-mono text-[10px]">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-[#d4af37]/40 text-[#fced9a] backdrop-blur-md shadow-lg">
                    <Camera className="w-3 h-3 text-[#d4af37]" />
                    <span className="tracking-widest uppercase">DIRECTOR ON SET</span>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/70 backdrop-blur-md">
                    <span>35MM STILL</span>
                  </div>
                </div>

                {/* Bottom Cinematic Gradient & Typography Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060608] via-[#060608]/85 to-transparent pt-20 pb-6 px-6 z-10 flex flex-col justify-end">
                  {/* Anamorphic Gold Accent Line */}
                  <div className="w-12 h-[2px] bg-gradient-to-r from-[#d4af37] to-transparent mb-3" />

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-serif uppercase tracking-wider mb-1">
                    FARHAN P. ZAMMA
                  </h3>

                  <p className="text-[11px] font-mono text-[#d4af37] tracking-[0.2em] uppercase mb-1">
                    DIRECTOR • PRODUCER • STORYTELLER
                  </p>

                  <p className="text-[10px] text-white/50 font-mono tracking-wide leading-relaxed">
                    Zee TV &ldquo;Amma&rdquo; • Amazon MX Player &ldquo;First Copy&rdquo; • Discovery Channel
                  </p>
                </div>

                {/* Framing Corner Ticks */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/70 pointer-events-none z-20" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/70 pointer-events-none z-20" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/70 pointer-events-none z-20" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/70 pointer-events-none z-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
