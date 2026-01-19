"use client";

import Link from "next/link";
import { GridTemplate } from "@/lib/types";
import GridPreview from "./GridPreview";

interface PuzzleInfo {
  puzzleId: string;
  templateId: string;
  theme: string;
  subTheme?: string;
  difficulty: string;
}

interface PuzzleSelectorProps {
  puzzles: PuzzleInfo[];
  templates: GridTemplate[];
}

export default function PuzzleSelector({
  puzzles,
  templates,
}: PuzzleSelectorProps) {
  const templateMap = new Map(templates.map((t) => [t.id, t]));

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return {
          badge: "bg-gradient-to-r from-emerald-400 to-green-500 text-white",
          border: "from-emerald-400 to-green-500",
          emoji: "🌱",
        };
      case "medium":
        return {
          badge: "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
          border: "from-amber-400 to-orange-500",
          emoji: "🔥",
        };
      case "hard":
        return {
          badge: "bg-gradient-to-r from-red-400 to-rose-500 text-white",
          border: "from-red-400 to-rose-500",
          emoji: "💎",
        };
      default:
        return {
          badge: "bg-gray-400 text-white",
          border: "from-gray-400 to-gray-500",
          emoji: "📝",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {puzzles.map((puzzle) => {
        const template = templateMap.get(puzzle.templateId);
        const style = getDifficultyStyle(puzzle.difficulty);

        return (
          <Link
            key={puzzle.puzzleId}
            href={`/play/${puzzle.puzzleId}`}
            className="group block"
          >
            <div
              className={`bg-gradient-to-r ${style.border} p-1 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="bg-white rounded-3xl p-5 h-full">
                <div className="flex items-start gap-4">
                  {template && (
                    <div className="flex-shrink-0 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl p-2">
                      <GridPreview template={template} size={90} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{style.emoji}</span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold ${style.badge} uppercase tracking-wide`}
                      >
                        {puzzle.difficulty}
                      </span>
                    </div>
                    <h3 className="font-black text-xl text-gray-800 mb-1">
                      {puzzle.subTheme || puzzle.theme}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{puzzle.theme}</p>
                    {template && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-bold">
                          {template.size}×{template.size} grid
                        </span>
                        <span className="text-gray-400">
                          {template.slots.length} clues
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Click to start</span>
                  <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm group-hover:from-violet-600 group-hover:to-purple-700 transition-all">
                    Play Now 🎯
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
