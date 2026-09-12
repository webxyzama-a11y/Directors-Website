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
  Film,
  Layers,
  Pause,
} from "lucide-react";
import { Project, WorkCategory } from "@/types";
import { PROJECTS_DATA, WORK_CATEGORIES } from "@/data/projectsData";
import { soundEngine } from "@/audio/soundEngine";

interface FilmStripBrowserProps {
  onSelectProject: (project: Project) => void;
}

type ViewMode = "dual-reel" | "strip" | "both";

// Helper to duplicate and rotate projects for seamless marquee looping
function getMarqueeList(projects: Project[], shift = 0): Project[] {
  if (projects.length === 0) return [];
  let base = [...projects];
  while (base.length < 6) {
    base = [...base, ...projects];
  }
  if (shift > 0) {
    const offset = shift % base.length;
    base = [...base.slice(offset), ...base.slice(0, offset)];
  }
  return [...base, ...base, ...base];
}

// Category accent colors
const CATEGORY_ACCENTS: Record<string, string> = {
  TELEVISION: "#f39c12",
  DOCUMENTARY: "#e74c3c",
  "WEB SERIES": "#00a8ff",
  "BRANDED CONTENT": "#2ecc71",
  ADS: "#f1c40f",
  "MUSIC VIDEO": "#9b59b6",
  MICRODRAMA: "#e056fd",
};

