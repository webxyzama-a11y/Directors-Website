"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createCinemaCameraRig } from "./CinemaCameraRig";
import { createDirectorsChair } from "./DirectorsChair";
import { createClapperboard3D } from "./Clapperboard3D";
import { createDustParticles, updateDustParticles } from "./DustParticles";

export type StudioFocusTarget =
  | "studio"
  | "camera"
  | "chair"
  | "clapperboard"
  | "monitor"
  | "cinema"
  | "timeline";

interface StudioSceneProps {
  activeTarget: StudioFocusTarget;
  onTargetSelect?: (target: StudioFocusTarget) => void;
  isRecActive?: boolean;
  onClapperClack?: () => void;
  onObjectClick?: (objectName: string) => void;
  timelineAtmosphere?: {
    lightingColor: string;
    accentColor: string;
  };
  scrollProgress?: number; // 0.0 to 1.0 for continuous tracking shot
  isAudioActive?: boolean;
}

export default function StudioScene({
  activeTarget = "studio",
  onTargetSelect,
  isRecActive = false,
  onClapperClack,
  onObjectClick,
  timelineAtmosphere,
  scrollProgress = 0,
  isAudioActive = false,
}: StudioSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Live parameter refs (avoids tearing down WebGL canvas)
  const scrollRef = useRef(0);
  const isAudioActiveRef = useRef(false);
  const activeTargetRef = useRef<StudioFocusTarget>("studio");

  scrollRef.current = scrollProgress;
  isAudioActiveRef.current = isAudioActive;
  activeTargetRef.current = activeTarget;

  // References for live animation
  const tallyMeshRef = useRef<THREE.Mesh | null>(null);
  const clapperSnapRef = useRef<((onClack?: () => void) => void) | null>(null);
  const keyLightRef = useRef<THREE.SpotLight | null>(null);
  const cursorLightRef = useRef<THREE.SpotLight | null>(null);
  const cursorTargetRef = useRef<THREE.Object3D | null>(null);
  const projectorBeamRef = useRef<THREE.Mesh | null>(null);
  const dustRef = useRef<THREE.Points | null>(null);

  // Interactive hover/click refs
  const focusSpotRef = useRef<THREE.SpotLight | null>(null);
  const focusTargetRef = useRef<THREE.Object3D | null>(null);
  const hoveredObjectRef = useRef<string | null>(null);
  const flashIntensityRef = useRef(0);
  const interactiveMeshesRef = useRef<THREE.Object3D[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseNDCRef = useRef(new THREE.Vector2(-10, -10));
  const onObjectClickRef = useRef(onObjectClick);
  onObjectClickRef.current = onObjectClick;

  // Tooltip label ref
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tooltipPosRef = useRef({ x: 0, y: 0 });

  // Camera targets dictionary
  const cameraTargets: Record<
    StudioFocusTarget,
    { pos: THREE.Vector3; lookAt: THREE.Vector3; fov: number }
  > = {
    studio: {
      pos: new THREE.Vector3(0, 1.2, 5.2),
      lookAt: new THREE.Vector3(0, 0.4, 0),
      fov: 44,
    },
    camera: {
      pos: new THREE.Vector3(-2.2, 1.1, 2.2),
      lookAt: new THREE.Vector3(-2.8, 0.8, 0),
      fov: 36,
    },
    chair: {
      pos: new THREE.Vector3(2.0, 0.9, 2.3),
      lookAt: new THREE.Vector3(2.5, 0.6, 0.2),
      fov: 38,
    },
    clapperboard: {
      pos: new THREE.Vector3(0, 0.4, 3.2),
      lookAt: new THREE.Vector3(0, -0.2, 1.8),
      fov: 34,
    },
    monitor: {
      pos: new THREE.Vector3(-1.1, 0.6, 0.4),
      lookAt: new THREE.Vector3(-1.2, 0.3, -1.2),
      fov: 38,
    },
    cinema: {
      pos: new THREE.Vector3(0, 0.8, 3.8),
      lookAt: new THREE.Vector3(0, 0.8, -7.5),
      fov: 46,
    },
    timeline: {
      pos: new THREE.Vector3(0, 0.9, 4.2),
      lookAt: new THREE.Vector3(0, 0.2, 0),
      fov: 40,
    },
  };

  const curCamPos = useRef(new THREE.Vector3(0, 1.2, 5.2));
  const curLookAt = useRef(new THREE.Vector3(0, 0.4, 0));
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const smoothScrollRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06060a);
    scene.fog = new THREE.FogExp2(0x060608, 0.028);
    sceneRef.current = scene;

    // 2. Camera (dynamically wider FOV on portrait phone screens so 3D props are fully visible)
    const aspect = width / height;
    const initialFov = aspect < 1.1 ? Math.min(64, Math.round(44 * (1.1 / Math.max(aspect, 0.5)) * 0.85)) : 44;
    const camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 40);
    camera.position.set(0, 1.2, 5.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Helper to generate soft radial alpha texture for floor gradient merge
    const createFloorRadialAlpha = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(512, 512, 60, 512, 512, 510);
        grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        grad.addColorStop(0.25, "rgba(255, 255, 255, 0.9)");
        grad.addColorStop(0.5, "rgba(255, 255, 255, 0.55)");
        grad.addColorStop(0.72, "rgba(255, 255, 255, 0.2)");
        grad.addColorStop(0.9, "rgba(255, 255, 255, 0.04)");
        grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    };

    // Helper to generate feathered alpha texture for cinema screen wall
    const createFeatheredWallAlpha = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(256, 256, 80, 256, 256, 254);
        grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        grad.addColorStop(0.65, "rgba(255, 255, 255, 0.8)");
        grad.addColorStop(0.85, "rgba(255, 255, 255, 0.2)");
        grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);
      }
      return new THREE.CanvasTexture(canvas);
    };

    // Helper for cinema projector screen dark-to-light glow texture
    const createProjectorScreenTex = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(512, 256, 30, 512, 256, 480);
        grad.addColorStop(0, "rgba(65, 90, 145, 1.0)");
        grad.addColorStop(0.35, "rgba(42, 56, 95, 0.9)");
        grad.addColorStop(0.7, "rgba(20, 26, 48, 0.65)");
        grad.addColorStop(1.0, "rgba(6, 8, 14, 0.3)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);
      }
      return new THREE.CanvasTexture(canvas);
    };

    // 4. Studio Soundstage Floor & Acoustics (with smooth radial dark-to-light gradient merge)
    const floorGeo = new THREE.PlaneGeometry(54, 54);
    const floorAlpha = createFloorRadialAlpha();
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0d0f18,
      roughness: 0.45,
      metalness: 0.35,
      alphaMap: floorAlpha,
      transparent: true,
      depthWrite: false,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Studio Soundstage Actor Taped "T" Marks
    const markMat = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
    const markGeo = new THREE.BoxGeometry(0.4, 0.005, 0.08);
    const mark1 = new THREE.Mesh(markGeo, markMat);
    mark1.position.set(-2.8, -1.19, 0);
    scene.add(mark1);

    const mark2 = new THREE.Mesh(markGeo, markMat);
    mark2.position.set(2.5, -1.19, 0.2);
    scene.add(mark2);

    // Back Cinema Projection Wall (feathered edges into darkness)
    const screenWallGeo = new THREE.PlaneGeometry(16, 7);
    const screenWallAlpha = createFeatheredWallAlpha();
    const screenWallMat = new THREE.MeshStandardMaterial({
      color: 0x0e0f16,
      roughness: 0.85,
      alphaMap: screenWallAlpha,
      transparent: true,
      depthWrite: false,
    });
    const screenWall = new THREE.Mesh(screenWallGeo, screenWallMat);
    screenWall.position.set(0, 1.2, -7.8);
    scene.add(screenWall);

    // Cinema Screen Canvas Border (2.39:1 scope)
    const screenBorderGeo = new THREE.BoxGeometry(9.6, 4.05, 0.1);
    const screenBorderMat = new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.9 });
    const screenBorder = new THREE.Mesh(screenBorderGeo, screenBorderMat);
    screenBorder.position.set(0, 1.2, -7.7);
    scene.add(screenBorder);

    // Active Screen Glow Surface (Cinema Projector radial gradient)
    const screenCanvasGeo = new THREE.PlaneGeometry(9.2, 3.85);
    const screenCanvasMat = new THREE.MeshBasicMaterial({
      map: createProjectorScreenTex(),
      transparent: true,
      opacity: 0.92,
    });
    const screenCanvas = new THREE.Mesh(screenCanvasGeo, screenCanvasMat);
    screenCanvas.position.set(0, 1.2, -7.64);
    scene.add(screenCanvas);

    // 5. Volumetric Projector Beam
    const beamGeo = new THREE.ConeGeometry(3.8, 14, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xe8f0ff,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const projectorBeam = new THREE.Mesh(beamGeo, beamMat);
    projectorBeam.rotation.x = -Math.PI / 2;
    projectorBeam.position.set(0, 2.5, -1);
    scene.add(projectorBeam);
    projectorBeamRef.current = projectorBeam;

    // 6. Dust Motes (160 particles — pure GPU transform drift, zero PCIe buffer uploads)
    const dust = createDustParticles(160);
    scene.add(dust);
    dustRef.current = dust;

    // 7. Lighting System — Enhanced for clarity and premium look
    // Ambient soundstage fill (brighter for object visibility)
    const ambientLight = new THREE.AmbientLight(0x161824, 1.4);
    scene.add(ambientLight);

    // Hemisphere light for natural fill (soft ambient bounce with dark shadows)
    const hemiLight = new THREE.HemisphereLight(0x152238, 0x08080c, 0.65);
    scene.add(hemiLight);

    // Key Studio Light (Fresnel Spot) — stronger
    const keyLight = new THREE.SpotLight(0xffeedd, 5.0, 22, Math.PI / 3.5, 0.35, 1.0);
    keyLight.position.set(-3.5, 5.0, 4.0);
    keyLight.target.position.set(-1.0, 0, 0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 512;
    keyLight.shadow.mapSize.height = 512;
    scene.add(keyLight);
    scene.add(keyLight.target);
    keyLightRef.current = keyLight;

    // Studio Rim / Hair Light (Cool Cyan backlight) — smooth edge definition
    const rimLight = new THREE.DirectionalLight(0x4477aa, 1.8);
    rimLight.position.set(3, 4.5, -4);
    scene.add(rimLight);

    // Warm Fill Light from opposite side (gives depth to objects)
    const fillLight = new THREE.DirectionalLight(0xffcc88, 1.4);
    fillLight.position.set(4, 2.5, 3);
    scene.add(fillLight);

    // Dedicated Chair Accent Light (makes chair pop)
    const chairSpot = new THREE.SpotLight(0xffe8c0, 3.5, 10, Math.PI / 5, 0.5, 1.2);
    chairSpot.position.set(3.5, 3.5, 2.5);
    chairSpot.target.position.set(2.5, 0.2, 0.2);
    scene.add(chairSpot);
    scene.add(chairSpot.target);

    // Dedicated Camera Rig Accent Light
    const camSpot = new THREE.SpotLight(0xe0e8ff, 3.0, 10, Math.PI / 5, 0.5, 1.2);
    camSpot.position.set(-4.0, 3.5, 2.0);
    camSpot.target.position.set(-2.8, 0.4, 0);
    scene.add(camSpot);
    scene.add(camSpot.target);

    // Clapperboard Down-Light
    const clapLight = new THREE.PointLight(0xfff0dd, 2.0, 6, 1.5);
    clapLight.position.set(0, 1.5, 2.0);
    scene.add(clapLight);

    // Subtle gold floor bounce/pool (makes floor reflections visible)
    const floorBounce = new THREE.PointLight(0xd4af37, 0.8, 8, 2);
    floorBounce.position.set(0, -0.8, 1.5);
    scene.add(floorBounce);

    // Interaction 02: "Find The Light" - Cursor Spotlight (enhanced)
    const cursorLight = new THREE.SpotLight(0xffffff, 3.5, 16, Math.PI / 5, 0.4, 1.2);
    cursorLight.position.set(0, 4.0, 5);
    const cursorTarget = new THREE.Object3D();
    cursorTarget.position.set(0, 0, 0);
    scene.add(cursorTarget);
    cursorLight.target = cursorTarget;
    scene.add(cursorLight);
    cursorLightRef.current = cursorLight;
    cursorTargetRef.current = cursorTarget;

    // 8. Place 3D Set Equipment
    // Camera Rig
    const camRig = createCinemaCameraRig();
    camRig.group.position.set(-2.8, -0.4, 0);
    camRig.group.rotation.y = 0.45;
    scene.add(camRig.group);
    tallyMeshRef.current = camRig.tallyLight;

    // Tag camera rig for raycasting
    camRig.group.traverse((child) => {
      child.userData.interactTarget = "camera";
      child.userData.interactLabel = "ARRI CINEMA CAMERA";
    });

    // Director's Chair
    const chair = createDirectorsChair();
    chair.position.set(2.5, -0.55, 0.2);
    chair.rotation.y = -0.4;
    scene.add(chair);

    // Tag chair for raycasting
    chair.traverse((child) => {
      child.userData.interactTarget = "chair";
      child.userData.interactLabel = "DIRECTOR'S CHAIR";
    });

    // Interactive 3D Clapperboard on Studio Case
    const caseGeo = new THREE.BoxGeometry(1.4, 0.7, 0.9);
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x22222a, roughness: 0.7, metalness: 0.4 });
    const peliCase = new THREE.Mesh(caseGeo, caseMat);
    peliCase.position.set(0, -0.85, 1.8);
    peliCase.castShadow = true;
    peliCase.userData.interactTarget = "clapperboard";
    peliCase.userData.interactLabel = "CLAPPERBOARD";
    scene.add(peliCase);

    const clapper = createClapperboard3D();
    clapper.group.position.set(0, -0.28, 1.8);
    clapper.group.rotation.x = -0.15;
    clapper.group.scale.set(0.65, 0.65, 0.65);
    scene.add(clapper.group);
    clapperSnapRef.current = clapper.snapAnimation;

    // Tag clapperboard for raycasting
    clapper.group.traverse((child) => {
      child.userData.interactTarget = "clapperboard";
      child.userData.interactLabel = "CLAPPERBOARD";
    });

    // Stacked 35mm Film Cans
    const canMat = new THREE.MeshStandardMaterial({ color: 0x7a7c88, roughness: 0.25, metalness: 0.92 });
    const canGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.12, 32);
    const filmCanGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const can = new THREE.Mesh(canGeo, canMat);
      can.position.set(1.4, -1.14 + i * 0.13, 1.6);
      can.rotation.y = i * 0.4;
      can.castShadow = true;
      can.userData.interactTarget = "filmcans";
      can.userData.interactLabel = "35MM FILM REELS";
      scene.add(can);
    }

    // Lightweight proxy meshes for ultra-fast raycasting (avoids testing thousands of sub-mesh triangles)
    const camProxy = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.0, 2.2),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    camProxy.position.set(-2.8, 0.4, 0);
    camProxy.userData.interactTarget = "camera";
    camProxy.userData.interactLabel = "ARRI CINEMA CAMERA";
    scene.add(camProxy);

    const chairProxy = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.8, 1.4),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    chairProxy.position.set(2.5, 0.4, 0.2);
    chairProxy.userData.interactTarget = "chair";
    chairProxy.userData.interactLabel = "DIRECTOR'S CHAIR";
    scene.add(chairProxy);

    const clapperProxy = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.2, 1.2),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    clapperProxy.position.set(0, -0.5, 1.8);
    clapperProxy.userData.interactTarget = "clapperboard";
    clapperProxy.userData.interactLabel = "CLAPPERBOARD";
    scene.add(clapperProxy);

    const cansProxy = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    cansProxy.position.set(1.4, -0.9, 1.6);
    cansProxy.userData.interactTarget = "filmcans";
    cansProxy.userData.interactLabel = "35MM FILM REELS";
    scene.add(cansProxy);

    interactiveMeshesRef.current = [camProxy, chairProxy, clapperProxy, cansProxy];

    // 8b. Interactive Focus Spotlight (appears on hover)
    const focusSpot = new THREE.SpotLight(0xffffff, 0, 14, Math.PI / 7, 0.5, 1.0);
    focusSpot.position.set(0, 5.5, 3);
    const focusTarget = new THREE.Object3D();
    focusTarget.position.set(0, 0, 0);
    scene.add(focusTarget);
    focusSpot.target = focusTarget;
    scene.add(focusSpot);
    focusSpotRef.current = focusSpot;
    focusTargetRef.current = focusTarget;

    // 9. Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = x;
      mousePos.current.targetY = y;

      // Store NDC coords for raycasting
      mouseNDCRef.current.set(x, y);

      // Store screen coords for tooltip
      tooltipPosRef.current = { x: e.clientX, y: e.clientY };

      // Update Cursor Light Target (Find The Light)
      if (cursorTargetRef.current) {
        cursorTargetRef.current.position.x = x * 4.5;
        cursorTargetRef.current.position.y = y * 2.5 - 0.2;
        cursorTargetRef.current.position.z = -x * 1.5;
      }
    };

    // Click handler for interactive 3D objects — only active in Hero section
    const handleClick = () => {
      const isHero = (window.scrollY || document.documentElement.scrollTop || 0) < (window.innerHeight * 0.7);
      if (isHero && hoveredObjectRef.current && onObjectClickRef.current) {
        onObjectClickRef.current(hoveredObjectRef.current);
      }
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    };

    let isScrolling = false;
    let scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      isScrolling = true;
      if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
      scrollDebounceTimer = setTimeout(() => {
        isScrolling = false;
      }, 90);

      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        scrollRef.current = Math.min(Math.max(y / total, 0), 1);
        if (activeTargetRef.current !== "studio") {
          activeTargetRef.current = "studio";
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 10. Render Loop with Cinematic Damping
    let animationId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animationId = requestAnimationFrame(render);
      // Skip rendering when tab is not visible — saves GPU entirely
      if (document.hidden) return;
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      // Update floating dust
      if (dustRef.current) {
        updateDustParticles(dustRef.current, elapsedTime);
      }

      // Smooth camera interpolation: Continuous Tracking Shot Spline
      let targetPos: THREE.Vector3;
      let targetLookAt: THREE.Vector3;
      let targetFov = 44;
      // Butter-smooth dampened scroll progress — eliminates mouse wheel stepped notch jitter
      const scrollDiff = scrollRef.current - smoothScrollRef.current;
      smoothScrollRef.current += scrollDiff * 0.16;

      if (activeTargetRef.current === "studio") {
        const s = smoothScrollRef.current;
        if (s < 0.16) {
          // 01. Hero Establishing Wide Shot
          const p = s / 0.16;
          targetPos = new THREE.Vector3(
            THREE.MathUtils.lerp(0, -1.4, p),
            THREE.MathUtils.lerp(1.3, 0.7, p),
            THREE.MathUtils.lerp(5.2, 3.4, p)
          );
          targetLookAt = new THREE.Vector3(
            THREE.MathUtils.lerp(0, -1.8, p),
            THREE.MathUtils.lerp(0.4, 0.3, p),
            0
          );
          targetFov = 46;
        } else if (s < 0.36) {
          // 02. Low Dolly past ARRI Cinema Camera Rig & 35mm Film Cans
          const p = (s - 0.16) / 0.20;
          targetPos = new THREE.Vector3(
            THREE.MathUtils.lerp(-1.4, -2.4, p),
            THREE.MathUtils.lerp(0.7, 0.2, p),
            THREE.MathUtils.lerp(3.4, 1.8, p)
          );
          targetLookAt = new THREE.Vector3(-2.8, 0.6, 0);
          targetFov = 38;
        } else if (s < 0.54) {
          // 03. Crane Swoop Down Looking at Storyboard Set
          const p = (s - 0.36) / 0.18;
          targetPos = new THREE.Vector3(
            THREE.MathUtils.lerp(-2.4, 0.4, p),
            THREE.MathUtils.lerp(0.2, 3.4, p),
            THREE.MathUtils.lerp(1.8, 2.6, p)
          );
          targetLookAt = new THREE.Vector3(0, -0.4, 0.6);
          targetFov = 48;
        } else if (s < 0.70) {
          // 04. Push In onto Production Monitor & NLE Editing Console
          const p = (s - 0.54) / 0.16;
          targetPos = new THREE.Vector3(
            THREE.MathUtils.lerp(0.4, -1.1, p),
            THREE.MathUtils.lerp(3.4, 0.5, p),
            THREE.MathUtils.lerp(2.6, 1.5, p)
          );
          targetLookAt = new THREE.Vector3(-1.4, 0.35, -0.8);
          targetFov = 36;
        } else if (s < 0.84) {
          // 05. Glide into Center Aisle of Screening Room (Facing 2.39:1 Canvas)
          const p = (s - 0.70) / 0.14;
          targetPos = new THREE.Vector3(
            THREE.MathUtils.lerp(-1.1, 0, p),
            THREE.MathUtils.lerp(0.5, 0.8, p),
            THREE.MathUtils.lerp(1.5, -0.8, p)
          );
          targetLookAt = new THREE.Vector3(0, 1.2, -7.64);
          targetFov = 46;
        } else if (s < 0.94) {
          // 06. Orbiting the Director's Chair in Dramatic Spotlight
          const p = (s - 0.84) / 0.10;
          const angle = -0.6 + p * Math.PI * 0.8;
          targetPos = new THREE.Vector3(
            2.5 + Math.cos(angle) * 2.4,
            0.65,
            0.2 + Math.sin(angle) * 2.4
          );
          targetLookAt = new THREE.Vector3(2.5, 0.45, 0.2);
          targetFov = 36;
        } else {
          // 07. Crane Retreat Pull-Back into Total Obsidian Black
          const p = (s - 0.94) / 0.06;
          targetPos = new THREE.Vector3(
            0,
            THREE.MathUtils.lerp(0.65, 2.0, p),
            THREE.MathUtils.lerp(2.4, 8.5, p)
          );
          targetLookAt = new THREE.Vector3(0, 0.2, 0);
          targetFov = 50;
        }

        // Dynamically steer spotlight towards current focal prop
        if (keyLightRef.current) {
          if (s < 0.36) {
            keyLightRef.current.target.position.set(-2.8, 0.6, 0);
          } else if (s < 0.70) {
            keyLightRef.current.target.position.set(0, 0, 1.0);
          } else if (s < 0.94) {
            keyLightRef.current.target.position.set(2.5, 0.6, 0.2);
          }
        }
      } else {
        const targetConfig = cameraTargets[activeTargetRef.current] || cameraTargets.studio;
        targetPos = targetConfig.pos.clone();
        targetLookAt = targetConfig.lookAt.clone();
        targetFov = targetConfig.fov;
      }

      // Dynamically widen target FOV on portrait phone viewports so 3D props (chair, camera, monitor) stay framed
      if (camera.aspect < 1.1) {
        targetFov = Math.min(64, Math.round(targetFov * (1.1 / Math.max(camera.aspect, 0.5)) * 0.85));
      }

      // Add subtle cinematic mouse parallax
      targetPos.x += mousePos.current.x * 0.28;
      targetPos.y += mousePos.current.y * 0.18;

      // Ultra-fluid cinematic camera tracking: responsive smooth lerp completely eliminates jerky stepped jumps
      const camLerp = isScrolling ? 0.22 : 0.14;
      curCamPos.current.lerp(targetPos, camLerp);
      curLookAt.current.lerp(targetLookAt, camLerp);

      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov += (targetFov - camera.fov) * 0.15;
        camera.updateProjectionMatrix();
      }

      camera.position.copy(curCamPos.current);
      camera.lookAt(curLookAt.current);

      // Projector flicker and audio-reactive beam pulsing
      if (projectorBeamRef.current) {
        const baseFlicker = 0.06 + Math.sin(elapsedTime * 14) * 0.006 + (Math.random() - 0.5) * 0.004;
        const audioBoost = isAudioActiveRef.current ? Math.sin(elapsedTime * 8) * 0.03 + 0.02 : 0;
        (projectorBeamRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
          0.04,
          baseFlicker + audioBoost
        );
      }

      // ─── Interactive Object Hover Raycasting (only active in Hero section; completely disabled when scrolled down) ───
      let newHovered: string | null = null;
      let newLabel: string | null = null;

      const isHeroSection = (window.scrollY || document.documentElement.scrollTop || 0) < (window.innerHeight * 0.7);

      if (!isScrolling && isHeroSection) {
        raycasterRef.current.setFromCamera(mouseNDCRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(
          interactiveMeshesRef.current,
          false // Non-recursive fast proxy test
        );

        if (intersects.length > 0) {
          newHovered = intersects[0].object.userData.interactTarget || null;
          newLabel = intersects[0].object.userData.interactLabel || newHovered;
        }
      }

      // Target positions for the focus spotlight
      const focusPositions: Record<string, THREE.Vector3> = {
        camera: new THREE.Vector3(-2.8, 0.4, 0),
        chair: new THREE.Vector3(2.5, 0.2, 0.2),
        clapperboard: new THREE.Vector3(0, -0.2, 1.8),
        filmcans: new THREE.Vector3(1.4, -0.9, 1.6),
      };

      // Detect hover change
      if (newHovered !== hoveredObjectRef.current) {
        hoveredObjectRef.current = newHovered;

        if (newHovered) {
          // Camera flash burst
          flashIntensityRef.current = 18;
          container.style.cursor = "pointer";

          // Snap focus target to object immediately
          const targetP = focusPositions[newHovered];
          if (targetP && focusTargetRef.current) {
            focusTargetRef.current.position.copy(targetP);
          }

          // Update tooltip
          if (tooltipRef.current && newLabel) {
            tooltipRef.current.textContent = `▶ ${newLabel}`;
            tooltipRef.current.style.opacity = "1";
            tooltipRef.current.style.transform = "translateY(0px)";
          }
        } else {
          container.style.cursor = "default";

          // Hide tooltip
          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = "0";
            tooltipRef.current.style.transform = "translateY(8px)";
          }
        }
      }

      // Animate tooltip position
      if (tooltipRef.current && hoveredObjectRef.current) {
        tooltipRef.current.style.left = `${tooltipPosRef.current.x + 16}px`;
        tooltipRef.current.style.top = `${tooltipPosRef.current.y - 12}px`;
      }

      // Animate focus spotlight
      if (focusSpotRef.current && focusTargetRef.current) {
        if (hoveredObjectRef.current) {
          const targetP = focusPositions[hoveredObjectRef.current];
          if (targetP) {
            focusTargetRef.current.position.lerp(targetP, 0.12);
          }

          // Position spotlight above the target
          const spotAbove = (targetP || focusTargetRef.current.position).clone();
          spotAbove.y += 5;
          spotAbove.z += 2;
          focusSpotRef.current.position.lerp(spotAbove, 0.1);

          // Flash decay: starts super bright (camera flash), settles to warm focused beam
          flashIntensityRef.current *= 0.88;
          const baseIntensity = 8;
          focusSpotRef.current.intensity =
            baseIntensity + flashIntensityRef.current;

          // Transition color: white flash → warm gold settle
          const flashRatio = Math.min(flashIntensityRef.current / 10, 1);
          const r = THREE.MathUtils.lerp(1.0, 1.0, flashRatio);
          const g = THREE.MathUtils.lerp(0.88, 1.0, flashRatio);
          const b = THREE.MathUtils.lerp(0.65, 1.0, flashRatio);
          focusSpotRef.current.color.setRGB(r, g, b);
        } else {
          // Smooth fade out
          focusSpotRef.current.intensity *= 0.88;
          if (focusSpotRef.current.intensity < 0.05) {
            focusSpotRef.current.intensity = 0;
          }
        }
      }

      renderer.render(scene, camera);
    };

    render();

    return () => {
      if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update camera target smoothly when activeTarget prop changes
  useEffect(() => {
    // Clapper snap if clapperboard selected
    if (activeTarget === "clapperboard" && clapperSnapRef.current) {
      clapperSnapRef.current(onClapperClack);
    }
  }, [activeTarget, onClapperClack]);

  // Update REC tally indicator
  useEffect(() => {
    if (tallyMeshRef.current) {
      const mat = tallyMeshRef.current.material as THREE.MeshStandardMaterial;
      if (isRecActive) {
        mat.color.setHex(0xff0000);
        mat.emissive.setHex(0xff2222);
      } else {
        mat.color.setHex(0x550000);
        mat.emissive.setHex(0x220000);
      }
    }
  }, [isRecActive]);

  // Update atmosphere based on career timeline stage
  useEffect(() => {
    if (timelineAtmosphere && keyLightRef.current) {
      keyLightRef.current.color.setStyle(timelineAtmosphere.lightingColor);
    }
  }, [timelineAtmosphere]);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0, pointerEvents: "auto" }}
      />
      {/* Floating tooltip label for hovered objects */}
      <div
        ref={tooltipRef}
        className="fixed z-50 pointer-events-none select-none"
        style={{
          opacity: 0,
          transform: "translateY(8px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          background: "rgba(0, 0, 0, 0.85)",
          border: "1px solid rgba(212, 175, 55, 0.5)",
          borderRadius: "6px",
          padding: "6px 14px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "#d4af37",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(212,175,55,0.15)",
          whiteSpace: "nowrap",
        }}
      />
    </>
  );
}
