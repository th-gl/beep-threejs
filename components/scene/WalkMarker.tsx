"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

interface WalkMarkerProps {
  target: { x: number; z: number } | null;
}

export function WalkMarker({ target }: WalkMarkerProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    const t = clock.getElapsedTime();
    group.scale.setScalar(1 + Math.sin(t * 6) * 0.08);
    group.rotation.y = t * 1.2;
  });

  if (!target) return null;

  return (
    <group ref={groupRef} position={[target.x, 0.04, target.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.32, 0.42, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.14, 24]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
