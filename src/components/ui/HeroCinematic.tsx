"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Compass, Film, Sparkles } from "lucide-react";
import { soundEngine } from "@/audio/soundEngine";

interface HeroCinematicProps {
  onEnterWorld: () => void;
  onPlayShowreel: () => void;
}

/* ─── Animated Counter Hook ─── */
function useAnimatedCounter(target: number, suffix = "", duration = 2200) {
  const [val, setVal] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [hasStarted, target, duration]);

  return { val, suffix, start: () => setHasStarted(true) };
}

/* ─── Background Particle Canvas ─── */
function HeroParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let isVisibleOnScreen = true;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleOnScreen = entry.isIntersecting;
        if (isVisibleOnScreen && !animId) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Particle types: golden dust, blue sparks, dim stars
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      type: "dust" | "spark" | "star";
      life: number;
      maxLife: number;
      pulseOffset: number;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 24;

    const createParticle = (type: Particle["type"]): Particle => {
      const configs = {
        dust: {
          size: Math.random() * 2.5 + 0.8,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.4 - 0.1,
          color: `hsl(${42 + Math.random() * 10}, ${70 + Math.random() * 20}%, ${60 + Math.random() * 20}%)`,
          maxLife: 300 + Math.random() * 400,
        },
        spark: {
          size: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.6,
          color: `hsl(${210 + Math.random() * 30}, 80%, ${65 + Math.random() * 20}%)`,
          maxLife: 150 + Math.random() * 250,
        },
        star: {
          size: Math.random() * 1.8 + 0.4,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          color: `rgba(255,255,255,${0.3 + Math.random() * 0.4})`,
          maxLife: 500 + Math.random() * 600,
        },
      };
      const c = configs[type];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: c.vx,
        vy: c.vy,
        size: c.size,
        opacity: 0,
        color: c.color,
        type,
        life: 0,
        maxLife: c.maxLife,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    };

    // Initial population
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const type: Particle["type"] =
        i < 16 ? "dust" : i < 20 ? "spark" : "star";
      const p = createParticle(type);
      p.life = Math.random() * p.maxLife; // stagger
      particles.push(p);
    }

    // Light ray parameters
    const rays = Array.from({ length: 5 }, (_, i) => ({
      angle: -0.8 + i * 0.4 + (Math.random() - 0.5) * 0.2,
      width: 0.02 + Math.random() * 0.04,
      opacity: 0.015 + Math.random() * 0.02,
      speed: 0.0002 + Math.random() * 0.0003,
      offset: Math.random() * Math.PI * 2,
    }));

    const render = (time: number) => {
      if (!isVisibleOnScreen) {
        animId = 0;
        return;
      }
      ctx.clearRect(0, 0, width, height);

      // === Volumetric Light Rays from top-right ===
      const originX = width * 0.85;
      const originY = -height * 0.1;

      for (const ray of rays) {
        const dynamicAngle =
          ray.angle + Math.sin(time * ray.speed + ray.offset) * 0.08;
        const dynamicOpacity =
          ray.opacity *
          (0.7 + 0.3 * Math.sin(time * 0.001 + ray.offset));

        const rayLength = Math.max(width, height) * 1.8;
        const halfWidth = ray.width * rayLength;

        ctx.save();
        ctx.translate(originX, originY);
        ctx.rotate(dynamicAngle);

        const gradient = ctx.createLinearGradient(0, 0, rayLength, 0);
        gradient.addColorStop(0, `rgba(212, 175, 55, ${dynamicOpacity * 1.5})`);
        gradient.addColorStop(0.3, `rgba(255, 235, 180, ${dynamicOpacity})`);
        gradient.addColorStop(0.7, `rgba(180, 200, 255, ${dynamicOpacity * 0.5})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, -halfWidth * 0.3);
        ctx.lineTo(rayLength, -halfWidth);
        ctx.lineTo(rayLength, halfWidth);
        ctx.lineTo(0, halfWidth * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // === Anamorphic Horizontal Lens Flare ===
      const flareY = height * 0.35;
      const flareOpacity = 0.04 + 0.025 * Math.sin(time * 0.0008);
      const flareGrad = ctx.createLinearGradient(0, flareY - 2, 0, flareY + 2);
      flareGrad.addColorStop(0, "rgba(100, 180, 255, 0)");
      flareGrad.addColorStop(0.5, `rgba(100, 180, 255, ${flareOpacity})`);
      flareGrad.addColorStop(1, "rgba(100, 180, 255, 0)");
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, flareY - 12, width, 24);

      // Second flare - warmer gold
      const flareY2 = height * 0.55;
      const flareOpacity2 = 0.025 + 0.015 * Math.sin(time * 0.0006 + 1.2);
      const flareGrad2 = ctx.createLinearGradient(0, flareY2 - 2, 0, flareY2 + 2);
      flareGrad2.addColorStop(0, "rgba(212, 175, 55, 0)");
      flareGrad2.addColorStop(0.5, `rgba(212, 175, 55, ${flareOpacity2})`);
      flareGrad2.addColorStop(1, "rgba(212, 175, 55, 0)");
      ctx.fillStyle = flareGrad2;
      ctx.fillRect(0, flareY2 - 8, width, 16);

      // === Particles ===
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in/out lifecycle
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.opacity = lifeRatio / 0.15;
        } else if (lifeRatio > 0.8) {
          p.opacity = (1 - lifeRatio) / 0.2;
        } else {
          p.opacity = 1;
        }

        // Pulsing for stars
        if (p.type === "star") {
          p.opacity *= 0.5 + 0.5 * Math.sin(time * 0.003 + p.pulseOffset);
        }

        // Respawn
        if (
          p.life >= p.maxLife ||
          p.x < -20 ||
          p.x > width + 20 ||
          p.y < -20 ||
          p.y > height + 20
        ) {
          const newP = createParticle(p.type);
          particles[i] = newP;
          continue;
        }

        // Draw
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(p.opacity, 1));

        if (p.type === "dust") {
          // Soft golden glow
          const grd = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.size * 3
          );
          grd.addColorStop(0, p.color);
          grd.addColorStop(0.5, p.color.replace(")", ", 0.3)").replace("hsl(", "hsla("));
          grd.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "spark") {
          // Sharp blue spark with streak
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();

          // Bright core
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Twinkling star
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Cross glint
          if (p.opacity > 0.6) {
            ctx.strokeStyle = `rgba(255,255,255,${p.opacity * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x - p.size * 2.5, p.y);
            ctx.lineTo(p.x + p.size * 2.5, p.y);
            ctx.moveTo(p.x, p.y - p.size * 2.5);
            ctx.lineTo(p.x, p.y + p.size * 2.5);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // === Subtle radial spotlight overlay from top-right ===
      const spotGrad = ctx.createRadialGradient(
        width * 0.8, height * 0.15, 0,
        width * 0.8, height * 0.15, width * 0.7
      );
      spotGrad.addColorStop(0, `rgba(212, 175, 55, ${0.06 + 0.02 * Math.sin(time * 0.0005)})`);
      spotGrad.addColorStop(0.4, "rgba(100, 120, 180, 0.02)");
      spotGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      if (isVisibleOnScreen) {
        animId = requestAnimationFrame(render);
      } else {
        animId = 0;
      }
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, mixBlendMode: "screen" }}
    />
  );
}

