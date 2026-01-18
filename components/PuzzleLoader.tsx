"use client";

import { useEffect } from "react";
import { useSupabasePuzzles } from "@/hooks/useSupabasePuzzles";
import { CrosswordPuzzle } from "./CrosswordPuzzle";

export function PuzzleLoader() {
  const { puzzle, loading, error, fetchRandomPuzzle } = useSupabasePuzzles();

  useEffect(() => {
    fetchRandomPuzzle();
  }, [fetchRandomPuzzle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🧩</div>
          <p className="text-purple-200 text-lg">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-purple-200 mb-4">
            {error ||
              "No puzzles available. Please check your Supabase configuration."}
          </p>
          <button
            onClick={fetchRandomPuzzle}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <CrosswordPuzzle puzzleData={puzzle} onNewPuzzle={fetchRandomPuzzle} />
  );
}
