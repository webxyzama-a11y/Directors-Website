"use client";

import React, { useEffect, useRef, useState } from "react";
import HeroCinematic from "./HeroCinematic";

interface ScrollVideoHeroProps {
  onEnterWorld: () => void;
  onPlayShowreel: () => void;
}

export default function ScrollVideoHero({
  onEnterWorld,
  onPlayShowreel,
}: ScrollVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.preload = "auto";
      const handleLoadedData = () => {
        setVideoLoaded(true);
        if (video.currentTime === 0) {
          video.currentTime = 0.001;
        }
      };

      if (video.readyState >= 2) {
        handleLoadedData();
      } else {
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("canplay", handleLoadedData);
      }
      
      video.load();
      
      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("canplay", handleLoadedData);
      };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!canvas || !video || !container) return;
    
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let rafId: number;
    let rvfcId: number | null = null;
    let rawProgress = 0;
    let smoothProgress = 0;
    let targetTime = 0.001;
    let isSeeking = false;

    // Enable hardware-accelerated high-quality frame interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const drawFrame = () => {
      if (!video || video.readyState < 2) return;
      
      const canvasRatio = canvas.width / canvas.height;
      const videoRatio = (video.videoWidth || 16) / (video.videoHeight || 9);
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      const isPortrait = canvasRatio < 1.0;
      const isMobileWidth = canvas.width < 768;

      if (isPortrait || isMobileWidth) {
        const mobileScale = 1.92;
        drawWidth = canvas.width * mobileScale;
        drawHeight = drawWidth / videoRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = (canvas.height - drawHeight) * 0.42;
      } else if (canvasRatio > videoRatio) {
        drawHeight = canvas.width / videoRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * videoRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      ctx.fillStyle = "#060608";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      drawFrame();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const seekToTarget = (time: number) => {
      if (!video || !video.duration || isNaN(video.duration)) return;
      if (isSeeking) return;

      const duration = video.duration;
      const clampedTime = Math.min(
        Math.max(0.001, duration - 0.05),
        Math.max(0.001, time)
      );

      if (Math.abs(video.currentTime - clampedTime) > 0.008) {
        isSeeking = true;
        video.currentTime = clampedTime;
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      drawFrame();
      seekToTarget(targetTime);
    };

    const handleScroll = () => {
      if (!container) return;
      
      const { top, height } = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = height - viewportHeight;
      
      if (top <= 0) {
        rawProgress = Math.min(1, Math.max(0, -top / Math.max(1, scrollableDistance)));
      } else {
        rawProgress = 0;
      }
    };

    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("timeupdate", drawFrame);

    // Native hardware video frame callback for 60/120Hz frame output
    const onVideoFrame = () => {
      drawFrame();
      if ("requestVideoFrameCallback" in video) {
        rvfcId = (video as any).requestVideoFrameCallback(onVideoFrame);
      }
    };
    if ("requestVideoFrameCallback" in video) {
      rvfcId = (video as any).requestVideoFrameCallback(onVideoFrame);
    }

    if (videoLoaded) {
      drawFrame();
      handleScroll();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Continuous liquid-smooth momentum interpolation loop (60fps / 120fps)
    const loop = () => {
      const diff = rawProgress - smoothProgress;
      if (Math.abs(diff) > 0.00015) {
        // Fluid cinematic damping: 0.082 gives a luxurious camera dolly feel
        smoothProgress += diff * 0.082;
        setScrollProgress(smoothProgress);

        if (video && video.duration && !isNaN(video.duration)) {
          targetTime = smoothProgress * video.duration;
          seekToTarget(targetTime);
        }
      } else if (smoothProgress !== rawProgress) {
        smoothProgress = rawProgress;
        setScrollProgress(smoothProgress);
        if (video && video.duration && !isNaN(video.duration)) {
          targetTime = smoothProgress * video.duration;
          seekToTarget(targetTime);
        }
      }

      drawFrame();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("timeupdate", drawFrame);
      if (rvfcId !== null && "cancelVideoFrameCallback" in video) {
        (video as any).cancelVideoFrameCallback(rvfcId);
      }
      cancelAnimationFrame(rafId);
    };
  }, [videoLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420vh] bg-[#060608]"
    >
      {/* Hidden preloaded video */}
      <video
        ref={videoRef}
        src="/video/bg.mp4"
        className="absolute opacity-0 pointer-events-none -z-50"
        style={{ width: "1px", height: "1px" }}
        playsInline
        muted
        preload="auto"
      />
      
      {/* Pinned Sticky Viewport */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ position: "sticky", top: 0 }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        {/* Cinematic Vignette Overlay to blend video into content at bottom */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-44 sm:h-36 bg-gradient-to-b from-[#060608] via-[#060608]/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-52 sm:h-44 bg-gradient-to-t from-[#060608] via-[#060608]/85 to-transparent" />
        </div>
        
        {/* Hero Title and Action Buttons (smoothly fades out as scrolling begins) */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 3.2) }} 
        >
          <div className="pointer-events-auto h-full">
            <HeroCinematic
              onEnterWorld={onEnterWorld}
              onPlayShowreel={onPlayShowreel}
            />
          </div>
        </div>

        {/* Cinematic Scroll Indicator (Visible during video scrubbing) */}
        <div
          className="absolute bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 transition-opacity duration-500"
          style={{
            opacity: scrollProgress > 0.05 && scrollProgress < 0.82 ? 0.75 : 0,
          }}
        >
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#d4af37]/80">
            SCROLL TO SCRUB FILM • {Math.round(scrollProgress * 100)}%
          </span>
          <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#d4af37] transition-all duration-75"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}