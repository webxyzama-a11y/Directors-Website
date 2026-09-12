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
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // Track whether video is ready
  const videoReadyRef = useRef(false);
  // Scroll state kept in refs to avoid re-renders in the hot path
  const rawProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const rafIdRef = useRef<number>(0);
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0.001);
  const scheduledRef = useRef(false);

  const [videoLoaded, setVideoLoaded] = useState(false);

  // Video load handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      videoReadyRef.current = true;
      setVideoLoaded(true);
      // Show first frame immediately
      if (video.currentTime === 0) video.currentTime = 0.001;
    };

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener("canplay", onReady, { once: true });
      video.addEventListener("loadeddata", onReady, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("loadeddata", onReady);
    };
  }, []);

  // Main scroll-scrub engine — pure DOM manipulation, zero React re-renders
  useEffect(() => {
    if (!videoLoaded) return;

    const video = videoRef.current;
    const container = containerRef.current;
    const heroOverlay = heroOverlayRef.current;
    const indicator = indicatorRef.current;
    const progressBar = progressBarRef.current;
    const progressText = progressTextRef.current;
    if (!video || !container) return;

    const updateDOM = (progress: number) => {
      // Hero overlay fade
      if (heroOverlay) {
        heroOverlay.style.opacity = String(Math.max(0, 1 - progress * 3.2));
      }
      // Progress indicator visibility
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

    const seekVideo = (time: number) => {
      if (!video.duration || isNaN(video.duration)) return;
      if (isSeekingRef.current) return;

      const clampedTime = Math.min(
        Math.max(0.001, video.duration - 0.05),
        Math.max(0.001, time)
      );

      if (Math.abs(video.currentTime - clampedTime) > 0.016) {
        isSeekingRef.current = true;
        if ("fastSeek" in video && typeof (video as any).fastSeek === "function") {
          (video as any).fastSeek(clampedTime);
        } else {
          video.currentTime = clampedTime;
        }
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      // If target moved while seeking, catch up
      seekVideo(targetTimeRef.current);
    };
    video.addEventListener("seeked", handleSeeked);

    // rAF loop: smooth progress toward raw, then seek video + update DOM
    const loop = () => {
      scheduledRef.current = false;
      const raw = rawProgressRef.current;
      const smooth = smoothProgressRef.current;
      const diff = raw - smooth;

      if (Math.abs(diff) > 0.0002) {
        // Lerp factor: 0.12 on desktop, 0.10 on mobile for extra smoothness
        const lerpFactor = window.innerWidth < 768 ? 0.10 : 0.12;
        smoothProgressRef.current = smooth + diff * lerpFactor;
      } else {
        smoothProgressRef.current = raw;
      }

      const sp = smoothProgressRef.current;
      updateDOM(sp);

      if (video.duration && !isNaN(video.duration)) {
        targetTimeRef.current = sp * video.duration;
        seekVideo(targetTimeRef.current);
      }

      // Keep loop running as long as we're not settled
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

      // Schedule a rAF only if one isn't pending
      if (!scheduledRef.current) {
        scheduledRef.current = true;
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Draw initial state
    updateDOM(0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      video.removeEventListener("seeked", handleSeeked);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [videoLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420vh] bg-[#060608]"
    >
      {/* 
        Native <video> element — no canvas.
        Mobile browsers hardware-decode & composite video natively,
        which is FAR faster than canvas drawImage on low-end devices.
      */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <video
          ref={videoRef}
          src="/video/bg.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ objectPosition: "center center" }}
          playsInline
          muted
          preload="auto"
          // Prevent autoplay — we scrub manually
          autoPlay={false}
        />

        {/* Cinematic Vignette Overlay */}
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