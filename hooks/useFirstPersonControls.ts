"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";
import {
  MAP_CENTER,
  MAP_ORBIT_HEIGHT,
  MAP_ORBIT_PERIOD,
  MAP_ORBIT_RADIUS,
  PLAYER_START,
  wallSegments,
} from "@/lib/building";

const PLAYER_RADIUS = 0.4;
const MAX_SPEED = 4.2;
const AUTOPILOT_SPEED = 3.6;
const ACCELERATION = 18;
const DAMPING = 10;
const ARRIVE_THRESHOLD = 0.35;
const AUTOPILOT_TURN_RATE = 5;
const LOOK_SENSITIVITY = 0.0025;
const LOOK_INERTIA_DAMPING = 6;
const PITCH_LIMIT = Math.PI / 2 - 0.15;
const HEAD_BOB_FREQUENCY = 7.5;
const HEAD_BOB_AMOUNT = 0.045;
const TRANSITION_DURATION = 1100;

function isBlocked(x: number, z: number): boolean {
  for (const wall of wallSegments) {
    if (
      x > wall.minX - PLAYER_RADIUS &&
      x < wall.maxX + PLAYER_RADIUS &&
      z > wall.minZ - PLAYER_RADIUS &&
      z < wall.maxZ + PLAYER_RADIUS
    ) {
      return true;
    }
  }
  return false;
}

function clampPitch(value: number): number {
  return Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, value));
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function wrapAngle(a: number): number {
  return a - Math.PI * 2 * Math.floor((a + Math.PI) / (Math.PI * 2));
}

function mapCameraPosition(angle: number): Vector3 {
  const [cx, cy, cz] = MAP_CENTER;
  return new Vector3(
    cx + Math.sin(angle) * MAP_ORBIT_RADIUS,
    cy + MAP_ORBIT_HEIGHT,
    cz + Math.cos(angle) * MAP_ORBIT_RADIUS
  );
}

function lookAtEuler(from: Vector3, to: Vector3): { yaw: number; pitch: number } {
  const dummy = new Object3D();
  dummy.position.copy(from);
  dummy.lookAt(to);
  dummy.rotation.order = "YXZ";
  return { yaw: dummy.rotation.y, pitch: dummy.rotation.x };
}

export type ViewMode = "fps" | "map";

export interface TeleportTarget {
  position: [number, number, number];
  yaw?: number;
}

export interface WalkTarget {
  x: number;
  z: number;
}

interface Transition {
  fromPos: Vector3;
  toPos: Vector3;
  fromYaw: number;
  toYaw: number;
  fromPitch: number;
  toPitch: number;
  start: number;
  enteringMode: ViewMode;
}

interface UseFirstPersonControlsOptions {
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

export function useFirstPersonControls({
  active,
  mode,
  moveInputRef,
  onRoomChange,
  teleportTarget,
  onTeleportComplete,
  orbitPausedRef,
  walkTargetRef,
  onArrived,
}: UseFirstPersonControlsOptions) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  // measured in radians/second, used only to coast the view after the pointer is released
  const yawInertia = useRef(0);
  const pitchInertia = useRef(0);
  const velocity = useRef({ x: 0, z: 0 });
  const bobPhase = useRef(0);
  const keys = useRef<Record<string, boolean>>({});
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const orbitAngle = useRef(0);
  const prevMode = useRef<ViewMode>(mode);
  const transition = useRef<Transition | null>(null);

  useEffect(() => {
    camera.position.set(...PLAYER_START);
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const el = gl.domElement;

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      yawInertia.current = 0;
      pitchInertia.current = 0;
      lastPointer.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const now = performance.now();
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      const dt = Math.max(1, now - lastPointer.current.t) / 1000;
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now };

      const yawDelta = -dx * LOOK_SENSITIVITY;
      const pitchDelta = -dy * LOOK_SENSITIVITY;

      yaw.current += yawDelta;
      pitch.current = clampPitch(pitch.current + pitchDelta);

      // rate of change, so releasing mid-swipe coasts smoothly instead of stopping dead
      yawInertia.current = yawDelta / dt;
      pitchInertia.current = pitchDelta / dt;
    };
    const onPointerUp = () => {
      dragging.current = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [gl]);

  // start a smooth transition whenever the view mode changes
  useEffect(() => {
    if (mode === prevMode.current) return;
    prevMode.current = mode;

    const fromPos = camera.position.clone();

    let toPos: Vector3;
    let toYaw: number;
    let toPitch: number;

    if (mode === "map") {
      toPos = mapCameraPosition(orbitAngle.current);
      const look = lookAtEuler(toPos, new Vector3(...MAP_CENTER));
      toYaw = look.yaw;
      toPitch = look.pitch;
    } else {
      const target = teleportTarget?.position ?? PLAYER_START;
      toPos = new Vector3(...target);
      toYaw = teleportTarget?.yaw ?? 0;
      toPitch = 0;
    }

    transition.current = {
      fromPos,
      toPos,
      fromYaw: yaw.current,
      toYaw,
      fromPitch: pitch.current,
      toPitch,
      start: performance.now(),
      enteringMode: mode,
    };
  }, [mode, teleportTarget, camera]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);

    if (!active) {
      camera.position.set(...PLAYER_START);
      camera.rotation.set(0, 0, 0);
      velocity.current.x = 0;
      velocity.current.z = 0;
      return;
    }

