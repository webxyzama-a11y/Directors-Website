"use client";

import React, { useRef } from "react";
import { Play, Film } from "lucide-react";
import { PROJECTS_DATA } from "@/data/projectsData";
import { soundEngine } from "@/audio/soundEngine";
import { Project } from "@/types";

interface VideoMarqueeRibbonProps {
  onSelectProject?: (project: Project) => void;
}

/* ──────────────────────────────────────────────────────────────────────────
   Split the projects into two rows.
   Row A scrolls LEFT  →  Row B scrolls RIGHT
   Each row is duplicated (×3) so the loop is seamless at any viewport width.
────────────────────────────────────────────────────────────────────────── */
const ALL = PROJECTS_DATA;
const ROW_A = [...ALL.slice(0, 6),  ...ALL.slice(0, 6),  ...ALL.slice(0, 6)];
const ROW_B = [...ALL.slice(4),     ...ALL.slice(4),     ...ALL.slice(4)];

export default function VideoMarqueeRibbon({ onSelectProject }: VideoMarqueeRibbonProps) {
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  const pauseRow = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.style.animationPlayState = "paused";
  };
  const resumeRow = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.style.animationPlayState = "running";
  };

  return (
    <section
      id="video-marquee"
      className="relative w-full py-20 overflow-hidden"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(6,6,8,0.92) 15%, rgba(6,6,8,0.96) 85%, transparent 100%)" }}
    >
      {/* ── Section label ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 mb-10 flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] text-[#d4af37] tracking-[0.3em] uppercase block mb-1">
            SELECTED FILMOGRAPHY
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif uppercase tracking-tight leading-none">
            The Reel
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase">
          <Film className="w-3.5 h-3.5" />
          <span>{ALL.length} Films &amp; Series</span>
        </div>
      </div>

      {/* ── Edge fade masks ── */}
      <div
        className="absolute inset-y-0 left-0 w-32 sm:w-56 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #060608 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-32 sm:w-56 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #060608 0%, transparent 100%)" }}
      />

      {/* ── ROW A — scrolls LEFT ── */}
      <div
        className="relative overflow-hidden mb-4"
        onMouseEnter={() => pauseRow(rowARef)}
        onMouseLeave={() => resumeRow(rowARef)}
      >
        <div
          ref={rowARef}
          className="flex gap-4 will-change-transform"
          style={{
            animation: "marqueeLeft 55s linear infinite",
            width: "max-content",
          }}
        >
          {ROW_A.map((project, i) => (
            <VideoCard
              key={`a-${i}`}
              project={project}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      </div>

      {/* ── ROW B — scrolls RIGHT ── */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => pauseRow(rowBRef)}
        onMouseLeave={() => resumeRow(rowBRef)}
      >
        <div
          ref={rowBRef}
          className="flex gap-4 will-change-transform"
          style={{
            animation: "marqueeRight 65s linear infinite",
            width: "max-content",
          }}
        >
          {ROW_B.map((project, i) => (
            <VideoCard
              key={`b-${i}`}
              project={project}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      </div>

      {/* ── CSS animations injected globally once ── */}
      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marqueeRight {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

/* ─── Individual Video Card ──────────────────────────────────────────────── */
interface VideoCardProps {
  project: Project;
  onSelectProject?: (project: Project) => void;
}

function VideoCard({ project, onSelectProject }: VideoCardProps) {
  const handleClick = () => {
    soundEngine.playCameraShutter();
    if (onSelectProject) onSelectProject(project);
  };

  // Map category → accent colour
  const accent: Record<string, string> = {
    TELEVISION:       "#f39c12",
    DOCUMENTARY:      "#e74c3c",
    "WEB SERIES":     "#00a8ff",
    "BRANDED CONTENT":"#2ecc71",
    ADS:              "#f1c40f",
    "MUSIC VIDEO":    "#9b59b6",
    MICRODRAMA:       "#e056fd",
  };
  const accentColor = accent[project.category] ?? "#d4af37";

  return (
    <button
      onClick={handleClick}
      className="group relative flex-shrink-0 overflow-hidden rounded-xl focus:outline-none"
      style={{
        width: "clamp(260px, 22vw, 360px)",
        height: "clamp(160px, 14vw, 220px)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      aria-label={`Open ${project.title}`}
    >
      {/* Poster */}
      <img
        src={project.posterUrl}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        draggable={false}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

      {/* Category badge */}
      <div
        className="absolute top-3 left-3 px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-[0.18em] font-bold"
        style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
      >
        {project.category}
      </div>

      {/* Year badge */}
      <div className="absolute top-3 right-3 font-mono text-[10px] text-white/50 tracking-widest">
        {project.year}
      </div>

      {/* Play button (appears on hover) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)", border: `1.5px solid ${accentColor}` }}
        >
          <Play className="w-5 h-5 fill-current" style={{ color: accentColor, marginLeft: "2px" }} />
        </div>
      </div>

      {/* Title + role */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3
          className="text-white font-bold text-sm sm:text-base leading-tight mb-0.5 truncate font-serif"
        >
          {project.title}
        </h3>
        <p className="text-white/50 font-mono text-[9px] uppercase tracking-widest truncate">
          {project.role}
        </p>
      </div>

      {/* Hover accent glow at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
      />
    </button>
  );
}
