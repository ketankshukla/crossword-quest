import { Puzzle, FullPuzzle, PuzzleIndexEntry } from "./types";
import { getTemplateById } from "@/data/templates";
import { mergeWithTemplate } from "./puzzleUtils";
import puzzleIndex from "@/data/puzzle-index.json";

// Import all puzzle data statically for client-side loading
import geoSquare001 from "@/data/puzzles/geo-square-001.json";
import geoClassic001 from "@/data/puzzles/geo-classic-001.json";
import geoStandard001 from "@/data/puzzles/geo-standard-001.json";
import geoChallenge001 from "@/data/puzzles/geo-challenge-001.json";
import geoExpert001 from "@/data/puzzles/geo-expert-001.json";
import geoDiamond001 from "@/data/puzzles/geo-diamond-001.json";
import geoCross001 from "@/data/puzzles/geo-cross-001.json";
import geoSpiral001 from "@/data/puzzles/geo-spiral-001.json";
import geoCorners001 from "@/data/puzzles/geo-corners-001.json";
import geoBlocks001 from "@/data/puzzles/geo-blocks-001.json";
import geoStaircase001 from "@/data/puzzles/geo-staircase-001.json";
import geoMaster001 from "@/data/puzzles/geo-master-001.json";

const puzzleData: Record<string, Puzzle> = {
  "geo-square-001": geoSquare001 as Puzzle,
  "geo-classic-001": geoClassic001 as Puzzle,
  "geo-standard-001": geoStandard001 as Puzzle,
  "geo-challenge-001": geoChallenge001 as Puzzle,
  "geo-expert-001": geoExpert001 as Puzzle,
  "geo-diamond-001": geoDiamond001 as Puzzle,
  "geo-cross-001": geoCross001 as Puzzle,
  "geo-spiral-001": geoSpiral001 as Puzzle,
  "geo-corners-001": geoCorners001 as Puzzle,
  "geo-blocks-001": geoBlocks001 as Puzzle,
  "geo-staircase-001": geoStaircase001 as Puzzle,
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
