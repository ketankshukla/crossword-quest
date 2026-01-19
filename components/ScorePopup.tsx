"use client";

import { useEffect, useState } from "react";

interface ScorePopupProps {
  points: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export default function ScorePopup({
  points,
  x,
  y,
  onComplete,
}: ScorePopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-40 animate-score-popup"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <span className="text-2xl font-bold text-green-500 drop-shadow-lg">
        +{points}
      </span>
    </div>
  );
}
