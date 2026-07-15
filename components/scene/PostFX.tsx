"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.25}
        radius={0.45}
      />
      <Vignette eskil={false} offset={0.3} darkness={0.32} />
    </EffectComposer>
  );
}
