"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import type { Character } from "@/lib/content";

interface Character3DProps {
  character: Character;
  onSelect: (character: Character) => void;
}

export function Character3D({ character, onSelect }: Character3DProps) {
  const rootRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + character.position[0] * 3;
    const root = rootRef.current;
    const leftArm = leftArmRef.current;
    const rightArm = rightArmRef.current;
    const head = headRef.current;
    if (!root || !leftArm || !rightArm || !head) return;

    // gentle breathing bob under every gesture
    root.position.y = Math.sin(t * 1.4) * 0.04;
    root.position.x = 0;
    root.position.z = 0;
    root.rotation.x = 0;
    root.rotation.y = 0;
    head.rotation.x = 0;
    head.rotation.y = 0;
    head.rotation.z = 0;

    switch (character.animation) {
      case "guide":
        // Beep sweeps an arm out like showing visitors the way in
        rightArm.rotation.x = -0.2;
        rightArm.rotation.z = -0.3 - Math.max(0, Math.sin(t * 0.8)) * 0.9;
        leftArm.rotation.x = Math.sin(t * 1.1) * 0.1 - 0.08;
        leftArm.rotation.z = 0;
        root.rotation.y = Math.sin(t * 0.35) * 0.25;
        break;

      case "greet":
        // Nora raises a hand and waves
        rightArm.rotation.x = -2.0;
        rightArm.rotation.z = Math.sin(t * 6) * 0.35;
        leftArm.rotation.x = Math.sin(t * 1.1) * 0.08 - 0.08;
        leftArm.rotation.z = 0;
        head.rotation.y = Math.sin(t * 1.2) * 0.1;
        break;

      case "wrench":
        // Rosie leans into the engine and works a wrench
        root.rotation.x = Math.sin(t * 1.2) * 0.12;
        rightArm.rotation.x = -0.9;
        rightArm.rotation.z = Math.sin(t * 3) * 0.6;
        leftArm.rotation.x = -0.5;
        leftArm.rotation.z = 0;
        break;

      case "patrol":
        // Milo shuttles back and forth ferrying parts
        root.position.z = Math.sin(t * 1.5) * 1.2;
        leftArm.rotation.x = Math.sin(t * 4) * 0.5;
        rightArm.rotation.x = Math.sin(t * 4 + Math.PI) * 0.5;
        leftArm.rotation.z = 0;
        rightArm.rotation.z = 0;
        break;

      case "point":
        // Dan gestures toward the monitor and scans for visitors
        rightArm.rotation.x = -0.4 + Math.sin(t * 0.7) * 0.5;
        rightArm.rotation.z = 0;
        leftArm.rotation.x = Math.sin(t * 1.1) * 0.08 - 0.08;
        leftArm.rotation.z = 0;
        head.rotation.y = Math.sin(t * 0.5) * 0.4;
        break;

      case "listen":
        // Ivy holds a hand to her ear on the radio
        rightArm.rotation.x = -2.1;
        rightArm.rotation.z = -0.3;
        leftArm.rotation.x = Math.sin(t * 1.1) * 0.08 - 0.08;
        leftArm.rotation.z = 0;
        head.rotation.z = Math.sin(t * 0.8) * 0.15;
        break;
    }
  });

  const scale = hovered ? 1.08 : 1;

  return (
    <group
      position={character.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(character);
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
      <group ref={rootRef} scale={scale}>
        {[-0.14, 0.14].map((x) => (
          <RoundedBox key={x} args={[0.16, 0.5, 0.18]} radius={0.06} position={[x, 0.28, 0]}>
            <meshStandardMaterial color="#3b2f2a" roughness={0.55} />
          </RoundedBox>
        ))}

        <RoundedBox args={[0.58, 0.62, 0.34]} radius={0.14} position={[0, 0.86, 0]} castShadow>
          <meshPhysicalMaterial
            color={character.color}
            roughness={0.35}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
          />
        </RoundedBox>

        <group ref={leftArmRef} position={[-0.36, 1.1, 0]}>
          <RoundedBox args={[0.14, 0.46, 0.14]} radius={0.06} position={[0, -0.22, 0]}>
            <meshStandardMaterial color={character.color} roughness={0.45} />
          </RoundedBox>
        </group>
        <group ref={rightArmRef} position={[0.36, 1.1, 0]}>
          <RoundedBox args={[0.14, 0.46, 0.14]} radius={0.06} position={[0, -0.22, 0]}>
            <meshStandardMaterial color={character.color} roughness={0.45} />
          </RoundedBox>
        </group>

        <group ref={headRef} position={[0, 1.42, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.27, 24, 24]} />
            <meshPhysicalMaterial
              color={character.color}
              roughness={0.25}
              clearcoat={0.8}
              clearcoatRoughness={0.15}
            />
          </mesh>
          <mesh position={[0, 0, 0.24]}>
            <boxGeometry args={[0.26, 0.08, 0.04]} />
            <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.4} />
          </mesh>
        </group>
      </group>

      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.56, 40]} />
        <meshBasicMaterial color={character.color} transparent opacity={hovered ? 0.85 : 0.45} />
      </mesh>

      <pointLight
        position={[0, 1.3, 0]}
        color={character.color}
        intensity={hovered ? 3.5 : 1.6}
        distance={4.5}
        decay={2}
      />

      <Html position={[0, 1.95, 0]} center distanceFactor={9} occlude style={{ pointerEvents: "none" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(5,8,24,0.85)",
            color: "white",
            padding: "5px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            border: `1px solid ${character.color}66`,
            boxShadow: `0 0 16px ${character.color}33`,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: character.color,
              boxShadow: `0 0 6px ${character.color}`,
            }}
          />
          {character.name}
        </div>
      </Html>
    </group>
  );
}
