import * as THREE from "three";

export function createDirectorsChair(): THREE.Group {
  const chair = new THREE.Group();

  // Materials — enhanced brightness for visibility
  const darkWood = new THREE.MeshStandardMaterial({
    color: 0x3a2820,
    roughness: 0.6,
    metalness: 0.15,
  });

  const brass = new THREE.MeshStandardMaterial({
    color: 0xd4b060,
    roughness: 0.25,
    metalness: 0.85,
    emissive: 0x3a2800,
    emissiveIntensity: 0.15,
  });

  const blackCanvas = new THREE.MeshStandardMaterial({
    color: 0x1e1e22,
    roughness: 0.85,
    metalness: 0.08,
    side: THREE.DoubleSide,
  });

  // 1. Scissor X-legs (Front and Back)
  const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.35, 16);

  // Left scissor pair
  const legFL = new THREE.Mesh(legGeo, darkWood);
  legFL.rotation.z = 0.35;
  legFL.position.set(-0.45, 0, 0.3);
  chair.add(legFL);

  const legBL = new THREE.Mesh(legGeo, darkWood);
  legBL.rotation.z = -0.35;
  legBL.position.set(-0.45, 0, 0.3);
  chair.add(legBL);

  // Right scissor pair
  const legFR = new THREE.Mesh(legGeo, darkWood);
  legFR.rotation.z = 0.35;
  legFR.position.set(0.45, 0, -0.3);
  chair.add(legFR);

  const legBR = new THREE.Mesh(legGeo, darkWood);
  legBR.rotation.z = -0.35;
  legBR.position.set(0.45, 0, -0.3);
  chair.add(legBR);

  // Brass pivot joints
  const pivotGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.06, 16);
  const pivotL = new THREE.Mesh(pivotGeo, brass);
  pivotL.rotation.x = Math.PI / 2;
  pivotL.position.set(-0.45, 0, 0.3);
  chair.add(pivotL);

  const pivotR = new THREE.Mesh(pivotGeo, brass);
  pivotR.rotation.x = Math.PI / 2;
  pivotR.position.set(0.45, 0, -0.3);
  chair.add(pivotR);

  // Cross stretchers
  const stretcherGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 16);
  const stretcherBottom = new THREE.Mesh(stretcherGeo, darkWood);
  stretcherBottom.rotation.z = Math.PI / 2;
  stretcherBottom.position.set(0, -0.45, 0);
  chair.add(stretcherBottom);

  // Footrest
  const footrestGeo = new THREE.BoxGeometry(0.9, 0.04, 0.12);
  const footrest = new THREE.Mesh(footrestGeo, darkWood);
  footrest.position.set(0, -0.3, 0.32);
  chair.add(footrest);

  // 2. Armrests
  const armrestGeo = new THREE.BoxGeometry(0.07, 0.03, 0.75);
  const armL = new THREE.Mesh(armrestGeo, darkWood);
  armL.position.set(-0.48, 0.55, 0);
  chair.add(armL);

  const armR = new THREE.Mesh(armrestGeo, darkWood);
  armR.position.set(0.48, 0.55, 0);
  chair.add(armR);

  // Arm upright supports
  const armSupportGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 16);
  const supFL = new THREE.Mesh(armSupportGeo, darkWood);
  supFL.position.set(-0.48, 0.35, 0.28);
  chair.add(supFL);

  const supFR = new THREE.Mesh(armSupportGeo, darkWood);
  supFR.position.set(0.48, 0.35, 0.28);
  chair.add(supFR);

  // 3. Canvas Seat
  const seatGeo = new THREE.PlaneGeometry(0.85, 0.62);
  const seat = new THREE.Mesh(seatGeo, blackCanvas);
  seat.rotation.x = -Math.PI / 2;
  seat.position.set(0, 0.25, 0);
  chair.add(seat);

  // 4. Backrest Posts (tall back uprights)
  const backPostGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.75, 16);
  const bPostL = new THREE.Mesh(backPostGeo, darkWood);
  bPostL.position.set(-0.48, 0.85, -0.32);
  chair.add(bPostL);

  const bPostR = new THREE.Mesh(backPostGeo, darkWood);
  bPostR.position.set(0.48, 0.85, -0.32);
  chair.add(bPostR);

  // 5. Backrest Canvas with Gold Lettering
  const backCanvasEl = document.createElement("canvas");
  backCanvasEl.width = 512;
  backCanvasEl.height = 180;
  const ctx = backCanvasEl.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#111114";
    ctx.fillRect(0, 0, 512, 180);

    // Gold borders
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 5;
    ctx.strokeRect(16, 16, 480, 148);

    // Lettering
    ctx.fillStyle = "#f5d98a";
    ctx.textAlign = "center";
    ctx.font = "bold 34px 'Cinzel', serif, Georgia";
    ctx.letterSpacing = "6px";
    ctx.fillText("FARHAN P. ZAMMA", 256, 78);

    ctx.fillStyle = "#d4af37";
    ctx.font = "600 22px 'Cinzel', sans-serif";
    ctx.fillText("DIRECTOR", 256, 122);
  }

  const backTexture = new THREE.CanvasTexture(backCanvasEl);
  const backMat = new THREE.MeshStandardMaterial({
    map: backTexture,
    roughness: 0.7,
    emissive: 0x2a1f00,
    emissiveIntensity: 0.3,
    side: THREE.DoubleSide,
  });

  const backGeo = new THREE.PlaneGeometry(0.92, 0.34);
  const backMesh = new THREE.Mesh(backGeo, backMat);
  backMesh.position.set(0, 0.95, -0.32);
  chair.add(backMesh);

  return chair;
}
