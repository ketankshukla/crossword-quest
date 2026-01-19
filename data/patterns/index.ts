import { patternClassic } from "./pattern-classic";
import { patternPinwheel } from "./pattern-pinwheel";
import { patternDiamond } from "./pattern-diamond";
import { patternStaircase } from "./pattern-staircase";
import { patternSpiral } from "./pattern-spiral";

export const patterns = [
  patternClassic,
  patternPinwheel,
  patternDiamond,
  patternStaircase,
  patternSpiral,
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
  patternPinwheel,
  patternDiamond,
  patternStaircase,
  patternSpiral,
};
