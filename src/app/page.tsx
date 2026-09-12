"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Project, CareerTimelineStage } from "@/types";
import { soundEngine } from "@/audio/soundEngine";
import CinematicHeader from "@/components/ui/CinematicHeader";
import HeroCinematic from "@/components/ui/HeroCinematic";
import ScrollVideoHero from "@/components/ui/ScrollVideoHero";
import FilmStripBrowser from "@/components/ui/FilmStripBrowser";
import BreakTheFrameModal from "@/components/ui/BreakTheFrameModal";
import CareerTimeline from "@/components/ui/CareerTimeline";
import ShowreelTheater from "@/components/ui/ShowreelTheater";
import AboutDirector from "@/components/ui/AboutDirector";
import Testimonials from "@/components/ui/Testimonials";
import SaltMediaPipeline from "@/components/ui/SaltMediaPipeline";
import RollingCredits from "@/components/ui/RollingCredits";
import FinalSceneContact from "@/components/ui/FinalSceneContact";
import ClapperboardModal from "@/components/ui/ClapperboardModal";
import PropInspectModal, { InspectableProp } from "@/components/ui/PropInspectModal";
import ClapperboardIntro from "@/components/ui/ClapperboardIntro";
import TrackingShotBadge from "@/components/ui/TrackingShotBadge";

export default function Home() {
  const [isRecActive, setIsRecActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isClapperOpen, setIsClapperOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("prologue");
  const [curtainKey, setCurtainKey] = useState(0);

  // Prop Inspect State (3D Interactive Orbit)
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [selectedInspectProp, setSelectedInspectProp] = useState<InspectableProp>("camera");

  const handleToggleRec = () => {
    soundEngine.playRecBeep();
    setIsRecActive((prev) => !prev);
  };

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    if (sectionId === "prologue") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleTimelineStageSelect = (stage: CareerTimelineStage) => {
    // Stage selected
  };

  // Handle interactive 3D prop clicks — navigate to relevant section
  const handleObjectClick = (objectName: string) => {
    soundEngine.playWhoosh();
    switch (objectName) {
      case "camera":
        handleNavigate("work");
        break;
      case "chair":
        handleNavigate("about");
        break;
      case "clapperboard":
        setIsClapperOpen(true);
        break;
      case "filmcans":
        handleNavigate("work");
        break;
    }
  };

  const handleOpenInspectProp = (prop: InspectableProp) => {
    soundEngine.playCameraShutter();
    setSelectedInspectProp(prop);
    setIsInspectOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-[#060608] text-white selection:bg-[#d4af37] selection:text-black">
      {/* Clapperboard intro: snaps on load/click and reveals the experience */}
      <ClapperboardIntro key={curtainKey} />

      {/* Cinematic HUD Header */}
      <CinematicHeader
        onOpenClapper={() => setIsClapperOpen(true)}
        onOpenInspect={() => handleOpenInspectProp("camera")}
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />

      {/* Live Camera Tracking Shot Telemetry Badge (Self-Contained Scroll Listener) */}
      <TrackingShotBadge />

      {/* Chapter 01: Prologue / Hero Reveal */}
      <div id="prologue">
        <ScrollVideoHero
          onEnterWorld={() => {
            handleNavigate("work");
          }}
          onPlayShowreel={() => {
            handleNavigate("showreel");
          }}
        />
      </div>

      {/* Chapter 02: 35mm Film Strip & Selected Works */}
      <div className="relative z-10 -mt-72 sm:mt-0">
        <div className="w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />
        </div>
        <FilmStripBrowser onSelectProject={(p) => setSelectedProject(p)} />
      </div>


      {/* Chapter 03: Career Timeline NLE */}
      <div className="relative z-10">
        <div className="w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
        </div>
        <CareerTimeline onStageSelect={handleTimelineStageSelect} />
      </div>

      {/* Chapter 05: The Screening Room / Official Showreel */}
      <div className="relative z-10">
        <div className="w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />
        </div>
        <ShowreelTheater />
      </div>

      {/* Chapter 06: The Director's Chair Biography */}
      <div className="relative z-10">
        <div className="w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
        </div>
        <AboutDirector />
      </div>

      {/* Chapter 07: Industry Dialogue Testimonials */}
      <div className="relative z-10">
        <div className="w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
        </div>
        <Testimonials />
      </div>

      {/* Chapter 08: Salt Media Scale & Production Pipeline */}
      <div className="relative z-10">
        <div className="w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />
        </div>
        <SaltMediaPipeline />
      </div>

      {/* Chapter 09: Collaborator & Broadcaster Credits */}
      <div className="relative z-10">
        <div className="w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
        </div>
        <RollingCredits />
      </div>

      {/* Chapter 10: Final Scene & CUT Fade to Black */}
      <div className="relative z-10">
        <div className="w-full flex justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        </div>
        <FinalSceneContact />
      </div>

      {/* Feature 3: 3D Prop Inspection Modal (360° Orbit) */}
      <PropInspectModal
        isOpen={isInspectOpen}
        onClose={() => setIsInspectOpen(false)}
        initialProp={selectedInspectProp}
      />

      {/* Modals */}
      {/* Interaction 08: Break The Frame Project Modal */}
      <BreakTheFrameModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Interaction 04: 3D Clapperboard Modal */}
      <ClapperboardModal
        isOpen={isClapperOpen}
        onClose={() => setIsClapperOpen(false)}
        onChapterCut={(sectionId) => handleNavigate(sectionId)}
      />
    </main>
  );
}
