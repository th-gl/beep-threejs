export type CharacterAnimation =
  | "guide"
  | "greet"
  | "wrench"
  | "patrol"
  | "point"
  | "listen";

export interface Character {
  id: string;
  name: string;
  role: string;
  isHuman?: boolean;
  blurb: string;
  color: string;
  initial: string;
  roomId: string | null;
  position: [number, number, number];
  animation: CharacterAnimation;
}

export const characters: Character[] = [
  {
    id: "beep",
    name: "Beep",
    role: "Mascot & Tour Guide",
    blurb:
      "Beep greets every visitor at the door and leads the way through the building — the first face (well, headlight) every kid meets.",
    color: "#38bdf8",
    initial: "B",
    roomId: "welcome-bay",
    position: [-2, 0, 4],
    animation: "guide",
  },
  {
    id: "nora",
    name: "Nora",
    role: "Front Desk Lead",
    blurb:
      "Nora checks everyone in, hands out safety goggles, and keeps the whole visit running on schedule.",
    color: "#fb7185",
    initial: "N",
    roomId: "welcome-bay",
    position: [2.5, 0, 1.5],
    animation: "greet",
  },
  {
    id: "rosie",
    name: "Rosie “Wrenches” Ortiz",
    role: "Lead Mechanic",
    blurb:
      "Rosie has fixed more engines than anyone on the crew. Kids get to watch her diagnose a real problem step by step.",
    color: "#fbbf24",
    initial: "R",
    roomId: "workshop",
    position: [-2.5, 0, -5],
    animation: "wrench",
  },
  {
    id: "milo",
    name: "Milo",
    role: "Parts Runner",
    blurb:
      "Milo keeps the workshop stocked — if Rosie needs a part in ten seconds, Milo already has it in his hand.",
    color: "#34d399",
    initial: "M",
    roomId: "workshop",
    position: [2.5, 0, -8.5],
    animation: "patrol",
  },
  {
    id: "dispatch-dan",
    name: "Dispatch Dan",
    role: "Dispatch Lead — Real Person",
    isHuman: true,
    blurb:
      "Dan is a real member of Ken's team. Ask him anything about the building, the vehicles, or the crew and he'll answer you himself.",
    color: "#a78bfa",
    initial: "D",
    roomId: "dispatch",
    position: [-2, 0, -15],
    animation: "point",
  },
  {
    id: "ivy",
    name: "Ivy",
    role: "Radio Operator",
    blurb:
      "Ivy relays every request between the workshop and the road — she's the voice on the radio the whole crew listens for.",
    color: "#fb923c",
    initial: "I",
    roomId: "dispatch",
    position: [2.5, 0, -19],
    animation: "listen",
  },
  {
    id: "gus",
    name: "Gus",
    role: "Fuel Attendant",
    blurb:
      "Gus tops off every vehicle in town and always has a road-trip snack recommendation ready.",
    color: "#34d399",
    initial: "G",
    roomId: "fuel-station-room",
    position: [-14, 0, 15],
    animation: "greet",
  },
  {
    id: "chief-ember",
    name: "Chief Ember",
    role: "Fire Captain",
    blurb:
      "Chief Ember keeps the town's rescue truck ready to roll at a moment's notice — ask about the last big call.",
    color: "#f87171",
    initial: "E",
    roomId: "firehouse-room",
    position: [14, 0, 19],
    animation: "point",
  },
  {
    id: "pip",
    name: "Pip",
    role: "Neighborhood Kid",
    blurb:
      "Pip is always out exploring Main Street, usually on the way between the garage and the fuel stop.",
    color: "#fbbf24",
    initial: "P",
    roomId: null,
    position: [0, 0, 20],
    animation: "patrol",
  },
];

export interface Collectible {
  id: string;
  roomId: string;
  label: string;
  position: [number, number, number];
}

export const collectibles: Collectible[] = [
  { id: "sticker-welcome", roomId: "welcome-bay", label: "Beep Beep Sticker", position: [-5.3, 1.1, 7.3] },
  { id: "sticker-workshop", roomId: "workshop", label: "Wrench Badge", position: [-5.3, 1.1, -3] },
  { id: "sticker-dispatch", roomId: "dispatch", label: "Radio Badge", position: [5.3, 1.1, -13] },
];

export interface ViralClip {
  id: string;
  caption: string;
  views: string;
}

export const viralClips: ViralClip[] = [
  { id: "clip-1", caption: "“come see beep with me”", views: "4.2M" },
  { id: "clip-2", caption: "“the workshop is SO cool”", views: "2.8M" },
  { id: "clip-3", caption: "“i asked dan a question!!”", views: "6.1M" },
  { id: "clip-4", caption: "“we went back 3 times”", views: "1.9M" },
];
