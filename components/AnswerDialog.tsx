"use client";

import { useRef, useEffect } from "react";
import { HintReveal } from "./HintReveal";
import type { PuzzleWord } from "@/lib/types";

interface AnswerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cellWords: { across: PuzzleWord | null; down: PuzzleWord | null };
  inputValues: { across: string; down: string };
  errors: { across: boolean; down: boolean };
  shake: { across: boolean; down: boolean };
  hintsRevealed: Set<string>;
  onInputChange: (direction: "across" | "down", value: string) => void;
  onSubmit: (direction: "across" | "down") => void;
  onRevealHint: (direction: "across" | "down") => void;
}

export function AnswerDialog({
  isOpen,
  onClose,
  cellWords,
  inputValues,
  errors,
  shake,
  hintsRevealed,
  onInputChange,
  onSubmit,
  onRevealHint,
}: AnswerDialogProps) {
  const acrossInputRef = useRef<HTMLInputElement>(null);
  const downInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (cellWords.across && acrossInputRef.current) {
          acrossInputRef.current.focus();
        } else if (cellWords.down && downInputRef.current) {
          downInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen, cellWords]);

  const handleDialogKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    direction: "across" | "down"
  ) => {
    if (e.key === "Tab") {
      const otherDirection = direction === "across" ? "down" : "across";
      if (cellWords[otherDirection]) {
        e.preventDefault();
        if (otherDirection === "across" && acrossInputRef.current) {
          acrossInputRef.current.focus();
        } else if (otherDirection === "down" && downInputRef.current) {
          downInputRef.current.focus();
        }
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(direction);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 max-w-md w-full shadow-2xl border border-purple-500/40 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
            ✏️ Enter Answer
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Esc to close</span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              ✕
            </button>
          </div>
        </div>

        {cellWords.across && (
          <div
            className={`mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 ${
              shake.across ? "animate-shake" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>➡️</span>
              <span className="font-bold text-cyan-400">
                {cellWords.across.number} Across
              </span>
              <span className="text-xs text-gray-400">
                ({cellWords.across.answer.length} letters)
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-2">
              {cellWords.across.clue}
            </p>
            <div className="flex gap-2">
              <input
                ref={acrossInputRef}
                type="text"
                value={inputValues.across}
                onChange={(e) => onInputChange("across", e.target.value)}
                onKeyDown={(e) => handleDialogKeyDown(e, "across")}
                maxLength={cellWords.across.answer.length}
                className={`flex-grow px-3 py-1.5 rounded bg-slate-700 border-2 ${
                  errors.across ? "border-red-500" : "border-cyan-500/50"
                } text-white uppercase tracking-widest font-mono focus:outline-none focus:border-cyan-400`}
                placeholder={`${cellWords.across.answer.length} letters`}
              />
              <button
                onClick={() => onSubmit("across")}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                Check
              </button>
            </div>
            {errors.across && (
              <p className="text-red-400 text-xs mt-1">
                ❌ Wrong! Try again or use a hint.
              </p>
            )}

            <HintReveal
              hint={cellWords.across.hint}
              isRevealed={hintsRevealed.has(
                `${cellWords.across.number}-across`
              )}
              onReveal={() => onRevealHint("across")}
              canReveal={
                !hintsRevealed.has(`${cellWords.across.number}-across`)
              }
            />
          </div>
        )}

        {cellWords.down && (
          <div
            className={`mb-3 p-3 bg-pink-500/10 rounded-lg border border-pink-500/30 ${
              shake.down ? "animate-shake" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>⬇️</span>
              <span className="font-bold text-pink-400">
                {cellWords.down.number} Down
              </span>
              <span className="text-xs text-gray-400">
                ({cellWords.down.answer.length} letters)
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-2">{cellWords.down.clue}</p>
            <div className="flex gap-2">
              <input
                ref={downInputRef}
                type="text"
                value={inputValues.down}
                onChange={(e) => onInputChange("down", e.target.value)}
                onKeyDown={(e) => handleDialogKeyDown(e, "down")}
                maxLength={cellWords.down.answer.length}
                className={`flex-grow px-3 py-1.5 rounded bg-slate-700 border-2 ${
                  errors.down ? "border-red-500" : "border-pink-500/50"
                } text-white uppercase tracking-widest font-mono focus:outline-none focus:border-pink-400`}
                placeholder={`${cellWords.down.answer.length} letters`}
              />
              <button
                onClick={() => onSubmit("down")}
                className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                Check
              </button>
            </div>
            {errors.down && (
              <p className="text-red-400 text-xs mt-1">
                ❌ Wrong! Try again or use a hint.
              </p>
            )}

            <HintReveal
              hint={cellWords.down.hint}
              isRevealed={hintsRevealed.has(`${cellWords.down.number}-down`)}
              onReveal={() => onRevealHint("down")}
              canReveal={!hintsRevealed.has(`${cellWords.down.number}-down`)}
            />
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
          <span>💡 Auto-fills when correct!</span>
          <span>Tab to switch • Enter to check</span>
        </div>
      </div>
    </div>
  );
}
