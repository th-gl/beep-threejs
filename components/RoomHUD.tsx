"use client";

import { buildings, type Room } from "@/lib/building";

interface RoomHUDProps {
  room: Room | null;
}

export function RoomHUD({ room }: RoomHUDProps) {
  const currentBuildingIndex = room
    ? buildings.findIndex((b) => b.id === room.buildingId)
    : -1;
  const accentColor = room?.accentColor ?? "#38bdf8";

  return (
    <div className="pointer-events-none absolute top-8 left-1/2 z-20 -translate-x-1/2 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
        {room ? room.eyebrow : "Beep Beep Town"}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white sm:text-4xl">
        {room ? room.name : "Main Street"}
      </h2>
      <p className="mx-auto mt-2 hidden max-w-md text-sm text-white/60 sm:block">
        {room
          ? room.description
          : "Walk up to any building and step through the door — everyone in town is happy to see you."}
      </p>

      <div className="mt-4 flex items-center justify-center gap-2">
        {buildings.map((b, i) => (
          <span
            key={b.id}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === currentBuildingIndex ? 22 : 8,
              backgroundColor:
                i === currentBuildingIndex ? accentColor : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      <p className="mt-4 text-[11px] tracking-wide text-white/40 uppercase">
        drag to look &middot; tap the floor to walk there
      </p>
    </div>
  );
}
