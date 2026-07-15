"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";
import type { Collectible } from "@/lib/content";

interface Collectible3DProps {
  collectible: Collectible;
  onCollect: (collectible: Collectible) => void;
}

const GOLD = "#facc15";

export function Collectible3D({ collectible, onCollect }: Collectible3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    mesh.rotation.y = t * 1.4;
    mesh.rotation.x = Math.sin(t * 1.1) * 0.3;
    mesh.position.y = collectible.position[1] + Math.sin(t * 2) * 0.08;
  });

  return (
    <group
      position={collectible.position}
      onClick={(e) => {
        e.stopPropagation();
        onCollect(collectible);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <mesh ref={meshRef} scale={hovered ? 1.3 : 1}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={1.2} roughness={0.3} />
      </mesh>
      <pointLight color={GOLD} intensity={hovered ? 2.5 : 1} distance={2.5} decay={2} />
      {hovered && (
        <Html center distanceFactor={9} position={[0, 0.35, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(5,8,24,0.85)",
              color: "white",
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: "nowrap",
              border: "1px solid #facc1566",
            }}
          >
            {collectible.label}
          </div>
        </Html>
      )}
    </group>
  );
}
