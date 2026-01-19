// Grid cell representation
export interface GridCell {
  isCell: boolean;
  isBlack: boolean;
  letter: string;
  correctLetter: string;
  number: number | null;
  filled: boolean;
  hinted: boolean;
}

// Template slot definition
export interface TemplateSlot {
  id: string; // e.g., "A1", "D5"
  direction: "across" | "down";
  row: number;
  col: number;
  length: number;
}

// Grid template definition
export interface GridTemplate {
  id: string;
  name: string;
  size: number;
  description: string;
  blackSquares: [number, number][];
  slots: TemplateSlot[];
}

// Word entry in a puzzle
export interface PuzzleWord {
  slotId: string;
  answer: string;
  clue: string;
  hint: string;
}

// Complete puzzle data
export interface Puzzle {
  puzzleId: string;
  templateId: string;
  theme: string;
  subTheme?: string;
  difficulty: "easy" | "medium" | "hard";
  words: PuzzleWord[];
}

// Puzzle index entry
export interface PuzzleIndexEntry {
  puzzleId: string;
  templateId: string;
  theme: string;
  subTheme?: string;
  difficulty: string;
}

// Full puzzle with template (for gameplay)
export interface FullPuzzle {
  puzzle: Puzzle;
  template: GridTemplate;
  words: PuzzleWordWithPosition[];
}

// Word with calculated position info
export interface PuzzleWordWithPosition extends PuzzleWord {
  number: number;
  direction: "across" | "down";
  row: number;
  col: number;
  length: number;
}
