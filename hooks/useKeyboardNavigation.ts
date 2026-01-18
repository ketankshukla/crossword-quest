"use client";

import { useEffect, useCallback } from "react";
import type { GridCell } from "@/lib/types";

interface UseKeyboardNavigationProps {
  gameStarted: boolean;
  dialogOpen: boolean;
  grid: GridCell[][];
  size: number;
  selectedCellPos: { row: number; col: number };
  setSelectedCellPos: (pos: { row: number; col: number }) => void;
  setDialogOpen: (open: boolean) => void;
  handleCellClick: (row: number, col: number) => void;
  startGame: () => void;
}

export function useKeyboardNavigation({
  gameStarted,
  dialogOpen,
  grid,
  size,
  selectedCellPos,
  setSelectedCellPos,
  setDialogOpen,
  handleCellClick,
  startGame,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (dialogOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          setDialogOpen(false);
        }
        return;
      }

      const { row, col } = selectedCellPos;
      let newRow = row;
      let newCol = col;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          newRow = Math.max(0, row - 1);
          while (newRow > 0 && grid[newRow]?.[col]?.isBlack) newRow--;
          break;
        case "ArrowDown":
          e.preventDefault();
          newRow = Math.min(size - 1, row + 1);
          while (newRow < size - 1 && grid[newRow]?.[col]?.isBlack) newRow++;
          break;
        case "ArrowLeft":
          e.preventDefault();
          newCol = Math.max(0, col - 1);
          while (newCol > 0 && grid[row]?.[newCol]?.isBlack) newCol--;
          break;
        case "ArrowRight":
          e.preventDefault();
          newCol = Math.min(size - 1, col + 1);
          while (newCol < size - 1 && grid[row]?.[newCol]?.isBlack) newCol++;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (grid[row]?.[col]?.number) {
            handleCellClick(row, col);
          }
          break;
        case "r":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            startGame();
          }
          break;
        default:
          break;
      }

      if (!grid[newRow]?.[newCol]?.isBlack) {
        setSelectedCellPos({ row: newRow, col: newCol });
      }
    },
    [
      gameStarted,
      dialogOpen,
      selectedCellPos,
      grid,
      size,
      setSelectedCellPos,
      setDialogOpen,
      handleCellClick,
      startGame,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
