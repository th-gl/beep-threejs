"use client";

import { motion } from "framer-motion";

interface HeroProps {
  onStepInside: () => void;
}

export function Hero({ onStepInside }: HeroProps) {
  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(167,139,250,0.15), transparent 45%)",
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-xs uppercase tracking-[0.4em] text-cyan-300/80"
      >
        A concept walkthrough for Ken
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative z-10 mt-4 text-5xl font-semibold tracking-tight text-white sm:text-7xl"
      >
        Beep Beep
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 mt-6 max-w-xl text-balance text-base text-white/70 sm:text-lg"
      >
        Walk down Main Street like you're really there. Look around, step
        into any building, meet the crew, and ask a real person a real
        question — the way kids already explore it in person.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        onClick={onStepInside}
        className="relative z-10 mt-10 rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold text-[#050818] transition hover:bg-cyan-300"
      >
        Step Inside
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 mt-8 text-[11px] tracking-wide text-white/40 uppercase"
      >
        drag to look &middot; tap the floor to walk there
      </motion.p>
    </section>
  );
}
