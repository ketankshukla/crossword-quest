"use client";

import { useState, useEffect, useCallback } from "react";
import { SCORING } from "@/lib/constants";
import type {
  GridCell,
  PuzzleWord,
  LoadedPuzzle,
  ScorePopupData,
  CellWords,
} from "@/lib/types";

function generateGrid(puzzleData: LoadedPuzzle): GridCell[][] {
  const { size, words } = puzzleData;

  const grid: GridCell[][] = Array(size)
    .fill(null)
    .map(() =>
      Array(size)
        .fill(null)
        .map(() => ({
          isCell: false,
          isBlack: true,
          letter: "",
          number: null,
          filled: false,
          correctLetter: "",
          hinted: false,
        }))
    );

  const numberedCells: Record<string, number> = {};

  words.forEach((word) => {
    const { answer, row, col, direction, number } = word;
    for (let i = 0; i < answer.length; i++) {
      const r = direction === "across" ? row : row + i;
      const c = direction === "across" ? col + i : col;

      if (r < size && c < size) {
        grid[r][c].isCell = true;
        grid[r][c].isBlack = false;
        grid[r][c].correctLetter = answer[i];

        if (i === 0) {
          const cellKey = `${r}-${c}`;
          if (!numberedCells[cellKey]) {
            numberedCells[cellKey] = number;
            grid[r][c].number = number;
          }
        }
      }
    }
  });

  return grid;
}

