import { Puzzle, FullPuzzle, PuzzleIndexEntry } from "./types";
import { getTemplateById } from "@/data/templates";
import { mergeWithTemplate } from "./puzzleUtils";
import puzzleIndex from "@/data/puzzle-index.json";

// Import all puzzle data statically for client-side loading
import geoClassic001 from "@/data/puzzles/geo-classic-001.json";
import geoOpen001 from "@/data/puzzles/geo-open-001.json";
import geoCompact001 from "@/data/puzzles/geo-compact-001.json";
import geoDiamond001 from "@/data/puzzles/geo-diamond-001.json";
import geoMini001 from "@/data/puzzles/geo-mini-001.json";
import geoStaircase001 from "@/data/puzzles/geo-staircase-001.json";
import geoCross001 from "@/data/puzzles/geo-cross-001.json";
import geoPinwheel001 from "@/data/puzzles/geo-pinwheel-001.json";
import geoBlocks001 from "@/data/puzzles/geo-blocks-001.json";
import geoTriplestack001 from "@/data/puzzles/geo-triplestack-001.json";
import geoSpiral001 from "@/data/puzzles/geo-spiral-001.json";
import geoCorners001 from "@/data/puzzles/geo-corners-001.json";

const puzzleData: Record<string, Puzzle> = {
  "geo-classic-001": geoClassic001 as Puzzle,
  "geo-open-001": geoOpen001 as Puzzle,
  "geo-compact-001": geoCompact001 as Puzzle,
  "geo-diamond-001": geoDiamond001 as Puzzle,
  "geo-mini-001": geoMini001 as Puzzle,
  "geo-staircase-001": geoStaircase001 as Puzzle,
  "geo-cross-001": geoCross001 as Puzzle,
  "geo-pinwheel-001": geoPinwheel001 as Puzzle,
  "geo-blocks-001": geoBlocks001 as Puzzle,
  "geo-triplestack-001": geoTriplestack001 as Puzzle,
  "geo-spiral-001": geoSpiral001 as Puzzle,
  "geo-corners-001": geoCorners001 as Puzzle,
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
