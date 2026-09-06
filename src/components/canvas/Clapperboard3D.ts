import * as THREE from "three";

export function createClapperboard3D(): {
  group: THREE.Group;
  clapperArm: THREE.Group;
  snapAnimation: (onClack?: () => void) => void;
  updateTakeText: (takeNum: number) => void;
} {
  const group = new THREE.Group();

  // Create Slate Canvas
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext("2d");

  const drawSlate = (take: number) => {
    if (!ctx) return;
    ctx.fillStyle = "#1c1c22";
    ctx.fillRect(0, 0, 512, 340);

    // White grid lines
    ctx.strokeStyle = "#44444c";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 492, 320);

    ctx.beginPath();
    ctx.moveTo(10, 70);
    ctx.lineTo(502, 70);
    ctx.moveTo(10, 140);
    ctx.lineTo(502, 140);
    ctx.moveTo(10, 230);
    ctx.lineTo(502, 230);
    ctx.moveTo(250, 140);
    ctx.lineTo(250, 230);
    ctx.moveTo(380, 140);
    ctx.lineTo(380, 230);
    ctx.stroke();

    // Text labels
    ctx.fillStyle = "#aaaabc";
    ctx.font = "bold 14px monospace";
    ctx.fillText("PRODUCTION", 20, 32);
    ctx.fillText("DIRECTOR", 20, 100);
    ctx.fillText("SCENE", 20, 165);
    ctx.fillText("SHOT", 260, 165);
    ctx.fillText("TAKE", 390, 165);
    ctx.fillText("DATE / FPS", 20, 255);

    // Dynamic chalkboard handwriting
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px monospace";
    ctx.fillText("FIRST COPY / AMMA", 20, 58);
    ctx.fillText("FARHAN P. ZAMMA", 20, 128);

    ctx.font = "bold 44px monospace";
    ctx.fillText("80+", 40, 212);
    ctx.fillText("A-1", 280, 212);

    ctx.fillStyle = "#e74c3c";
    ctx.fillText(take < 10 ? `0${take}` : `${take}`, 405, 212);

    ctx.fillStyle = "#e0e0e0";
    ctx.font = "bold 18px monospace";
    ctx.fillText("24 FPS • 4K DCI • ARRI LF", 20, 288);
  };

  drawSlate(1);
  const slateTexture = new THREE.CanvasTexture(canvas);

  const slateMat = new THREE.MeshStandardMaterial({
    map: slateTexture,
    roughness: 0.45,
    metalness: 0.15,
    emissive: 0x080808,
    emissiveIntensity: 0.15,
  });

  const slateBodyGeo = new THREE.BoxGeometry(1.2, 0.8, 0.04);
  const slateBody = new THREE.Mesh(slateBodyGeo, slateMat);
  slateBody.position.y = -0.05;
  group.add(slateBody);

  // Chevron Strip Texture Generator
  const createChevronTexture = () => {
    const cCanvas = document.createElement("canvas");
    cCanvas.width = 256;
    cCanvas.height = 48;
    const cCtx = cCanvas.getContext("2d");
    if (cCtx) {
      cCtx.fillStyle = "#181820";
      cCtx.fillRect(0, 0, 256, 48);
      cCtx.fillStyle = "#f5f5f7";
      for (let i = -30; i < 280; i += 40) {
        cCtx.beginPath();
        cCtx.moveTo(i, 0);
        cCtx.lineTo(i + 22, 0);
        cCtx.lineTo(i + 42, 48);
        cCtx.lineTo(i + 20, 48);
        cCtx.closePath();
        cCtx.fill();
      }
    }
    return new THREE.CanvasTexture(cCanvas);
  };

  const chevronTex = createChevronTexture();
  const chevronMat = new THREE.MeshStandardMaterial({
    map: chevronTex,
    roughness: 0.4,
  });

  // Base stick (fixed to slate top)
  const baseStickGeo = new THREE.BoxGeometry(1.2, 0.12, 0.05);
  const baseStick = new THREE.Mesh(baseStickGeo, chevronMat);
  baseStick.position.set(0, 0.41, 0);
  group.add(baseStick);

  // Moving Clapper Arm (Pivoted on the left)
  const clapperArm = new THREE.Group();
  clapperArm.position.set(-0.6, 0.46, 0.02);

  const armGeo = new THREE.BoxGeometry(1.2, 0.12, 0.05);
  const armMesh = new THREE.Mesh(armGeo, chevronMat);
  armMesh.position.set(0.6, 0, 0);
  clapperArm.add(armMesh);

  // Pivot Bolt
  const boltGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 16);
  const boltMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
  const bolt = new THREE.Mesh(boltGeo, boltMat);
  bolt.rotation.x = Math.PI / 2;
  clapperArm.add(bolt);

  group.add(clapperArm);

  let isSnapping = false;
  const snapAnimation = (onClack?: () => void) => {
    if (isSnapping) return;
    isSnapping = true;

    // Raise arm
    const startTime = performance.now();
    const duration = 280; // ms

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 0.5) {
        // Open up to 35 degrees
        const p = progress / 0.5;
        clapperArm.rotation.z = Math.sin(p * Math.PI * 0.5) * 0.55;
      } else {
        // Slam down fast
        const p = (progress - 0.5) / 0.5;
        clapperArm.rotation.z = (1 - p) * 0.55;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        clapperArm.rotation.z = 0;
        isSnapping = false;
        if (onClack) onClack();
      }
    };
    requestAnimationFrame(animate);
  };

  const updateTakeText = (takeNum: number) => {
    drawSlate(takeNum);
    slateTexture.needsUpdate = true;
  };

  return { group, clapperArm, snapAnimation, updateTakeText };
}
