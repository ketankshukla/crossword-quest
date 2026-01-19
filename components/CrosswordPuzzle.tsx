"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FullPuzzle, GridCell, PuzzleWordWithPosition } from "@/lib/types";
import {
  generateGrid,
  getWordsAtCell,
  isWordComplete,
  isWordCorrect,
  formatTime,
} from "@/lib/puzzleUtils";
import Confetti from "./Confetti";
import ScorePopup from "./ScorePopup";
import HintReveal from "./HintReveal";

interface CrosswordPuzzleProps {
  puzzle: FullPuzzle;
}

interface ScorePopupData {
  id: number;
  points: number;
  x: number;
  y: number;
}

export default function CrosswordPuzzle({ puzzle }: CrosswordPuzzleProps) {
  const [grid, setGrid] = useState<GridCell[][]>(() => generateGrid(puzzle));
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [solvedWords, setSolvedWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [scorePopups, setScorePopups] = useState<ScorePopupData[]>([]);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);
  const popupIdRef = useRef(0);

  // Timer
  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell || isComplete) return;

      const { row, col } = selectedCell;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveToNextCell(row, col, "up");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        moveToNextCell(row, col, "down");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveToNextCell(row, col, "left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveToNextCell(row, col, "right");
      } else if (e.key === "Tab") {
        e.preventDefault();
        setDirection((d) => (d === "across" ? "down" : "across"));
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleLetterInput(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, direction, grid, isComplete]);

  const moveToNextCell = (
    row: number,
    col: number,
    dir: "up" | "down" | "left" | "right"
  ) => {
    const size = puzzle.template.size;
    let newRow = row;
    let newCol = col;

    do {
      if (dir === "up") newRow--;
      else if (dir === "down") newRow++;
      else if (dir === "left") newCol--;
      else if (dir === "right") newCol++;

      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) return;
    } while (grid[newRow][newCol].isBlack);

    setSelectedCell({ row: newRow, col: newCol });
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlack) return;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      setDirection((d) => (d === "across" ? "down" : "across"));
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleLetterInput = (letter: string) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    setGrid((prev) => {
      const newGrid = prev.map((r) => r.map((c) => ({ ...c })));
      newGrid[row][col].letter = letter;
      newGrid[row][col].filled = true;
      return newGrid;
    });

    // Check words after state update
    setTimeout(() => checkWords(row, col, letter), 0);

    // Move to next cell
    const size = puzzle.template.size;
    if (direction === "across") {
      let nextCol = col + 1;
      while (nextCol < size && grid[row][nextCol].isBlack) nextCol++;
      if (nextCol < size) setSelectedCell({ row, col: nextCol });
    } else {
      let nextRow = row + 1;
      while (nextRow < size && grid[nextRow][col].isBlack) nextRow++;
      if (nextRow < size) setSelectedCell({ row: nextRow, col });
    }
  };

  const handleBackspace = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    if (grid[row][col].letter) {
      setGrid((prev) => {
        const newGrid = prev.map((r) => r.map((c) => ({ ...c })));
        newGrid[row][col].letter = "";
        newGrid[row][col].filled = false;
        return newGrid;
      });
    } else {
      // Move back
      const size = puzzle.template.size;
      if (direction === "across") {
        let prevCol = col - 1;
        while (prevCol >= 0 && grid[row][prevCol].isBlack) prevCol--;
        if (prevCol >= 0) {
          setSelectedCell({ row, col: prevCol });
          setGrid((prev) => {
            const newGrid = prev.map((r) => r.map((c) => ({ ...c })));
            newGrid[row][prevCol].letter = "";
            newGrid[row][prevCol].filled = false;
            return newGrid;
          });
        }
      } else {
        let prevRow = row - 1;
        while (prevRow >= 0 && grid[prevRow][col].isBlack) prevRow--;
        if (prevRow >= 0) {
          setSelectedCell({ row: prevRow, col });
          setGrid((prev) => {
            const newGrid = prev.map((r) => r.map((c) => ({ ...c })));
            newGrid[prevRow][col].letter = "";
            newGrid[prevRow][col].filled = false;
            return newGrid;
          });
        }
      }
    }
  };

  const checkWords = useCallback(
    (row: number, col: number, _letter: string) => {
      setGrid((currentGrid) => {
        const { across, down } = getWordsAtCell(puzzle.words, row, col);
        let newSolvedWords = new Set(solvedWords);
        let pointsEarned = 0;
        let newStreak = streak;

        const checkWord = (word: PuzzleWordWithPosition | undefined) => {
          if (!word || newSolvedWords.has(word.slotId)) return;

          if (
            isWordComplete(word, currentGrid) &&
            isWordCorrect(word, currentGrid)
          ) {
            newSolvedWords.add(word.slotId);
            newStreak++;
            const basePoints = word.length * 10;
            const streakBonus = Math.min(newStreak - 1, 5) * 5;
            pointsEarned += basePoints + streakBonus;
          }
        };

        checkWord(across);
        checkWord(down);

        if (pointsEarned > 0) {
          setSolvedWords(newSolvedWords);
          setScore((s) => s + pointsEarned);
          setStreak(newStreak);

          // Show score popup
          if (gridRef.current) {
            const rect = gridRef.current.getBoundingClientRect();
            const cellSize = rect.width / puzzle.template.size;
            const x = rect.left + col * cellSize + cellSize / 2;
            const y = rect.top + row * cellSize;

            const id = ++popupIdRef.current;
            setScorePopups((prev) => [
              ...prev,
              { id, points: pointsEarned, x, y },
            ]);
          }

          // Check completion
          if (newSolvedWords.size === puzzle.words.length) {
            setIsComplete(true);
          }
        } else {
          // Reset streak on wrong letter
          setStreak(0);
        }

        return currentGrid;
      });
    },
    [puzzle.words, solvedWords, streak]
  );

  const handleHint = () => {
    if (!selectedCell) return;

    const { across, down } = getWordsAtCell(
      puzzle.words,
      selectedCell.row,
      selectedCell.col
    );
    const currentWord = direction === "across" ? across : down;

    if (currentWord && !solvedWords.has(currentWord.slotId)) {
      setHintMessage(currentWord.hint);
      setHintsUsed((h) => h + 1);
      setScore((s) => Math.max(0, s - 25));
    }
  };

  const removeScorePopup = (id: number) => {
    setScorePopups((prev) => prev.filter((p) => p.id !== id));
  };

  const getCurrentWord = () => {
    if (!selectedCell) return null;
    const { across, down } = getWordsAtCell(
      puzzle.words,
      selectedCell.row,
      selectedCell.col
    );
    return direction === "across" ? across : down;
  };

  const isInCurrentWord = (row: number, col: number) => {
    const word = getCurrentWord();
    if (!word) return false;

    if (word.direction === "across") {
      return (
        row === word.row && col >= word.col && col < word.col + word.length
      );
    } else {
      return (
        col === word.col && row >= word.row && row < word.row + word.length
      );
    }
  };

  const currentWord = getCurrentWord();
  const cellSize = Math.min(40, 600 / puzzle.template.size);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto">
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

      {hintMessage && (
        <HintReveal
          hint={hintMessage}
          onComplete={() => setHintMessage(null)}
        />
      )}

      {/* Game Info Panel */}
      <div className="lg:w-64 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {puzzle.puzzle.theme}
          </h2>
          {puzzle.puzzle.subTheme && (
            <p className="text-sm text-gray-500">{puzzle.puzzle.subTheme}</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Score</span>
            <span className="text-2xl font-bold text-blue-600">{score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Streak</span>
            <span className="text-lg font-semibold text-orange-500">
              🔥 {streak}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Time</span>
            <span className="text-lg font-mono text-gray-800">
              {formatTime(timer)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Progress</span>
            <span className="text-lg font-semibold text-green-600">
              {solvedWords.size}/{puzzle.words.length}
            </span>
          </div>
        </div>

        <button
          onClick={handleHint}
          disabled={!selectedCell || isComplete}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span>💡</span> Get Hint (-25 pts)
        </button>

        {hintsUsed > 0 && (
          <p className="text-sm text-gray-500 text-center">
            Hints used: {hintsUsed}
          </p>
        )}

        {isComplete && (
          <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-green-800">
              Puzzle Complete!
            </h3>
            <p className="text-green-700">Final Score: {score}</p>
            <p className="text-green-600">Time: {formatTime(timer)}</p>
          </div>
        )}
      </div>

      {/* Grid and Clues */}
      <div className="flex-1 space-y-4">
        {/* Grid */}
        <div
          ref={gridRef}
          className="bg-white rounded-xl shadow-md p-4 inline-block"
        >
          <div
            className="grid gap-0 border-2 border-gray-800"
            style={{
              gridTemplateColumns: `repeat(${puzzle.template.size}, ${cellSize}px)`,
            }}
          >
            {grid.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isSelected =
                  selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
                const isHighlighted = isInCurrentWord(rowIdx, colIdx);
                const isSolved = (() => {
                  const words = getWordsAtCell(puzzle.words, rowIdx, colIdx);
                  return (
                    (words.across && solvedWords.has(words.across.slotId)) ||
                    (words.down && solvedWords.has(words.down.slotId))
                  );
                })();

                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    className={`
                      relative border border-gray-300 flex items-center justify-center
                      ${
                        cell.isBlack ? "bg-gray-900" : "bg-white cursor-pointer"
                      }
                      ${isSelected ? "bg-yellow-300" : ""}
                      ${isHighlighted && !isSelected ? "bg-blue-100" : ""}
                      ${
                        isSolved && !isSelected && !isHighlighted
                          ? "bg-green-50"
                          : ""
                      }
                      transition-colors
                    `}
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {cell.number && (
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-medium text-gray-600">
                        {cell.number}
                      </span>
                    )}
                    {!cell.isBlack && (
                      <span
                        className={`text-lg font-bold ${
                          cell.hinted ? "text-purple-600" : "text-gray-800"
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

        {/* Current Clue */}
        {currentWord && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-blue-800">
                {currentWord.number} {currentWord.direction.toUpperCase()}
              </span>
              <span className="text-sm text-blue-600">
                ({currentWord.length} letters)
              </span>
            </div>
            <p className="text-gray-800">{currentWord.clue}</p>
          </div>
        )}

        {/* Clue Lists */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">
              ACROSS
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {puzzle.words
                .filter((w) => w.direction === "across")
                .sort((a, b) => a.number - b.number)
                .map((word) => (
                  <div
                    key={word.slotId}
                    onClick={() => {
                      setSelectedCell({ row: word.row, col: word.col });
                      setDirection("across");
                    }}
                    className={`
                      p-2 rounded cursor-pointer text-sm
                      ${
                        solvedWords.has(word.slotId)
                          ? "bg-green-100 line-through text-gray-500"
                          : "hover:bg-gray-100"
                      }
                      ${
                        currentWord?.slotId === word.slotId
                          ? "bg-blue-100 ring-2 ring-blue-400"
                          : ""
                      }
                    `}
                  >
                    <span className="font-semibold">{word.number}.</span>{" "}
                    {word.clue}
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">DOWN</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {puzzle.words
                .filter((w) => w.direction === "down")
                .sort((a, b) => a.number - b.number)
                .map((word) => (
                  <div
                    key={word.slotId}
                    onClick={() => {
                      setSelectedCell({ row: word.row, col: word.col });
                      setDirection("down");
                    }}
                    className={`
                      p-2 rounded cursor-pointer text-sm
                      ${
                        solvedWords.has(word.slotId)
                          ? "bg-green-100 line-through text-gray-500"
                          : "hover:bg-gray-100"
                      }
                      ${
                        currentWord?.slotId === word.slotId
                          ? "bg-blue-100 ring-2 ring-blue-400"
                          : ""
                      }
                    `}
                  >
                    <span className="font-semibold">{word.number}.</span>{" "}
                    {word.clue}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
