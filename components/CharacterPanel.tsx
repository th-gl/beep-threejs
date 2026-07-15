"use client";

import { motion } from "framer-motion";
import type { Character } from "@/lib/content";

interface CharacterPanelProps {
  character: Character;
  onClose: () => void;
  onAsk: () => void;
}

export function CharacterPanel({ character, onClose, onAsk }: CharacterPanelProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="fixed top-0 right-0 z-40 h-full w-full max-w-sm border-l border-white/10 bg-[#0a0f27] p-6 shadow-2xl"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 text-white/50 transition hover:text-white"
        aria-label="Close"
      >
        <CloseIcon />
      </button>

      <div className="mt-8 flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span
            className="absolute inline-flex h-full w-full animate-pulse rounded-full opacity-30"
            style={{ backgroundColor: character.color }}
          />
          <span
            className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 text-xl font-bold text-[#050818]"
            style={{ backgroundColor: character.color }}
          >
            {character.initial}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-semibold text-white">{character.name}</h3>
        <p className="mt-1 text-sm font-medium" style={{ color: character.color }}>
          {character.role}
        </p>

        {character.isHuman && (
          <span className="mt-3 rounded-full border border-violet-400/40 bg-violet-400/10 px-3 py-1 text-[11px] uppercase tracking-wide text-violet-300">
            Real person on the team
          </span>
        )}

        <p className="mt-5 text-sm leading-relaxed text-white/70">
          {character.blurb}
        </p>

        <div className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] uppercase tracking-wide text-white/40">
            On the job
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <JobLoopAnimation color={character.color} />
          </div>
        </div>

        <button
          type="button"
          onClick={onAsk}
          className="mt-8 w-full rounded-full px-6 py-3 text-sm font-semibold text-[#050818] transition hover:opacity-90"
          style={{ backgroundColor: character.color }}
        >
          Ask {character.name.split(" ")[0]} a question
        </button>
      </div>
    </motion.div>
  );
}

function JobLoopAnimation({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-1.5 h-8">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-1.5 rounded-full"
          style={{
            backgroundColor: color,
            animation: `beep-bar 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes beep-bar {
          0%, 100% { height: 6px; opacity: 0.5; }
          50% { height: 28px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
