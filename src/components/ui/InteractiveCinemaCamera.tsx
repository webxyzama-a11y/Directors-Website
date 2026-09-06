"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InteractiveCinemaCamera() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId = 0;
    let isVisible = true;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup (framed to showcase cinematic depth and angles)
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(0.4, 0.35, 4.6);

    // 3. Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    container.appendChild(renderer.domElement);

    // 4. Generate Procedural Studio Softbox Environment Map for Photorealistic PBR Reflections
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext("2d");
    if (envCtx) {
      // Dark cinematic soundstage background
      envCtx.fillStyle = "#07080d";
      envCtx.fillRect(0, 0, 512, 256);

      // Top large studio overhead softbox light
      const topSoftbox = envCtx.createLinearGradient(120, 0, 392, 0);
      topSoftbox.addColorStop(0, "rgba(255,255,255,0)");
      topSoftbox.addColorStop(0.2, "rgba(255,255,255,0.95)");
      topSoftbox.addColorStop(0.8, "rgba(255,255,255,0.95)");
      topSoftbox.addColorStop(1, "rgba(255,255,255,0)");
      envCtx.fillStyle = topSoftbox;
      envCtx.fillRect(100, 10, 312, 45);

      // Left warm rim light strip
      const leftStrip = envCtx.createLinearGradient(0, 40, 80, 40);
      leftStrip.addColorStop(0, "rgba(255,190,110,0.85)");
      leftStrip.addColorStop(1, "rgba(255,190,110,0)");
      envCtx.fillStyle = leftStrip;
      envCtx.fillRect(0, 30, 80, 180);

      // Right cool cyan/blue rim light strip
      const rightStrip = envCtx.createLinearGradient(512, 40, 432, 40);
      rightStrip.addColorStop(0, "rgba(0,180,255,0.9)");
      rightStrip.addColorStop(1, "rgba(0,180,255,0)");
      envCtx.fillStyle = rightStrip;
      envCtx.fillRect(432, 30, 80, 180);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // Key front-right softbox light
    const keySpot = new THREE.SpotLight(0xfff8ee, 6.5, 20, Math.PI / 3, 0.45, 1.2);
    keySpot.position.set(2.8, 3.2, 4.2);
    scene.add(keySpot);

    // Fill front-left light
    const fillLight = new THREE.DirectionalLight(0xb0d0ff, 3.5);
    fillLight.position.set(-3.0, 1.8, 3.5);
    scene.add(fillLight);

    // Warm gold rim edge light
    const goldRim = new THREE.DirectionalLight(0xd4af37, 5.0);
    goldRim.position.set(3.5, 2.5, -2.5);
    scene.add(goldRim);

    // Cool cyan backlight
    const cyanBack = new THREE.DirectionalLight(0x00c4ff, 3.8);
    cyanBack.position.set(-3.5, 3.0, -3.0);
    scene.add(cyanBack);

    // 6. Photorealistic PBR Materials
    const titaniumChassis = new THREE.MeshStandardMaterial({
      color: 0x2a2d36,
      roughness: 0.28,
      metalness: 0.88,
      envMapIntensity: 1.6,
    });

    const polishedChrome = new THREE.MeshStandardMaterial({
      color: 0xd8dde8,
      roughness: 0.12,
      metalness: 0.98,
      envMapIntensity: 2.2,
    });

    const cinemaGold = new THREE.MeshStandardMaterial({
      color: 0xf5c542,
      roughness: 0.18,
      metalness: 0.92,
      emissive: 0x3d2b02,
      emissiveIntensity: 0.35,
      envMapIntensity: 2.0,
    });

    const carbonFiberMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.35,
      metalness: 0.55,
      envMapIntensity: 1.2,
    });

    const rubberKnurled = new THREE.MeshStandardMaterial({
      color: 0x1e2026,
      roughness: 0.65,
      metalness: 0.2,
    });

    const masterGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0088ff,
      roughness: 0.01,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.58,
      reflectivity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      emissive: 0x003366,
      emissiveIntensity: 0.5,
      envMapIntensity: 2.5,
    });

    // 7. Assemble Master Cinema Camera Model
    const masterPivot = new THREE.Group();
    scene.add(masterPivot);

    // Base Motorized Gimbal / Head Base (Stationary)
    const baseGimbalGroup = new THREE.Group();
    baseGimbalGroup.position.y = -1.0;

    // Curved carbon-fiber pan yoke
    const yokeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.25, 32), titaniumChassis);
    baseGimbalGroup.add(yokeBase);

    const goldBaseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.05, 32), cinemaGold);
    goldBaseRing.position.y = 0.12;
    baseGimbalGroup.add(goldBaseRing);

    // Motorized pan stator bell
    const motorBell = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 32), polishedChrome);
    motorBell.position.y = 0.22;
    baseGimbalGroup.add(motorBell);

    scene.add(baseGimbalGroup);

    // --- Dynamic Pan/Tilt Gimbal Arm (Tracks cursor smoothly) ---
    const panTiltGroup = new THREE.Group();
    panTiltGroup.position.set(0, -0.65, 0);
    masterPivot.add(panTiltGroup);

    // Gimbal Tilt Fork (Curved twin arms)
    const forkL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.2), carbonFiberMat);
    forkL.position.set(-0.68, 0.55, 0);
    panTiltGroup.add(forkL);

    const forkR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.2), carbonFiberMat);
    forkR.position.set(0.68, 0.55, 0);
    panTiltGroup.add(forkR);

    // Gold tilt motor hubs on both sides
    const tiltHubL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 32), cinemaGold);
    tiltHubL.rotation.z = Math.PI / 2;
    tiltHubL.position.set(-0.68, 0.9, 0);
    panTiltGroup.add(tiltHubL);

    const tiltHubR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 32), cinemaGold);
    tiltHubR.rotation.z = Math.PI / 2;
    tiltHubR.position.set(0.68, 0.9, 0);
    panTiltGroup.add(tiltHubR);

    // --- Camera Body Group (Pitches up/down on tilt axis) ---
    const cameraRig = new THREE.Group();
    cameraRig.position.set(0, 0.9, 0);
    panTiltGroup.add(cameraRig);

    // 7A. Main Camera Chassis (ARRI Alexa 35 / LF Style)
    // Main body cube with beveled feel
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.82, 1.25), titaniumChassis);
    cameraRig.add(mainBody);

    // Recessed side display panel (left)
    const sideDisplayBezel = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.42, 0.65), carbonFiberMat);
    sideDisplayBezel.position.set(0, 0.05, 0.1);
    cameraRig.add(sideDisplayBezel);

    const sideStatusScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.58, 0.35),
      new THREE.MeshBasicMaterial({ color: 0x050c18 })
    );
    sideStatusScreen.position.set(-0.472, 0.05, 0.1);
    sideStatusScreen.rotation.y = -Math.PI / 2;
    cameraRig.add(sideStatusScreen);

    // Right-side Gold ARRI Master badge
    const arriBadge = new THREE.Mesh(new THREE.BoxGeometry(0.935, 0.2, 0.45), cinemaGold);
    arriBadge.position.set(0, 0.08, 0.1);
    cameraRig.add(arriBadge);

    // CNC Machined Radiator Vent Fins (Top & Bottom)
    for (let i = -0.32; i <= 0.32; i += 0.1) {
      const ventFin = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.025, 0.85), polishedChrome);
      ventFin.position.set(0, i, 0.05);
      cameraRig.add(ventFin);
    }

    // Top NATO Cheese Plate
    const topCheesePlate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 1.15), polishedChrome);
    topCheesePlate.position.set(0, 0.43, 0);
    cameraRig.add(topCheesePlate);

    // Top Carbon Ergonomic Handle
    const handleCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.95, 16), carbonFiberMat);
    handleCylinder.rotation.x = Math.PI / 2;
    handleCylinder.position.set(0, 0.68, 0.05);
    cameraRig.add(handleCylinder);

    const handleStanchionF = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.07), polishedChrome);
    handleStanchionF.position.set(0, 0.55, 0.42);
    cameraRig.add(handleStanchionF);

    const handleStanchionR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.07), polishedChrome);
    handleStanchionR.position.set(0, 0.55, -0.32);
    cameraRig.add(handleStanchionR);

    // Cold-shoe gold mounts on top handle
    const coldShoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.12), cinemaGold);
    coldShoe.position.set(0, 0.74, 0.2);
    cameraRig.add(coldShoe);

    // 7B. Rear V-Mount Cinema Battery (Anton Bauer / Core SWX)
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, -0.05, -0.82);

    const batteryPack = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.7, 0.4), carbonFiberMat);
    batteryGroup.add(batteryPack);

    // Battery gold contact plate
    const vPlate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.04), cinemaGold);
    vPlate.position.z = 0.21;
    batteryGroup.add(vPlate);

    // LED Fuel Gauge on Battery (Glows in the dark)
    for (let b = 0; b < 4; b++) {
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.03, 0.02),
        new THREE.MeshStandardMaterial({
          color: 0x00ff88,
          emissive: 0x00ff88,
          emissiveIntensity: 2.2,
        })
      );
      led.position.set(-0.35, -0.15 + b * 0.09, -0.21);
      batteryGroup.add(led);
    }
    cameraRig.add(batteryGroup);

    // 7C. Articulating Electronic Viewfinder Eyepiece (Operator side)
    const evfGroup = new THREE.Group();
    evfGroup.position.set(-0.62, 0.48, -0.1);
    evfGroup.rotation.y = -0.35;

    const evfBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.45, 24), titaniumChassis);
    evfBody.rotation.x = Math.PI / 2;
    evfGroup.add(evfBody);

    const evfGoldRing = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.142, 0.04, 24), cinemaGold);
    evfGoldRing.rotation.x = Math.PI / 2;
    evfGoldRing.position.z = 0.08;
    evfGroup.add(evfGoldRing);

    // Flared rubber eyecup
    const eyecup = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 0.16, 24), rubberKnurled);
    eyecup.rotation.x = Math.PI / 2;
    eyecup.position.z = -0.28;
    evfGroup.add(eyecup);

    const evfBracket = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 12), polishedChrome);
    evfBracket.rotation.z = Math.PI / 2;
    evfBracket.position.set(0.14, 0, 0);
    evfGroup.add(evfBracket);

    cameraRig.add(evfGroup);

    // 7D. Master Anamorphic Prime Lens Package (Facing +Z toward viewer)
    const lensGroup = new THREE.Group();
    lensGroup.position.set(0, 0.04, 0.65);

    // Stainless Steel PL Mount Ring
    const plMount = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.12, 32), polishedChrome);
    plMount.rotation.x = Math.PI / 2;
    plMount.position.z = 0.06;
    lensGroup.add(plMount);

    const plGoldPin = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.03, 32), cinemaGold);
    plGoldPin.rotation.x = Math.PI / 2;
    plGoldPin.position.z = 0.12;
    lensGroup.add(plGoldPin);

    // Main Anamorphic Lens Barrel (Multi-stepped cylinders)
    const mainBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.55, 32), titaniumChassis);
    mainBarrel.rotation.x = Math.PI / 2;
    mainBarrel.position.z = 0.38;
    lensGroup.add(mainBarrel);

    // Knurled 0.8 MOD Focus Ring with Laser Teeth
    const focusGearRing = new THREE.Mesh(new THREE.CylinderGeometry(0.41, 0.41, 0.14, 48), polishedChrome);
    focusGearRing.rotation.x = Math.PI / 2;
    focusGearRing.position.z = 0.28;
    lensGroup.add(focusGearRing);

    // Iris / Aperture Ring with Cinema Gold Accents
    const irisRing = new THREE.Mesh(new THREE.CylinderGeometry(0.405, 0.405, 0.08, 48), cinemaGold);
    irisRing.rotation.x = Math.PI / 2;
    irisRing.position.z = 0.48;
    lensGroup.add(irisRing);

    // Front Flared Optics Bell
    const frontBell = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.39, 0.25, 32), carbonFiberMat);
    frontBell.rotation.x = Math.PI / 2;
    frontBell.position.z = 0.72;
    lensGroup.add(frontBell);

    // Anamorphic Blue Accent Identification Ring
    const anamorphicBlueRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.465, 0.465, 0.04, 32),
      new THREE.MeshStandardMaterial({
        color: 0x0099ff,
        emissive: 0x0066cc,
        emissiveIntensity: 1.2,
        roughness: 0.15,
        metalness: 0.8,
      })
    );
    anamorphicBlueRing.rotation.x = Math.PI / 2;
    anamorphicBlueRing.position.z = 0.78;
    lensGroup.add(anamorphicBlueRing);

    // Front Convex Optical Element (Multi-coated Anamorphic Sapphire Glass)
    const frontGlass = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.38),
      masterGlassMat
    );
    frontGlass.rotation.x = -Math.PI / 2;
    frontGlass.position.z = 0.82;
    lensGroup.add(frontGlass);

    // 4-Stage Carbon Fiber Matte Box with Beveled Shroud
    const matteBoxGroup = new THREE.Group();
    matteBoxGroup.position.set(0, 0, 0.98);

    const matteBoxHood = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.78, 0.32), carbonFiberMat);
    matteBoxGroup.add(matteBoxHood);

    // Gold Bezel Face Frame
    const boxFrame = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.82, 0.035), cinemaGold);
    boxFrame.position.z = 0.16;
    matteBoxGroup.add(boxFrame);

    // Carbon Fiber Top French Flag with Gold Hinges
    const topFlag = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.02, 0.48), carbonFiberMat);
    topFlag.position.set(0, 0.42, 0.2);
    topFlag.rotation.x = -0.26;
    matteBoxGroup.add(topFlag);

    const hingeL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 12), cinemaGold);
    hingeL.rotation.z = Math.PI / 2;
    hingeL.position.set(-0.4, 0.41, 0.02);
    matteBoxGroup.add(hingeL);

    const hingeR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 12), cinemaGold);
    hingeR.rotation.z = Math.PI / 2;
    hingeR.position.set(0.4, 0.41, 0.02);
    matteBoxGroup.add(hingeR);

    // Carbon Side Wings / Barndoors
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.72, 0.36), carbonFiberMat);
    wingL.position.set(-0.55, 0, 0.18);
    wingL.rotation.y = 0.28;
    matteBoxGroup.add(wingL);

    const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.72, 0.36), carbonFiberMat);
    wingR.position.set(0.55, 0, 0.18);
    wingR.rotation.y = -0.28;
    matteBoxGroup.add(wingR);

    lensGroup.add(matteBoxGroup);

    // --- Subtle Anamorphic Volumetric Lens Beam (Projects toward cursor) ---
    const beamGeo = new THREE.ConeGeometry(0.7, 3.2, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00b4ff,
      transparent: true,
      opacity: 0.075,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const lensBeam = new THREE.Mesh(beamGeo, beamMat);
    lensBeam.rotation.x = -Math.PI / 2;
    lensBeam.position.set(0, 0, 2.6);
    lensGroup.add(lensBeam);

    cameraRig.add(lensGroup);

    // 7E. Dual 15mm Titanium Iris Rods & Follow-Focus Motor
    const rodL = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 2.3, 16), polishedChrome);
    rodL.rotation.x = Math.PI / 2;
    rodL.position.set(-0.32, -0.48, 0.45);
    cameraRig.add(rodL);

    const rodR = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 2.3, 16), polishedChrome);
    rodR.rotation.x = Math.PI / 2;
    rodR.position.set(0.32, -0.48, 0.45);
    cameraRig.add(rodR);

    // Wireless Follow-Focus Motor attached to left rod
    const ffMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.32, 24), titaniumChassis);
    ffMotor.position.set(-0.32, -0.22, 0.9);
    cameraRig.add(ffMotor);

    const ffGear = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 24), cinemaGold);
    ffGear.rotation.x = Math.PI / 2;
    ffGear.position.set(-0.25, -0.06, 0.9);
    cameraRig.add(ffGear);

    // 7F. Production Monitor with Active Live Timecode Screen
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(-0.76, 0.52, 0.25);
    monitorGroup.rotation.y = 0.48;

    const monBezel = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.5, 0.08), titaniumChassis);
    monitorGroup.add(monBezel);

    const monGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.52, 0.02), cinemaGold);
    monGoldTrim.position.z = -0.02;
    monitorGroup.add(monGoldTrim);

    // Dynamic Live Screen Canvas
    const monCanvas = document.createElement("canvas");
    monCanvas.width = 256;
    monCanvas.height = 170;
    const monCtx = monCanvas.getContext("2d");
    const monTexture = new THREE.CanvasTexture(monCanvas);
    const monScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.68, 0.44),
      new THREE.MeshBasicMaterial({ map: monTexture })
    );
    monScreen.position.z = 0.045;
    monitorGroup.add(monScreen);

    // Chrome articulating arm clamp
    const armClamp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 12), polishedChrome);
    armClamp.rotation.z = Math.PI / 2;
    armClamp.position.set(0.3, -0.2, 0);
    monitorGroup.add(armClamp);

    cameraRig.add(monitorGroup);

    // 7G. Red Tally LED Indicator (Pulsing)
    const tallyMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff1122,
      emissiveIntensity: 2.5,
      roughness: 0.1,
    });
    const tallyLED = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), tallyMat);
    tallyLED.position.set(0, 0.42, 1.15);
    cameraRig.add(tallyLED);

    // 8. Dynamic Cursor Tracking Logic
    const targetRot = { pan: -0.24, tilt: 0.04, roll: 0 }; // Natural 3/4 cinematic angle
    const curRot = { pan: -0.24, tilt: 0.04, roll: 0 };
    const curOffset = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Normalized coordinates relative to screen center
      const nx = (e.clientX - cx) / (window.innerWidth / 1.8);
      const ny = (e.clientY - cy) / (window.innerHeight / 1.8);

      // Smooth pan: when cursor is on the left (credits list), camera swivels left to aim directly at them!
      targetRot.pan = -nx * 0.95 - 0.15;
      targetRot.tilt = -ny * 0.42 + 0.04;
      targetRot.roll = -nx * 0.07;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // IntersectionObserver to pause rendering when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 9. High-Performance Render Loop
    let time = 0;
    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      animId = requestAnimationFrame(render);
      time += 0.016;

      // Kinematic smoothing for camera orientation
      curRot.pan += (targetRot.pan - curRot.pan) * 0.085;
      curRot.tilt += (targetRot.tilt - curRot.tilt) * 0.085;
      curRot.roll += (targetRot.roll - curRot.roll) * 0.085;

      panTiltGroup.rotation.y = curRot.pan;
      cameraRig.rotation.x = curRot.tilt;
      cameraRig.rotation.z = curRot.roll;

      // Mechanical translation lean
      curOffset.x += (curRot.pan * 0.22 - curOffset.x) * 0.08;
      curOffset.y += (-curRot.tilt * 0.16 - curOffset.y) * 0.08;
      masterPivot.position.x = curOffset.x;
      masterPivot.position.y = curOffset.y;

      // Subtle volumetric beam pulse
      beamMat.opacity = 0.06 + Math.sin(time * 3) * 0.018;

      // Tally light pulse
      tallyMat.emissiveIntensity = 2.0 + Math.sin(time * 5.5) * 0.8;

      // Update OLED monitor screen texture
      if (monCtx) {
        monCtx.fillStyle = "#060912";
        monCtx.fillRect(0, 0, 256, 170);

        // Frame guide
        monCtx.strokeStyle = "rgba(212, 175, 55, 0.4)";
        monCtx.lineWidth = 1.5;
        monCtx.strokeRect(18, 15, 220, 140);

        // Optical reticle center cross
        monCtx.strokeStyle = "rgba(0, 200, 255, 0.6)";
        monCtx.beginPath();
        monCtx.moveTo(128, 75);
        monCtx.lineTo(128, 95);
        monCtx.moveTo(118, 85);
        monCtx.lineTo(138, 85);
        monCtx.stroke();

        // Waveform
        monCtx.fillStyle = "#00ff88";
        for (let b = 0; b < 14; b++) {
          const h = 4 + Math.abs(Math.sin(time * 7 + b)) * 18;
          monCtx.fillRect(26 + b * 6, 145 - h, 4, h);
        }

        // Camera Info
        monCtx.fillStyle = "#d4af37";
        monCtx.font = "bold 13px monospace";
        monCtx.fillText("ARRI LF • 50mm", 28, 35);

        // Coordinates
        monCtx.fillStyle = "#ffffff";
        monCtx.font = "11px monospace";
        monCtx.fillText(`PAN: ${(curRot.pan * (180 / Math.PI)).toFixed(1)}°`, 140, 35);
        monCtx.fillText(`TLT: ${(curRot.tilt * (180 / Math.PI)).toFixed(1)}°`, 140, 52);

        // REC dot
        monCtx.fillStyle = Math.sin(time * 5) > 0 ? "#ff2222" : "#550000";
        monCtx.beginPath();
        monCtx.arc(32, 52, 4, 0, Math.PI * 2);
        monCtx.fill();
        monCtx.fillStyle = "#ff5555";
        monCtx.fillText("REC 24P", 42, 55);

        monTexture.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      envTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[540px] mx-auto select-none pointer-events-none"
    />
  );
}