export default function FilmStripBrowser({ onSelectProject }: FilmStripBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<WorkCategory>("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("dual-reel");
  const [isLightTableActive, setIsLightTableActive] = useState(false);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const stripRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  // Mouse drag-to-scroll tracking for 35mm strip
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

  // Generate rows for the dual marquee
  const rowAProjects = getMarqueeList(filteredProjects, 0);
  const rowBProjects = getMarqueeList(
    filteredProjects,
    Math.max(1, Math.floor(filteredProjects.length / 2))
  );

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

  // Passive RAF-throttled scroll listener for accurate active card tracking
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

  // Drag handlers for 35mm strip
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
    stripRef.current.style.scrollSnapType = "none";
    stripRef.current.style.scrollBehavior = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current || !stripRef.current) return;
    e.preventDefault();

    const currentX = e.pageX;
    const currentTime = performance.now();
    const deltaX = currentX - startXRef.current;

    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }

    const timeDiff = currentTime - lastTimeRef.current;
    if (timeDiff > 8) {
      const distance = currentX - lastXRef.current;
      velocityRef.current = distance / timeDiff;
      lastXRef.current = currentX;
      lastTimeRef.current = currentTime;
    }

    stripRef.current.scrollLeft = scrollLeftRef.current - deltaX;
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;

    const container = stripRef.current;
    if (container) {
      const inertiaDistance = velocityRef.current * -260;
      const targetScrollLeft = container.scrollLeft + inertiaDistance;
      const containerCenter = targetScrollLeft + container.clientWidth / 2;

      const children = Array.from(container.children) as HTMLElement[];
      let closestIdx = 0;
      let closestDist = Infinity;

      children.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(containerCenter - childCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });

      const targetIdx = Math.max(0, Math.min(filteredProjects.length - 1, closestIdx));
      scrollToIndex(targetIdx);
      setActiveIndex(targetIdx);
      activeIndexRef.current = targetIdx;
      soundEngine.playFilmSprocketTick();

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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!stripRef.current) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      stripRef.current.scrollLeft += e.deltaX;
      return;
    }
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

  const pauseRow = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.style.animationPlayState = "paused";
  };
  const resumeRow = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current && !isMarqueePaused) ref.current.style.animationPlayState = "running";
  };

  return (
    <section
      id="work"
      className="relative w-full pt-4 pb-20 sm:pt-28 sm:pb-28 px-4 md:px-12 bg-gradient-to-b from-transparent via-[rgba(6,6,8,0.85)] to-transparent overflow-hidden"
    >
      {/* Top and bottom cinematic dark merges */}
      <div className="absolute top-0 left-0 right-0 h-24 sm:h-36 bg-gradient-to-b from-[#060608] via-[#060608]/75 to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#060608] via-[#060608]/75 to-transparent pointer-events-none z-0" />

      {/* Chapter Title & Global Controls */}
      <div className="max-w-7xl mx-auto mb-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.08)]">
          <div>
            <div className="flex items-center gap-2 text-[#d4af37] text-xs font-mono tracking-[0.3em] uppercase mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>35MM FILM STRIP &amp; CONTINUOUS DUAL REEL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight font-serif uppercase">
              SELECTED WORKS
            </h2>
            <p className="text-sm md:text-base text-[rgba(255,255,255,0.6)] font-light mt-2 max-w-2xl">
              Spanning high-octane streaming thrillers, 80+ television sagas, hazard-zone documentaries, and award-winning commercial campaigns.
            </p>
          </div>

          {/* View Mode Switcher + Light Table Controls */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* View Mode Toggle Buttons */}
            <div className="flex items-center p-1 rounded-full bg-[rgba(20,20,26,0.8)] border border-white/10">
              <button
                onClick={() => {
                  soundEngine.playLensRack();
                  setViewMode("dual-reel");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all ${
                  viewMode === "dual-reel"
                    ? "bg-[#d4af37] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Film className="w-3 h-3" />
                <span>{selectedCategory === "ALL" ? "DUAL REEL" : "CONTINUOUS REEL"}</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playLensRack();
                  setViewMode("strip");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all ${
                  viewMode === "strip"
                    ? "bg-[#d4af37] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>35MM STRIP</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playLensRack();
                  setViewMode("both");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all ${
                  viewMode === "both"
                    ? "bg-[#d4af37] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span>SHOW BOTH</span>
              </button>
            </div>

            {/* Backlit 5600K Light Table Toggle */}
            <button
              onClick={() => {
                soundEngine.playLensRack();
                setIsLightTableActive(!isLightTableActive);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-mono transition-all ${
                isLightTableActive
                  ? "bg-[#fff5ea] text-black font-bold border-white shadow-[0_0_20px_rgba(255,245,230,0.5)]"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/30"
              }`}
              title="Toggle Backlit 5600K Light Table Mode"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${isLightTableActive ? "text-amber-500 fill-amber-500" : ""}`} />
              <span className="text-[10px]">LIGHT TABLE</span>
            </button>

            {/* Film counter */}
            <div className="font-mono text-xs text-[rgba(255,255,255,0.6)] px-2">
              <span className="text-[#d4af37] font-bold">{filteredProjects.length}</span> FILMS
            </div>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)] mr-1 shrink-0" />
            {WORK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] tracking-wider uppercase transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? "bg-[#d4af37] text-black font-bold border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    : "bg-[rgba(20,20,26,0.5)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)] hover:border-[rgba(255,255,255,0.25)] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dynamic interaction guidance */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[10px] text-white/50">
            {viewMode === "dual-reel" ? (
              <>
                <Film className="w-3 h-3 text-[#d4af37] animate-pulse" />
                <span>
                  {selectedCategory === "ALL"
                    ? "ROW 1 SCROLLS LEFT ◄ | ROW 2 SCROLLS RIGHT ► • HOVER TO PAUSE"
                    : "CONTINUOUS REEL SCROLLS LEFT ◄ • HOVER TO PAUSE"}
                </span>
              </>
            ) : viewMode === "strip" ? (
              <>
                <MousePointer2 className="w-3 h-3 text-[#d4af37] animate-pulse" />
                <span>DRAG WITH MOUSE OR USE ARROWS TO SCROLL</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>DUAL CONTINUOUS REEL + 35MM FRAME INSPECTOR</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Container with optional 5600K Light Table glow */}
      <div
        className={`relative w-full rounded-2xl transition-all duration-700 ${
          isLightTableActive
            ? "bg-[radial-gradient(ellipse_at_center,_rgba(255,250,240,0.18)_0%,_rgba(10,10,14,0.95)_70%)] shadow-[inset_0_0_100px_rgba(255,245,230,0.15)] border border-[rgba(255,245,230,0.2)]"
            : ""
        }`}
      >
        {/* ========================================================================= */}
        {/* PART 1: DUAL CONTINUOUS REEL (Row 1 Left, Row 2 Right)                    */}
        {/* Visible when viewMode === "dual-reel" OR viewMode === "both"               */}
        {/* ========================================================================= */}
        {(viewMode === "dual-reel" || viewMode === "both") && (
          <div className="relative w-full overflow-hidden py-4 select-none">
            {/* Top Sprocket Holes Bar */}
            <div className="w-full flex items-center gap-6 py-2 px-4 bg-[#0e0e12] border-t border-b border-[rgba(255,255,255,0.08)] mb-4 overflow-hidden">
              <span className="font-mono text-[9px] text-[rgba(212,175,55,0.7)] tracking-widest shrink-0 font-bold">
                KODAK VISION3 500T • 35MM CONTINUOUS REEL
              </span>
              <div className="flex items-center gap-3 grow overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 shrink-0">
                    <div className="w-3.5 h-2 rounded-[2px] bg-[#050507] border border-[rgba(255,255,255,0.1)]" />
                    <span className="font-mono text-[8px] text-[rgba(255,255,255,0.25)]">
                      {i % 2 === 0 ? `${i + 1}A` : `${i + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edge fade gradient masks */}
            <div
              className="absolute inset-y-0 left-0 w-24 sm:w-44 z-20 pointer-events-none"
              style={{ background: "linear-gradient(to right, #060608 0%, transparent 100%)" }}
            />
            <div
              className="absolute inset-y-0 right-0 w-24 sm:w-44 z-20 pointer-events-none"
              style={{ background: "linear-gradient(to left, #060608 0%, transparent 100%)" }}
            />

            {/* ── ROW A: SCROLLS CONTINUOUSLY TO THE LEFT ── */}
            <div
              className="relative overflow-hidden mb-4"
              onMouseEnter={() => pauseRow(rowARef)}
              onMouseLeave={() => resumeRow(rowARef)}
            >
              <div
                ref={rowARef}
                className="flex gap-4 sm:gap-6 will-change-transform"
                style={{
                  animation: `marqueeLeft 50s linear infinite`,
                  animationPlayState: isMarqueePaused ? "paused" : "running",
                  width: "max-content",
                }}
              >
                {rowAProjects.map((project, i) => (
                  <DualReelCard
                    key={`row-a-${project.id}-${i}`}
                    project={project}
                    onSelectProject={onSelectProject}
                  />
                ))}
              </div>
            </div>

            {/* Middle Sprocket Separator Bar & Row B: ONLY for "ALL" (other categories keep single layer) */}
            {selectedCategory === "ALL" && (
              <>
                {/* Middle Sprocket Separator Bar */}
                <div className="w-full flex items-center justify-between py-1.5 px-4 bg-[#09090c] border-t border-b border-[rgba(255,255,255,0.06)] my-3 overflow-hidden">
                  <div className="flex items-center gap-3 grow overflow-hidden">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 shrink-0">
                        <div className="w-3 h-1.5 rounded-[1px] bg-[#050507] border border-[rgba(255,255,255,0.08)]" />
                        <span className="font-mono text-[7px] text-[rgba(212,175,55,0.4)] tracking-wider">
                          FARHAN P. ZAMMA • 24 FPS
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="font-mono text-[8px] text-[rgba(255,255,255,0.4)] tracking-widest shrink-0 uppercase ml-4">
                    4K DCI • HDR10 • MULTI-TRACK
                  </span>
                </div>

                {/* ── ROW B: SCROLLS CONTINUOUSLY TO THE RIGHT ── */}
                <div
                  className="relative overflow-hidden mb-4"
                  onMouseEnter={() => pauseRow(rowBRef)}
                  onMouseLeave={() => resumeRow(rowBRef)}
                >
                  <div
                    ref={rowBRef}
                    className="flex gap-4 sm:gap-6 will-change-transform"
                    style={{
                      animation: `marqueeRight 58s linear infinite`,
                      animationPlayState: isMarqueePaused ? "paused" : "running",
                      width: "max-content",
                    }}
                  >
                    {rowBProjects.map((project, i) => (
                      <DualReelCard
                        key={`row-b-${project.id}-${i}`}
                        project={project}
                        onSelectProject={onSelectProject}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Bottom Sprocket Holes Bar */}
            <div className="w-full flex items-center gap-6 py-2 px-4 bg-[#0e0e12] border-t border-b border-[rgba(255,255,255,0.08)] mt-2 overflow-hidden">
              <div className="flex items-center gap-3 grow overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 shrink-0">
                    <div className="w-3.5 h-2 rounded-[2px] bg-[#050507] border border-[rgba(255,255,255,0.1)]" />
                    <span className="font-mono text-[8px] text-[rgba(255,255,255,0.25)]">
                      {i % 2 === 0 ? `EASTMAN ${i + 1}` : `SAFETY FILM`}
                    </span>
                  </div>
                ))}
              </div>
              <span className="font-mono text-[9px] text-[rgba(212,175,55,0.7)] tracking-widest shrink-0 font-bold">
                SAFETY FILM • EASTMAN KODAK CO.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PART 2: INTERACTIVE 35MM STRIP (Draggable Single Row with Center Snap)     */}
        {/* Visible when viewMode === "strip" OR viewMode === "both"                  */}
        {/* ========================================================================= */}
        {(viewMode === "strip" || viewMode === "both") && (
          <div className={`relative w-full overflow-hidden py-6 rounded-2xl ${viewMode === "both" ? "mt-12 pt-8 border-t border-white/10" : ""}`}>
            {viewMode === "both" && (
              <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>35MM FRAME-BY-FRAME INSPECTOR</span>
                </div>
                <div className="font-mono text-xs text-white/50">
                  <span className="text-[#d4af37] font-bold">{activeIndex + 1}</span> / {filteredProjects.length}
                </div>
              </div>
            )}

            {/* Sprocket Bar Top */}
            <div className="w-full flex items-center gap-6 py-2 px-4 bg-[#0e0e12] border-t border-b border-[rgba(255,255,255,0.08)] mb-4 select-none overflow-hidden">
              <span className="font-mono text-[9px] text-[rgba(212,175,55,0.6)] tracking-widest shrink-0">
                FRAME BY FRAME • 35MM
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

            {/* Left Nav Arrow Button */}
            <button
              onClick={handleScrollPrev}
              disabled={activeIndex === 0}
              className="absolute left-1 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[rgba(8,8,12,0.92)] border-2 border-[#d4af37]/80 hover:border-white text-[#fced9a] hover:text-black hover:bg-[#d4af37] hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(0,0,0,0.95),0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer group"
              aria-label="Scroll Left"
              title="Previous Video"
            >
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Right Nav Arrow Button */}
            <button
              onClick={handleScrollNext}
              disabled={activeIndex === filteredProjects.length - 1}
              className="absolute right-1 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[rgba(8,8,12,0.92)] border-2 border-[#d4af37]/80 hover:border-white text-[#fced9a] hover:text-black hover:bg-[#d4af37] hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(0,0,0,0.95),0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer group"
              aria-label="Scroll Right"
              title="Next Video"
            >
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Scrollable Film Strip Cards */}
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
                    key={`strip-${project.id}`}
                    onClick={() => {
                      if (hasDraggedRef.current) return;
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
                    {/* 16:9 Frame Container */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-black pointer-events-none">
                      <img
                        src={project.posterUrl}
                        alt={project.title}
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-[rgba(0,0,0,0.3)]" />

                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[rgba(6,6,8,0.85)] border border-[rgba(255,255,255,0.1)] font-mono text-[9px] text-[#d4af37] tracking-wider uppercase backdrop-blur-sm">
                        {project.aspectRatio}
                      </span>

                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded bg-[rgba(231,76,60,0.2)] border border-[rgba(231,76,60,0.5)] font-mono text-[9px] text-white tracking-widest uppercase backdrop-blur-sm">
                        {project.category}
                      </span>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[rgba(0,0,0,0.75)] border border-[#d4af37] flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-125 shadow-lg">
                          <Play className="w-5 h-5 fill-white ml-0.5 text-white" />
                        </div>
                      </div>

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

            {/* Sprocket Bar Bottom */}
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
        )}
      </div>

      {/* Global CSS Keyframes for Infinite Smooth Marquee Loops */}
      <style>{`
        @keyframes marqueeLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33333%);
          }
        }
        @keyframes marqueeRight {
          0% {
            transform: translateX(-33.33333%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Individual Card in the Dual-Row Continuous Marquee
────────────────────────────────────────────────────────────────────────── */
interface DualReelCardProps {
  project: Project;
  onSelectProject?: (project: Project) => void;
}

function DualReelCard({ project, onSelectProject }: DualReelCardProps) {
  const handleClick = () => {
    soundEngine.playCameraShutter();
    if (onSelectProject) onSelectProject(project);
  };

  const accentColor = CATEGORY_ACCENTS[project.category] ?? "#d4af37";

  return (
    <button
      onClick={handleClick}
      className="group relative flex-shrink-0 overflow-hidden rounded-xl focus:outline-none transition-all duration-300 hover:scale-[1.03] hover:z-30 text-left cursor-pointer"
      style={{
        width: "clamp(270px, 23vw, 380px)",
        height: "clamp(165px, 14.5vw, 225px)",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(14,14,18,0.9)",
      }}
      aria-label={`Open ${project.title}`}
    >
      {/* Poster Image */}
      <img
        src={project.posterUrl}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        draggable={false}
      />

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 transition-opacity duration-300 group-hover:opacity-85" />

      {/* Category badge */}
      <div
        className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-[0.16em] font-bold backdrop-blur-md"
        style={{
          background: `${accentColor}25`,
          color: accentColor,
          border: `1px solid ${accentColor}55`,
        }}
      >
        {project.category}
      </div>

      {/* Year & Aspect Ratio badge */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
        <span className="font-mono text-[9px] text-[#d4af37]/90 px-1.5 py-0.5 rounded bg-black/60 border border-[#d4af37]/30">
          {project.aspectRatio}
        </span>
        <span className="font-mono text-[10px] text-white/60 tracking-wider">
          {project.year}
        </span>
      </div>

      {/* Center Play Button on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110"
          style={{
            background: "rgba(0,0,0,0.8)",
            border: `1.5px solid ${accentColor}`,
          }}
        >
          <Play className="w-5 h-5 fill-current" style={{ color: accentColor, marginLeft: "2px" }} />
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="text-[10px] font-mono text-white/50 mb-0.5 truncate">
          {project.client}
        </div>
        <h3 className="text-white font-bold text-sm sm:text-base leading-tight mb-1 truncate font-serif group-hover:text-[#d4af37] transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center justify-between text-[9px] font-mono text-white/60">
          <span className="uppercase tracking-wider truncate max-w-[70%]">
            {project.role}
          </span>
          <span className="text-[#d4af37] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            <Maximize2 className="w-2.5 h-2.5" />
            EXPAND
          </span>
        </div>
      </div>

      {/* Subtle bottom glowing accent strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
        }}
      />
    </button>
  );
}
