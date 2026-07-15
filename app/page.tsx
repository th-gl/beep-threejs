"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { Hero } from "@/components/Hero";
import { CharacterPanel } from "@/components/CharacterPanel";
import { AskPanel } from "@/components/AskPanel";
import { ViralProof } from "@/components/ViralProof";
import { RoadmapSection } from "@/components/RoadmapSection";
import { ClosingCTA } from "@/components/ClosingCTA";
import { RoomHUD } from "@/components/RoomHUD";
import { CollectibleHUD } from "@/components/CollectibleHUD";
import { rooms, getRoomAt } from "@/lib/building";
import { collectibles, type Character, type Collectible } from "@/lib/content";
import type { TeleportTarget, ViewMode, WalkTarget } from "@/hooks/useFirstPersonControls";

const Experience = dynamic(
  () => import("@/components/scene/Experience").then((mod) => mod.Experience),
  { ssr: false }
);

const Loader = dynamic(
  () => import("@react-three/drei").then((mod) => mod.Loader),
  { ssr: false }
);

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("fps");
  const [teleportTarget, setTeleportTarget] = useState<TeleportTarget | null>(null);
  const [walkTarget, setWalkTarget] = useState<WalkTarget | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [asking, setAsking] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const moveInputRef = useRef({ x: 0, y: 0 });
  const walkTargetRef = useRef<WalkTarget | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeDrawer = () => {
    setSelectedCharacter(null);
    setAsking(false);
  };

  const handleCollect = (collectible: Collectible) => {
    setCollectedIds((prev) => {
      if (prev.has(collectible.id)) return prev;
      const next = new Set(prev);
      next.add(collectible.id);
      return next;
    });
    setToastMessage(collectible.label);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2400);
  };

  const handleEnterRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    setTeleportTarget({ position: room.entryPosition, yaw: 0 });
    setViewMode("fps");
  };

  const handleWalkTo = (x: number, z: number) => {
    if (viewMode !== "fps") return;
    const target = { x, z };
    walkTargetRef.current = target;
    setWalkTarget(target);
  };

  const handleArrived = () => {
    walkTargetRef.current = null;
    setWalkTarget(null);
  };

  const currentRoom = rooms.find((room) => room.id === currentRoomId) ?? null;

  return (
    <main className="relative">
      <section className="relative h-screen w-full overflow-hidden bg-[#bce6ff]">
        <div className="absolute inset-0">
          <Experience
            active={entered}
            mode={viewMode}
            moveInputRef={moveInputRef}
            onSelectCharacter={(character) => {
              setSelectedCharacter(character);
              setAsking(false);
            }}
            onRoomChange={(x, z) => {
              const room = getRoomAt(x, z);
              const id = room?.id ?? null;
              if (id !== currentRoomId) setCurrentRoomId(id);
            }}
            collectedIds={collectedIds}
            onCollect={handleCollect}
            onEnterRoom={handleEnterRoom}
            teleportTarget={teleportTarget}
            onTeleportComplete={() => setTeleportTarget(null)}
            onWalkTo={handleWalkTo}
            walkTarget={walkTarget}
            walkTargetRef={walkTargetRef}
            onArrived={handleArrived}
          />
        </div>

        {!entered && (
          <div className="absolute inset-0 z-10 bg-[#050818]/70 backdrop-blur-[2px]">
            <Hero onStepInside={() => setEntered(true)} />
          </div>
        )}

        {entered && viewMode === "fps" && <RoomHUD room={currentRoom} />}
        {entered && (
          <CollectibleHUD
            collectedCount={collectedIds.size}
            total={collectibles.length}
            toastMessage={toastMessage}
          />
        )}

        {entered && viewMode === "map" && (
          <div className="pointer-events-none absolute top-8 left-1/2 z-20 -translate-x-1/2 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
              Building overview
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Tap a room to step inside
            </h2>
          </div>
        )}

        {entered && (
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "map" ? "fps" : "map")}
            className="fixed right-8 bottom-8 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/80"
          >
            {viewMode === "map" ? "← Back to Walkthrough" : "🗺 View Map"}
          </button>
        )}

        <AnimatePresence>
          {selectedCharacter && !asking && (
            <CharacterPanel
              key="character"
              character={selectedCharacter}
              onClose={closeDrawer}
              onAsk={() => setAsking(true)}
            />
          )}
          {selectedCharacter && asking && (
            <AskPanel
              key="ask"
              character={selectedCharacter}
              onBack={() => setAsking(false)}
              onClose={closeDrawer}
            />
          )}
        </AnimatePresence>

        {selectedCharacter && (
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close panel"
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          />
        )}
      </section>

      <ViralProof />
      <RoadmapSection />
      <ClosingCTA />

      <Loader
        containerStyles={{ background: "#050818" }}
        innerStyles={{ background: "rgba(255,255,255,0.15)" }}
        barStyles={{ background: "#38bdf8" }}
        dataStyles={{ color: "white", fontSize: "12px" }}
      />
    </main>
  );
}
