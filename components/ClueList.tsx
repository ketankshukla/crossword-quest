"use client";

import type { PuzzleWord } from "@/lib/types";

interface ClueListProps {
  words: PuzzleWord[];
  direction: "across" | "down";
  solvedWords: Set<string>;
}

export function ClueList({ words, direction, solvedWords }: ClueListProps) {
  const filteredWords = words
    .filter((w) => w.direction === direction)
    .sort((a, b) => a.number - b.number);

  const isAcross = direction === "across";
  const title = isAcross ? "➡️ Across" : "⬇️ Down";
  const borderColor = isAcross ? "border-cyan-400/30" : "border-pink-400/30";
  const bgColor = isAcross ? "bg-blue-500/10" : "bg-pink-500/10";
  const titleColor = isAcross ? "text-cyan-400" : "text-pink-400";

  return (
    <div
      className={`${bgColor} backdrop-blur-sm rounded-xl p-2 border ${borderColor} overflow-auto`}
    >
      <h2
        className={`text-base font-bold ${titleColor} mb-1 sticky top-0 bg-slate-900/95 py-1 z-10`}
      >
        {title}
      </h2>
      <div className="space-y-0.5 text-xs">
        {filteredWords.map((word) => {
          const wordKey = `${word.number}-${direction}`;
          const isSolved = solvedWords.has(wordKey);

          return (
            <div
              key={wordKey}
              className={`p-1.5 rounded transition-all ${
                isSolved
                  ? "bg-green-500/30 border border-green-400/50"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="font-bold text-yellow-400">{word.number}.</span>
              <span className="text-gray-200 ml-1">{word.clue}</span>
              {isSolved && <span className="ml-1 text-green-400">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
