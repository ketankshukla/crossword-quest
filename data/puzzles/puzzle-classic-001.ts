import type { LoadedPuzzle } from "@/lib/types";
import { patternClassic } from "../patterns/pattern-classic";

// Puzzle 1 for Classic Pattern - World Capitals theme
export const puzzleClassic001: LoadedPuzzle = {
  size: 15,
  theme: "World Geography",
  category: "World Capitals",
  difficulty: "medium",
  patternId: "pattern-classic",
  grid: patternClassic.grid,
  words: [
    {
      number: 1,
      direction: "across",
      answer: "PARIS",
      clue: "🇫🇷 Capital of France",
      row: 0,
      col: 0,
      hint: "City of Light with the Eiffel Tower.",
    },
    {
      number: 6,
      direction: "across",
      answer: "RIO",
      clue: "🇧🇷 ___ de Janeiro",
      row: 0,
      col: 6,
      hint: "Brazilian city famous for Carnival.",
    },
    {
      number: 7,
      direction: "across",
      answer: "TOKYO",
      clue: "🇯🇵 Capital of Japan",
      row: 0,
      col: 10,
      hint: "Worlds most populous metro area.",
    },
    {
      number: 8,
      direction: "across",
      answer: "CAIRO",
      clue: "🇪🇬 Capital of Egypt",
      row: 1,
      col: 0,
      hint: "Near the Pyramids of Giza.",
    },
    {
      number: 9,
      direction: "across",
      answer: "SAO",
      clue: "🇧🇷 ___ Paulo",
      row: 1,
      col: 6,
      hint: "Largest city in South America.",
    },
    {
      number: 10,
      direction: "across",
      answer: "SEOUL",
      clue: "🇰🇷 Capital of South Korea",
      row: 1,
      col: 10,
      hint: "K-pop capital with Gangnam.",
    },
  ],
};
