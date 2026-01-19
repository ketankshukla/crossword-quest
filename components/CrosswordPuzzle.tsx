"use client";

import { useState, useEffect, useRef } from "react";
import { FullPuzzle, GridCell, PuzzleWordWithPosition } from "@/lib/types";
import { generateGrid, getWordsAtCell, formatTime } from "@/lib/puzzleUtils";
import Confetti from "./Confetti";
import ScorePopup from "./ScorePopup";
import AnswerDialog from "./AnswerDialog";

interface CrosswordPuzzleProps {
  puzzle: FullPuzzle;
}

interface ScorePopupData {
  id: number;
  points: number;
  x: number;
  y: number;
}

interface DialogState {
  row: number;
  col: number;
  cellNumber: number;
  across?: PuzzleWordWithPosition;
  down?: PuzzleWordWithPosition;
}

export default function CrosswordPuzzle({ puzzle }: CrosswordPuzzleProps) {
  const [grid, setGrid] = useState<GridCell[][]>(() => generateGrid(puzzle));
  const [solvedWords, setSolvedWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [scorePopups, setScorePopups] = useState<ScorePopupData[]>([]);
  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const popupIdRef = useRef(0);

  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlack) return;

    const { across, down } = getWordsAtCell(puzzle.words, row, col);
    const cellNumber = grid[row][col].number;

    const acrossSolved = across ? solvedWords.has(across.slotId) : true;
    const downSolved = down ? solvedWords.has(down.slotId) : true;

    if (acrossSolved && downSolved) return;

    setDialogState({
      row,
      col,
      cellNumber: cellNumber || 0,
      across,
      down,
    });
  };

  const handleClueClick = (word: PuzzleWordWithPosition) => {
    if (solvedWords.has(word.slotId)) return;

    const { across, down } = getWordsAtCell(puzzle.words, word.row, word.col);
    const cellNumber = grid[word.row][word.col].number;

    setDialogState({
      row: word.row,
      col: word.col,
      cellNumber: cellNumber || word.number,
      across,
      down,
    });
  };

  const handleCorrectAnswer = (slotId: string, answer: string) => {
    const word = puzzle.words.find((w) => w.slotId === slotId);
    if (!word || solvedWords.has(slotId)) return;

    setGrid((prev) => {
      const newGrid = prev.map((r) => r.map((c) => ({ ...c })));
      for (let i = 0; i < answer.length; i++) {
        const r = word.direction === "across" ? word.row : word.row + i;
        const c = word.direction === "across" ? word.col + i : word.col;
        newGrid[r][c].letter = answer[i];
        newGrid[r][c].filled = true;
      }
      return newGrid;
    });

    const newSolvedWords = new Set(solvedWords);
    newSolvedWords.add(slotId);
    setSolvedWords(newSolvedWords);

    const newStreak = streak + 1;
    setStreak(newStreak);
    const basePoints = word.length * 10;
    const streakBonus = Math.min(newStreak - 1, 5) * 5;
    const pointsEarned = basePoints + streakBonus;
    setScore((s) => s + pointsEarned);

    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const cellSize = rect.width / puzzle.template.size;
      const x = rect.left + word.col * cellSize + cellSize / 2;
      const y = rect.top + word.row * cellSize;
      const id = ++popupIdRef.current;
      setScorePopups((prev) => [...prev, { id, points: pointsEarned, x, y }]);
    }

    if (newSolvedWords.size === puzzle.words.length) {
      setIsComplete(true);
    }
  };

  const removeScorePopup = (id: number) => {
    setScorePopups((prev) => prev.filter((p) => p.id !== id));
  };

  const cellSize = Math.min(44, 650 / puzzle.template.size);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-6">
      {isComplete && <Confetti />}

      {scorePopups.map((popup) => (
        <ScorePopup
          key={popup.id}
          points={popup.points}
          x={popup.x}
          y={popup.y}
          onComplete={() => removeScorePopup(popup.id)}
        />
      ))}

      {dialogState && (
        <AnswerDialog
          acrossWord={dialogState.across}
          downWord={dialogState.down}
          acrossSolved={
            dialogState.across
              ? solvedWords.has(dialogState.across.slotId)
              : true
          }
          downSolved={
            dialogState.down ? solvedWords.has(dialogState.down.slotId) : true
          }
          onCorrectAnswer={handleCorrectAnswer}
          onClose={() => setDialogState(null)}
          cellNumber={dialogState.cellNumber}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 mb-2 drop-shadow-lg">
            🧩 Crossword Quest 🎯
          </h1>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="text-2xl">🌍</span>
            <span className="text-white font-bold text-lg">
              {puzzle.puzzle.theme}
            </span>
            {puzzle.puzzle.subTheme && (
              <>
                <span className="text-white/50">•</span>
                <span className="text-pink-300">{puzzle.puzzle.subTheme}</span>
              </>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-5 py-3 shadow-lg">
            <div className="text-amber-900 text-xs font-bold uppercase tracking-wider">
              🏆 Score
            </div>
            <div className="text-2xl font-black text-white">{score}</div>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-rose-500 rounded-2xl px-5 py-3 shadow-lg">
            <div className="text-rose-900 text-xs font-bold uppercase tracking-wider">
              🔥 Streak
            </div>
            <div className="text-2xl font-black text-white">{streak}</div>
          </div>
          <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl px-5 py-3 shadow-lg">
            <div className="text-cyan-900 text-xs font-bold uppercase tracking-wider">
              ⏱️ Time
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {formatTime(timer)}
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl px-5 py-3 shadow-lg">
            <div className="text-emerald-900 text-xs font-bold uppercase tracking-wider">
              ✅ Progress
            </div>
            <div className="text-2xl font-black text-white">
              {solvedWords.size}/{puzzle.words.length}
            </div>
          </div>
        </div>

        {isComplete && (
          <div className="mb-6 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-3xl p-6 text-center shadow-2xl animate-bounce-in">
            <div className="text-6xl mb-3">🎉🏆🎊</div>
            <h2 className="text-3xl font-black text-white mb-2">
              Puzzle Complete!
            </h2>
            <p className="text-xl text-emerald-900 font-bold">
              Final Score: {score} points in {formatTime(timer)}
            </p>
          </div>
        )}

        {/* Main Content - Grid and Clues Side by Side */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Grid */}
          <div className="flex-shrink-0">
            <div
              ref={gridRef}
              className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-4 shadow-2xl"
            >
              <div
                className="grid gap-0 border-4 border-gray-800 rounded-lg overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${puzzle.template.size}, ${cellSize}px)`,
                }}
              >
                {grid.map((row, rowIdx) =>
                  row.map((cell, colIdx) => {
                    const words = getWordsAtCell(puzzle.words, rowIdx, colIdx);
                    const isSolved =
                      (words.across && solvedWords.has(words.across.slotId)) ||
                      (words.down && solvedWords.has(words.down.slotId));
                    const isFullySolved =
                      (!words.across || solvedWords.has(words.across.slotId)) &&
                      (!words.down || solvedWords.has(words.down.slotId));

                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        className={`
                          relative border border-gray-400 flex items-center justify-center
                          transition-all duration-200 select-none
                          ${
                            cell.isBlack
                              ? "bg-gradient-to-br from-gray-800 to-gray-900"
                              : isFullySolved
                              ? "bg-gradient-to-br from-emerald-200 to-green-300 cursor-default"
                              : isSolved
                              ? "bg-gradient-to-br from-amber-100 to-yellow-200 hover:from-amber-200 hover:to-yellow-300 cursor-pointer"
                              : "bg-white hover:bg-violet-100 cursor-pointer hover:scale-105"
                          }
                        `}
                        style={{ width: cellSize, height: cellSize }}
                      >
                        {cell.number && (
                          <span className="absolute top-0.5 left-1 text-[9px] font-black text-violet-700">
                            {cell.number}
                          </span>
                        )}
                        {!cell.isBlack && (
                          <span
                            className={`text-lg font-black ${
                              isFullySolved
                                ? "text-emerald-700"
                                : "text-gray-800"
                            }`}
                          >
                            {cell.letter}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <p className="text-center text-white/60 text-sm mt-3">
              👆 Click any cell to answer!
            </p>
          </div>

          {/* Clues Side by Side */}
          <div className="flex-1 grid md:grid-cols-2 gap-4 w-full">
            {/* Across Clues */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-1 shadow-xl">
              <div className="bg-white rounded-3xl p-4 h-full">
                <h3 className="font-black text-xl text-amber-600 mb-4 flex items-center gap-2">
                  <span className="text-2xl">➡️</span> ACROSS
                </h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {puzzle.words
                    .filter((w) => w.direction === "across")
                    .sort((a, b) => a.number - b.number)
                    .map((word) => (
                      <div
                        key={word.slotId}
                        onClick={() => handleClueClick(word)}
                        className={`
                          p-3 rounded-xl transition-all
                          ${
                            solvedWords.has(word.slotId)
                              ? "bg-emerald-100 border-2 border-emerald-300"
                              : "bg-amber-50 border-2 border-amber-200 hover:bg-amber-100 hover:border-amber-400 cursor-pointer hover:scale-[1.02]"
                          }
                        `}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`font-black text-lg ${
                              solvedWords.has(word.slotId)
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {word.number}.
                          </span>
                          <span
                            className={`text-gray-700 leading-relaxed ${
                              solvedWords.has(word.slotId)
                                ? "line-through text-gray-400"
                                : ""
                            }`}
                          >
                            {word.clue}
                          </span>
                        </div>
                        {solvedWords.has(word.slotId) && (
                          <div className="mt-1 text-sm font-bold text-emerald-600 flex items-center gap-1">
                            ✅ {word.answer}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Down Clues */}
            <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-3xl p-1 shadow-xl">
              <div className="bg-white rounded-3xl p-4 h-full">
                <h3 className="font-black text-xl text-sky-600 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⬇️</span> DOWN
                </h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {puzzle.words
                    .filter((w) => w.direction === "down")
                    .sort((a, b) => a.number - b.number)
                    .map((word) => (
                      <div
                        key={word.slotId}
                        onClick={() => handleClueClick(word)}
                        className={`
                          p-3 rounded-xl transition-all
                          ${
                            solvedWords.has(word.slotId)
                              ? "bg-emerald-100 border-2 border-emerald-300"
                              : "bg-sky-50 border-2 border-sky-200 hover:bg-sky-100 hover:border-sky-400 cursor-pointer hover:scale-[1.02]"
                          }
                        `}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`font-black text-lg ${
                              solvedWords.has(word.slotId)
                                ? "text-emerald-600"
                                : "text-sky-600"
                            }`}
                          >
                            {word.number}.
                          </span>
                          <span
                            className={`text-gray-700 leading-relaxed ${
                              solvedWords.has(word.slotId)
                                ? "line-through text-gray-400"
                                : ""
                            }`}
                          >
                            {word.clue}
                          </span>
                        </div>
                        {solvedWords.has(word.slotId) && (
                          <div className="mt-1 text-sm font-bold text-emerald-600 flex items-center gap-1">
                            ✅ {word.answer}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
