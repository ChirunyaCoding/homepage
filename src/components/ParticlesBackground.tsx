"use client";

import backgroundImage from "../../background.png";

export function ParticlesBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "top center",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
