"use client";

import { motion } from "framer-motion";

interface RoadmapStep {
  id: string;
  label: string;
  status: "live" | "next";
}

const roadmap: RoadmapStep[] = [
  { id: "season-1", label: "Season 1 — this walkthrough", status: "live" },
  { id: "season-2", label: "Season 2 — new rooms & characters", status: "next" },
  { id: "songs", label: "Songs", status: "next" },
  { id: "games", label: "Mini-games", status: "next" },
  { id: "books", label: "Story books", status: "next" },
  { id: "merch", label: "Merchandise", status: "next" },
];

export function RoadmapSection() {
  return (
    <section className="w-full border-t border-white/10 bg-[#050818] px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
          Built to last
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          This isn&rsquo;t a one-off site — it&rsquo;s a{" "}
          <span className="text-cyan-300">world that grows</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
          Every room, character, and doorway is data-driven. Adding Season 2,
          a new game, or a merchandise drop is a content update, not a
          rebuild — the same foundation keeps working whether this is year
          one or year ten.
        </p>
      </div>

      <div className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-3">
        {roadmap.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex items-center gap-3"
          >
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                step.status === "live"
                  ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-200"
                  : "border-white/15 bg-white/5 text-white/50"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  step.status === "live" ? "bg-cyan-300" : "bg-white/30"
                }`}
              />
              {step.label}
              {step.status === "live" && (
                <span className="ml-1 text-[10px] font-semibold tracking-wide text-cyan-300 uppercase">
                  live
                </span>
              )}
            </div>
            {i < roadmap.length - 1 && (
              <span className="hidden text-white/20 sm:inline">→</span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
