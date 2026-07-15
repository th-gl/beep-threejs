"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character } from "@/lib/content";

interface AskPanelProps {
  character: Character;
  onBack: () => void;
  onClose: () => void;
}

type Status = "idle" | "typing" | "replied";

export function AskPanel({ character, onBack, onClose }: AskPanelProps) {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || status !== "idle") return;
    setStatus("typing");
    window.setTimeout(() => setStatus("replied"), 1100 + Math.random() * 500);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="fixed top-0 right-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#0a0f27] p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-white/50 transition hover:text-white"
        >
          <BackIcon /> Back
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-white/50 transition hover:text-white"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 text-sm font-bold text-[#050818]"
          style={{ backgroundColor: character.color }}
        >
          {character.initial}
        </span>
        <div>
          <p className="text-sm font-semibold text-white">
            Ask {character.name}
          </p>
          <p className="text-xs text-white/50">
            {character.isHuman
              ? "Answered by a real person on the team"
              : "Answered by the team behind the scenes"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4">
        {status === "idle" ? (
          <p className="text-sm text-white/50">
            Type a question below — for the real site, this connects to the
            team live, the same way a visitor in the building would just
            walk up and ask.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-cyan-400 px-4 py-2 text-sm text-[#050818]">
              {question}
            </div>
            <AnimatePresence mode="wait">
              {status === "typing" ? (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mr-auto flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3"
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-white/60"
                      style={{ animation: `typing-dot 1.1s ease-in-out ${i * 0.15}s infinite` }}
                    />
                  ))}
                  <style>{`
                    @keyframes typing-dot {
                      0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
                      30% { opacity: 1; transform: translateY(-2px); }
                    }
                  `}</style>
                </motion.div>
              ) : (
                <motion.div
                  key="reply"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2 text-sm text-white/80"
                >
                  Thanks — your question has been sent. {character.name.split(" ")[0]}
                  &rsquo;s team typically replies within a few minutes.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={status !== "idle"}
          placeholder={
            status !== "idle" ? "Question sent" : `Ask ${character.name.split(" ")[0]} anything…`
          }
          className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status !== "idle" || !question.trim()}
          className="rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#050818] transition hover:bg-cyan-300 disabled:opacity-30"
        >
          Send
        </button>
      </form>
    </motion.div>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
