"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CollectibleHUDProps {
  collectedCount: number;
  total: number;
  toastMessage: string | null;
}

export function CollectibleHUD({ collectedCount, total, toastMessage }: CollectibleHUDProps) {
  return (
    <>
      <div className="pointer-events-none fixed top-8 right-8 z-20 flex items-center gap-2 rounded-full border border-yellow-400/30 bg-black/60 px-4 py-2 text-sm font-semibold text-yellow-300 backdrop-blur-sm">
        <span aria-hidden="true">⭐</span>
        {collectedCount}/{total} found
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="pointer-events-none fixed top-24 left-1/2 z-20 -translate-x-1/2 rounded-full border border-yellow-400/40 bg-black/80 px-5 py-2.5 text-sm font-semibold text-yellow-200 shadow-[0_0_24px_rgba(250,204,21,0.25)]"
          >
            ⭐ You found the {toastMessage}!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
