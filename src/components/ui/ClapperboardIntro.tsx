"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "@/audio/soundEngine";

interface ClapperboardIntroProps {
  onComplete?: () => void;
  forceSkip?: boolean;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Phase timeline
   "idle"     : board visible, arm raised, waiting for click / auto-snap
   "snapping" : arm slams down (220 ms)
   "flash"    : white frame-cut flash (140 ms)
   "exiting"  : overlay fades/scales out (750 ms)
   "done"     : component unmounted
───────────────────────────────────────────────────────────────────────────── */
type Phase = "idle" | "snapping" | "flash" | "exiting" | "done";

export default function ClapperboardIntro({
  onComplete,
  forceSkip = false,
}: ClapperboardIntroProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [armAngle, setArmAngle] = useState(0); // degrees, positive = raised
  const rafRef = useRef<number | null>(null);
  const hasSnapped = useRef(false);

  // Auto-raise arm then auto-snap
  useEffect(() => {
    if (forceSkip) { setPhase("done"); return; }

    const raiseTimer = setTimeout(() => setArmAngle(38), 600);
    const snapTimer  = setTimeout(() => triggerSnap(), 1600);
    return () => { clearTimeout(raiseTimer); clearTimeout(snapTimer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSkip]);

  const triggerSnap = () => {
    if (hasSnapped.current) return;
    hasSnapped.current = true;

    soundEngine.unmute();
    soundEngine.playClapperSnap();
    setPhase("snapping");

    const start = performance.now();
    const DURATION = 220;

    const animate = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setArmAngle(38 * (1 - t * t)); // ease-in slam
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setArmAngle(0);
        setTimeout(() => {
          setPhase("flash");
          setTimeout(() => {
            setPhase("exiting");
            soundEngine.startPeacefulAmbient();
            if (onComplete) onComplete();
            setTimeout(() => setPhase("done"), 750);
          }, 140);
        }, 80);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const handleClick = () => {
    if (phase === "idle") {
      setArmAngle(38);
      setTimeout(triggerSnap, 120);
    }
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  if (phase === "done") return null;

  const isExiting = phase === "exiting";
  const isFlash   = phase === "flash";

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 z-50 flex items-center justify-center select-none"
      style={{
        background: "#0a0a0d",
        cursor: phase === "idle" ? "pointer" : "default",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.04)" : "scale(1)",
        transition: isExiting ? "opacity 0.75s ease-out, transform 0.75s ease-out" : undefined,
        pointerEvents: phase !== "idle" ? "none" : "auto",
      }}
    >
      {/* White frame-cut flash */}
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          zIndex: 10,
          opacity: isFlash ? 1 : 0,
          transition: isFlash ? "none" : "opacity 0.3s ease-out",
        }}
      />

      {/* Film-grain texture */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.75) 100%)" }}
      />

      {/* ── Clapperboard ── */}
      <div
        className="relative flex flex-col items-center"
        style={{ width: "min(90vw, 580px)", filter: "drop-shadow(0 28px 70px rgba(0,0,0,0.98))" }}
      >
        {/* Moving clapper arm */}
        <div
          style={{
            width: "100%",
            transformOrigin: "left center",
            transform: `rotate(-${armAngle}deg)`,
            transition: phase === "idle" ? "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)" : "none",
            zIndex: 2,
            position: "relative",
          }}
        >
          <ClapperArm />
        </div>

        {/* Fixed base strip */}
        <div style={{ width: "100%", marginTop: "-1px", zIndex: 1, position: "relative" }}>
          <BaseStrip />
        </div>

        {/* Slate body */}
        <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
          <SlateBody />
        </div>
      </div>

      {/* Hint text */}
      {phase === "idle" && (
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] uppercase"
          style={{ color: "rgba(255,255,255,0.35)", animation: "cbPulse 1.8s ease-in-out infinite" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.35)", animation: "cbPing 1.8s ease-in-out infinite" }}
          />
          <span>Click to clap &bull; Opening automatically</span>
        </div>
      )}

      <style>{`
        @keyframes cbPulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @keyframes cbPing  { 0%,100%{transform:scale(1);opacity:.4} 50%{transform:scale(1.7);opacity:1} }
      `}</style>
    </div>
  );
}

