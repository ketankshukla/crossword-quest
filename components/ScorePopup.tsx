"use client";

import type { ScorePopupData } from "@/lib/types";

interface ScorePopupProps {
  data: ScorePopupData | null;
}

export function ScorePopup({ data }: ScorePopupProps) {
  if (!data) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 animate-scoreUp"
      style={{
        left: data.position.x,
        top: data.position.y,
        transform: "translateX(-50%)",
      }}
    >
      <span className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
        +{data.score}
      </span>
    </div>
  );
}
