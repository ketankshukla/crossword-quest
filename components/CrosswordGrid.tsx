"use client";

import { CELL_SIZE, GAP } from "@/lib/constants";
import type { GridCell } from "@/lib/types";

interface CrosswordGridProps {
  grid: GridCell[][];
  size: number;
  selectedCellPos: { row: number; col: number };
  onCellClick: (row: number, col: number) => void;
}

export function CrosswordGrid({
  grid,
  size,
  selectedCellPos,
  onCellClick,
}: CrosswordGridProps) {
  return (
    <div
      className="bg-slate-800 rounded-lg shadow-2xl border border-purple-500/30 inline-block"
      style={{ padding: `${GAP}px` }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${size}, ${CELL_SIZE}px)`,
          gap: `${GAP}px`,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const isSelected =
              selectedCellPos.row === rowIdx && selectedCellPos.col === colIdx;

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                onClick={() => onCellClick(rowIdx, colIdx)}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                className={`
                  relative flex items-center justify-center text-sm font-bold transition-all duration-150
                  ${
                    cell.isBlack
                      ? "bg-slate-800"
                      : cell.filled
                      ? cell.hinted
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                        : "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                      : isSelected
                      ? "bg-gradient-to-br from-cyan-300 to-blue-400 ring-2 ring-cyan-400"
                      : cell.number
                      ? "bg-gradient-to-br from-amber-100 to-yellow-200 hover:from-amber-200 hover:to-yellow-300 cursor-pointer"
                      : "bg-white hover:bg-gray-100"
                  }
                `}
              >
                {cell.number && (
                  <span className="absolute top-0 left-0.5 text-[8px] font-bold text-purple-800 leading-none">
                    {cell.number}
                  </span>
                )}
                {!cell.isBlack && (
                  <span
                    className={`${
                      cell.filled
                        ? "text-white text-sm"
                        : "text-slate-700 text-sm"
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
  );
}
