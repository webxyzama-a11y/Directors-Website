"use client";

import React from "react";
import { Quote, MessageSquare } from "lucide-react";
import { TESTIMONIALS_DATA } from "@/data/creditsData";

export default function Testimonials() {
  return (
    <section className="relative w-full py-24 px-4 md:px-12 bg-[rgba(6,6,8,0.88)] border-t border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-4xl mx-auto">
        {/* Screenplay Scene Slugline Header */}
        <div className="text-center mb-16 font-mono">
          <span className="text-xs text-[#d4af37] tracking-[0.3em] uppercase block mb-2">
            SCENE 88 • EXT. INDUSTRY DIALOGUE — NIGHT
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif uppercase tracking-tight">
            INDUSTRY VOICES
          </h2>
          <span className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase block mt-2">
            FORMAT: SCREENPLAY EXCERPTS
          </span>
        </div>

        {/* Screenplay Dialogue Blocks */}
        <div className="space-y-16">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <div
              key={t.id}
              className="relative p-8 md:p-12 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(12,12,18,0.7)] backdrop-blur-md shadow-2xl"
            >
              {/* Screenplay Scene Number Tag */}
              <div className="absolute top-4 left-6 text-[10px] font-mono text-[rgba(255,255,255,0.3)] tracking-widest">
                ACT III • SCENE 0{idx + 1}
              </div>

              {/* Character Slugline Header */}
              <div className="text-center font-mono mb-6">
                <h3 className="text-lg md:text-xl font-bold text-white tracking-[0.25em] uppercase">
                  {t.speaker}
                </h3>
                <span className="text-xs text-[#d4af37] tracking-wider block mt-1">
                  ({t.role} — {t.organization})
                </span>
              </div>

              {/* Spoken Dialogue */}
              <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif text-white font-normal text-center leading-snug italic max-w-2xl mx-auto my-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Context Footnote */}
              <div className="text-center text-[11px] font-mono text-[rgba(255,255,255,0.4)] tracking-wide border-t border-[rgba(255,255,255,0.06)] pt-4 mt-6">
                {t.context}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
