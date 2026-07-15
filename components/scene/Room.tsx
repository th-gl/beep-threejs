"use client";

import { useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { DoubleSide } from "three";
import { createGridTexture } from "@/lib/gridTexture";
import { CEILING_MARGIN, WALL_HEIGHT, type Room as RoomData } from "@/lib/building";

interface RoomProps {
  room: RoomData;
  onWalkTo?: (x: number, z: number) => void;
}

export function Room({ room, onWalkTo }: RoomProps) {
  const width = room.bounds.maxX - room.bounds.minX;
  const depth = room.bounds.maxZ - room.bounds.minZ;
  const centerX = (room.bounds.minX + room.bounds.maxX) / 2;
  const centerZ = (room.bounds.minZ + room.bounds.maxZ) / 2;

  const openingWidth = width - CEILING_MARGIN * 2;
  const openingDepth = depth - CEILING_MARGIN * 2;

  const texture = useMemo(() => {
    const t = createGridTexture(room.accentColor);
    t.repeat.set(width / 2, depth / 2);
    return t;
  }, [room.accentColor, width, depth]);

  return (
    <group>
      <mesh
        position={[centerX, 0, centerZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onWalkTo?.(e.point.x, e.point.z);
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={texture} roughness={0.55} envMapIntensity={0.6} />
      </mesh>

      {/* ceiling frame (border only, leaves a skylight opening) */}
      <mesh position={[centerX, WALL_HEIGHT - 0.075, centerZ + (depth / 2 - CEILING_MARGIN / 2)]}>
        <boxGeometry args={[width, 0.15, CEILING_MARGIN]} />
        <meshStandardMaterial color="#ecdcb8" roughness={0.7} />
      </mesh>
      <mesh position={[centerX, WALL_HEIGHT - 0.075, centerZ - (depth / 2 - CEILING_MARGIN / 2)]}>
        <boxGeometry args={[width, 0.15, CEILING_MARGIN]} />
        <meshStandardMaterial color="#ecdcb8" roughness={0.7} />
      </mesh>
      <mesh position={[centerX + (width / 2 - CEILING_MARGIN / 2), WALL_HEIGHT - 0.075, centerZ]}>
        <boxGeometry args={[CEILING_MARGIN, 0.15, openingDepth]} />
        <meshStandardMaterial color="#ecdcb8" roughness={0.7} />
      </mesh>
      <mesh position={[centerX - (width / 2 - CEILING_MARGIN / 2), WALL_HEIGHT - 0.075, centerZ]}>
        <boxGeometry args={[CEILING_MARGIN, 0.15, openingDepth]} />
        <meshStandardMaterial color="#ecdcb8" roughness={0.7} />
      </mesh>

      {/* skylight glass */}
      <mesh position={[centerX, WALL_HEIGHT - 0.05, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[openingWidth, openingDepth]} />
        <meshStandardMaterial
          color={room.accentColor}
          emissive={room.accentColor}
          emissiveIntensity={0.12}
          transparent
          opacity={0.15}
          side={DoubleSide}
        />
      </mesh>

      <pointLight
        position={[centerX, 3.4, centerZ]}
        color={room.accentColor}
        intensity={1.1}
        distance={14}
        decay={2}
      />
    </group>
  );
}
