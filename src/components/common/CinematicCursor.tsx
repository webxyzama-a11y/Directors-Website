"use client";

import React, { useEffect, useRef } from "react";

export default function CinematicCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Only show custom cursor on fine pointer devices (desktop with mouse)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!cursor || !ring || !dot || !label) return;

    // Enable custom cursor styles on document body
    document.documentElement.classList.add("custom-cursor-active");

    let isVisible = false;
    let isHovered = false;
    let isDown = false;

    const updateAppearance = () => {
      if (isHovered) {
        ring.className =
          "relative rounded-full border border-[#d4af37] bg-[rgba(212,175,55,0.1)] flex items-center justify-center w-14 h-14 scale-110 transition-all duration-150 ease-out";
        dot.className =
          "w-1.5 h-1.5 rounded-full bg-[#d4af37] transition-colors duration-150";
        label.textContent = "RACK FOCUS";
      } else if (isDown) {
        ring.className =
          "relative rounded-full border border-[#e74c3c] bg-[rgba(231,76,60,0.1)] flex items-center justify-center w-8 h-8 scale-95 transition-all duration-100 ease-out";
        dot.className =
          "w-1.5 h-1.5 rounded-full bg-[#e74c3c] transition-colors duration-100";
        label.textContent = "REC • ACTIVE";
      } else {
        ring.className =
          "relative rounded-full border border-[rgba(255,255,255,0.45)] flex items-center justify-center w-10 h-10 scale-100 transition-all duration-150 ease-out";
        dot.className =
          "w-1.5 h-1.5 rounded-full bg-white transition-colors duration-150";
        label.textContent = "35mm ƒ/1.4";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // 100% synchronous direct hardware-accelerated transform update (Zero React lag)
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = "1";
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = Boolean(
        target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("a") ||
          target.hasAttribute("role") ||
          target.classList.contains("interactive-cursor") ||
          target.classList.contains("cursor-pointer")
      );

      if (isInteractive !== isHovered) {
        isHovered = isInteractive;
        updateAppearance();
      }
    };

    const handleMouseDown = () => {
      isDown = true;
      updateAppearance();
    };

    const handleMouseUp = () => {
      isDown = false;
      updateAppearance();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      cursor.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] opacity-0 will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        marginTop: "-20px",
        marginLeft: "-20px",
      }}
    >
      {/* Outer Reticle Ring */}
      <div
        ref={ringRef}
        className="relative rounded-full border border-[rgba(255,255,255,0.45)] flex items-center justify-center w-10 h-10 transition-all duration-150 ease-out"
      >
        {/* Center Point */}
        <div
          ref={dotRef}
          className="w-1.5 h-1.5 rounded-full bg-white transition-colors duration-150"
        />

        {/* Framing Corner Ticks */}
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-[1px] h-1.5 bg-[rgba(255,255,255,0.6)]" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-[1px] h-1.5 bg-[rgba(255,255,255,0.6)]" />
        <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 h-[1px] w-1.5 bg-[rgba(255,255,255,0.6)]" />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 h-[1px] w-1.5 bg-[rgba(255,255,255,0.6)]" />

        {/* Small Lens Focal Length readout */}
        <span
          ref={labelRef}
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-[rgba(255,255,255,0.6)] whitespace-nowrap drop-shadow-sm"
        >
          35mm ƒ/1.4
        </span>
      </div>
    </div>
  );
}
