"use client";

import { Html } from "@react-three/drei";
import { buildings, type Building } from "@/lib/building";

function doorSignPosition(building: Building): [number, number, number] {
  const { footprint, doorSide, doorCenter } = building;
  const offset = 0.6;

  switch (doorSide) {
    case "north":
      return [doorCenter, 3, footprint.maxZ + offset];
    case "south":
      return [doorCenter, 3, footprint.minZ - offset];
    case "east":
      return [footprint.maxX + offset, 3, doorCenter];
    case "west":
      return [footprint.minX - offset, 3, doorCenter];
  }
}

export function BuildingExterior() {
  return (
    <group>
      {buildings.map((building) => (
        <Html
          key={building.id}
          position={doorSignPosition(building)}
          center
          distanceFactor={12}
          occlude
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                background: "rgba(5,8,24,0.85)",
                color: "white",
                padding: "5px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: "nowrap",
                border: `1px solid ${building.exteriorColor}88`,
                boxShadow: `0 0 16px ${building.exteriorColor}33`,
              }}
            >
              {building.name}
            </div>
          </div>
        </Html>
      ))}
    </group>
  );
}
