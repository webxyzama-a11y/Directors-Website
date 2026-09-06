"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { X, RotateCcw, Sparkles, Info, Camera, Armchair, Film, Clapperboard } from "lucide-react";
import { soundEngine } from "@/audio/soundEngine";
import { createCinemaCameraRig } from "../canvas/CinemaCameraRig";
import { createDirectorsChair } from "../canvas/DirectorsChair";
import { createClapperboard3D } from "../canvas/Clapperboard3D";

export type InspectableProp = "camera" | "chair" | "film" | "clapper";

interface PropInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProp?: InspectableProp;
}

interface PropDetail {
  id: InspectableProp;
  title: string;
  subtitle: string;
  specs: { label: string; value: string }[];
  directorContext: string;
}

const PROP_DETAILS: Record<InspectableProp, PropDetail> = {
  camera: {
    id: "camera",
    title: "ARRI ALEXA LF CINEMA PACKAGE",
    subtitle: "Large Format 4.5K Sensor with Anamorphic Prime Set",
    specs: [
      { label: "Sensor", value: "Large Format 36.70 x 25.54 mm" },
      { label: "Resolution", value: "4448 x 3096 (4.5K UHD Master)" },
      { label: "Dynamic Range", value: "14+ Stops Exposure Latitude" },
      { label: "Pipeline", value: "Pioneered for Viacom18 4K & First Copy" },
    ],
    directorContext:
      "Farhan championed the adoption of large format cinema optics early in his career, insisting that shallow depth of field and authentic optical flare gives crime narratives visceral intimacy.",
  },
  chair: {
    id: "chair",
    title: "DIRECTOR'S CANVAS CHAIR",
    subtitle: "Solid Dark Walnut Frame with Gold Embossed Canvas",
    specs: [
      { label: "Inscribed", value: "FARHAN P. ZAMMA — DIRECTOR" },
      { label: "Production Sets", value: "80+ TV Shows, 2-Part Discovery Doc, Web Series" },
      { label: "Historic Set", value: "5-Acre Mumbai Docks Replica for Zee TV's 'Amma'" },
      { label: "Origin", value: "Handcrafted Mumbai Soundstage Equipment" },
    ],
    directorContext:
      "At just 24 years old, Farhan occupied this chair while directing Bollywood legends like Shabana Azmi, Urvashi Sharma, and Gulshan Grover, commanding respect through razor-sharp vision.",
  },
  film: {
    id: "film",
    title: "35MM KODAK VISION3 500T REELS",
    subtitle: "Color Negative 5219 Motion Picture Film",
    specs: [
      { label: "Format", value: "35mm 4-Perforation Standard" },
      { label: "Emulsion", value: "Tungsten Balanced High Speed" },
      { label: "Soundtrack", value: "Dolby Digital Optical Twin Track" },
      { label: "Theme", value: "Underworld Piracy in 'First Copy' (2025)" },
    ],
    directorContext:
      "In First Copy, film cans like these were the currency of power in 1990s Mumbai, smuggled out of projection booths at 3 AM to duplicate bootleg VHS tapes.",
  },
  clapper: {
    id: "clapper",
    title: "SCENE 80+ PRODUCTION SLATE",
    subtitle: "Acrylic & Hardwood Dual-Action Clapperboard",
    specs: [
      { label: "Production", value: "FIRST COPY / AMMA" },
      { label: "Director", value: "FARHAN P. ZAMMA" },
      { label: "Scene Mark", value: "80+ Shows Produced" },
      { label: "Sync Sound", value: "24.00 FPS Timecode Synced" },
    ],
    directorContext:
      "The sharp wooden snap of the clapperboard is the universal heartbeat of cinema. It signifies that performance has begun and truth is being captured.",
  },
};

