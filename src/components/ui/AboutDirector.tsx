"use client";

import React from "react";
import { Armchair, CheckCircle2, Award, Sparkles, Film, Quote } from "lucide-react";
import CinematicReveal from "@/components/ui/CinematicReveal";

export default function AboutDirector() {
  const milestones = [
    {
      year: "2016",
      title: "AMMA (Zee TV)",
      desc: "Created and produced the historic finite period crime epic starring 5-time National Award winner Shabana Azmi, Neha Rajpal, and Ashmit Patel. Nominated across multiple Indian Television Academy (ITA) awards.",
    },
    {
      year: "2025",
      title: "FIRST COPY (Amazon MX Player)",
      desc: "Wrote, directed, and produced the acclaimed streaming crime thriller series starring Munawar Faruqui, Ashi Singh, Raza Murad, Gulshan Grover, and Inamulhaq.",
    },
    {
      year: "2021",
      title: "INSIDE THE BURNING (Discovery Channel)",
      desc: "Directed the gripping two-part international documentary special capturing the high-hazard blowout and fire containment efforts at Baghjan Oilfield, Assam.",
    },
    {
      year: "2023+",
      title: "COMMERCIALS & DIGITAL IP (Salt Media)",
      desc: "Directing high-impact campaigns for TECNO Mobile, Maruti Suzuki NEXA, SEBI, NSDL, and pioneering premium mobile-native vertical microdramas with Salt Media.",
    },
  ];

  return (
    <section id="about" className="relative w-full py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 bg-gradient-to-b from-transparent via-[rgba(8,9,14,0.88)] to-transparent overflow-hidden">
      {/* Top and bottom dark-to-light gradient merges */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#060608] via-[#060608]/75 to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#060608] via-[#060608]/75 to-transparent pointer-events-none z-0" />

      {/* Ambient Soundstage Spotlight Vignettes */}
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <CinematicReveal effect="rack-focus" className="relative mb-16 sm:mb-20 text-center">
          <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-mono tracking-[0.3em] uppercase mb-4 px-3.5 py-1 rounded-full bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.25)] backdrop-blur-md">
            <Armchair className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>THE DIRECTOR&apos;S CHAIR</span>
          </div>

          <div className="space-y-1 font-serif">
            <h2 className="text-4xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tight uppercase leading-none">
              13+ YEARS.
            </h2>
            <h2 className="text-4xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tight uppercase leading-none">
              80+ SHOWS.
            </h2>
            <h3 className="text-2xl sm:text-5xl md:text-6xl font-extrabold text-[#d4af37] tracking-tight uppercase pt-2 sm:pt-3">
              ONE OBSESSION: STORYTELLING.
            </h3>
          </div>
        </CinematicReveal>

        {/* Main Content: Left Director Portrait, Right Narrative & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: DIRECTOR PORTRAIT CARD (Photo 2)                            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 w-full flex flex-col items-center lg:sticky lg:top-24">
            <CinematicReveal effect="slide-up" className="w-full max-w-[460px]">
              <div className="relative group">
                {/* Golden Ambient Glow Spotlight */}
                <div className="absolute -inset-2.5 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.22)_0%,transparent_70%)] rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Main Portrait Frame */}
                <div className="relative aspect-[4/5] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#0d0e14] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.15)] group-hover:border-[#d4af37]/75 transition-all duration-500">
                  {/* Director Photo (Cream Blazer Portrait) */}
                  <img
                    src="/images/farhan-director-bio.jpg"
                    alt="Farhan P. Zamma — Director & Producer"
                    className="w-full h-full object-cover object-top filter brightness-[1.01] contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Top Film Badge Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10 font-mono text-[10px]">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 border border-[#d4af37]/40 text-[#fced9a] backdrop-blur-md shadow-lg">
                      <Film className="w-3 h-3 text-[#d4af37]" />
                      <span className="tracking-widest uppercase">THE DIRECTOR</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/70 backdrop-blur-md">
                      <span>MUMBAI, INDIA</span>
                    </div>
                  </div>

                  {/* Bottom Vignette & Bio Title Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060608] via-[#060608]/85 to-transparent pt-24 pb-6 px-6 z-10 flex flex-col justify-end">
                    <div className="w-12 h-[2px] bg-gradient-to-r from-[#d4af37] to-transparent mb-2.5" />

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white font-serif uppercase tracking-wider mb-1">
                      FARHAN P. ZAMMA
                    </h3>

                    <p className="text-[11px] font-mono text-[#d4af37] tracking-[0.2em] uppercase mb-1">
                      DIRECTOR • PRODUCER • STORYTELLER
                    </p>

                    <p className="text-[10px] text-white/60 font-mono tracking-wide">
                      13+ Years • 80+ Shows • 12B+ Impressions
                    </p>
                  </div>

                  {/* Framing Corner Ticks */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/70 pointer-events-none z-20" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/70 pointer-events-none z-20" />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/70 pointer-events-none z-20" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/70 pointer-events-none z-20" />
                </div>

                {/* Director Quotation Plaque Below Image */}
                <div className="mt-4 p-4 rounded-xl bg-[rgba(16,17,24,0.7)] border border-[rgba(212,175,55,0.2)] font-mono text-[11px] text-white/70 backdrop-blur-md shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <p className="italic font-light leading-relaxed text-white/80">
                      &ldquo;At 24, Farhan commanded the director&apos;s chair alongside five-time National Award winner Shabana Azmi, earning respect through razor-sharp storytelling vision.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Official IMDb Profile Link Badge */}
                <a
                  href="https://www.imdb.com/name/nm4912902/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full group flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0c0d14] border border-[#f5c518]/30 hover:border-[#f5c518] hover:bg-[#f5c518]/10 transition-all duration-300 shadow-lg"
                  title="View Farhan P. Zamma's official verified profile on IMDb"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#f5c518] text-black font-black text-[11px] font-sans tracking-tight leading-none shadow-sm">
                      IMDb
                    </span>
                    <span className="text-[11px] font-mono text-white/80 group-hover:text-white transition-colors">
                      Official Profile <span className="text-[#f5c518] text-[10px]">[nm4912902]</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#f5c518] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                    VIEW FILMOGRAPHY →
                  </span>
                </a>
              </div>
            </CinematicReveal>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: COMPREHENSIVE BIOGRAPHY & MILESTONES                        */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-8">
            {/* Narrative Story Paragraphs */}
            <CinematicReveal effect="slide-up" className="space-y-6 text-sm sm:text-base text-[rgba(255,255,255,0.8)] font-light leading-relaxed">
              <p className="text-lg sm:text-xl font-serif text-white italic border-l-2 border-[#d4af37] pl-4 leading-snug">
                Farhan P. Zamma is an Indian television producer, director, and storyteller whose 13-year career bridges prime-time broadcast television, hazard-zone documentaries, streaming web series, and cutting-edge digital media.
              </p>

              <p>
                At an extraordinarily young age, Farhan shook the Indian television industry by creating and producing <strong className="text-white font-semibold">Amma (2016)</strong> for Zee TV—an ambitious, finite period epic chronicling five decades of Mumbai underworld history that also marked the historic television debut of five-time National Award-winning icon <strong className="text-[#d4af37] font-semibold">Shabana Azmi</strong>.
              </p>

              <p>
                Over the subsequent decade, Farhan lent his creative vision and production leadership to over <strong className="text-white font-semibold">80 successful television shows</strong>, including History TV18&apos;s celebrated non-fiction franchise <strong className="text-white font-semibold">OMG! Yeh Mera India</strong> and writing for Zee TV&apos;s cult horror phenomenon <strong className="text-white font-semibold">Fear Files</strong>.
              </p>

              <p>
                Always fascinated by technology and craft, Farhan played an instrumental role in architecting the <strong className="text-white font-semibold">4K production pipeline for Viacom18</strong>, ushering in Ultra High Definition broadcast workflows long before they became the industry norm. He subsequently conquered the international non-fiction space as the director of Discovery Channel&apos;s critically praised 2-part special <strong className="text-white font-semibold">Inside the Burning (Assam Gas Blowout)</strong>.
              </p>

              <p>
                Most recently, Farhan wrote, directed, and produced the crime-thriller streaming series <strong className="text-white font-semibold">First Copy (2025)</strong> on Amazon MX Player featuring Munawar Faruqui, Raza Murad, Gulshan Grover, and Inamulhaq—cementing his reputation as a filmmaker who moves effortlessly across genres, screens, and cultural zeitgeists.
              </p>
            </CinematicReveal>

            {/* Landmark Milestones 2-Column Grid */}
            <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] font-mono">
              <div className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.45)] tracking-widest uppercase mb-4">
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>LANDMARK CAREER MILESTONES</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {milestones.map((m, i) => (
                  <CinematicReveal key={i} delay={i * 80} effect="slide-up">
                    <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(16,17,24,0.6)] hover:border-[#d4af37]/60 hover:bg-[rgba(212,175,55,0.04)] transition-all duration-300 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-[#d4af37] font-bold tracking-wider px-2 py-0.5 rounded bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.25)]">
                            {m.year}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase font-serif mb-1.5">
                          {m.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[rgba(255,255,255,0.6)] font-sans font-light leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  </CinematicReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
