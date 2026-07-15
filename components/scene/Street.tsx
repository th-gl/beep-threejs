"use client";

import { useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { createGridTexture } from "@/lib/gridTexture";
import { createRoadTexture } from "@/lib/streetTexture";
import { STREET_BOUNDS } from "@/lib/building";

interface StreetProps {
  onWalkTo?: (x: number, z: number) => void;
}

const LAMP_POSITIONS: [number, number][] = [
  [-8, 12],
  [8, 12],
  [-8, 24],
  [8, 24],
];

export function Street({ onWalkTo }: StreetProps) {
  const width = STREET_BOUNDS.maxX - STREET_BOUNDS.minX;
  const depth = STREET_BOUNDS.maxZ - STREET_BOUNDS.minZ;
  const centerX = (STREET_BOUNDS.minX + STREET_BOUNDS.maxX) / 2;
  const centerZ = (STREET_BOUNDS.minZ + STREET_BOUNDS.maxZ) / 2;

  const sidewalkTexture = useMemo(() => {
    const t = createGridTexture("#c9a878", 512, 64);
    t.repeat.set(width / 3, depth / 3);
    return t;
  }, [width, depth]);

  const roadTexture = useMemo(() => createRoadTexture(), []);

  const handleWalk = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onWalkTo?.(e.point.x, e.point.z);
  };

  return (
    <group>
      <mesh
        position={[centerX, 0, centerZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={handleWalk}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={sidewalkTexture} roughness={0.85} />
      </mesh>

      <mesh
        position={[centerX, 0.005, centerZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={handleWalk}
      >
        <planeGeometry args={[6, depth]} />
        <meshStandardMaterial map={roadTexture} roughness={0.9} />
      </mesh>

      {LAMP_POSITIONS.map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 2.8, 10]} />
            <meshStandardMaterial color="#6b5847" roughness={0.5} metalness={0.2} />
          </mesh>
          <mesh position={[0, 2.85, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#fff4d6" emissive="#ffedb3" emissiveIntensity={1.2} />
          </mesh>
          <pointLight position={[0, 2.85, 0]} color="#ffedb3" intensity={0.8} distance={7} decay={2} />
        </group>
      ))}

      <Html position={[0, 3.2, 25.5]} center distanceFactor={14} style={{ pointerEvents: "none" }}>
        <div
          style={{
            background: "rgba(5,8,24,0.8)",
            color: "white",
            padding: "6px 18px",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          Main Street
        </div>
      </Html>
    </group>
  );
}