export function useCrosswordGame(puzzleData: LoadedPuzzle | null) {
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [solvedWords, setSolvedWords] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cellWords, setCellWords] = useState<CellWords>({
    across: null,
    down: null,
  });
  const [inputValues, setInputValues] = useState({ across: "", down: "" });
  const [errors, setErrors] = useState({ across: false, down: false });
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState({ across: false, down: false });

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState<Set<string>>(new Set());
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scorePopup, setScorePopup] = useState<ScorePopupData | null>(null);
  const [selectedCellPos, setSelectedCellPos] = useState({ row: 0, col: 0 });

  const totalWords = puzzleData?.words.length || 0;
  const completedCount = solvedWords.size;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && completedCount < totalWords) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, completedCount, totalWords]);

  const startGame = useCallback(() => {
    if (!puzzleData) return;
    setGrid(generateGrid(puzzleData));
    setSolvedWords(new Set());
    setGameStarted(true);
    setDialogOpen(false);
    setScore(0);
    setStreak(0);
    setTimer(0);
    setIsTimerRunning(true);
    setHintsRevealed(new Set());
    setSelectedCellPos({ row: 0, col: 0 });
  }, [puzzleData]);

  const getWordsForCell = useCallback(
    (row: number, col: number): CellWords => {
      const words: CellWords = { across: null, down: null };
      if (!puzzleData) return words;

      puzzleData.words.forEach((word) => {
        if (word.row === row && word.col === col) {
          words[word.direction] = word;
        }
      });
      return words;
    },
    [puzzleData]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const cell = grid[row]?.[col];
      if (!cell?.isCell || cell.isBlack || cell.number === null) return;

      setSelectedCellPos({ row, col });

      const words = getWordsForCell(row, col);
      if (!words.across && !words.down) return;

      const availableWords: CellWords = {
        across:
          words.across && !solvedWords.has(`${words.across.number}-across`)
            ? words.across
            : null,
        down:
          words.down && !solvedWords.has(`${words.down.number}-down`)
            ? words.down
            : null,
      };

      if (!availableWords.across && !availableWords.down) return;

      setCellWords(availableWords);
      setInputValues({ across: "", down: "" });
      setErrors({ across: false, down: false });
      setDialogOpen(true);
    },
    [grid, solvedWords, getWordsForCell]
  );

  const fillWord = useCallback(
    (word: PuzzleWord, usedHint: boolean) => {
      const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
      const { answer, row, col, direction } = word;

      for (let i = 0; i < answer.length; i++) {
        const r = direction === "across" ? row : row + i;
        const c = direction === "across" ? col + i : col;
        newGrid[r][c].letter = answer[i];
        newGrid[r][c].filled = true;
        if (usedHint) newGrid[r][c].hinted = true;
      }

      setGrid(newGrid);
    },
    [grid]
  );

  const calculateScore = useCallback(
    (word: PuzzleWord, usedHint: boolean): number => {
      const baseScore = word.answer.length * SCORING.POINTS_PER_LETTER;
      const streakBonus = streak * SCORING.STREAK_BONUS;
      const hintPenalty = usedHint ? SCORING.HINT_PENALTY : 0;
      const timeBonus =
        timer < SCORING.TIME_THRESHOLD_FAST
          ? SCORING.TIME_BONUS_FAST
          : timer < SCORING.TIME_THRESHOLD_MEDIUM
          ? SCORING.TIME_BONUS_MEDIUM
          : timer < SCORING.TIME_THRESHOLD_SLOW
          ? SCORING.TIME_BONUS_SLOW
          : 0;
      return Math.max(
        baseScore + streakBonus + hintPenalty + timeBonus,
        SCORING.MIN_SCORE
      );
    },
    [streak, timer]
  );

  const showScoreAnimation = useCallback((points: number) => {
    setScorePopup({ score: points, position: { x: "50%", y: "40%" } });
    setTimeout(() => setScorePopup(null), 1000);
  }, []);

  const handleInputChange = useCallback(
    (direction: "across" | "down", value: string) => {
      const upperValue = value.toUpperCase().replace(/[^A-Z]/g, "");
      setInputValues((prev) => ({ ...prev, [direction]: upperValue }));
      setErrors((prev) => ({ ...prev, [direction]: false }));

      const word = cellWords[direction];
      if (word && upperValue === word.answer) {
        const hintKey = `${word.number}-${direction}`;
        const usedHint = hintsRevealed.has(hintKey);
        fillWord(word, usedHint);

        const wordKey = `${word.number}-${direction}`;
        const newSolvedWords = new Set(solvedWords);
        newSolvedWords.add(wordKey);
        setSolvedWords(newSolvedWords);

        const points = calculateScore(word, usedHint);
        setScore((s) => s + points);
        showScoreAnimation(points);

        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);

        setCellWords((prev) => ({ ...prev, [direction]: null }));
        setInputValues((prev) => ({ ...prev, [direction]: "" }));

        const otherDirection = direction === "across" ? "down" : "across";
        if (!cellWords[otherDirection]) {
          setDialogOpen(false);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }

        if (newSolvedWords.size === totalWords) {
          setIsTimerRunning(false);
          setTimeout(() => {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }, 300);
        }
      }
    },
    [
      cellWords,
      hintsRevealed,
      solvedWords,
      streak,
      bestStreak,
      totalWords,
      fillWord,
      calculateScore,
      showScoreAnimation,
    ]
  );

  const handleSubmit = useCallback(
    (direction: "across" | "down") => {
      const word = cellWords[direction];
      if (!word) return;

      if (inputValues[direction] !== word.answer) {
        setErrors((prev) => ({ ...prev, [direction]: true }));
        setShake((prev) => ({ ...prev, [direction]: true }));
        setTimeout(
          () => setShake((prev) => ({ ...prev, [direction]: false })),
          500
        );
        setStreak(0);
      }
    },
    [cellWords, inputValues]
  );

  const revealHint = useCallback(
    (direction: "across" | "down") => {
      const word = cellWords[direction];
      if (!word) return;

      const hintKey = `${word.number}-${direction}`;
      const newHintsRevealed = new Set(hintsRevealed);
      newHintsRevealed.add(hintKey);
      setHintsRevealed(newHintsRevealed);
    },
    [cellWords, hintsRevealed]
  );

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return {
    gameStarted,
    grid,
    solvedWords,
    dialogOpen,
    cellWords,
    inputValues,
    errors,
    showConfetti,
    shake,
    score,
    streak,
    bestStreak,
    hintsRevealed,
    timer,
    isTimerRunning,
    scorePopup,
    selectedCellPos,
    totalWords,
    completedCount,
    startGame,
    handleCellClick,
    handleInputChange,
    handleSubmit,
    revealHint,
    closeDialog,
    setSelectedCellPos,
    setDialogOpen,
  };
}
