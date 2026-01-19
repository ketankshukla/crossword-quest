"use client";

import { useEffect, useState } from "react";

interface HintRevealProps {
  hint: string;
  onComplete: () => void;
}

export default function HintReveal({ hint, onComplete }: HintRevealProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-6 py-4 shadow-xl animate-hint-reveal max-w-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <span className="text-lg font-medium text-yellow-800">{hint}</span>
        </div>
      </div>
    </div>
  );
}
