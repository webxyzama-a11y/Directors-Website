"use client";

import React, { useState } from "react";
import { Camera, Monitor, FileText, Armchair, Sliders, Clapperboard, Aperture } from "lucide-react";
import { soundEngine } from "@/audio/soundEngine";
import { StudioFocusTarget } from "../canvas/StudioScene";

interface DirectTheShotNavProps {
  activeTarget: StudioFocusTarget;
  onSelectTarget: (target: StudioFocusTarget, sectionId: string) => void;
}

export default function DirectTheShotNav({
  activeTarget,
  onSelectTarget,
}: DirectTheShotNavProps) {
  const [hudNotice, setHudNotice] = useState<string | null>(null);

  const subjects = [
    {
      id: "camera" as StudioFocusTarget,
      sectionId: "showreel",
      label: "CINEMA CAMERA",
      dest: "SHOWREEL",
      icon: Camera,
      lens: "50mm ƒ/1.2",
    },
    {
      id: "monitor" as StudioFocusTarget,
      sectionId: "work",
      label: "PRODUCTION MONITOR",
      dest: "WORK ARCHIVE",
      icon: Monitor,
      lens: "35mm ƒ/1.4",
    },
    {
      id: "chair" as StudioFocusTarget,
      sectionId: "about",
      label: "DIRECTOR'S CHAIR",
      dest: "ABOUT FARHAN",
      icon: Armchair,
      lens: "85mm ƒ/1.8",
    },
    {
      id: "clapperboard" as StudioFocusTarget,
      sectionId: "clapper",
      label: "CLAPPERBOARD",
      dest: "SLATE & CHAPTERS",
      icon: Clapperboard,
      lens: "28mm ƒ/2.0",
    },
    {
      id: "timeline" as StudioFocusTarget,
      sectionId: "timeline",
      label: "EDITING TIMELINE",
      dest: "CAREER NLE",
      icon: Sliders,
      lens: "24mm ƒ/2.8",
    },
    {
      id: "monitor" as StudioFocusTarget,
      sectionId: "process",
      label: "STORYBOARDS",
      dest: "DIRECTING PROCESS",
      icon: FileText,
      lens: "40mm ƒ/1.4",
    },
  ];

  const handleActionClick = (target: StudioFocusTarget, sectionId: string, label: string) => {
    soundEngine.playLensRack();
    setHudNotice(`ACTION — DOLLY TO ${label}`);

    setTimeout(() => {
      soundEngine.playWhoosh();
      onSelectTarget(target, sectionId);
      setHudNotice("CUT.");
      setTimeout(() => setHudNotice(null), 700);
    }, 380);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 pointer-events-none">
      {/* Dynamic HUD ACTION / CUT Notification Flash */}
      {hudNotice && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded bg-[rgba(6,6,8,0.9)] border border-[#d4af37] text-[#d4af37] font-mono text-xs tracking-[0.25em] font-bold uppercase shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse">
          {hudNotice}
        </div>
      )}

      {/* Director Console Bar */}
      <div className="pointer-events-auto bg-[rgba(10,10,14,0.85)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl p-2 shadow-2xl">
        <div className="flex items-center justify-between px-3 py-1 mb-1.5 border-b border-[rgba(255,255,255,0.06)] text-[10px] font-mono text-[rgba(255,255,255,0.4)] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <Aperture className="w-3 h-3 text-[#d4af37]" />
            <span>INTERACTION 01 — DIRECT THE SHOT</span>
          </div>
          <span className="hidden sm:inline">SELECT SUBJECT TO DOLLY IN</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {subjects.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeTarget === s.id;
            return (
              <button
                key={`${s.id}-${idx}`}
                onClick={() => handleActionClick(s.id, s.sectionId, s.label)}
                onMouseEnter={() => soundEngine.playFilmSprocketTick()}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all duration-300 group ${
                  isSelected
                    ? "bg-[rgba(212,175,55,0.15)] border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-[rgba(20,20,24,0.5)] border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.6)] hover:border-[rgba(255,255,255,0.25)] hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mb-1 transition-transform group-hover:scale-110 ${
                    isSelected ? "text-[#d4af37]" : "text-[rgba(255,255,255,0.5)] group-hover:text-white"
                  }`}
                />
                <span className="text-[10px] font-mono font-bold tracking-wider leading-tight">
                  {s.dest}
                </span>
                <span className="text-[8px] font-mono text-[rgba(255,255,255,0.35)] mt-0.5 tracking-tighter">
                  {s.lens}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