/* ─── Clapper Arm ─────────────────────────────────────────────────────────── */
function ClapperArm() {
  return (
    <svg viewBox="0 0 580 68" width="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect x="0" y="8" width="580" height="52" rx="6" fill="#1a1a22" />
      {Array.from({ length: 18 }).map((_, i) => {
        const x = i * 34 - 10;
        return (
          <polygon
            key={i}
            points={`${x},8 ${x+20},8 ${x+36},60 ${x+16},60`}
            fill={i % 2 === 0 ? "#f0f0f3" : "#111118"}
          />
        );
      })}
      <rect x="0" y="8" width="580" height="3" fill="rgba(255,255,255,0.10)" />
      <rect x="0" y="57" width="580" height="3" fill="rgba(0,0,0,0.35)" />
      {/* Pivot bolt */}
      <circle cx="18" cy="34" r="11" fill="#c0c0c0" stroke="#777" strokeWidth="2" />
      <circle cx="18" cy="34" r="4.5" fill="#888" />
    </svg>
  );
}

/* ─── Base Strip ─────────────────────────────────────────────────────────── */
function BaseStrip() {
  return (
    <svg viewBox="0 0 580 50" width="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect x="0" y="0" width="580" height="50" fill="#141418" />
      {Array.from({ length: 18 }).map((_, i) => {
        const x = i * 34 - 10;
        return (
          <polygon
            key={i}
            points={`${x},0 ${x+20},0 ${x+36},50 ${x+16},50`}
            fill={i % 2 === 0 ? "#e6e6ea" : "#0d0d12"}
          />
        );
      })}
      <rect x="0" y="0" width="580" height="2" fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

/* ─── Slate Body ─────────────────────────────────────────────────────────── */
function SlateBody() {
  return (
    <svg viewBox="0 0 580 390" width="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect x="0" y="0" width="580" height="390" fill="#17171f" />
      <rect x="10" y="10" width="560" height="370" rx="4" fill="none" stroke="#3a3a4a" strokeWidth="2.5" />

      {/* Grid lines */}
      <line x1="10"  y1="78"  x2="570" y2="78"  stroke="#3a3a4a" strokeWidth="2" />
      <line x1="10"  y1="158" x2="570" y2="158" stroke="#3a3a4a" strokeWidth="2" />
      <line x1="10"  y1="262" x2="570" y2="262" stroke="#3a3a4a" strokeWidth="2" />
      <line x1="290" y1="158" x2="290" y2="262" stroke="#3a3a4a" strokeWidth="2" />
      <line x1="435" y1="158" x2="435" y2="262" stroke="#3a3a4a" strokeWidth="2" />

      {/* Row 1: Production */}
      <text x="24" y="38" fill="#606080" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="2">PRODUCTION</text>
      <text x="24" y="68" fill="#ffffff" fontSize="23" fontFamily="monospace" fontWeight="bold">FIRST COPY / AMMA</text>

      {/* Row 2: Director */}
      <text x="24" y="108" fill="#606080" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="2">DIRECTOR</text>
      <text x="24" y="148" fill="#ffffff" fontSize="23" fontFamily="monospace" fontWeight="bold">FARHAN P. ZAMMA</text>

      {/* Row 3: Scene / Shot / Take labels */}
      <text x="24"  y="185" fill="#606080" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="2">SCENE</text>
      <text x="306" y="185" fill="#606080" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="2">SHOT</text>
      <text x="450" y="185" fill="#606080" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="2">TAKE</text>

      {/* Row 3: Scene / Shot / Take values */}
      <text x="44"  y="248" fill="#ffffff" fontSize="54" fontFamily="monospace" fontWeight="bold">80+</text>
      <text x="316" y="248" fill="#ffffff" fontSize="54" fontFamily="monospace" fontWeight="bold">A-1</text>
      <text x="454" y="248" fill="#e74c3c" fontSize="54" fontFamily="monospace" fontWeight="bold">01</text>

      {/* Row 4: Date / FPS */}
      <text x="24" y="292" fill="#606080" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="2">DATE / FPS</text>
      <text x="24" y="322" fill="#c8c8d8" fontSize="18" fontFamily="monospace" fontWeight="bold">24 FPS  •  4K DCI  •  ARRI LF</text>

      {/* Tagline */}
      <text x="290" y="368" fill="#44445a" fontSize="11" fontFamily="monospace" textAnchor="middle" letterSpacing="3">
        13+ YEARS  •  80+ SHOWS  •  ONE OBSESSION: STORYTELLING
      </text>
    </svg>
  );
}
