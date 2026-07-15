import * as THREE from "three";

export function createRoadTexture(): THREE.CanvasTexture {
  const width = 128;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#a89a86";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#fdf6e9";
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = width * 0.05;
  ctx.setLineDash([height * 0.045, height * 0.035]);
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
