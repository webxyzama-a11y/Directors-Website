"use client";

import React, { useState } from "react";
import { X, Sparkles, Volume2 } from "lucide-react";
import confetti from "canvas-confetti";
import { soundEngine } from "@/audio/soundEngine";

interface ClapperboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChapterCut: (sectionId: string) => void;
}

export default function ClapperboardModal({
  isOpen,
  onClose,
  onChapterCut,
}: ClapperboardModalProps) {
  const [takeCount, setTakeCount] = useState(1);
  const [isSnapping, setIsSnapping] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClack = () => {
    if (isSnapping) return;
    setIsSnapping(true);
    soundEngine.playClapperSnap();

    const nextTake = takeCount + 1;
    setTakeCount(nextTake);

    if (nextTake === 4) {
      setEasterEggMessage("STILL NOT PERFECT. TAKE IT FROM THE TOP. CUT!");
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d4af37", "#e74c3c", "#ffffff"],
        });
      } catch (e) {}
    } else if (nextTake > 4) {
      setEasterEggMessage(null);
      setTakeCount(1);
    }

    setTimeout(() => {
      setIsSnapping(false);
    }, 280);
  };

  const handleChapterJump = (sectionId: string) => {
    soundEngine.playClapperSnap();
    onChapterCut(sectionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[rgba(212,175,55,0.4)] bg-[#0d0e14] p-5 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] font-mono max-h-[92vh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <span className="text-xs text-[#d4af37] tracking-[0.3em] uppercase block mb-1">
            INTERACTION 04 — 3D SLATE & CHAPTER CUTS
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif uppercase tracking-tight">
            DIRECTOR&apos;S CLAPPERBOARD
          </h3>
          <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1">
            Tap the slate to trigger a CLACK and increment the take counter
          </p>
        </div>

        {/* Interactive Clapperboard Physical Card */}
        <div
          onClick={handleClack}
          className="relative max-w-lg mx-auto rounded-xl border-2 border-white/20 bg-[#121217] overflow-hidden cursor-pointer shadow-2xl transition-transform active:scale-98 group select-none"
        >
          {/* Moving Clapper Stick with Diagonal Chevrons */}
          <div
            className={`w-full h-12 flex items-center bg-[#181820] border-b-2 border-white/30 transition-transform origin-bottom-left ${
              isSnapping ? "-rotate-12 duration-100" : "rotate-0 duration-150"
            }`}
          >
            <div className="w-full h-full flex overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-full skew-x-[-35deg] ${
                    i % 2 === 0 ? "bg-white" : "bg-[#111114]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Slate Board Face */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] text-[rgba(255,255,255,0.4)] block uppercase tracking-widest">
                  PRODUCTION
                </span>
                <span className="text-white font-bold text-sm tracking-wider">
                  FIRST COPY / AMMA
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-[rgba(255,255,255,0.4)] block uppercase tracking-widest">
                  DIRECTOR
                </span>
                <span className="text-[#d4af37] font-bold text-sm tracking-wider">
                  FARHAN P. ZAMMA
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 text-center py-2 border-b border-white/10">
              <div className="border-r border-white/10 pr-2">
                <span className="text-[9px] text-[rgba(255,255,255,0.4)] block uppercase">SCENE</span>
                <span className="text-3xl font-extrabold text-white">80+</span>
              </div>
              <div className="border-r border-white/10 px-2">
                <span className="text-[9px] text-[rgba(255,255,255,0.4)] block uppercase">SHOT</span>
                <span className="text-3xl font-extrabold text-white">A-1</span>
              </div>
              <div className="pl-2">
                <span className="text-[9px] text-[rgba(255,255,255,0.4)] block uppercase">TAKE</span>
                <span className="text-3xl font-extrabold text-[#e74c3c]">
                  {takeCount < 10 ? `0${takeCount}` : takeCount}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[rgba(255,255,255,0.5)] pt-1">
              <span>CAMERA: ARRI ALEXA LF • 4K</span>
              <span className="text-[#d4af37] font-bold">CLICK TO CLACK 🎬</span>
            </div>
          </div>
        </div>

        {/* Easter Egg Message Banner */}
        {easterEggMessage && (
          <div className="mt-6 p-4 rounded-xl bg-[rgba(231,76,60,0.15)] border border-[#e74c3c] text-center text-xs font-bold text-[#e74c3c] animate-bounce">
            {easterEggMessage}
          </div>
        )}

        {/* Chapter Quick Cut Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <span className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-widest block text-center mb-3">
            OR CUT DIRECTLY TO CHAPTER:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "work", label: "TELEVISION → CUT" },
              { id: "work", label: "DOCUMENTARY → CUT" },
              { id: "work", label: "WEB SERIES → CUT" },
              { id: "work", label: "ADVERTISING → CUT" },
              { id: "timeline", label: "TIMELINE → CUT" },
            ].map((c, i) => (
              <button
                key={i}
                onClick={() => handleChapterJump(c.id)}
                className="px-3 py-1.5 rounded border border-white/15 bg-white/5 hover:border-[#d4af37] hover:text-[#d4af37] text-xs transition-all"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
