"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Project, CareerTimelineStage } from "@/types";
import { soundEngine } from "@/audio/soundEngine";
import CinematicHeader from "@/components/ui/CinematicHeader";
import HeroCinematic from "@/components/ui/HeroCinematic";
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
import GrandRedCurtain from "@/components/ui/GrandRedCurtain";
import TrackingShotBadge from "@/components/ui/TrackingShotBadge";
import { StudioFocusTarget } from "@/components/canvas/StudioScene";

// Dynamic import with SSR disabled for WebGL canvas
const StudioScene = dynamic(() => import("@/components/canvas/StudioScene"), {
  ssr: false,
});

export default function Home() {
  const [activeStudioTarget, setActiveStudioTarget] = useState<StudioFocusTarget>("studio");
  const [isRecActive, setIsRecActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isClapperOpen, setIsClapperOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("prologue");
  const [curtainKey, setCurtainKey] = useState(0);

  // Prop Inspect State (3D Interactive Orbit)
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [selectedInspectProp, setSelectedInspectProp] = useState<InspectableProp>("camera");

  const [timelineAtmosphere, setTimelineAtmosphere] = useState({
    lightingColor: "#ff9944",
    accentColor: "#f39c12",
  });

  const handleToggleRec = () => {
    soundEngine.playRecBeep();
    setIsRecActive((prev) => !prev);
  };

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    if (sectionId === "prologue") {
      setActiveStudioTarget("studio");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleTimelineStageSelect = (stage: CareerTimelineStage) => {
    setActiveStudioTarget("timeline");
    setTimelineAtmosphere({
      lightingColor: stage.lightingColor,
      accentColor: stage.accentColor,
    });
  };

  // Handle interactive 3D prop clicks — navigate to relevant section
  const handleObjectClick = (objectName: string) => {
    soundEngine.playWhoosh();
    switch (objectName) {
      case "camera":
        setActiveStudioTarget("camera");
        handleNavigate("work");
        break;
      case "chair":
        setActiveStudioTarget("chair");
        handleNavigate("about");
        break;
      case "clapperboard":
        setIsClapperOpen(true);
        break;
      case "filmcans":
        setActiveStudioTarget("studio");
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
      {/* Grand Cinema Red Curtains: Opens on first load/reload and reveals the experience */}
      <GrandRedCurtain key={curtainKey} />

      {/* 3D WebGL Studio Soundstage Scene (Fixed Background Canvas) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <StudioScene
          activeTarget={activeStudioTarget}
          isRecActive={isRecActive}
          timelineAtmosphere={timelineAtmosphere}
          isAudioActive={!soundEngine.isMuted}
          onObjectClick={handleObjectClick}
        />
      </div>

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
        <HeroCinematic
          onEnterWorld={() => {
            setActiveStudioTarget("monitor");
            handleNavigate("work");
          }}
          onPlayShowreel={() => {
            setActiveStudioTarget("cinema");
            handleNavigate("showreel");
          }}
        />
      </div>

      {/* Chapter 02: 35mm Film Strip & Selected Works (Interaction 06 & 07, Feature 5 Light Table) */}
      <div className="relative z-10">
        <FilmStripBrowser onSelectProject={(p) => setSelectedProject(p)} />
      </div>

      {/* Chapter 03: Career Timeline NLE (Interaction 05) */}
      <div className="relative z-10">
        <CareerTimeline onStageSelect={handleTimelineStageSelect} />
      </div>

      {/* Chapter 05: The Screening Room / Official Showreel */}
      <div className="relative z-10">
        <ShowreelTheater />
      </div>

      {/* Chapter 06: The Director's Chair Biography */}
      <div className="relative z-10">
        <AboutDirector />
      </div>

      {/* Chapter 07: Industry Dialogue Testimonials */}
      <div className="relative z-10">
        <Testimonials />
      </div>

      {/* Chapter 08: Salt Media Scale & Production Pipeline */}
      <div className="relative z-10">
        <SaltMediaPipeline />
      </div>

      {/* Chapter 09: Collaborator & Broadcaster Credits */}
      <div className="relative z-10">
        <RollingCredits />
      </div>

      {/* Chapter 10: Final Scene & CUT Fade to Black */}
      <div className="relative z-10">
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
