import {
  GridTemplate,
  Puzzle,
  FullPuzzle,
  PuzzleWordWithPosition,
  GridCell,
} from "./types";
import { TEMPLATES, getTemplateById } from "@/data/templates";

export function loadPuzzle(puzzleId: string): FullPuzzle | null {
  // Dynamic import of puzzle data
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const puzzleData = require(`@/data/puzzles/${puzzleId}.json`) as Puzzle;
    const template = getTemplateById(puzzleData.templateId);

    if (!template) {
      console.error(`Template not found: ${puzzleData.templateId}`);
      return null;
    }

    return mergeWithTemplate(puzzleData, template);
  } catch (error) {
    console.error(`Failed to load puzzle: ${puzzleId}`, error);
    return null;
  }
}

export function mergeWithTemplate(
  puzzle: Puzzle,
  template: GridTemplate
): FullPuzzle {
  const slotMap = new Map(template.slots.map((s) => [s.id, s]));

  // Assign numbers to slots based on position
  const numberedPositions = new Map<string, number>();
  let currentNumber = 1;

  // Sort slots by position (top-to-bottom, left-to-right)
  const sortedSlots = [...template.slots].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });

  for (const slot of sortedSlots) {
    const posKey = `${slot.row},${slot.col}`;
    if (!numberedPositions.has(posKey)) {
      numberedPositions.set(posKey, currentNumber++);
    }
  }

  const words: PuzzleWordWithPosition[] = puzzle.words.map((word) => {
    const slot = slotMap.get(word.slotId);
    if (!slot) {
      throw new Error(`Slot not found: ${word.slotId}`);
    }

    const posKey = `${slot.row},${slot.col}`;
    const number = numberedPositions.get(posKey) || 0;

    return {
      ...word,
      number,
      direction: slot.direction,
      row: slot.row,
      col: slot.col,
      length: slot.length,
    };
  });

  return {
    puzzle,
    template,
    words,
  };
}

export function generateGrid(fullPuzzle: FullPuzzle): GridCell[][] {
  const { template, words } = fullPuzzle;
  const size = template.size;

  // Initialize grid
  const grid: GridCell[][] = Array(size)
    .fill(null)
    .map(() =>
      Array(size)
        .fill(null)
        .map(() => ({
          isCell: true,
          isBlack: false,
          letter: "",
          correctLetter: "",
          number: null,
          filled: false,
          hinted: false,
        }))
    );

  // Mark black squares
  for (const [row, col] of template.blackSquares) {
    grid[row][col] = {
      isCell: false,
      isBlack: true,
      letter: "",
      correctLetter: "",
      number: null,
      filled: false,
      hinted: false,
    };
  }

  // Fill in correct letters and numbers
  for (const word of words) {
    const { row, col, direction, answer, number } = word;

    // Set the number on the first cell
    if (grid[row][col].number === null) {
      grid[row][col].number = number;
    }

    // Fill in letters
    for (let i = 0; i < answer.length; i++) {
      const r = direction === "across" ? row : row + i;
      const c = direction === "across" ? col + i : col;

      if (r < size && c < size) {
        grid[r][c].correctLetter = answer[i];
      }
    }
  }

  return grid;
}

export function getAllTemplates(): GridTemplate[] {
  return TEMPLATES;
}

export function getWordAtPosition(
  words: PuzzleWordWithPosition[],
  row: number,
  col: number,
  direction: "across" | "down"
): PuzzleWordWithPosition | undefined {
  return words.find((word) => {
    if (word.direction !== direction) return false;

    if (direction === "across") {
      return (
        word.row === row && col >= word.col && col < word.col + word.length
      );
    } else {
      return (
        word.col === col && row >= word.row && row < word.row + word.length
      );
    }
  });
}

export function getWordsAtCell(
  words: PuzzleWordWithPosition[],
  row: number,
  col: number
): { across?: PuzzleWordWithPosition; down?: PuzzleWordWithPosition } {
  return {
    across: getWordAtPosition(words, row, col, "across"),
    down: getWordAtPosition(words, row, col, "down"),
  };
}

export function isWordComplete(
  word: PuzzleWordWithPosition,
  grid: GridCell[][]
): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = word.direction === "across" ? word.row : word.row + i;
    const c = word.direction === "across" ? word.col + i : word.col;

    if (!grid[r][c].letter) return false;
  }
  return true;
}

export function isWordCorrect(
  word: PuzzleWordWithPosition,
  grid: GridCell[][]
): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = word.direction === "across" ? word.row : word.row + i;
    const c = word.direction === "across" ? word.col + i : word.col;

    if (
      grid[r][c].letter.toUpperCase() !== grid[r][c].correctLetter.toUpperCase()
    ) {
      return false;
    }
  }
  return true;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
