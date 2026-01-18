"use client";

import { useEffect, useState } from "react";
import { CONFETTI_COLORS } from "@/lib/constants";

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  isCircle: boolean;
}

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array(80)
        .fill(null)
        .map((_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 2 + Math.random() * 2,
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          isCircle: Math.random() > 0.5,
        }));
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animation: `fall ${p.duration}s ${p.delay}s linear forwards`,
            borderRadius: p.isCircle ? "50%" : "0%",
          }}
        />
      ))}
    </div>
  );
}
