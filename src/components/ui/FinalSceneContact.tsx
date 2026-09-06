"use client";

import React, { useState } from "react";
import { Mail, Phone, Send, CheckCircle2, Clapperboard } from "lucide-react";
import { soundEngine } from "@/audio/soundEngine";

export default function FinalSceneContact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Feature / Web Series",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playCameraShutter();
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="relative w-full min-h-screen py-32 px-4 md:px-12 bg-[rgba(4,4,6,0.94)] flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Single Pinpoint Spotlight Beam on Darkness */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        {/* Slugline */}
        <div className="font-mono text-xs text-[#d4af37] tracking-[0.4em] uppercase">
          SCENE 99 • THE FINAL FRAME
        </div>

        {/* Big Question */}
        <h2 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white font-serif uppercase tracking-tight leading-none">
          WHAT SHOULD WE MAKE NEXT?
        </h2>

        <p className="text-sm sm:text-base text-[rgba(255,255,255,0.6)] font-light max-w-xl mx-auto leading-relaxed">
          From full-blown web series and finite period television to viral branded campaigns and commercial films. Let&apos;s turn your story into cinema.
        </p>

        {/* Contact Form / Inquiry Box */}
        <div className="p-5 sm:p-8 md:p-10 rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(14,14,20,0.85)] backdrop-blur-xl text-left shadow-2xl">
          {formSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#d4af37] mx-auto" />
              <h3 className="text-2xl font-serif text-white font-bold uppercase">
                SCENE LOCKED.
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[rgba(255,255,255,0.6)]">
                Thank you. Farhan and the Salt Media team will review your project brief within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase block mb-1">
                    YOUR NAME / STUDIO
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Yash Raj Films / Creator"
                    className="w-full px-4 py-3 rounded bg-[rgba(20,20,28,0.8)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[#d4af37] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase block mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded bg-[rgba(20,20,28,0.8)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[#d4af37] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase block mb-1">
                  PROJECT FORMAT
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-[rgba(20,20,28,0.8)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[#d4af37] focus:outline-none transition-all"
                >
                  <option value="Feature / Web Series">Streaming Web Series / Long-Format</option>
                  <option value="Commercial / Ad Film">Commercial / Brand Campaign</option>
                  <option value="Documentary Feature">Investigative Documentary</option>
                  <option value="Music Video">Music Video / Cultural Anthem</option>
                  <option value="Microdrama Series">Mobile Microdrama Series</option>
                  <option value="Salt Media Co-Production">Salt Media Co-Production</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase block mb-1">
                  LOGLINE & VISION
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share a brief overview of the project, timeline, and scope..."
                  className="w-full px-4 py-3 rounded bg-[rgba(20,20,28,0.8)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[#d4af37] focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded bg-[#d4af37] text-black font-bold tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)]"
              >
                <span>START A PROJECT →</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Direct Channels */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 font-mono text-xs text-[rgba(255,255,255,0.6)]">
          <a
            href="mailto:farhan@saltmedia.in"
            className="flex items-center gap-2 hover:text-[#d4af37] transition-colors"
          >
            <Mail className="w-4 h-4 text-[#d4af37]" />
            <span>farhan@saltmedia.in</span>
          </a>
          <span className="text-[rgba(255,255,255,0.2)]">|</span>
          <a
            href="https://www.instagram.com/farhanzamma"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-[#d4af37] transition-colors"
          >
            <svg className="w-4 h-4 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span>@farhanzamma</span>
          </a>
          <span className="text-[rgba(255,255,255,0.2)]">|</span>
          <a
            href="https://www.imdb.com/name/nm4912902/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-[#f5c518] transition-colors"
            title="Farhan P. Zamma on IMDb"
          >
            <span className="px-1.5 py-0.5 rounded bg-[#f5c518] text-black font-black text-[10px] font-sans leading-none">
              IMDb
            </span>
            <span>Farhan P. Zamma</span>
          </a>
          <span className="text-[rgba(255,255,255,0.2)]">|</span>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-[#d4af37] transition-colors"
          >
            <svg className="w-4 h-4 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Final Frame: CUT. Fade to Black. */}
        <div className="pt-16 sm:pt-20 pb-8 sm:pb-10 space-y-3 select-none">
          <div className="text-4xl sm:text-6xl font-black font-serif text-white tracking-[0.2em] sm:tracking-[0.4em] uppercase">
            CUT.
          </div>
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[rgba(255,255,255,0.3)] uppercase">
            FADE TO BLACK.
          </div>
        </div>
      </div>
    </section>
  );
}
