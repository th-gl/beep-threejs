"use client";

import { motion } from "framer-motion";
import { viralClips } from "@/lib/content";

export function ViralProof() {
  return (
    <section className="w-full bg-[#050818] px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
          Already happening
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          Kids have already made this place go viral —{" "}
          <span className="text-cyan-300">millions of views</span>, no ad
          spend.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
          This isn&rsquo;t a theory. The real building already gets filmed
          and shared constantly. A digital version built to be explored and
          screenshotted only adds fuel to what&rsquo;s already working.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {viralClips.map((clip, i) => (
          <motion.div
            key={clip.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10"
            style={{
              backgroundImage: `linear-gradient(160deg, ${
                ["#0e3a52", "#4a2a1c", "#1e2a5e", "#241a3d"][i % 4]
              } 0%, #050818 100%)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition group-hover:scale-110">
                <PlayIcon />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-xs text-white/90">{clip.caption}</p>
              <p className="mt-1 text-[11px] font-semibold text-cyan-300">
                {clip.views} views
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M8 5v14l11-7-11-7z" />
    </svg>
  );
}
