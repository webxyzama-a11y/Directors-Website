import * as THREE from "three";

export function createDustParticles(count = 160): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Distribute along the projector light cone
    const t = Math.random();
    const radius = 0.4 + t * 4.2;
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;

    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = 1.2 + (Math.random() - 0.5) * 3.5;
    positions[i * 3 + 2] = -12 + t * 24;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Canvas circle texture for soft rounded dust motes
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 245, 220, 1)");
    gradient.addColorStop(0.4, "rgba(255, 230, 180, 0.6)");
    gradient.addColorStop(1, "rgba(255, 230, 180, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.PointsMaterial({
    size: 0.075,
    map: texture,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

export function updateDustParticles(particles: THREE.Points, time: number): void {
  // Pure transform drift: ZERO CPU buffer looping, ZERO GPU uploads over PCIe bus
  // Completely eliminates micro-stutters during scrolling while keeping realistic atmospheric motes
  particles.rotation.y = time * 0.02;
  particles.rotation.x = Math.sin(time * 0.03) * 0.025;
  particles.position.y = Math.sin(time * 0.05) * 0.12;
  particles.position.x = Math.cos(time * 0.04) * 0.08;
}

