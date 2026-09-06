"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Clapperboard, Volume2, Film } from "lucide-react";
import { soundEngine } from "@/audio/soundEngine";

interface GrandRedCurtainProps {
  onCurtainOpen?: () => void;
  forceOpen?: boolean;
}

export default function GrandRedCurtain({
  onCurtainOpen,
  forceOpen = false,
}: GrandRedCurtainProps) {
  // isParted controls whether the curtains are currently open or closed
  const [isParted, setIsParted] = useState(false);
  // isHidden removes the overlay from DOM / pointer events once fully parted
  const [isHidden, setIsHidden] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Trigger parting the curtains
  const handleOpenCurtains = () => {
    if (isParted) return;
    setIsParted(true);

    // Unmute audio and trigger grand audience applause + velvet opening
    soundEngine.unmute();
    soundEngine.playAudienceApplause();
    soundEngine.playCurtainOpening();

    // Fade in peaceful ambient soundscape throughout the video and experience
    setTimeout(() => {
      soundEngine.startPeacefulAmbient();
    }, 1200);

    if (onCurtainOpen) {
      onCurtainOpen();
    }

    // After animation completes (2.4s), hide overlay so full site is interactive
    setTimeout(() => {
      setIsHidden(true);
    }, 2400);
  };

  // Auto-countdown timer on load/reload
  useEffect(() => {
    if (forceOpen) {
      setIsParted(true);
      setIsHidden(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleOpenCurtains();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [forceOpen]);

  if (isHidden) return null;

  return (
    <div
      onClick={handleOpenCurtains}
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-opacity duration-700 ${
        isParted ? "pointer-events-none" : "pointer-events-auto cursor-pointer"
      }`}
      aria-label="Grand Cinema Premiere Curtain"
    >
      {/* ========================================================================= */}
      {/* 1. LEFT RED VELVET CURTAIN                                                */}
      {/* ========================================================================= */}
      <div
        className={`absolute top-0 left-0 w-[52%] h-full z-20 transition-all duration-[2200ms] ease-[cubic-bezier(0.65,0,0.2,1)] will-change-transform shadow-[15px_0_40px_rgba(0,0,0,0.85)] ${
          isParted ? "-translate-x-full scale-x-[0.25] origin-left" : "translate-x-0 scale-x-100"
        }`}
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              #4a0309 0px,
              #780a13 22px,
              #99101d 44px,
              #b81423 60px,
              #780a13 78px,
              #3a0207 100px
            )
          `,
          boxShadow: "inset -12px 0 24px rgba(0, 0, 0, 0.7), 10px 0 35px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Soft fabric surface sheen & vertical shadow grooves */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.18) 0px,
              transparent 25px,
              rgba(0,0,0,0.65) 50px,
              transparent 75px
            )`,
          }}
        />

        {/* Vertical Center Gold Trim Border */}
        <div className="absolute top-0 right-0 w-2.5 h-full bg-gradient-to-r from-[#8a7226] via-[#f7d678] to-[#69541a] shadow-[0_0_12px_rgba(212,175,55,0.6)]" />

        {/* Bottom Gold Fringe Hem */}
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-[#4a390e] via-[#c9a635] to-[#7d6118] border-t border-[#f7d678]/40 shadow-lg">
          <div
            className="w-full h-full opacity-60"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, #241902 0px, #241902 2px, #f7d678 3px, #241902 4px)`,
            }}
          />
        </div>

        {/* Left Gold Tassel & Drape Tieback Cord */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-80">
          <div className="w-1.5 h-36 bg-gradient-to-b from-[#f7d678] to-[#997926] rounded-full shadow-md" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f7d678] to-[#7d6118] border border-[#fced9a] shadow-lg -mt-1" />
          <div className="w-4 h-12 bg-gradient-to-b from-[#f7d678] via-[#a88628] to-transparent rounded-b-md shadow-md" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT RED VELVET CURTAIN                                               */}
      {/* ========================================================================= */}
      <div
        className={`absolute top-0 right-0 w-[52%] h-full z-20 transition-all duration-[2200ms] ease-[cubic-bezier(0.65,0,0.2,1)] will-change-transform shadow-[-15px_0_40px_rgba(0,0,0,0.85)] ${
          isParted ? "translate-x-full scale-x-[0.25] origin-right" : "translate-x-0 scale-x-100"
        }`}
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              #3a0207 0px,
              #780a13 22px,
              #b81423 40px,
              #99101d 56px,
              #780a13 78px,
              #4a0309 100px
            )
          `,
          boxShadow: "inset 12px 0 24px rgba(0, 0, 0, 0.7), -10px 0 35px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Soft fabric surface sheen & vertical shadow grooves */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(0,0,0,0.65) 25px,
              transparent 50px,
              rgba(255,255,255,0.18) 75px
            )`,
          }}
        />

        {/* Vertical Center Gold Trim Border */}
        <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-r from-[#69541a] via-[#f7d678] to-[#8a7226] shadow-[0_0_12px_rgba(212,175,55,0.6)]" />

        {/* Bottom Gold Fringe Hem */}
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-[#4a390e] via-[#c9a635] to-[#7d6118] border-t border-[#f7d678]/40 shadow-lg">
          <div
            className="w-full h-full opacity-60"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, #241902 0px, #241902 2px, #f7d678 3px, #241902 4px)`,
            }}
          />
        </div>

        {/* Right Gold Tassel & Drape Tieback Cord */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-80">
          <div className="w-1.5 h-36 bg-gradient-to-b from-[#f7d678] to-[#997926] rounded-full shadow-md" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f7d678] to-[#7d6118] border border-[#fced9a] shadow-lg -mt-1" />
          <div className="w-4 h-12 bg-gradient-to-b from-[#f7d678] via-[#a88628] to-transparent rounded-b-md shadow-md" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TOP THEATRICAL SCALLOPED PELMET / VALANCE                              */}
      {/* ========================================================================= */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 h-16 sm:h-24 transition-transform duration-[1800ms] ease-out will-change-transform pointer-events-none ${
          isParted ? "-translate-y-full" : "translate-y-0"
        }`}
        style={{
          background: "linear-gradient(180deg, #300206 0%, #61070e 65%, #7d0a13 100%)",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Scalloped velvet pleat arches */}
        <div className="flex justify-between w-full h-full px-2 sm:px-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={`scallop-${i}`}
              className="flex-1 h-full mx-0.5 rounded-b-3xl sm:rounded-b-[40px] border-b-2 sm:border-b-4 border-[#d4af37] bg-gradient-to-b from-[#5c070e] to-[#8c0f1b] shadow-md relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#fced9a] opacity-80" />
            </div>
          ))}
        </div>
        {/* Top Gold Fringe Line */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#997926] via-[#f7d678] to-[#997926] shadow-[0_0_10px_rgba(212,175,55,0.7)]" />
      </div>

      {/* ========================================================================= */}
      {/* 4. CENTER WELCOME PREMIERE PLAQUE & CALL-TO-ACTION                        */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center transition-all duration-[1200ms] ease-out ${
          isParted
            ? "opacity-0 scale-110 pointer-events-none"
            : "opacity-100 scale-100 pointer-events-auto"
        }`}
      >
        {/* Spotlighting vignette backdrop behind the plaque */}
        <div className="absolute w-[92%] max-w-2xl h-[420px] rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.5)_60%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 rounded-2xl bg-[rgba(10,8,12,0.88)] border-2 border-[#d4af37]/60 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.25)]">
          {/* Top Laurel & Cinema Emblem */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#fced9a] font-mono text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase">
              <Film className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#d4af37]" />
              <span>PREMIERE SCREENING • ADMIT ONE</span>
            </div>
            <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>

          {/* Welcome Tagline */}
          <p className="font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.28em] uppercase text-white/70 mb-2">
            WELCOME TO THE CINEMATIC WORLD OF
          </p>

          {/* Grand Director Name */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#fff2cc] via-[#d4af37] to-[#8c701d] drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)] mb-3">
            FARHAN P. ZAMMA
          </h1>

          {/* Titles & Roles */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] text-[#d4af37] mb-5 uppercase">
            <span>DIRECTOR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/50" />
            <span>PRODUCER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/50" />
            <span>STORYTELLER</span>
          </div>

          {/* Famous Quote */}
          <p className="text-xs sm:text-sm text-white/80 font-light italic max-w-lg mx-auto mb-6 sm:mb-8 leading-relaxed">
            &ldquo;13+ Years • 80+ Shows • One Obsession: Storytelling. Enter the 3D Soundstage.&rdquo;
          </p>

          {/* Interactive "Open Curtains" Button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleOpenCurtains}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f7e089] to-[#d4af37] text-black font-mono text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider shadow-[0_0_35px_rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Shimmer light sweep on button */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
              <Clapperboard className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-black group-hover:rotate-12 transition-transform duration-300 shrink-0" />
              <span>OPEN CURTAINS</span>
              <span className="hidden xs:inline">• ENTER THEATER</span>
              <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-black shrink-0" />
            </button>

            {/* Auto countdown indicator */}
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-white/50 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
              <span>Curtains opening automatically in {countdown}s...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
