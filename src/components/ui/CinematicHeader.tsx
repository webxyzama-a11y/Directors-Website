"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Clapperboard, RotateCcw, Menu, X, Film, Sparkles } from "lucide-react";
import { soundEngine } from "@/audio/soundEngine";

interface CinematicHeaderProps {
  isRecActive?: boolean;
  onToggleRec?: () => void;
  onOpenClapper: () => void;
  onOpenInspect?: () => void;
  onReplayCurtain?: () => void;
  currentSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function CinematicHeader({
  isRecActive = false,
  onToggleRec,
  onOpenClapper,
  onOpenInspect,
  onReplayCurtain,
  currentSection,
  onNavigate,
}: CinematicHeaderProps) {
  const [timecode, setTimecode] = useState("01:13:80:00");
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync with soundEngine mute state
  useEffect(() => {
    setIsMuted(soundEngine.isMuted);
    const unsubscribe = soundEngine.subscribe((muted) => {
      setIsMuted(muted);
    });
    return () => unsubscribe();
  }, []);

  // Live 24fps timecode simulation
  useEffect(() => {
    let frame = 0;
    let sec = 13;
    let min = 1;
    let hour = 1;

    const interval = setInterval(() => {
      frame++;
      if (frame >= 24) {
        frame = 0;
        sec++;
        if (sec >= 60) {
          sec = 0;
          min++;
        }
      }
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      setTimecode(`${pad(hour)}:${pad(min)}:${pad(sec)}:${pad(frame)}`);
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const active = soundEngine.toggleSound();
    setIsMuted(!active);
  };

  const navItems = [
    { id: "prologue", label: "PROLOGUE", num: "01" },
    { id: "work", label: "FILMOGRAPHY", num: "02" },
    { id: "timeline", label: "TIMELINE", num: "03" },
    { id: "showreel", label: "SHOWREEL", num: "04" },
    { id: "about", label: "DIRECTOR", num: "05" },
    { id: "salt-media", label: "SALT MEDIA", num: "06" },
    { id: "contact", label: "CONTACT", num: "07" },
  ];

  const handleNavClick = (sectionId: string) => {
    soundEngine.playLensRack();
    setIsMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 md:px-8 py-3 sm:py-4 backdrop-blur-md bg-[rgba(6,6,8,0.85)] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs tracking-widest uppercase font-mono">
        {/* Left: Timecode & Camera Specs */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-[10px] text-[rgba(255,255,255,0.4)]">TC</span>
            <span className="font-bold text-[#f5f5f7] tracking-wider text-xs sm:text-sm">
              {timecode}
            </span>
          </div>
          <span className="hidden sm:inline-block text-[rgba(255,255,255,0.2)]">|</span>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-[rgba(255,255,255,0.5)]">
            <span>ARRI LF</span>
            <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
            <span>4K DCI</span>
            <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
            <span>2.39:1</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`transition-all duration-200 hover:text-white py-1 relative text-[11px] ${
                currentSection === item.id
                  ? "text-[#d4af37] font-semibold"
                  : "text-[rgba(255,255,255,0.5)]"
              }`}
            >
              {item.label}
              {currentSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#d4af37]" />
              )}
            </button>
          ))}
        </nav>

        {/* Right: Controls & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 3D Prop Inspect Trigger */}
          {onOpenInspect && (
            <button
              onClick={() => {
                soundEngine.playCameraShutter();
                onOpenInspect();
              }}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(20,20,24,0.6)] hover:border-[rgba(255,255,255,0.3)] text-[rgba(255,255,255,0.7)] transition-all shrink-0"
              title="Inspect 3D Studio Equipment"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden md:inline text-[10px]">3D</span>
            </button>
          )}

          {/* Interaction 04 Trigger: Slate */}
          <button
            onClick={() => {
              soundEngine.playClapperSnap();
              onOpenClapper();
            }}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(20,20,24,0.6)] hover:border-[rgba(255,255,255,0.3)] text-[rgba(255,255,255,0.7)] transition-all shrink-0"
            title="Interactive Clapperboard Slate"
          >
            <Clapperboard className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden md:inline text-[10px]">SLATE</span>
          </button>

          {/* Sound Toggle with Wave Bars */}
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(20,20,24,0.6)] hover:border-[rgba(255,255,255,0.3)] text-[rgba(255,255,255,0.7)] transition-all shrink-0"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
            )}
            <div className="hidden xs:flex items-center gap-[2px] h-3">
              {[0.4, 0.9, 0.6, 0.3].map((height, i) => (
                <span
                  key={i}
                  className={`w-[2px] rounded-full transition-all ${
                    isMuted
                      ? "bg-[rgba(255,255,255,0.2)] h-1"
                      : "bg-[#d4af37] animate-pulse"
                  }`}
                  style={{
                    height: isMuted ? "4px" : `${height * 12}px`,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>
            <span className="hidden xs:inline text-[10px]">{isMuted ? "OFF" : "ON"}</span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => {
              soundEngine.playLensRack();
              setIsMobileMenuOpen((prev) => !prev);
            }}
            className="lg:hidden flex items-center justify-center p-1.5 rounded border border-[#d4af37]/40 bg-[rgba(20,20,28,0.8)] text-[#fced9a] hover:bg-[#d4af37]/20 transition-all shrink-0"
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Navigation Menu"}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ─── Mobile Navigation Drawer Overlay ─── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-20 px-6 pb-8 flex flex-col justify-between font-mono animate-fadeIn">
          {/* Top Cinema Header in Drawer */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2 text-xs text-[#d4af37]">
                <Film className="w-3.5 h-3.5" />
                <span>SCENE NAVIGATION</span>
              </div>
              <span className="text-[10px] text-white/40">FARHAN P. ZAMMA</span>
            </div>

            {/* Nav Chapter Links */}
            <div className="space-y-3">
              {navItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-[#fced9a] shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                        : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#d4af37] font-bold">
                        {item.num}
                      </span>
                      <span className="font-serif text-base tracking-wider">
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-[10px] text-[#d4af37] tracking-widest font-bold">
                        CURRENT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Drawer Quick Controls */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {onOpenInspect && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    soundEngine.playCameraShutter();
                    onOpenInspect();
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/15 bg-white/5 text-white/90 active:scale-98 transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-[#d4af37]" />
                  <span>INSPECT 3D</span>
                </button>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  soundEngine.playClapperSnap();
                  onOpenClapper();
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/15 bg-white/5 text-white/90 active:scale-98 transition-all"
              >
                <Clapperboard className="w-4 h-4 text-[#d4af37]" />
                <span>SLATE</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/40 pt-2">
              <span>TC {timecode}</span>
              <span>2.39:1 CINEMATIC SCOPE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
