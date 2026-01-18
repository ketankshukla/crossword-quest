"use client";

import { useEffect } from "react";
import { useCrosswordGame } from "@/hooks/useCrosswordGame";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { Confetti } from "./Confetti";
import { ScorePopup } from "./ScorePopup";
import { CrosswordGrid } from "./CrosswordGrid";
import { ClueList } from "./ClueList";
import { AnswerDialog } from "./AnswerDialog";
import { GameHeader } from "./GameHeader";
import { StartScreen } from "./StartScreen";
import type { LoadedPuzzle } from "@/lib/types";

interface CrosswordPuzzleProps {
  puzzleData: LoadedPuzzle;
  onNewPuzzle?: () => void;
}

export function CrosswordPuzzle({
  puzzleData,
  onNewPuzzle,
}: CrosswordPuzzleProps) {
  const game = useCrosswordGame(puzzleData);

  useKeyboardNavigation({
    gameStarted: game.gameStarted,
    dialogOpen: game.dialogOpen,
    grid: game.grid,
    size: puzzleData.size,
    selectedCellPos: game.selectedCellPos,
    setSelectedCellPos: game.setSelectedCellPos,
    setDialogOpen: game.setDialogOpen,
    handleCellClick: game.handleCellClick,
    startGame: game.startGame,
  });

  useEffect(() => {
    if (puzzleData && !game.gameStarted) {
      game.startGame();
    }
  }, [puzzleData]);

  if (!game.gameStarted) {
    return (
      <StartScreen
        totalWords={game.totalWords}
        gridSize={puzzleData.size}
        theme={puzzleData.theme}
        category={puzzleData.category}
        onStart={game.startGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 md:p-4">
      <Confetti active={game.showConfetti} />
      <ScorePopup data={game.scorePopup} />

      <GameHeader
        score={game.score}
        completedCount={game.completedCount}
        totalWords={game.totalWords}
        timer={game.timer}
        streak={game.streak}
        bestStreak={game.bestStreak}
        theme={puzzleData.theme}
        category={puzzleData.category}
      />

      <div className="flex flex-col xl:flex-row gap-3 max-w-7xl mx-auto">
        <div className="flex justify-center xl:justify-start flex-shrink-0">
          <CrosswordGrid
            grid={game.grid}
            size={puzzleData.size}
            selectedCellPos={game.selectedCellPos}
            onCellClick={game.handleCellClick}
          />
        </div>

        <div className="flex-grow grid md:grid-cols-2 gap-2 max-h-[500px]">
          <ClueList
            words={puzzleData.words}
            direction="across"
            solvedWords={game.solvedWords}
          />
          <ClueList
            words={puzzleData.words}
            direction="down"
            solvedWords={game.solvedWords}
          />
        </div>
      </div>

      <div className="text-center mt-2 flex flex-wrap justify-center gap-2 items-center">
        <p className="text-purple-300 text-xs">
          ⌨️ Arrow keys to navigate • Enter to select • Esc to close
        </p>
        <button
          onClick={game.startGame}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-full text-white text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          🔄 Reset (Ctrl+R)
        </button>
        {onNewPuzzle && (
          <button
            onClick={onNewPuzzle}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            🎲 New Puzzle
          </button>
        )}
      </div>

      <AnswerDialog
        isOpen={game.dialogOpen}
        onClose={game.closeDialog}
        cellWords={game.cellWords}
        inputValues={game.inputValues}
        errors={game.errors}
        shake={game.shake}
        hintsRevealed={game.hintsRevealed}
        onInputChange={game.handleInputChange}
        onSubmit={game.handleSubmit}
        onRevealHint={game.revealHint}
      />

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-6px);
          }
          40%,
          80% {
            transform: translateX(6px);
          }
        }
        @keyframes scoreUp {
          0% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(-50px) scale(1.5);
            opacity: 0;
          }
        }
        @keyframes hintReveal {
          0% {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            max-height: 200px;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .animate-scoreUp {
          animation: scoreUp 1s ease-out forwards;
        }
        .animate-hintReveal {
          animation: hintReveal 0.3s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