export default function PropInspectModal({
  isOpen,
  onClose,
  initialProp = "camera",
}: PropInspectModalProps) {
  const [activeProp, setActiveProp] = useState<InspectableProp>(initialProp);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentMeshRef = useRef<THREE.Group | null>(null);
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0.003 });

  const detail = PROP_DETAILS[activeProp];

  useEffect(() => {
    setActiveProp(initialProp);
  }, [initialProp]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 30);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Lighting for Product Showcase
    const keyLight = new THREE.SpotLight(0xffeedd, 3.5, 12, Math.PI / 4, 0.4);
    keyLight.position.set(2.5, 3.5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4477aa, 1.2);
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimLight.position.set(0, 2, -3);
    scene.add(rimLight);

    // Build Current Prop
    const loadPropMesh = (propType: InspectableProp) => {
      if (currentMeshRef.current) {
        scene.remove(currentMeshRef.current);
      }

      let propGroup: THREE.Group;
      if (propType === "camera") {
        const cam = createCinemaCameraRig();
        propGroup = cam.group;
        propGroup.scale.set(1.4, 1.4, 1.4);
        propGroup.position.set(0, -0.2, 0);
      } else if (propType === "chair") {
        propGroup = createDirectorsChair();
        propGroup.scale.set(1.3, 1.3, 1.3);
        propGroup.position.set(0, -0.7, 0);
      } else if (propType === "clapper") {
        const clapper = createClapperboard3D();
        propGroup = clapper.group;
        propGroup.scale.set(1.4, 1.4, 1.4);
        propGroup.position.set(0, 0, 0);
      } else {
        // 35mm Film Cans & Spool
        propGroup = new THREE.Group();
        const canMat = new THREE.MeshStandardMaterial({
          color: 0x6a6c76,
          metalness: 0.9,
          roughness: 0.3,
        });
        const spoolMat = new THREE.MeshStandardMaterial({
          color: 0x111114,
          metalness: 0.2,
          roughness: 0.8,
        });

        // 3 stacked film cans
        for (let i = 0; i < 3; i++) {
          const can = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.22, 32), canMat);
          can.position.y = -0.5 + i * 0.26;
          propGroup.add(can);
        }

        // Open unspooled reel
        const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.18, 32), spoolMat);
        reel.position.set(0.3, 0.4, 0.2);
        reel.rotation.z = 0.3;
        propGroup.add(reel);

        propGroup.scale.set(1.1, 1.1, 1.1);
      }

      scene.add(propGroup);
      currentMeshRef.current = propGroup;
    };

    loadPropMesh(activeProp);

    // Mouse Interaction for 360 Drag-to-Rotate
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !currentMeshRef.current) return;
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      previousMouse.current = { x: e.clientX, y: e.clientY };

      rotationVelocity.current.y = deltaX * 0.008;
      rotationVelocity.current.x = deltaY * 0.008;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Touch Interaction for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging.current = true;
        previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !currentMeshRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMouse.current.x;
      const deltaY = e.touches[0].clientY - previousMouse.current.y;
      previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      rotationVelocity.current.y = deltaX * 0.008;
      rotationVelocity.current.x = deltaY * 0.008;
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (currentMeshRef.current) {
        if (!isDragging.current) {
          // Gentle idle rotation
          rotationVelocity.current.y *= 0.95;
          rotationVelocity.current.x *= 0.95;
          currentMeshRef.current.rotation.y += 0.004 + rotationVelocity.current.y;
          currentMeshRef.current.rotation.x += rotationVelocity.current.x;
        } else {
          currentMeshRef.current.rotation.y += rotationVelocity.current.y;
          currentMeshRef.current.rotation.x += rotationVelocity.current.x;
        }
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, activeProp]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/92 backdrop-blur-2xl animate-fadeIn font-mono overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-[rgba(212,175,55,0.4)] bg-[#0c0d14] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col lg:flex-row my-auto max-h-[92vh] overflow-y-auto lg:overflow-visible">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playCameraShutter();
            onClose();
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full border border-white/15 bg-black/60 text-white hover:text-[#d4af37] hover:border-[#d4af37] transition-all"
          title="Close Inspection"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: 3D Interactive WebGL Prop Canvas */}
        <div className="relative w-full lg:w-7/12 aspect-[4/3] sm:aspect-square lg:aspect-auto min-h-[250px] sm:min-h-[380px] lg:min-h-[460px] bg-gradient-to-b from-[#0e0f18] to-[#07080d] cursor-grab active:cursor-grabbing flex items-center justify-center shrink-0">
          <div ref={containerRef} className="w-full h-full" />

          {/* Drag Overlay Hint */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 text-[9px] sm:text-[10px] text-white/50 bg-black/60 px-2.5 sm:px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm pointer-events-none">
            <RotateCcw className="w-3 h-3 text-[#d4af37]" />
            <span>DRAG TO ORBIT 360°</span>
          </div>
        </div>

        {/* Right Side: Prop Details & Technical Blueprint */}
        <div className="w-full lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0c0d14]">
          <div>
            {/* Prop Switcher Tabs */}
            <div className="grid grid-cols-4 gap-1.5 mb-6 pb-4 border-b border-white/10">
              {[
                { id: "camera" as InspectableProp, label: "CAMERA", icon: Camera },
                { id: "chair" as InspectableProp, label: "CHAIR", icon: Armchair },
                { id: "film" as InspectableProp, label: "REELS", icon: Film },
                { id: "clapper" as InspectableProp, label: "SLATE", icon: Clapperboard },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeProp === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundEngine.playLensRack();
                      setActiveProp(tab.id);
                    }}
                    className={`p-2 rounded border text-center transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? "bg-[#d4af37] text-black font-bold border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] tracking-wider">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Prop Title & Subhead */}
            <span className="text-[10px] text-[#d4af37] tracking-[0.25em] uppercase block mb-1">
              STUDIO EQUIPMENT ARCHIVE
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-serif uppercase tracking-tight mb-1">
              {detail.title}
            </h3>
            <p className="text-xs text-white/60 font-sans font-light mb-6">
              {detail.subtitle}
            </p>

            {/* Technical Specifications */}
            <div className="space-y-2.5 mb-6">
              <span className="text-[10px] text-white/40 tracking-widest uppercase block">
                TECHNICAL SPECIFICATIONS
              </span>
              <div className="space-y-1.5 text-xs">
                {detail.specs.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-1 border-b border-white/5 text-[11px]"
                  >
                    <span className="text-white/50">{s.label}:</span>
                    <span className="text-white font-semibold text-right">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Director Context Note */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-[10px] text-[#d4af37] tracking-widest uppercase font-bold mb-1">
                <Info className="w-3.5 h-3.5" />
                <span>DIRECTOR&apos;S NOTE</span>
              </div>
              <p className="text-xs text-white/80 font-sans font-light italic leading-relaxed">
                &ldquo;{detail.directorContext}&rdquo;
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-[10px] text-white/40 flex justify-between">
            <span>FARHAN P. ZAMMA CINEMATOGRAPHY</span>
            <span className="text-[#d4af37]">AUTHENTIC PRODUCTION SPEC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