/* ─── Main Hero Component ─── */
export default function HeroCinematic({
  onEnterWorld,
  onPlayShowreel,
}: HeroCinematicProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const years = useAnimatedCounter(13, "+", 2000);
  const shows = useAnimatedCounter(80, "+", 2400);
  const views = useAnimatedCounter(12, "B+", 2600);

  // Trigger entrance animation + counter start on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      years.start();
      shows.start();
      views.start();
    }, 400); // slight delay for curtain reveal
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center sm:justify-end pt-16 sm:pt-24 pb-20 sm:pb-24 px-4 sm:px-8 md:px-16 overflow-hidden pointer-events-none"
    >
      {/* ─── Animated Background Canvas (particles, rays, flares) ─── */}
      <HeroParticleCanvas />

      {/* ─── Cinematic Vignette Gradients (Dark-to-light gradient merge) ─── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {/* Continuous bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[rgba(6,6,8,0.4)] to-transparent" />
        {/* Deep bottom gradient merge toward next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060608] via-[#060608]/75 to-transparent" />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,6,8,0.5)] via-transparent to-[rgba(6,6,8,0.3)]" />
        {/* Top subtle darkening */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(6,6,8,0.5)] via-transparent to-transparent" />
      </div>

      {/* ─── Animated golden scanline (moves slowly down) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        <div
          className="absolute left-0 right-0 h-px opacity-[0.06]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #d4af37 20%, #fff 50%, #d4af37 80%, transparent 100%)",
            animation: "heroScanline 8s linear infinite",
          }}
        />
      </div>

      {/* ─── Content ─── */}
      <div
        className="relative max-w-5xl pointer-events-auto -mt-6 sm:mt-0"
        style={{ zIndex: 10 }}
      >
        {/* Film Badge */}
        <div
          className={`inline-flex items-center gap-3 px-3.5 sm:px-4 py-1.5 rounded-full mb-3.5 sm:mb-5 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            background: "rgba(212, 175, 55, 0.08)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            backdropFilter: "blur(12px)",
            transitionDelay: "200ms",
          }}
        >
          <Film className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] uppercase text-[rgba(255,255,255,0.7)]">
            A FILM BY
          </span>
          <Sparkles className="w-3 h-3 text-[#d4af37] opacity-60" />
        </div>

        {/* Director Name - staggered letter reveal */}
        <h1
          className={`text-[32px] xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white mb-3 sm:mb-4 leading-none uppercase select-none font-serif transition-all duration-1200 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{
            transitionDelay: "500ms",
            textShadow: isVisible
              ? "0 0 80px rgba(212, 175, 55, 0.15), 0 4px 30px rgba(0,0,0,0.5)"
              : "none",
          }}
        >
          <span className="inline-block" style={{ transitionDelay: "500ms" }}>
            FARHAN P.
          </span>
          <br />
          <span
            className="inline-block bg-clip-text"
            style={{
              transitionDelay: "700ms",
              background: "linear-gradient(135deg, #ffffff 0%, #f0e6cc 40%, #d4af37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ZAMMA
          </span>
        </h1>

        {/* Roles Subhead with animated gold line */}
        <div
          className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm md:text-base font-mono tracking-[0.25em] uppercase text-[#d4af37] mb-4 sm:mb-6 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <span className="relative">
            DIRECTOR
            <span
              className="absolute -bottom-1 left-0 h-px bg-[#d4af37] transition-all duration-1000"
              style={{ width: isVisible ? "100%" : "0%", transitionDelay: "1400ms" }}
            />
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span>PRODUCER</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" style={{ animationDelay: "0.5s" }} />
          <span>STORYTELLER</span>
        </div>

        {/* Primary Positioning Quote */}
        <blockquote
          className={`text-base sm:text-2xl md:text-3xl font-light text-[rgba(255,255,255,0.9)] max-w-3xl leading-snug mb-5 sm:mb-8 pl-4 sm:pl-5 italic transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: "1100ms",
            borderLeft: "2px solid #d4af37",
            borderImage: "linear-gradient(to bottom, #d4af37, rgba(212,175,55,0.2)) 1",
          }}
        >
          &ldquo;13+ years of making stories move.&rdquo;
        </blockquote>

        {/* Supporting Metrics Badges - Animated Counters */}
        <div
          className={`grid grid-cols-3 max-w-md gap-2 sm:gap-4 mb-6 sm:mb-10 pt-4 sm:pt-6 font-mono transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: "1300ms",
            borderTop: "1px solid rgba(212, 175, 55, 0.15)",
          }}
        >
          {[
            { counter: years, label: "YEARS EXPERIENCE" },
            { counter: shows, label: "PRODUCED SHOWS" },
            { counter: views, label: "GLOBAL VIEWS" },
          ].map((item, idx) => (
            <div key={idx} className="group">
              <div className="text-lg xs:text-xl sm:text-3xl font-bold tracking-tight relative">
                <span
                  className="bg-clip-text"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 30%, #d4af37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {item.counter.val}
                  {item.counter.suffix}
                </span>
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs text-[rgba(255,255,255,0.4)] tracking-widest uppercase mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action CTAs with enhanced styling */}
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "1500ms" }}
        >
          <button
            onClick={() => {
              soundEngine.playWhoosh();
              onEnterWorld();
            }}
            className="group relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden w-full sm:w-auto"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f0e6cc 100%)",
              color: "#0a0a0d",
              boxShadow:
                "0 0 30px rgba(212, 175, 55, 0.25), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {/* Hover shimmer effect */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.3) 0%, transparent 50%, rgba(212,175,55,0.2) 100%)",
              }}
            />
            <Compass className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90 relative z-10" />
            <span className="relative z-10">ENTER THE WORLD →</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playWhoosh();
              onPlayShowreel();
            }}
            className="group px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500 backdrop-blur-md relative overflow-hidden w-full sm:w-auto"
            style={{
              background: "rgba(20, 20, 26, 0.7)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.6)");
              (e.currentTarget.style.boxShadow = "0 0 25px rgba(212, 175, 55, 0.15), inset 0 0 20px rgba(212, 175, 55, 0.05)");
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.2)");
              (e.currentTarget.style.boxShadow = "none");
            }}
          >
            <Play className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-125 relative z-10" />
            <span className="relative z-10">PLAY SHOWREEL</span>
          </button>
        </div>
      </div>

      {/* ─── Hero CSS Animations ─── */}
      <style jsx>{`
        @keyframes heroScanline {
          0% {
            top: -2px;
          }
          100% {
            top: 100%;
          }
        }
      `}</style>
    </section>
  );
}
