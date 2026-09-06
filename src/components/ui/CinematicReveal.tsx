"use client";

import React, { useEffect, useRef, useState } from "react";

interface CinematicRevealProps {
  children: React.ReactNode;
  delay?: number; // milliseconds
  className?: string;
  effect?: "rack-focus" | "slide-up" | "fade";
}

export default function CinematicReveal({
  children,
  delay = 0,
  className = "",
  effect = "rack-focus",
}: CinematicRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Zero scroll-listener overhead: IntersectionObserver unobserves once visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getStyles = (): React.CSSProperties => {
    if (effect === "rack-focus") {
      return {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(22px) scale(0.985)",
        filter: isVisible ? "blur(0px)" : "blur(4px)",
        transition: `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform, filter",
      };
    }

    if (effect === "slide-up") {
      return {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      };
    }

    return {
      opacity: isVisible ? 1 : 0,
      transition: `opacity 0.8s ease-out ${delay}ms`,
    };
  };

  return (
    <div ref={ref} style={getStyles()} className={className}>
      {children}
    </div>
  );
}
