"use client";

import { Html, RoundedBox } from "@react-three/drei";
import { doorways, getRoomAt, wallSegments, WALL_HEIGHT } from "@/lib/building";

const TRIM_COLOR = "#fff8ec";
const WALL_COLOR = "#f6e8d2";

export function Walls() {
  return (
    <group>
      {wallSegments.map((wall) => {
        const width = wall.maxX - wall.minX;
        const depth = wall.maxZ - wall.minZ;
        const cx = (wall.minX + wall.maxX) / 2;
        const cz = (wall.minZ + wall.maxZ) / 2;
        return (
          <group key={wall.id}>
            <RoundedBox
              args={[width, WALL_HEIGHT, depth]}
              radius={Math.min(0.08, width / 2, depth / 2)}
              position={[cx, WALL_HEIGHT / 2, cz]}
              receiveShadow
              castShadow
            >
              <meshStandardMaterial
                color={WALL_COLOR}
                roughness={0.75}
                emissive={WALL_COLOR}
                emissiveIntensity={0.08}
              />
            </RoundedBox>
            <mesh position={[cx, 0.08, cz]}>
              <boxGeometry args={[width + 0.02, 0.16, depth + 0.02]} />
              <meshStandardMaterial
                color={TRIM_COLOR}
                emissive={TRIM_COLOR}
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>
        );
      })}

      {doorways.map((door) => {
        const nextRoom = getRoomAt(0, door.z - 0.6);
        if (!nextRoom) return null;
        return (
          <group key={door.id}>
            {[door.gapMin, door.gapMax].map((x) => (
              <RoundedBox
                key={x}
                args={[0.18, WALL_HEIGHT, 0.4]}
                radius={0.05}
                position={[x, WALL_HEIGHT / 2, door.z]}
              >
                <meshStandardMaterial color={TRIM_COLOR} emissive={TRIM_COLOR} emissiveIntensity={0.35} />
              </RoundedBox>
            ))}
            <RoundedBox
              args={[door.gapMax - door.gapMin + 0.2, 0.3, 0.4]}
              radius={0.05}
              position={[(door.gapMin + door.gapMax) / 2, WALL_HEIGHT - 0.55, door.z]}
            >
              <meshStandardMaterial color={TRIM_COLOR} emissive={TRIM_COLOR} emissiveIntensity={0.35} />
            </RoundedBox>
            <Html
              position={[(door.gapMin + door.gapMax) / 2, WALL_HEIGHT - 0.9, door.z]}
              center
              distanceFactor={10}
              occlude
              style={{ pointerEvents: "none" }}
            >
              <div
                style={{
                  background: "rgba(5,8,24,0.85)",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  border: `1px solid ${nextRoom.accentColor}66`,
                }}
              >
                {nextRoom.name} →
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
