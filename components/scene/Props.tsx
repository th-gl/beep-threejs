"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { createDashboardTexture, createLogoTexture } from "@/lib/signageTexture";

const METAL = "#8b5e42";
const METAL_LIGHT = "#c9a878";
const VEHICLE_PAINT = "#fbbf24";

export function Props() {
  const logoTexture = useMemo(() => createLogoTexture(), []);
  const dashboardTexture = useMemo(() => createDashboardTexture("#a78bfa"), []);

  return (
    <group>
      {/* Welcome Bay — reception desk + bench + logo signage */}
      <RoundedBox args={[2.2, 1, 0.7]} radius={0.08} position={[0, 0.5, 6]} castShadow receiveShadow>
        <meshPhysicalMaterial color={METAL} roughness={0.4} clearcoat={0.4} />
      </RoundedBox>
      <mesh position={[0, 1.02, 5.7]}>
        <boxGeometry args={[1.6, 0.05, 0.3]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 2.6, 7.75]}>
        <planeGeometry args={[3.4, 1.06]} />
        <meshBasicMaterial map={logoTexture} transparent toneMapped={false} />
      </mesh>
      <RoundedBox args={[1.6, 0.5, 0.6]} radius={0.1} position={[-4.5, 0.25, 3]} castShadow receiveShadow>
        <meshPhysicalMaterial color={METAL_LIGHT} roughness={0.45} clearcoat={0.3} />
      </RoundedBox>

      {/* Workshop — car-like vehicle blockout + tool cart */}
      <group position={[0.5, 0, -4]}>
        <RoundedBox args={[2.4, 0.65, 4]} radius={0.25} position={[0, 0.45, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color={VEHICLE_PAINT} roughness={0.25} clearcoat={0.9} clearcoatRoughness={0.1} metalness={0.2} />
        </RoundedBox>
        <RoundedBox args={[1.7, 0.5, 1.6]} radius={0.2} position={[0, 0.98, -0.75]} castShadow receiveShadow>
          <meshPhysicalMaterial color={VEHICLE_PAINT} roughness={0.25} clearcoat={0.9} clearcoatRoughness={0.1} metalness={0.2} />
        </RoundedBox>
        <mesh position={[0, 0.98, -0.75]}>
          <boxGeometry args={[1.75, 0.35, 1.65]} />
          <meshPhysicalMaterial color="#3b2f2a" roughness={0.1} transparent opacity={0.55} />
        </mesh>
        {/* sloped hood tapering down to the front bumper */}
        <mesh position={[0, 0.62, 1.55]} rotation={[0.32, 0, 0]} castShadow>
          <boxGeometry args={[2.2, 0.12, 1]} />
          <meshPhysicalMaterial color={VEHICLE_PAINT} roughness={0.25} clearcoat={0.9} clearcoatRoughness={0.1} metalness={0.2} />
        </mesh>
        <RoundedBox args={[2.3, 0.3, 0.2]} radius={0.06} position={[0, 0.25, 1.95]} castShadow>
          <meshPhysicalMaterial color="#3b2f2a" roughness={0.3} metalness={0.4} />
        </RoundedBox>
        {[-0.85, 0.85].map((x) => (
          <mesh key={x} position={[x, 0.32, 1.97]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1.6} />
          </mesh>
        ))}
        <RoundedBox args={[2.2, 0.06, 0.12]} radius={0.02} position={[0, 1.28, -1.85]} castShadow>
          <meshStandardMaterial color="#3b2f2a" roughness={0.4} metalness={0.5} />
        </RoundedBox>
        {[
          [-1.2, 0.32, 1.5],
          [1.2, 0.32, 1.5],
          [-1.2, 0.32, -1.5],
          [1.2, 0.32, -1.5],
        ].map((pos) => (
          <mesh key={pos.join(",")} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.32, 20]} />
            <meshStandardMaterial color="#2b2320" roughness={0.9} />
          </mesh>
        ))}
      </group>
      <RoundedBox args={[1, 0.8, 0.6]} radius={0.08} position={[4.3, 0.4, -8.5]} castShadow receiveShadow>
        <meshPhysicalMaterial color={METAL} roughness={0.4} clearcoat={0.3} />
      </RoundedBox>

      {/* Dispatch Control — desks + tracking monitor */}
      <group position={[1.5, 0, -14]}>
        <RoundedBox args={[2, 0.9, 0.8]} radius={0.1} castShadow receiveShadow>
          <meshPhysicalMaterial color={METAL} roughness={0.4} clearcoat={0.4} />
        </RoundedBox>
        <RoundedBox args={[1.4, 0.7, 0.06]} radius={0.04} position={[0, 0.8, -0.3]} castShadow>
          <meshStandardMaterial
            map={dashboardTexture}
            emissiveMap={dashboardTexture}
            emissive="#a78bfa"
            emissiveIntensity={0.9}
            color="#ffffff"
            roughness={0.3}
          />
        </RoundedBox>
      </group>
      <mesh position={[-2.5, 0.25, -19.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.5, 16]} />
        <meshPhysicalMaterial color={METAL_LIGHT} roughness={0.4} clearcoat={0.3} />
      </mesh>
    </group>
  );
}
