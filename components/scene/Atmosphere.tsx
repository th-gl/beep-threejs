"use client";

import { Sparkles } from "@react-three/drei";
import { DoubleSide } from "three";
import { rooms, WALL_HEIGHT } from "@/lib/building";

export function Atmosphere() {
  return (
    <group>
      {rooms.map((room) => {
        const width = room.bounds.maxX - room.bounds.minX;
        const depth = room.bounds.maxZ - room.bounds.minZ;
        const centerX = (room.bounds.minX + room.bounds.maxX) / 2;
        const centerZ = (room.bounds.minZ + room.bounds.maxZ) / 2;
        const openingWidth = width - 2;
        const openingDepth = depth - 2;

        return (
          <group key={room.id}>
            <Sparkles
              count={40}
              scale={[openingWidth * 0.9, WALL_HEIGHT - 0.6, openingDepth * 0.9]}
              position={[centerX, WALL_HEIGHT / 2 - 0.2, centerZ]}
              size={2}
              speed={0.15}
              opacity={0.5}
              color={room.accentColor}
            />
            <mesh position={[centerX, WALL_HEIGHT / 2, centerZ]}>
              <coneGeometry args={[Math.min(openingWidth, openingDepth) * 0.55, WALL_HEIGHT, 4, 1, true]} />
              <meshBasicMaterial
                color={room.accentColor}
                transparent
                opacity={0.05}
                side={DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}

      {/* welding-spark burst near the vehicle in the workshop */}
      <Sparkles
        count={14}
        scale={[0.6, 0.5, 0.6]}
        position={[1.4, 0.5, -4.4]}
        size={4}
        speed={1.4}
        opacity={0.9}
        color="#fb923c"
      />
    </group>
  );
}
