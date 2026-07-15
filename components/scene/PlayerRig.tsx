"use client";

import {
  useFirstPersonControls,
  type TeleportTarget,
  type ViewMode,
  type WalkTarget,
} from "@/hooks/useFirstPersonControls";

interface PlayerRigProps {
  active: boolean;
  mode: ViewMode;
  moveInputRef: React.RefObject<{ x: number; y: number }>;
  onRoomChange?: (x: number, z: number) => void;
  teleportTarget?: TeleportTarget | null;
  onTeleportComplete?: () => void;
  orbitPausedRef?: React.RefObject<boolean>;
  walkTargetRef?: React.RefObject<WalkTarget | null>;
  onArrived?: () => void;
}

export function PlayerRig({
  active,
  mode,
  moveInputRef,
  onRoomChange,
  teleportTarget,
  onTeleportComplete,
  orbitPausedRef,
  walkTargetRef,
  onArrived,
}: PlayerRigProps) {
  useFirstPersonControls({
    active,
    mode,
    moveInputRef,
    onRoomChange,
    teleportTarget,
    onTeleportComplete,
    orbitPausedRef,
    walkTargetRef,
    onArrived,
  });
  return null;
}
