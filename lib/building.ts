export interface RoomBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface Room {
  id: string;
  eyebrow: string;
  name: string;
  description: string;
  accentColor: string;
  buildingId: string;
  bounds: RoomBounds;
  entryPosition: [number, number, number];
}

export interface WallSegment {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export type DoorSide = "north" | "south" | "east" | "west";

export interface Building {
  id: string;
  eyebrow: string;
  name: string;
  exteriorColor: string;
  footprint: RoomBounds;
  doorSide: DoorSide;
  doorCenter: number;
  doorHalfWidth: number;
}

export const WALL_HEIGHT = 4;
export const PLAYER_START: [number, number, number] = [0, 1.6, 24];

export const rooms: Room[] = [
  {
    id: "welcome-bay",
    eyebrow: "Room 1",
    name: "The Welcome Bay",
    description:
      "Kids roll in through the big garage door and meet the crew before the tour begins.",
    accentColor: "#38bdf8",
    buildingId: "beep-beep",
    bounds: { minX: -6, maxX: 6, minZ: -2, maxZ: 8 },
    entryPosition: [0, 1.6, 5],
  },
  {
    id: "workshop",
    eyebrow: "Room 2",
    name: "The Workshop",
    description:
      "The heart of the building — engines get fixed, sparks fly, and every tool has a job.",
    accentColor: "#fbbf24",
    buildingId: "beep-beep",
    bounds: { minX: -6, maxX: 6, minZ: -12, maxZ: -2 },
    entryPosition: [0, 1.6, -4],
  },
  {
    id: "dispatch",
    eyebrow: "Room 3",
    name: "Dispatch Control",
    description:
      "Every vehicle in the building gets tracked from here. This is also where you can talk to a real person on the team.",
    accentColor: "#a78bfa",
    buildingId: "beep-beep",
    bounds: { minX: -6, maxX: 6, minZ: -22, maxZ: -12 },
    entryPosition: [0, 1.6, -15],
  },
  {
    id: "fuel-station-room",
    eyebrow: "Building 2",
    name: "The Fuel Stop",
    description:
      "Every vehicle in town tops up here before a big trip — snacks included, of course.",
    accentColor: "#34d399",
    buildingId: "fuel-station",
    bounds: { minX: -22, maxX: -10, minZ: 10, maxZ: 24 },
    entryPosition: [-16, 1.6, 17],
  },
  {
    id: "firehouse-room",
    eyebrow: "Building 3",
    name: "The Firehouse",
    description:
      "Home base for the town's rescue truck — always fueled up and ready to roll.",
    accentColor: "#f87171",
    buildingId: "firehouse",
    bounds: { minX: 10, maxX: 22, minZ: 10, maxZ: 24 },
    entryPosition: [16, 1.6, 17],
  },
];

export const buildings: Building[] = [
  {
    id: "beep-beep",
    eyebrow: "Building 1",
    name: "Beep Beep's Garage",
    exteriorColor: "#38bdf8",
    footprint: { minX: -6, maxX: 6, minZ: -22, maxZ: 8 },
    doorSide: "north",
    doorCenter: 0,
    doorHalfWidth: 1.5,
  },
  {
    id: "fuel-station",
    eyebrow: "Building 2",
    name: "The Fuel Stop",
    exteriorColor: "#34d399",
    footprint: { minX: -22, maxX: -10, minZ: 10, maxZ: 24 },
    doorSide: "east",
    doorCenter: 17,
    doorHalfWidth: 1.5,
  },
  {
    id: "firehouse",
    eyebrow: "Building 3",
    name: "The Firehouse",
    exteriorColor: "#f87171",
    footprint: { minX: 10, maxX: 22, minZ: 10, maxZ: 24 },
    doorSide: "west",
    doorCenter: 17,
    doorHalfWidth: 1.5,
  },
];

const T = 0.15;

function exteriorWalls(building: Building): WallSegment[] {
  const { minX, maxX, minZ, maxZ } = building.footprint;
  const { doorSide, doorCenter: c, doorHalfWidth: h, id } = building;
  const segments: WallSegment[] = [];

  if (doorSide === "north") {
    segments.push({ id: `${id}-north-a`, minX, maxX: c - h, minZ: maxZ - T, maxZ: maxZ + T });
    segments.push({ id: `${id}-north-b`, minX: c + h, maxX, minZ: maxZ - T, maxZ: maxZ + T });
  } else {
    segments.push({ id: `${id}-north`, minX, maxX, minZ: maxZ - T, maxZ: maxZ + T });
  }

  if (doorSide === "south") {
    segments.push({ id: `${id}-south-a`, minX, maxX: c - h, minZ: minZ - T, maxZ: minZ + T });
    segments.push({ id: `${id}-south-b`, minX: c + h, maxX, minZ: minZ - T, maxZ: minZ + T });
  } else {
    segments.push({ id: `${id}-south`, minX, maxX, minZ: minZ - T, maxZ: minZ + T });
  }

  if (doorSide === "east") {
    segments.push({ id: `${id}-east-a`, minX: maxX - T, maxX: maxX + T, minZ, maxZ: c - h });
    segments.push({ id: `${id}-east-b`, minX: maxX - T, maxX: maxX + T, minZ: c + h, maxZ });
  } else {
    segments.push({ id: `${id}-east`, minX: maxX - T, maxX: maxX + T, minZ, maxZ });
  }

  if (doorSide === "west") {
    segments.push({ id: `${id}-west-a`, minX: minX - T, maxX: minX + T, minZ, maxZ: c - h });
    segments.push({ id: `${id}-west-b`, minX: minX - T, maxX: minX + T, minZ: c + h, maxZ });
  } else {
    segments.push({ id: `${id}-west`, minX: minX - T, maxX: minX + T, minZ, maxZ });
  }

  return segments;
}

export const STREET_BOUNDS: RoomBounds = { minX: -26, maxX: 26, minZ: 8, maxZ: 28 };

const streetPerimeterWalls: WallSegment[] = [
  { id: "street-north", minX: STREET_BOUNDS.minX, maxX: STREET_BOUNDS.maxX, minZ: STREET_BOUNDS.maxZ - T, maxZ: STREET_BOUNDS.maxZ + T },
  { id: "street-south-a", minX: STREET_BOUNDS.minX, maxX: -6, minZ: STREET_BOUNDS.minZ - T, maxZ: STREET_BOUNDS.minZ + T },
  { id: "street-south-b", minX: 6, maxX: STREET_BOUNDS.maxX, minZ: STREET_BOUNDS.minZ - T, maxZ: STREET_BOUNDS.minZ + T },
  { id: "street-east", minX: STREET_BOUNDS.maxX - T, maxX: STREET_BOUNDS.maxX + T, minZ: STREET_BOUNDS.minZ, maxZ: STREET_BOUNDS.maxZ },
  { id: "street-west", minX: STREET_BOUNDS.minX - T, maxX: STREET_BOUNDS.minX + T, minZ: STREET_BOUNDS.minZ, maxZ: STREET_BOUNDS.maxZ },
];

export const wallSegments: WallSegment[] = [
  // Beep Beep's Garage (interior, unchanged, now with a street-facing door on the north wall)
  { id: "west", minX: -6 - T, maxX: -6 + T, minZ: -22, maxZ: 8 },
  { id: "east", minX: 6 - T, maxX: 6 + T, minZ: -22, maxZ: 8 },
  { id: "north-a", minX: -6, maxX: -1.5, minZ: 8 - T, maxZ: 8 + T },
  { id: "north-b", minX: 1.5, maxX: 6, minZ: 8 - T, maxZ: 8 + T },
  { id: "south", minX: -6, maxX: 6, minZ: -22 - T, maxZ: -22 + T },
  { id: "boundary1-a", minX: -6, maxX: -1.5, minZ: -2 - T, maxZ: -2 + T },
  { id: "boundary1-b", minX: 1.5, maxX: 6, minZ: -2 - T, maxZ: -2 + T },
  { id: "boundary2-a", minX: -6, maxX: -1.5, minZ: -12 - T, maxZ: -12 + T },
  { id: "boundary2-b", minX: 1.5, maxX: 6, minZ: -12 - T, maxZ: -12 + T },

  // Fuel Station + Firehouse exterior shells
  ...exteriorWalls(buildings[1]),
  ...exteriorWalls(buildings[2]),

  // the street/town perimeter
  ...streetPerimeterWalls,
];

export interface Doorway {
  id: string;
  z: number;
  gapMin: number;
  gapMax: number;
}

export const doorways: Doorway[] = [
  { id: "doorway-1", z: -2, gapMin: -1.5, gapMax: 1.5 },
  { id: "doorway-2", z: -12, gapMin: -1.5, gapMax: 1.5 },
];

export const CEILING_MARGIN = 1;

export const MAP_CENTER: [number, number, number] = [0, 0, 3];
export const MAP_ORBIT_RADIUS = 30;
export const MAP_ORBIT_HEIGHT = 28;
export const MAP_ORBIT_PERIOD = 60;

export function getRoomAt(x: number, z: number): Room | null {
  return (
    rooms.find(
      (room) =>
        x >= room.bounds.minX &&
        x <= room.bounds.maxX &&
        z >= room.bounds.minZ &&
        z <= room.bounds.maxZ
    ) ?? null
  );
}
