"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { rooms } from "@/lib/building";

interface MapHotspotsProps {
  visible: boolean;
  onEnterRoom: (roomId: string) => void;
  orbitPausedRef?: React.RefObject<boolean>;
}

export function MapHotspots({ visible, onEnterRoom, orbitPausedRef }: MapHotspotsProps) {
  if (!visible) return null;

  return (
    <group>
      {rooms.map((room) => (
        <RoomHotspot
          key={room.id}
          roomId={room.id}
          onEnterRoom={onEnterRoom}
          orbitPausedRef={orbitPausedRef}
        />
      ))}
    </group>
  );
}

function RoomHotspot({
  roomId,
  onEnterRoom,
  orbitPausedRef,
}: {
  roomId: string;
  onEnterRoom: (roomId: string) => void;
  orbitPausedRef?: React.RefObject<boolean>;
}) {
  const room = rooms.find((r) => r.id === roomId);
  const [hovered, setHovered] = useState(false);
  if (!room) return null;

  const cx = (room.bounds.minX + room.bounds.maxX) / 2;
  const cz = (room.bounds.minZ + room.bounds.maxZ) / 2;
  const width = room.bounds.maxX - room.bounds.minX - 0.6;
  const depth = room.bounds.maxZ - room.bounds.minZ - 0.6;

  return (
    <group position={[cx, 0.1, cz]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onEnterRoom(room.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          if (orbitPausedRef) orbitPausedRef.current = true;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          if (orbitPausedRef) orbitPausedRef.current = false;
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial
          color={room.accentColor}
          transparent
          opacity={hovered ? 0.32 : 0.16}
        />
      </mesh>

      <Html center distanceFactor={16} position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.15s ease",
          }}
        >
          <div
            style={{
              background: "rgba(5,8,24,0.85)",
              color: "white",
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
              border: `1px solid ${room.accentColor}88`,
              boxShadow: `0 0 20px ${room.accentColor}44`,
            }}
          >
            {room.name}
          </div>
          <div
            style={{
              color: room.accentColor,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: hovered ? 1 : 0.7,
            }}
          >
            Tap to step inside
          </div>
        </div>
      </Html>
    </group>
  );
}
