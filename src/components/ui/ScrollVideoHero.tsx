"use client";

import React, { useEffect, useRef, useState } from "react";
import HeroCinematic from "./HeroCinematic";

const TOTAL_FRAMES = 120;

interface ScrollVideoHeroProps {
  onEnterWorld: () => void;
  onPlayShowreel: () => void;
}

export default function ScrollVideoHero({
  onEnterWorld,
  onPlayShowreel,
}: ScrollVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // Frames cache for mobile 60fps rendering
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameIdxRef = useRef(-1);

  // Scroll state kept in refs for 0ms overhead
  const rawProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const rafIdRef = useRef<number>(0);
  const isSeekingRef = useRef(false);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetTimeRef = useRef(0.001);
  const scheduledRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile vs desktop on mount
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // MOBILE: Preload 120 WebP frames into memory (total 2.3MB)
  useEffect(() => {
    if (!mounted || !isMobile) return;

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    // Frame 0 priority load
    const firstImg = new Image();
    firstImg.src = "/frames/frame_000.webp";
    firstImg.onload = () => {
      images[0] = firstImg;
      framesRef.current = images;
      drawMobileFrame(0);
    };

    // Preload remaining frames in background
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(3, "0")}.webp`;
      img.onload = () => {
        images[i] = img;
      };
    }
    framesRef.current = images;
  }, [mounted, isMobile]);

  // DESKTOP: Video initialization
  useEffect(() => {
    if (!mounted || isMobile) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const onReady = () => {
      if (video.currentTime === 0) video.currentTime = 0.001;
    };

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener("canplay", onReady, { once: true });
      video.addEventListener("loadeddata", onReady, { once: true });
      video.load();
    }

    return () => {
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("loadeddata", onReady);
    };
  }, [mounted, isMobile]);

  // Helper to render frame onto mobile canvas with optimal framing
  const drawMobileFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const frames = framesRef.current;
    let img = frames[frameIdx];

    // If frame hasn't finished loading yet, pick closest loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let delta = 1; delta < 40; delta++) {
        const prev = frames[frameIdx - delta];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = frames[frameIdx + delta];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = window.innerWidth;
    const canvasH = window.innerHeight;
    const videoRatio = 16 / 9;

    // Mobile / Portrait: 1.48x scale, optically centered at 48.5% X, 42% Y
    const scale = 1.48;
    const drawWidth = canvasW * scale;
    const drawHeight = drawWidth / videoRatio;
    const offsetX = canvasW * 0.485 - drawWidth / 2;
    const offsetY = canvasH * 0.42 - drawHeight / 2;

    ctx.fillStyle = "#060608";
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Main scroll loop
  useEffect(() => {
    if (!mounted) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const heroOverlay = heroOverlayRef.current;
    const indicator = indicatorRef.current;
    const progressBar = progressBarRef.current;
    const progressText = progressTextRef.current;
    if (!container) return;

    const updateDOM = (progress: number) => {
      if (heroOverlay) {
        heroOverlay.style.opacity = String(Math.max(0, 1 - progress * 3.2));
      }
      if (indicator) {
        indicator.style.opacity =
          progress > 0.05 && progress < 0.82 ? "0.75" : "0";
      }
      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }
      if (progressText) {
        progressText.textContent = `SCROLL TO SCRUB FILM • ${Math.round(progress * 100)}%`;
      }
    };

    // Desktop video seeking
    const seekVideo = (time: number) => {
      if (!video || !video.duration || isNaN(video.duration)) return;
      if (isSeekingRef.current) return;

      const clampedTime = Math.min(
        Math.max(0.001, video.duration - 0.05),
        Math.max(0.001, time)
      );

      if (Math.abs(video.currentTime - clampedTime) > 0.012) {
        isSeekingRef.current = true;
        video.currentTime = clampedTime;

        if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);
        seekTimeoutRef.current = setTimeout(() => {
          isSeekingRef.current = false;
        }, 120);
      }
    };

    const handleSeeked = () => {
      if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);
      isSeekingRef.current = false;
      seekVideo(targetTimeRef.current);
    };
    if (video) video.addEventListener("seeked", handleSeeked);

    // Canvas resize for mobile
    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
      drawMobileFrame(Math.max(0, lastFrameIdxRef.current));
    };

    if (isMobile) {
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();
    }

    // Smooth momentum loop
    const loop = () => {
      scheduledRef.current = false;
      const raw = rawProgressRef.current;
      const smooth = smoothProgressRef.current;
      const diff = raw - smooth;

      if (Math.abs(diff) > 0.0002) {
        const lerpFactor = isMobile ? 0.16 : 0.12;
        smoothProgressRef.current = smooth + diff * lerpFactor;
      } else {
        smoothProgressRef.current = raw;
      }

      const sp = smoothProgressRef.current;
      updateDOM(sp);

      if (isMobile) {
        // MOBILE: Instant 0.05ms canvas frame draw
        const targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.floor(sp * TOTAL_FRAMES))
        );
        if (targetFrame !== lastFrameIdxRef.current) {
          lastFrameIdxRef.current = targetFrame;
          drawMobileFrame(targetFrame);
        }
      } else {
        // DESKTOP: Native video seek
        if (video && video.duration && !isNaN(video.duration)) {
          targetTimeRef.current = sp * video.duration;
          seekVideo(targetTimeRef.current);
        }
      }

      if (Math.abs(raw - sp) > 0.0001) {
        scheduledRef.current = true;
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    const handleScroll = () => {
      if (!container) return;
      const { top, height } = container.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollable = height - viewportH;

      rawProgressRef.current =
        top <= 0 ? Math.min(1, Math.max(0, -top / Math.max(1, scrollable))) : 0;

      if (!scheduledRef.current) {
        scheduledRef.current = true;
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateDOM(0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (isMobile) window.removeEventListener("resize", resizeCanvas);
      if (video) video.removeEventListener("seeked", handleSeeked);
      if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [mounted, isMobile]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420vh] bg-[#060608]"
    >
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden bg-[#060608]">
        {/* DESKTOP ENGINE: Native <video> (unchanged, runs perfectly on laptop) */}
        {!isMobile && (
          <video
            ref={videoRef}
            src="/video/bg.mp4"
            className="hero-video-frame"
            playsInline
            muted
            preload="auto"
            autoPlay={false}
          />
        )}

        {/* MOBILE ENGINE: 60fps/120fps WebP Canvas Scrubber */}
        {isMobile && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 bg-[#060608]"
          />
        )}

        {/* Cinematic Vignette Overlay to blend video/frames into obsidian void */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-44 sm:h-36 bg-gradient-to-b from-[#060608] via-[#060608]/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-52 sm:h-44 bg-gradient-to-t from-[#060608] via-[#060608]/85 to-transparent" />
        </div>

        {/* Hero Title & Action Buttons — fades as scroll begins */}
        <div
          ref={heroOverlayRef}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ opacity: 1 }}
        >
          <div className="pointer-events-auto h-full">
            <HeroCinematic
              onEnterWorld={onEnterWorld}
              onPlayShowreel={onPlayShowreel}
            />
          </div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <div
          ref={indicatorRef}
          className="absolute bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5"
          style={{ opacity: 0, transition: "opacity 0.5s ease" }}
        >
          <span
            ref={progressTextRef}
            className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#d4af37]/80"
          >
            SCROLL TO SCRUB FILM • 0%
          </span>
          <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-[#d4af37]"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}