import * as THREE from "three";

export function createLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 76px system-ui, sans-serif";

  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 30;
  ctx.fillStyle = "#e0f6ff";
  ctx.fillText("BEEP BEEP", canvas.width / 2, canvas.height / 2);
  ctx.shadowBlur = 12;
  ctx.fillText("BEEP BEEP", canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createDashboardTexture(accent: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0a0f27";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.85;
  ctx.fillRect(0, 0, canvas.width, 18);

  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  for (let y = 30; y < canvas.height; y += 14) {
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(canvas.width - 10, y);
    ctx.stroke();
  }

  const blips = [
    [30, 40], [70, 60], [130, 45], [180, 70], [210, 50], [50, 90], [150, 95],
  ];
  ctx.globalAlpha = 1;
  for (const [x, y] of blips) {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
