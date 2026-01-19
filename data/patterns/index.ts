import { patternClassic } from "./pattern-classic";
import { patternDiamond } from "./pattern-diamond";
import { patternBlocks } from "./pattern-blocks";
import { patternCorners } from "./pattern-corners";
import { patternCross } from "./pattern-cross";

export const patterns = [
  patternClassic,
  patternDiamond,
  patternBlocks,
  patternCorners,
  patternCross,
];

export type Pattern = typeof patternClassic;

export function getRandomPattern(): Pattern {
  return patterns[Math.floor(Math.random() * patterns.length)];
}

export function getPatternById(id: string): Pattern | undefined {
  return patterns.find((p) => p.id === id);
}

export {
  patternClassic,
  patternDiamond,
  patternBlocks,
  patternCorners,
  patternCross,
};
