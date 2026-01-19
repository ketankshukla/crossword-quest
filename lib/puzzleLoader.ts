import { Puzzle, FullPuzzle, PuzzleIndexEntry } from "./types";
import { getTemplateById } from "@/data/templates";
import { mergeWithTemplate } from "./puzzleUtils";
import puzzleIndex from "@/data/puzzle-index.json";

// Import all puzzle data statically for client-side loading
import geoClassic001 from "@/data/puzzles/geo-classic-001.json";
import geoStandard001 from "@/data/puzzles/geo-standard-001.json";
import geoAdvanced001 from "@/data/puzzles/geo-advanced-001.json";
import geoMaster001 from "@/data/puzzles/geo-master-001.json";

const puzzleData: Record<string, Puzzle> = {
  "geo-classic-001": geoClassic001 as Puzzle,
  "geo-standard-001": geoStandard001 as Puzzle,
  "geo-advanced-001": geoAdvanced001 as Puzzle,
  "geo-master-001": geoMaster001 as Puzzle,
};

export function getPuzzleIndex(): PuzzleIndexEntry[] {
  return puzzleIndex as PuzzleIndexEntry[];
}

export function loadPuzzleById(puzzleId: string): FullPuzzle | null {
  const puzzle = puzzleData[puzzleId];
  if (!puzzle) {
    console.error(`Puzzle not found: ${puzzleId}`);
    return null;
  }

  const template = getTemplateById(puzzle.templateId);
  if (!template) {
    console.error(`Template not found: ${puzzle.templateId}`);
    return null;
  }

  return mergeWithTemplate(puzzle, template);
}

export function getAllPuzzleIds(): string[] {
  return Object.keys(puzzleData);
}
