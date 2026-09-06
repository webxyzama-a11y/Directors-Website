"use client";

import React, { useState } from "react";
import { Play, Volume2, VolumeX, Film } from "lucide-react";
import { SHOWREEL_METADATA } from "@/data/projectsData";
import { soundEngine } from "@/audio/soundEngine";
import CinematicReveal from "@/components/ui/CinematicReveal";

export default function ShowreelTheater() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const handlePlayShowreel = () => {
    soundEngine.playWhoosh();
    soundEngine.startProjectorHum();
    setIsPlaying(true);
  };

  return (
    <section id="showreel" className="relative w-full py-28 sm:py-36 px-4 md:px-12 bg-gradient-to-b from-transparent via-[rgba(4,4,6,0.95)] to-transparent overflow-hidden">
      {/* Top and bottom cinematic dark-to-light gradient merges */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#060608] via-[#060608]/80 to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060608] via-[#060608]/80 to-transparent pointer-events-none z-0" />

      {/* Volumetric Projector Glow in Background */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(232,240,255,0.08)] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Cinema Header */}
        <CinematicReveal effect="rack-focus" className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-mono tracking-[0.3em] uppercase mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>THE SCREENING ROOM</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white font-serif uppercase tracking-tight mb-2">
            OFFICIAL SHOWREEL
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[rgba(255,255,255,0.5)] tracking-widest uppercase">
            FARHAN P. ZAMMA • DIRECTOR & PRODUCER • 2.39:1 SCOPE
          </p>
        </CinematicReveal>

        {/* Anamorphic Cinema Screen (Responsive Ratio) */}
        <CinematicReveal delay={120} effect="rack-focus">
          <div className="relative aspect-[16/10] sm:aspect-[2.39/1] min-h-[250px] sm:min-h-0 w-full rounded-2xl overflow-hidden border-2 border-[rgba(255,255,255,0.1)] bg-[#07070a] shadow-[0_20px_60px_rgba(0,0,0,0.85)] transform-gpu will-change-transform group">
          {isPlaying ? (
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${SHOWREEL_METADATA.youtubeId}?autoplay=1&mute=${
                  isAudioMuted ? 1 : 0
                }&rel=0&modestbranding=1&showinfo=0`}
                title="Farhan P. Zamma Official Showreel"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Minimalist Floating Sound & Fullscreen Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="p-2 rounded-full bg-black/70 border border-white/20 text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-all backdrop-blur-md"
                  title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-gradient-to-t from-black via-[#0d0e14] to-black">
              {/* Subtle Screen Ambient Dust Texture */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />

              <div className="relative z-10 max-w-lg space-y-3 sm:space-y-4">
                <span className="font-mono text-[10px] sm:text-xs text-[#d4af37] tracking-[0.25em] uppercase">
                  MASTER DIRECTORS CUT • {SHOWREEL_METADATA.duration}
                </span>
                <h3 className="text-xl sm:text-4xl font-extrabold text-white font-serif uppercase tracking-tight">
                  13+ YEARS OF DIRECTING IDEAS INTO IMAGES
                </h3>
                <p className="text-[11px] sm:text-sm text-[rgba(255,255,255,0.6)] font-light leading-relaxed">
                  First Copy • Amma • Inside The Burning • Maruti • TECNO • SEBI Qawwali • Microdramas
                </p>

                <div className="pt-2 sm:pt-4">
                  <button
                    onClick={handlePlayShowreel}
                    className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#d4af37] text-black font-bold text-xs font-mono tracking-widest uppercase hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>PLAY FILM →</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </CinematicReveal>

        {/* Showreel Chapter Bookmarks */}
        <CinematicReveal delay={220} effect="slide-up">
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-[10px]">
            {SHOWREEL_METADATA.chapters.map((ch, i) => (
              <div
                key={i}
                className="p-2.5 rounded border border-[rgba(255,255,255,0.06)] bg-[rgba(14,14,20,0.4)] text-[rgba(255,255,255,0.6)] hover:border-[#d4af37]/40 transition-colors"
              >
                <span className="text-[#d4af37] block font-bold">{ch.time}</span>
                <span className="truncate block mt-0.5 text-white">{ch.title}</span>
              </div>
            ))}
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
}
