import { puzzleClassic001 } from "./puzzle-classic-001";
import type { LoadedPuzzle } from "@/lib/types";

// All puzzles organized by pattern
export const puzzlesByPattern: Record<string, LoadedPuzzle[]> = {
  "pattern-classic": [puzzleClassic001],
  "pattern-diamond": [],
  "pattern-blocks": [],
  "pattern-corners": [],
  "pattern-cross": [],
};

// Get all puzzles as flat array
export const allPuzzles: LoadedPuzzle[] =
  Object.values(puzzlesByPattern).flat();

// Get random puzzle
export function getRandomPuzzle(): LoadedPuzzle {
  if (allPuzzles.length === 0) {
    return puzzleClassic001; // fallback
  }
  return allPuzzles[Math.floor(Math.random() * allPuzzles.length)];
}

// Get random puzzle for a specific pattern
export function getPuzzleForPattern(
  patternId: string
): LoadedPuzzle | undefined {
  const puzzles = puzzlesByPattern[patternId];
  if (!puzzles || puzzles.length === 0) return undefined;
  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

export { puzzleClassic001 };
