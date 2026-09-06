"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Maximize2,
  Sparkles,
  Filter,
  Lightbulb,
  MousePointer2,
} from "lucide-react";
import { Project, WorkCategory } from "@/types";
import { PROJECTS_DATA, WORK_CATEGORIES } from "@/data/projectsData";
import { soundEngine } from "@/audio/soundEngine";

interface FilmStripBrowserProps {
  onSelectProject: (project: Project) => void;
}

export default function FilmStripBrowser({ onSelectProject }: FilmStripBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<WorkCategory>("ALL");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightTableActive, setIsLightTableActive] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);

  // Mouse drag-to-scroll tracking via refs for 0-rerender high-speed drag
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWheelTimeRef = useRef(0);

  const filteredProjects =
    selectedCategory === "ALL"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  const handleCategoryChange = (cat: WorkCategory) => {
    soundEngine.playLensRack();
    setSelectedCategory(cat);
    setActiveIndex(0);
    activeIndexRef.current = 0;
    if (stripRef.current) {
      stripRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const handleScrollPrev = () => {
    if (!stripRef.current) return;
    soundEngine.playFilmSprocketTick();
    const newIdx = Math.max(0, activeIndex - 1);
    setActiveIndex(newIdx);
    activeIndexRef.current = newIdx;
    scrollToIndex(newIdx);
  };

  const handleScrollNext = () => {
    if (!stripRef.current) return;
    soundEngine.playFilmSprocketTick();
    const newIdx = Math.min(filteredProjects.length - 1, activeIndex + 1);
    setActiveIndex(newIdx);
    activeIndexRef.current = newIdx;
    scrollToIndex(newIdx);
  };

  const scrollToIndex = (idx: number) => {
    if (stripRef.current) {
      const container = stripRef.current;
      const children = container.children;
      if (children[idx]) {
        const el = children[idx] as HTMLElement;
        el.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  };

  // Passive RAF-throttled scroll listener for accurate active card tracking without layout thrashing
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!strip) return;
          const containerCenter = strip.scrollLeft + strip.clientWidth / 2;
          const children = strip.children;
          let closestIdx = 0;
          let closestDist = Infinity;
          for (let i = 0; i < children.length; i++) {
            const el = children[i] as HTMLElement;
            const childCenter = el.offsetLeft + el.clientWidth / 2;
            const dist = Math.abs(containerCenter - childCenter);
            if (dist < closestDist) {
              closestDist = dist;
              closestIdx = i;
            }
          }
          if (closestIdx !== activeIndexRef.current && closestIdx < filteredProjects.length) {
            activeIndexRef.current = closestIdx;
            setActiveIndex(closestIdx);
            soundEngine.playFilmSprocketTick();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    strip.addEventListener("scroll", onScroll, { passive: true });
    return () => strip.removeEventListener("scroll", onScroll);
  }, [filteredProjects.length]);

  // Butter-Smooth Mouse Drag Handlers with Inertia & Projected Centering
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stripRef.current) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    scrollLeftRef.current = stripRef.current.scrollLeft;

    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

    // Disable scroll snap and smooth behavior while dragging so it tracks cursor 1:1 instantaneously
    stripRef.current.style.scrollSnapType = "none";
    stripRef.current.style.scrollBehavior = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current || !stripRef.current) return;
    e.preventDefault();

    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const dx = e.pageX - lastXRef.current;

    // Track smoothed drag velocity (px per ms)
    velocityRef.current = 0.75 * (dx / dt) + 0.25 * velocityRef.current;
    lastXRef.current = e.pageX;
    lastTimeRef.current = now;

    const totalWalk = e.pageX - startXRef.current;
    if (Math.abs(totalWalk) > 6) {
      hasDraggedRef.current = true;
    }

    // 1:1 exact, natural drag matching cursor movement
    stripRef.current.scrollLeft = scrollLeftRef.current - totalWalk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDownRef.current || !stripRef.current) return;
    isMouseDownRef.current = false;

    const container = stripRef.current;

    if (hasDraggedRef.current) {
      // Calculate target card based on release position + flick momentum velocity
      const children = Array.from(container.children) as HTMLElement[];
      const containerCenter = container.scrollLeft + container.clientWidth / 2;

      // Project forward based on release velocity (px/ms)
      const v = velocityRef.current;
      const momentumDistance = v * 240; // smooth projection glide
      const projectedCenter = containerCenter - momentumDistance;

      let closestIdx = 0;
      let closestDist = Infinity;
      children.forEach((child, i) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(projectedCenter - childCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });

      const targetIdx = Math.max(0, Math.min(filteredProjects.length - 1, closestIdx));

      // Glide smoothly into the target card using the exact same smooth easing as the buttons!
      scrollToIndex(targetIdx);
      setActiveIndex(targetIdx);
      activeIndexRef.current = targetIdx;
      soundEngine.playFilmSprocketTick();

      // Restore scroll snap after the smooth glide finishes
      snapTimeoutRef.current = setTimeout(() => {
        if (container) {
          container.style.scrollSnapType = "x mandatory";
        }
      }, 500);
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 60);
  };

  // Mouse wheel horizontal scrolling with smooth card stepping
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!stripRef.current) return;
    // Native horizontal trackpad swipe
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      stripRef.current.scrollLeft += e.deltaX;
      return;
    }
    // Vertical mouse wheel notch over filmstrip: smoothly glide to next/prev card
    if (Math.abs(e.deltaY) > 20) {
      const now = Date.now();
      if (now - lastWheelTimeRef.current > 300) {
        lastWheelTimeRef.current = now;
        if (e.deltaY > 0) {
          handleScrollNext();
        } else {
          handleScrollPrev();
        }
      }
    }
  };

  return (
    <section id="work" className="relative w-full py-24 px-4 md:px-12 bg-gradient-to-b from-transparent via-[rgba(6,6,8,0.78)] to-transparent">
      {/* Chapter Title & Positioning */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.08)]">
          <div>
            <div className="flex items-center gap-2 text-[#d4af37] text-xs font-mono tracking-[0.3em] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>35MM FILM STRIP & VIDEO REEL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight font-serif uppercase">
              SELECTED WORKS
            </h2>
            <p className="text-sm md:text-base text-[rgba(255,255,255,0.6)] font-light mt-2 max-w-2xl">
              Spanning high-octane streaming thrillers, 80+ television sagas, hazard-zone documentaries, and award-winning commercial campaigns.
            </p>
          </div>

          {/* Film Strip Header Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playLensRack();
                setIsLightTableActive(!isLightTableActive);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-mono transition-all ${
                isLightTableActive
                  ? "bg-[#fff5ea] text-black font-bold border-white shadow-[0_0_20px_rgba(255,245,230,0.5)]"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/30"
              }`}
              title="Toggle Backlit 5600K Light Table Mode"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${isLightTableActive ? "text-amber-500 fill-amber-500" : ""}`} />
              <span className="text-[10px]">LIGHT TABLE</span>
            </button>

            {/* Stepper counter */}
            <div className="font-mono text-xs text-[rgba(255,255,255,0.6)] px-2">
              <span className="text-[#d4af37] font-bold">{activeIndex + 1}</span> / {filteredProjects.length}
            </div>
          </div>
        </div>

        {/* Category Filter Pills & Mouse Scroll Hint */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)] mr-1 shrink-0" />
            {WORK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full font-mono text-[11px] tracking-wider uppercase transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? "bg-[#d4af37] text-black font-bold border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    : "bg-[rgba(20,20,26,0.5)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)] hover:border-[rgba(255,255,255,0.25)] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mouse drag & arrow guidance hint */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[10px] text-white/50">
            <MousePointer2 className="w-3 h-3 text-[#d4af37] animate-pulse" />
            <span>DRAG WITH MOUSE OR USE ARROWS TO SCROLL</span>
          </div>
        </div>
      </div>

      {/* 35mm Film Strip Reel Container */}
      <div
        className={`relative w-full overflow-hidden py-4 rounded-2xl transition-all duration-700 ${
          isLightTableActive
            ? "bg-[radial-gradient(ellipse_at_center,_rgba(255,250,240,0.18)_0%,_rgba(10,10,14,0.95)_70%)] shadow-[inset_0_0_100px_rgba(255,245,230,0.15)] border border-[rgba(255,245,230,0.2)]"
            : ""
        }`}
      >
        {/* Top Sprocket Holes Bar */}
        <div className="w-full flex items-center gap-6 py-2 px-4 bg-[#0e0e12] border-t border-b border-[rgba(255,255,255,0.08)] mb-4 select-none overflow-hidden">
          <span className="font-mono text-[9px] text-[rgba(212,175,55,0.6)] tracking-widest shrink-0">
            KODAK VISION3 500T • 35MM
          </span>
          <div className="flex items-center gap-3 grow overflow-hidden">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <div className="w-3.5 h-2 rounded-[2px] bg-[#050507] border border-[rgba(255,255,255,0.1)]" />
                <span className="font-mono text-[8px] text-[rgba(255,255,255,0.2)]">
                  {i % 2 === 0 ? `${i + 1}A` : `${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROMINENT LEFT FLOATING ARROW BUTTON FOR SCROLLING LEFT                   */}
        {/* ========================================================================= */}
        <button
          onClick={handleScrollPrev}
          disabled={activeIndex === 0}
          className="absolute left-1 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[rgba(8,8,12,0.92)] border-2 border-[#d4af37]/80 hover:border-white text-[#fced9a] hover:text-black hover:bg-[#d4af37] hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(0,0,0,0.95),0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer group"
          aria-label="Scroll Videos Left"
          title="Previous Video (Scroll Left)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* ========================================================================= */}
        {/* PROMINENT RIGHT FLOATING ARROW BUTTON FOR SCROLLING RIGHT                 */}
        {/* ========================================================================= */}
        <button
          onClick={handleScrollNext}
          disabled={activeIndex === filteredProjects.length - 1}
          className="absolute right-1 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[rgba(8,8,12,0.92)] border-2 border-[#d4af37]/80 hover:border-white text-[#fced9a] hover:text-black hover:bg-[#d4af37] hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(0,0,0,0.95),0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer group"
          aria-label="Scroll Videos Right"
          title="Next Video (Scroll Right)"
        >
          <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Scrollable Film Strip Cards with Mouse Drag & Wheel Support */}
        <div
          ref={stripRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          className="flex items-center gap-5 sm:gap-8 overflow-x-auto pb-8 pt-4 px-10 xs:px-14 sm:px-24 md:px-28 snap-x snap-mandatory no-scrollbar select-none cursor-grab active:cursor-grabbing"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {filteredProjects.map((project, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div
                key={project.id}
                onClick={() => {
                  if (hasDraggedRef.current) return; // Prevent triggering modal when dragging
                  setActiveIndex(idx);
                  activeIndexRef.current = idx;
                  soundEngine.playWhoosh();
                  onSelectProject(project);
                }}
                className={`relative shrink-0 w-[260px] xs:w-[300px] sm:w-[380px] md:w-[440px] rounded-lg border transition-[transform,opacity,border-color,box-shadow] duration-300 snap-center group will-change-transform ${
                  isCenter
                    ? "border-[#d4af37] bg-[rgba(16,16,22,0.95)] scale-[1.03] shadow-[0_0_35px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.25)] z-20 opacity-100"
                    : "border-[rgba(255,255,255,0.08)] bg-[rgba(12,12,16,0.65)] scale-[0.96] opacity-60 hover:opacity-90 z-10"
                }`}
              >
                {/* 16:9 Frame Container (Pre-Break state) */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-black pointer-events-none">
                  {/* Poster Image */}
                  <img
                    src={project.posterUrl}
                    alt={project.title}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-[rgba(0,0,0,0.3)]" />

                  {/* Aspect Ratio Badge */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[rgba(6,6,8,0.85)] border border-[rgba(255,255,255,0.1)] font-mono text-[9px] text-[#d4af37] tracking-wider uppercase backdrop-blur-sm">
                    {project.aspectRatio}
                  </span>

                  {/* Category Pill */}
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded bg-[rgba(231,76,60,0.2)] border border-[rgba(231,76,60,0.5)] font-mono text-[9px] text-white tracking-widest uppercase backdrop-blur-sm">
                    {project.category}
                  </span>

                  {/* Center Play / Break-The-Frame Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[rgba(0,0,0,0.75)] border border-[#d4af37] flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-125 shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5 text-white" />
                    </div>
                  </div>

                  {/* Bottom Hover Cue */}
                  <div className="absolute bottom-2 right-3 flex items-center gap-1.5 text-[9px] font-mono text-[rgba(255,255,255,0.7)]">
                    <Maximize2 className="w-3 h-3 text-[#d4af37]" />
                    <span>BREAK THE FRAME</span>
                  </div>
                </div>

                {/* Metadata Card Footer */}
                <div className="p-5 pointer-events-none">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[rgba(255,255,255,0.45)] mb-1">
                    <span>{project.year}</span>
                    <span className="text-[#d4af37]">{project.client}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2 font-serif group-hover:text-[#d4af37] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-[rgba(255,255,255,0.65)] font-light leading-relaxed line-clamp-2 mb-4">
                    {project.logline}
                  </p>

                  <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[10px] font-mono text-[rgba(255,255,255,0.5)]">
                    <span>ROLE: <strong className="text-white">{project.role}</strong></span>
                    <span className="text-[#d4af37]">EXPAND FILM →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Sprocket Holes Bar */}
        <div className="w-full flex items-center gap-6 py-2 px-4 bg-[#0e0e12] border-t border-b border-[rgba(255,255,255,0.08)] mt-2 select-none overflow-hidden">
          <div className="flex items-center gap-3 grow overflow-hidden">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <div className="w-3.5 h-2 rounded-[2px] bg-[#050507] border border-[rgba(255,255,255,0.1)]" />
                <span className="font-mono text-[8px] text-[rgba(255,255,255,0.2)]">
                  FARHAN P. ZAMMA
                </span>
              </div>
            ))}
          </div>
          <span className="font-mono text-[9px] text-[rgba(212,175,55,0.6)] tracking-widest shrink-0">
            SAFETY FILM • EASTMAN
          </span>
        </div>
      </div>
    </section>
  );
}
