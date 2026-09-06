 import * as THREE from "three";

export function createCinemaCameraRig(): {
  group: THREE.Group;
  tallyLight: THREE.Mesh;
  monitorScreen: THREE.Mesh;
  lensGroup: THREE.Group;
} {
  const group = new THREE.Group();

  // Materials
  const matteBlack = new THREE.MeshStandardMaterial({
    color: 0x1e1f24,
    roughness: 0.55,
    metalness: 0.82,
  });

  const brushedMetal = new THREE.MeshStandardMaterial({
    color: 0x5a5e68,
    roughness: 0.3,
    metalness: 0.92,
  });

  const goldAccent = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85,
    emissive: 0x4a3800,
    emissiveIntensity: 0.25,
  });

  const glassLens = new THREE.MeshPhysicalMaterial({
    color: 0x1a3355,
    roughness: 0.05,
    metalness: 0.15,
    transmission: 0.5,
    ior: 1.52,
    reflectivity: 0.95,
    clearcoat: 1.0,
    emissive: 0x0a1525,
    emissiveIntensity: 0.2,
  });

  // 1. Camera Body (ARRI style cube with chamfered look)
  const bodyGeo = new THREE.BoxGeometry(0.8, 0.7, 1.2);
  const body = new THREE.Mesh(bodyGeo, matteBlack);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Side vent grills
  for (let i = -0.35; i <= 0.35; i += 0.12) {
    const grillGeo = new THREE.BoxGeometry(0.82, 0.03, 0.7);
    const grill = new THREE.Mesh(grillGeo, brushedMetal);
    grill.position.set(0, i, 0);
    group.add(grill);
  }

  // Top Cheese Plate
  const plateGeo = new THREE.BoxGeometry(0.7, 0.04, 1.1);
  const plate = new THREE.Mesh(plateGeo, brushedMetal);
  plate.position.set(0, 0.37, 0);
  group.add(plate);

  // Top Handle
  const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 16);
  const handle = new THREE.Mesh(handleGeo, brushedMetal);
  handle.rotation.x = Math.PI / 2;
  handle.position.set(0, 0.58, 0);
  group.add(handle);

  const handlePostF = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), brushedMetal);
  handlePostF.position.set(0, 0.47, 0.35);
  group.add(handlePostF);

  const handlePostR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), brushedMetal);
  handlePostR.position.set(0, 0.47, -0.35);
  group.add(handlePostR);

  // 2. Cinema Prime Lens
  const lensGroup = new THREE.Group();
  lensGroup.position.set(0, 0.05, 0.65);

  const lensBarrelGeo = new THREE.CylinderGeometry(0.28, 0.25, 0.7, 32);
  const lensBarrel = new THREE.Mesh(lensBarrelGeo, matteBlack);
  lensBarrel.rotation.x = Math.PI / 2;
  lensGroup.add(lensBarrel);

  // Focus Gear Ring
  const focusRingGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.12, 32);
  const focusRing = new THREE.Mesh(focusRingGeo, brushedMetal);
  focusRing.rotation.x = Math.PI / 2;
  focusRing.position.z = 0.1;
  lensGroup.add(focusRing);

  // Gold aperture mark ring
  const apRingGeo = new THREE.CylinderGeometry(0.282, 0.282, 0.04, 32);
  const apRing = new THREE.Mesh(apRingGeo, goldAccent);
  apRing.rotation.x = Math.PI / 2;
  apRing.position.z = -0.15;
  lensGroup.add(apRing);

  // Front Glass Element
  const frontGlassGeo = new THREE.SphereGeometry(0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
  const frontGlass = new THREE.Mesh(frontGlassGeo, glassLens);
  frontGlass.rotation.x = -Math.PI / 2;
  frontGlass.position.z = 0.36;
  lensGroup.add(frontGlass);

  // Matte Box (Carbon fiber hood)
  const matteBoxGeo = new THREE.BoxGeometry(0.75, 0.55, 0.35);
  const matteBox = new THREE.Mesh(matteBoxGeo, matteBlack);
  matteBox.position.z = 0.5;
  lensGroup.add(matteBox);

  // Top Flag
  const flagGeo = new THREE.BoxGeometry(0.72, 0.02, 0.4);
  const topFlag = new THREE.Mesh(flagGeo, matteBlack);
  topFlag.position.set(0, 0.29, 0.55);
  topFlag.rotation.x = -0.25;
  lensGroup.add(topFlag);

  group.add(lensGroup);

  // 3. 15mm Base Rails (Chrome rods)
  const railGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.8, 16);
  const railL = new THREE.Mesh(railGeo, brushedMetal);
  railL.rotation.x = Math.PI / 2;
  railL.position.set(-0.25, -0.42, 0.2);
  group.add(railL);

  const railR = new THREE.Mesh(railGeo, brushedMetal);
  railR.rotation.x = Math.PI / 2;
  railR.position.set(0.25, -0.42, 0.2);
  group.add(railR);

  // 4. OLED Production Field Monitor on Articulating Arm
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(-0.55, 0.42, 0.15);
  monitorGroup.rotation.y = 0.35;

  const monitorFrameGeo = new THREE.BoxGeometry(0.6, 0.42, 0.06);
  const monitorFrame = new THREE.Mesh(monitorFrameGeo, matteBlack);
  monitorGroup.add(monitorFrame);

  // Monitor Canvas Texture (Simulated live video feed + timecode + waveform)
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, 256, 160);
    // Cinema crosshair
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 20, 196, 120);
    ctx.beginPath();
    ctx.moveTo(128, 70);
    ctx.lineTo(128, 90);
    ctx.moveTo(118, 80);
    ctx.lineTo(138, 80);
    ctx.stroke();

    // Timecode
    ctx.fillStyle = "#00ff66";
    ctx.font = "bold 14px monospace";
    ctx.fillText("TC 01:13:80:24", 36, 40);

    ctx.fillStyle = "#ffffff";
    ctx.font = "11px monospace";
    ctx.fillText("4K DCI • 24fps", 36, 130);
    ctx.fillText("FARHAN P. ZAMMA", 140, 130);
  }
  const screenTexture = new THREE.CanvasTexture(canvas);
  const monitorScreenMat = new THREE.MeshBasicMaterial({
    map: screenTexture,
  });
  const screenGeo = new THREE.PlaneGeometry(0.54, 0.36);
  const monitorScreen = new THREE.Mesh(screenGeo, monitorScreenMat);
  monitorScreen.position.z = 0.032;
  monitorGroup.add(monitorScreen);

  // Articulating arm clamp
  const clampGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 12);
  const clamp = new THREE.Mesh(clampGeo, brushedMetal);
  clamp.rotation.z = Math.PI / 2;
  clamp.position.set(0.22, -0.15, 0);
  monitorGroup.add(clamp);

  group.add(monitorGroup);

  // 5. Tally Red LED Light
  const tallyGeo = new THREE.SphereGeometry(0.03, 16, 16);
  const tallyMat = new THREE.MeshStandardMaterial({
    color: 0x550000,
    emissive: 0x220000,
    roughness: 0.2,
  });
  const tallyLight = new THREE.Mesh(tallyGeo, tallyMat);
  tallyLight.position.set(0, 0.32, 0.61);
  group.add(tallyLight);

  return { group, tallyLight, monitorScreen, lensGroup };
}
