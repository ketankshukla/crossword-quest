import { supabase } from "./supabase";
import type {
  Template,
  Puzzle,
  Word,
  LoadedPuzzle,
  PuzzleWord,
  Slot,
} from "./types";

export async function getRandomPuzzle(): Promise<LoadedPuzzle | null> {
  const { data: puzzles, error: puzzleError } = await supabase
    .from("puzzles")
    .select("*")
    .limit(100);

  if (puzzleError || !puzzles || puzzles.length === 0) {
    console.error("Error fetching puzzles:", puzzleError);
    return null;
  }

  const randomPuzzle = puzzles[
    Math.floor(Math.random() * puzzles.length)
  ] as Puzzle;
  return loadPuzzleById(randomPuzzle.puzzle_id);
}

export async function getPuzzlesByCategory(
  category: string
): Promise<Puzzle[]> {
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("category", category);

  if (error) {
    console.error("Error fetching puzzles by category:", error);
    return [];
  }

  return data as Puzzle[];
}

export async function getPuzzlesByDifficulty(
  difficulty: string
): Promise<Puzzle[]> {
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("difficulty", difficulty);

  if (error) {
    console.error("Error fetching puzzles by difficulty:", error);
    return [];
  }

  return data as Puzzle[];
}

export async function loadPuzzleById(
  puzzleId: string
): Promise<LoadedPuzzle | null> {
  const { data: puzzle, error: puzzleError } = await supabase
    .from("puzzles")
    .select("*")
    .eq("puzzle_id", puzzleId)
    .single();

  if (puzzleError || !puzzle) {
    console.error("Error fetching puzzle:", puzzleError);
    return null;
  }

  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("*")
    .eq("template_id", puzzle.template_id)
    .single();

  if (templateError || !template) {
    console.error("Error fetching template:", templateError);
    return null;
  }

  const { data: words, error: wordsError } = await supabase
    .from("words")
    .select("*")
    .eq("puzzle_id", puzzleId);

  if (wordsError || !words) {
    console.error("Error fetching words:", wordsError);
    return null;
  }

  return mergePuzzleWithTemplate(
    puzzle as Puzzle,
    template as Template,
    words as Word[]
  );
}

export function mergePuzzleWithTemplate(
  puzzle: Puzzle,
  template: Template,
  words: Word[]
): LoadedPuzzle {
  const puzzleWords: PuzzleWord[] = words.map((word) => {
    const slot = template.slots.find((s: Slot) => s.slotId === word.slot_id);
    if (!slot) {
      throw new Error(`Slot ${word.slot_id} not found in template`);
    }
    return {
      number: slot.number,
      direction: slot.direction,
      row: slot.row,
      col: slot.col,
      answer: word.answer,
      clue: word.clue,
      hint: word.hint,
    };
  });

  return {
    size: template.size,
    theme: puzzle.theme,
    category: puzzle.category,
    difficulty: puzzle.difficulty,
    words: puzzleWords,
  };
}

export async function getAllCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("puzzles")
    .select("category")
    .order("category");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  const uniqueCategories = [...new Set(data.map((p) => p.category))];
  return uniqueCategories;
}

export async function getAllTemplates(): Promise<Template[]> {
  const { data, error } = await supabase.from("templates").select("*");

  if (error) {
    console.error("Error fetching templates:", error);
    return [];
  }

  return data as Template[];
}
