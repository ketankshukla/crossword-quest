export interface Intersection {
  slotId: string;
  position: number;
  otherPosition: number;
}

export interface Slot {
  slotId: string;
  direction: "across" | "down";
  row: number;
  col: number;
  length: number;
  number: number;
  intersections: Intersection[];
}

export interface Template {
  id: string;
  template_id: string;
  name: string;
  size: number;
  description: string;
  slots: Slot[];
  created_at?: string;
}

export interface Word {
  id: string;
  puzzle_id: string;
  slot_id: string;
  answer: string;
  clue: string;
  hint: string;
  created_at?: string;
}

export interface Puzzle {
  id: string;
  puzzle_id: string;
  template_id: string;
  theme: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  author: string;
  created_at?: string;
  words?: Word[];
}

export interface PuzzleWord {
  number: number;
  direction: "across" | "down";
  row: number;
  col: number;
  answer: string;
  clue: string;
  hint: string;
}

export interface LoadedPuzzle {
  size: number;
  theme: string;
  category: string;
  difficulty: string;
  patternId: string;
  grid: number[][];
  words: PuzzleWord[];
}

export interface GridCell {
  isCell: boolean;
  isBlack: boolean;
  letter: string;
  number: number | null;
  filled: boolean;
  correctLetter: string;
  hinted: boolean;
}

export interface CellWords {
  across: PuzzleWord | null;
  down: PuzzleWord | null;
}

export interface ScorePopupData {
  score: number;
  position: { x: string; y: string };
}

export interface GameState {
  gameStarted: boolean;
  grid: GridCell[][];
  solvedWords: Set<string>;
  score: number;
  streak: number;
  bestStreak: number;
  timer: number;
  isTimerRunning: boolean;
  hintsRevealed: Set<string>;
  selectedCellPos: { row: number; col: number };
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
