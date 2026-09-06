"use client";

import React, { useEffect, useState } from "react";
import { X, ExternalLink, Film, Award, Users, Camera, Play, Volume2 } from "lucide-react";
import { Project } from "@/types";
import { soundEngine } from "@/audio/soundEngine";

interface BreakTheFrameModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function BreakTheFrameModal({ project, onClose }: BreakTheFrameModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "bts" | "credits">("overview");
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);

  useEffect(() => {
    if (project) {
      soundEngine.playCameraShutter();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          soundEngine.playCameraShutter();
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8 bg-[rgba(3,3,5,0.94)] backdrop-blur-2xl overflow-y-auto animate-fadeIn">
      {/* Background Anamorphic Blue Flare Line */}
      <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00a8ff] to-transparent opacity-25 pointer-events-none" />

      {/* Main Expanded Container ("The Film Has Escaped The Frame") */}
      <div className="relative w-full max-w-6xl rounded-xl border border-[rgba(212,175,55,0.4)] bg-[#090a0e] shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(14,14,18,0.8)] font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#e74c3c] animate-ping" />
            <span className="text-[#d4af37] font-bold tracking-widest uppercase">
              THE FILM HAS ESCAPED THE FRAME
            </span>
            <span className="hidden sm:inline text-[rgba(255,255,255,0.3)]">|</span>
            <span className="hidden sm:inline text-[rgba(255,255,255,0.6)]">
              {project.aspectRatio} • {project.format}
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playCameraShutter();
              onClose();
            }}
            className="flex items-center gap-1 px-3 py-1 rounded bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(231,76,60,0.2)] text-white hover:text-[#e74c3c] transition-all border border-[rgba(255,255,255,0.1)] hover:border-[#e74c3c]"
          >
            <X className="w-4 h-4" />
            <span className="text-[10px] tracking-wider">CLOSE [ESC]</span>
          </button>
        </div>

        {/* Cinematic Video Player Viewport */}
        <div className="relative aspect-video w-full bg-black">
          {isPlayingVideo && project.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0`}
              title={project.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={project.bannerUrl || project.posterUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
                <button
                  onClick={() => setIsPlayingVideo(true)}
                  className="w-16 h-16 rounded-full bg-[#d4af37] flex items-center justify-center text-black shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-110 transition-transform mb-3"
                >
                  <Play className="w-7 h-7 fill-black ml-1" />
                </button>
                <span className="font-mono text-xs tracking-widest text-white uppercase">
                  PLAY OFFICIAL FOOTAGE
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Information & Credits Drawer */}
        <div className="p-6 md:p-8 bg-gradient-to-b from-[#0c0d12] to-[#08080a]">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.08)]">
            <div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#d4af37] mb-2 uppercase tracking-widest">
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.year}</span>
                <span>•</span>
                <span>{project.client}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-serif tracking-tight uppercase">
                {project.title}
              </h2>
            </div>

            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="self-start inline-flex items-center gap-2 px-4 py-2 rounded border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] hover:border-[#d4af37] hover:text-[#d4af37] text-xs font-mono tracking-wider transition-all"
              >
                <span>VIEW ON PLATFORM</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 py-4 border-b border-[rgba(255,255,255,0.06)] font-mono text-xs tracking-widest uppercase">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-1 relative transition-colors ${
                activeTab === "overview" ? "text-[#d4af37] font-bold" : "text-[rgba(255,255,255,0.5)] hover:text-white"
              }`}
            >
              OVERVIEW & SYNOPSIS
              {activeTab === "overview" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4af37]" />}
            </button>
            <button
              onClick={() => setActiveTab("bts")}
              className={`py-1 relative transition-colors ${
                activeTab === "bts" ? "text-[#d4af37] font-bold" : "text-[rgba(255,255,255,0.5)] hover:text-white"
              }`}
            >
              BEHIND THE SCENES
              {activeTab === "bts" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4af37]" />}
            </button>
            <button
              onClick={() => setActiveTab("credits")}
              className={`py-1 relative transition-colors ${
                activeTab === "credits" ? "text-[#d4af37] font-bold" : "text-[rgba(255,255,255,0.5)] hover:text-white"
              }`}
            >
              FULL CREDITS
              {activeTab === "credits" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4af37]" />}
            </button>
          </div>

          {/* Tab Contents */}
          <div className="py-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-[11px] font-mono tracking-widest text-[#d4af37] uppercase mb-1">
                      THE LOGLINE
                    </h4>
                    <p className="text-lg md:text-xl text-white font-serif italic leading-relaxed">
                      &ldquo;{project.logline}&rdquo;
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-mono tracking-widest text-[rgba(255,255,255,0.4)] uppercase mb-2">
                      DIRECTOR&apos;S STATEMENT & SYNOPSIS
                    </h4>
                    <p className="text-sm md:text-base text-[rgba(255,255,255,0.8)] font-light leading-relaxed">
                      {project.synopsis}
                    </p>
                  </div>
                </div>

                {/* Sidebar Stats Box */}
                <div className="p-5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,22,0.6)] font-mono space-y-4">
                  <h4 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] pb-2">
                    <Award className="w-4 h-4 text-[#d4af37]" />
                    <span>PRODUCTION BENCHMARKS</span>
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[rgba(255,255,255,0.4)] block text-[10px] uppercase">DIRECTOR ROLE</span>
                      <span className="text-white font-semibold">{project.role}</span>
                    </div>
                    <div>
                      <span className="text-[rgba(255,255,255,0.4)] block text-[10px] uppercase">NETWORK / PLATFORM</span>
                      <span className="text-[#d4af37] font-semibold">{project.client}</span>
                    </div>
                    <div>
                      <span className="text-[rgba(255,255,255,0.4)] block text-[10px] uppercase">FORMAT SPECIFICATION</span>
                      <span className="text-white">{project.format}</span>
                    </div>
                    {Object.entries(project.stats).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-[rgba(255,255,255,0.4)] block text-[10px] uppercase">{k}</span>
                        <span className="text-[#d4af37] font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bts" && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase flex items-center gap-2 mb-4">
                  <Camera className="w-4 h-4" />
                  <span>PRODUCTION ARCHIVE & TECHNICAL DISPATCHES</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.behindTheScenes.map((note, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,24,0.5)] flex flex-col justify-between"
                    >
                      <span className="font-mono text-xs text-[#d4af37] mb-2 font-bold">
                        DISPATCH 0{i + 1}
                      </span>
                      <p className="text-xs md:text-sm text-[rgba(255,255,255,0.8)] font-light leading-relaxed">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "credits" && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4" />
                  <span>HEAD OF DEPARTMENTS & COLLABORATORS</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                  {project.credits.map((c, i) => (
                    <div
                      key={i}
                      className="p-4 rounded border border-[rgba(255,255,255,0.06)] bg-[rgba(14,14,18,0.5)]"
                    >
                      <span className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase block mb-1">
                        {c.role}
                      </span>
                      <span className="text-white font-semibold text-sm">
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
