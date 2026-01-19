"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { loadPuzzleById } from "@/lib/puzzleLoader";
import CrosswordPuzzle from "@/components/CrosswordPuzzle";

export default function PlayPage() {
  const params = useParams();
  const puzzleId = params.puzzleId as string;
  const puzzle = loadPuzzleById(puzzleId);

  if (!puzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Puzzle Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn&apos;t find the puzzle you&apos;re looking for.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            ← Back to Puzzles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>←</span>
              <span className="text-2xl">🧩</span>
              <span className="font-semibold">Crossword Quest</span>
            </Link>
            <div className="text-sm text-gray-500">{puzzle.template.name}</div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <CrosswordPuzzle puzzle={puzzle} />
      </main>
    </div>
  );
}
