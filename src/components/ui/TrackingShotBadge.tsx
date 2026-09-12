"use client";

import React, { useEffect, useRef } from "react";
import { Camera } from "lucide-react";

export default function TrackingShotBadge() {
  const labelRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const labelEl = labelRef.current;
    const pctEl = pctRef.current;
    if (!labelEl || !pctEl) return;

    let ticking = false;
    let lastPct = -1;
    let cachedTotalHeight = 1;

    const updateTotalHeight = () => {
      cachedTotalHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    updateTotalHeight();
    window.addEventListener("resize", updateTotalHeight, { passive: true });

    const getTrackingShotLabel = (p: number) => {
      if (p < 0.18) return "SHOT 01 • ESTABLISHING WIDE SOUNDSTAGE";
      if (p < 0.38) return "SHOT 02 • LOW DOLLY PAST ARRI CAMERA & ARCHIVE";
      if (p < 0.58) return "SHOT 03 • PUSH IN TO MONITOR & NLE TIMELINE";
      if (p < 0.78) return "SHOT 04 • GLIDE INTO CINEMA SCREENING ROOM";
      if (p < 0.92) return "SHOT 05 • 180° ORBIT OF DIRECTOR'S CHAIR";
      return "SHOT 06 • RETREAT PULL-BACK TO BLACK";
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset || 0;
          const progress = Math.min(Math.max(scrollY / cachedTotalHeight, 0), 1);
          const intPct = Math.round(progress * 100);
          if (intPct !== lastPct) {
            lastPct = intPct;
            labelEl.textContent = getTrackingShotLabel(progress);
            pctEl.textContent = `[${intPct}%]`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateTotalHeight);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-30 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-black/85 border border-[#d4af37]/35 backdrop-blur-md font-mono text-[9px] sm:text-[10px] text-white shadow-2xl pointer-events-none select-none max-w-[94vw] overflow-hidden">
      <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse shrink-0" />
      <Camera className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
      <span ref={labelRef} className="text-white/90 font-bold truncate">
        SHOT 01 • ESTABLISHING WIDE SOUNDSTAGE
      </span>
      <span ref={pctRef} className="text-[#d4af37] font-semibold shrink-0">
        [0%]
      </span>
    </div>
  );
}