    if (transition.current) {
      const tr = transition.current;
      const progress = Math.min(1, (performance.now() - tr.start) / TRANSITION_DURATION);
      const eased = easeInOutCubic(progress);

      camera.position.lerpVectors(tr.fromPos, tr.toPos, eased);
      yaw.current = tr.fromYaw + (tr.toYaw - tr.fromYaw) * eased;
      pitch.current = tr.fromPitch + (tr.toPitch - tr.fromPitch) * eased;
      camera.rotation.order = "YXZ";
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;

      if (progress >= 1) {
        transition.current = null;
        velocity.current.x = 0;
        velocity.current.z = 0;
        if (tr.enteringMode === "fps") onTeleportComplete?.();
      }
      return;
    }

    if (mode === "map") {
      if (!orbitPausedRef?.current) {
        orbitAngle.current += (delta * Math.PI * 2) / MAP_ORBIT_PERIOD;
      }
      const pos = mapCameraPosition(orbitAngle.current);
      camera.position.copy(pos);
      camera.lookAt(...MAP_CENTER);
      return;
    }

    if (!dragging.current && (yawInertia.current !== 0 || pitchInertia.current !== 0)) {
      yaw.current += yawInertia.current * delta;
      pitch.current = clampPitch(pitch.current + pitchInertia.current * delta);
      const decay = Math.exp(-LOOK_INERTIA_DAMPING * delta);
      yawInertia.current *= decay;
      pitchInertia.current *= decay;
      if (Math.abs(yawInertia.current) < 0.001) yawInertia.current = 0;
      if (Math.abs(pitchInertia.current) < 0.001) pitchInertia.current = 0;
    }

    const keyForward =
      (keys.current["KeyW"] || keys.current["ArrowUp"] ? 1 : 0) -
      (keys.current["KeyS"] || keys.current["ArrowDown"] ? 1 : 0);
    const keyStrafe =
      (keys.current["KeyD"] || keys.current["ArrowRight"] ? 1 : 0) -
      (keys.current["KeyA"] || keys.current["ArrowLeft"] ? 1 : 0);

    const joyX = moveInputRef.current?.x ?? 0;
    const joyY = moveInputRef.current?.y ?? 0;

    let manualForward = keyForward - joyY;
    let manualStrafe = keyStrafe + joyX;
    const manualMagnitude = Math.hypot(manualForward, manualStrafe);
    if (manualMagnitude > 1) {
      manualForward /= manualMagnitude;
      manualStrafe /= manualMagnitude;
    }

    // pressing a key or dragging the joystick always takes over from an autopilot glide
    if (manualMagnitude > 0.05 && walkTargetRef?.current) {
      walkTargetRef.current = null;
    }

    const pos = camera.position;
    const wasAutopilot = !!walkTargetRef?.current;
    let targetVx: number;
    let targetVz: number;

    if (walkTargetRef?.current) {
      const target = walkTargetRef.current;
      const toX = target.x - pos.x;
      const toZ = target.z - pos.z;
      const dist = Math.hypot(toX, toZ);

      if (dist < ARRIVE_THRESHOLD) {
        walkTargetRef.current = null;
        targetVx = 0;
        targetVz = 0;
        onArrived?.();
      } else {
        const dirX = toX / dist;
        const dirZ = toZ / dist;
        targetVx = dirX * AUTOPILOT_SPEED;
        targetVz = dirZ * AUTOPILOT_SPEED;

        // smoothly turn to face the direction we're walking, like a real footstep tour
        const desiredYaw = Math.atan2(-dirX, -dirZ);
        const yawDelta = wrapAngle(desiredYaw - yaw.current);
        yaw.current += yawDelta * Math.min(1, AUTOPILOT_TURN_RATE * delta);
      }
    } else {
      const sinYaw = Math.sin(yaw.current);
      const cosYaw = Math.cos(yaw.current);
      targetVx = (-sinYaw * manualForward + cosYaw * manualStrafe) * MAX_SPEED;
      targetVz = (-cosYaw * manualForward - sinYaw * manualStrafe) * MAX_SPEED;
    }

    const moving = wasAutopilot || manualMagnitude > 0.05;
    const rate = moving ? ACCELERATION : DAMPING;
    velocity.current.x += (targetVx - velocity.current.x) * Math.min(1, rate * delta);
    velocity.current.z += (targetVz - velocity.current.z) * Math.min(1, rate * delta);

    const dx = velocity.current.x * delta;
    const dz = velocity.current.z * delta;

    let blockedX = false;
    let blockedZ = false;
    if (!isBlocked(pos.x + dx, pos.z)) {
      pos.x += dx;
    } else {
      velocity.current.x = 0;
      blockedX = true;
    }
    if (!isBlocked(pos.x, pos.z + dz)) {
      pos.z += dz;
    } else {
      velocity.current.z = 0;
      blockedZ = true;
    }

    // give up gracefully if a glide target turns out to be unreachable (e.g. right at a wall)
    if (wasAutopilot && walkTargetRef?.current && blockedX && blockedZ) {
      walkTargetRef.current = null;
      onArrived?.();
    }

    const speed = Math.hypot(velocity.current.x, velocity.current.z);
    bobPhase.current += delta * HEAD_BOB_FREQUENCY * Math.min(1, speed / MAX_SPEED);
    const bob = speed > 0.1 ? Math.sin(bobPhase.current) * HEAD_BOB_AMOUNT * Math.min(1, speed / MAX_SPEED) : 0;
    pos.y = PLAYER_START[1] + bob;

    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;

    onRoomChange?.(pos.x, pos.z);
  });
}
