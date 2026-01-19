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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {puzzles.map((puzzle) => {
        const template = templateMap.get(puzzle.templateId);

        return (
          <Link
            key={puzzle.puzzleId}
            href={`/play/${puzzle.puzzleId}`}
            className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 hover:-translate-y-1"
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                {template && (
                  <div className="flex-shrink-0">
                    <GridPreview template={template} size={80} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {puzzle.theme}
                  </h3>
                  {puzzle.subTheme && (
                    <p className="text-sm text-gray-500 truncate">
                      {puzzle.subTheme}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(
                        puzzle.difficulty
                      )}`}
                    >
                      {puzzle.difficulty}
                    </span>
                    {template && (
                      <span className="text-xs text-gray-400">
                        {template.size}×{template.size}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100">
              <span className="text-sm font-medium text-blue-600">
                Play Now →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
