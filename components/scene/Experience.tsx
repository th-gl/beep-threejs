"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { rooms, PLAYER_START } from "@/lib/building";
import { characters, collectibles, type Character, type Collectible } from "@/lib/content";
import { Room } from "./Room";
import { Walls } from "./Walls";
import { Props } from "./Props";
import { Atmosphere } from "./Atmosphere";
import { Character3D } from "./Character3D";
import { Collectible3D } from "./Collectible3D";
import { ExpansionSignage } from "./ExpansionSignage";
import { MapHotspots } from "./MapHotspots";
import { Street } from "./Street";
import { BuildingExterior } from "./BuildingExterior";
import { WalkMarker } from "./WalkMarker";
import { PlayerRig } from "./PlayerRig";
import { PostFX } from "./PostFX";
import type { TeleportTarget, ViewMode, WalkTarget } from "@/hooks/useFirstPersonControls";

interface ExperienceProps {
  active: boolean;
  mode: ViewMode;
  moveInputRef: React.RefObject<{ x: number; y: number }>;
  onSelectCharacter: (character: Character) => void;
  onRoomChange?: (x: number, z: number) => void;
  collectedIds: Set<string>;
  onCollect: (collectible: Collectible) => void;
  onEnterRoom: (roomId: string) => void;
  teleportTarget?: TeleportTarget | null;
  onTeleportComplete?: () => void;
  onWalkTo: (x: number, z: number) => void;
  walkTarget: WalkTarget | null;
  walkTargetRef: React.RefObject<WalkTarget | null>;
  onArrived: () => void;
}

export function Experience({
  active,
  mode,
  moveInputRef,
  onSelectCharacter,
  onRoomChange,
  collectedIds,
  onCollect,
  onEnterRoom,
  teleportTarget,
  onTeleportComplete,
  onWalkTo,
  walkTarget,
  walkTargetRef,
  onArrived,
}: ExperienceProps) {
  const orbitPausedRef = useRef(false);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      camera={{ position: PLAYER_START, fov: 75, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#bce6ff"]} />
      <fog attach="fog" args={mode === "map" ? ["#bce6ff", 45, 95] : ["#bce6ff", 22, 48]} />
      <ambientLight intensity={0.9} color="#fff6e6" />
      <hemisphereLight color="#ffffff" groundColor="#f2d9b3" intensity={0.7} />
      <directionalLight position={[10, 18, 8]} intensity={1.3} color="#fff4e0" castShadow />
      <directionalLight position={[-8, 10, -14]} intensity={0.25} color="#dceeff" />

      <Suspense fallback={null}>
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={1.4} color="#38bdf8" scale={[10, 4, 1]} position={[0, 8, 3]} rotation={[Math.PI / 2, 0, 0]} />
          <Lightformer form="rect" intensity={1.1} color="#fbbf24" scale={[10, 4, 1]} position={[0, 8, -7]} rotation={[Math.PI / 2, 0, 0]} />
          <Lightformer form="rect" intensity={1.1} color="#a78bfa" scale={[10, 4, 1]} position={[0, 8, -17]} rotation={[Math.PI / 2, 0, 0]} />
          <Lightformer form="ring" intensity={1.5} color="#fff8ec" scale={4} position={[0, 3, 10]} />
        </Environment>
      </Suspense>

      {rooms.map((room) => (
        <Room key={room.id} room={room} onWalkTo={onWalkTo} />
      ))}

      <Walls />
      <Street onWalkTo={onWalkTo} />
      <BuildingExterior />
      <Props />
      <Atmosphere />
      <ExpansionSignage />

      {characters.map((character) => (
        <Character3D key={character.id} character={character} onSelect={onSelectCharacter} />
      ))}

      {collectibles
        .filter((c) => !collectedIds.has(c.id))
        .map((collectible) => (
          <Collectible3D key={collectible.id} collectible={collectible} onCollect={onCollect} />
        ))}

      <WalkMarker target={walkTarget} />

      <MapHotspots
        visible={mode === "map"}
        onEnterRoom={onEnterRoom}
        orbitPausedRef={orbitPausedRef}
      />

      <PlayerRig
        active={active}
        mode={mode}
        moveInputRef={moveInputRef}
        onRoomChange={onRoomChange}
        teleportTarget={teleportTarget}
        onTeleportComplete={onTeleportComplete}
        orbitPausedRef={orbitPausedRef}
        walkTargetRef={walkTargetRef}
        onArrived={onArrived}
      />

      <PostFX />
    </Canvas>
  );
}
