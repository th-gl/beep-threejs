"use client";

import { Html, RoundedBox, Sparkles } from "@react-three/drei";

const ACCENT = "#38bdf8";

export function ExpansionSignage() {
  return (
    <group position={[0, 0, -21.8]}>
      <RoundedBox args={[2.6, 3, 0.1]} radius={0.1} position={[0, 1.6, 0]}>
        <meshStandardMaterial
          color="#0b1330"
          emissive={ACCENT}
          emissiveIntensity={0.18}
          roughness={0.6}
          transparent
          opacity={0.7}
        />
      </RoundedBox>
      <mesh position={[0, 1.6, 0.06]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.06, 1.6, 0.02]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0, 1.6, 0.06]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.06, 1.6, 0.02]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.4} />
      </mesh>

      <Sparkles count={20} scale={[2.2, 2.6, 0.6]} position={[0, 1.6, 0.3]} size={2.5} speed={0.25} opacity={0.7} color={ACCENT} />

      <Html position={[0, 0.5, 0.4]} center distanceFactor={9} occlude style={{ pointerEvents: "none" }}>
        <div
          style={{
            background: "rgba(5,8,24,0.85)",
            color: "white",
            padding: "5px 14px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            border: `1px solid ${ACCENT}66`,
          }}
        >
          Season 2 · Coming Soon
        </div>
      </Html>
    </group>
  );
}
