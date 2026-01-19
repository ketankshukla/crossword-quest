"use client";

import { useState, useEffect, useRef } from "react";
import { PuzzleWordWithPosition } from "@/lib/types";

interface AnswerDialogProps {
  acrossWord?: PuzzleWordWithPosition;
  downWord?: PuzzleWordWithPosition;
  acrossSolved: boolean;
  downSolved: boolean;
  onCorrectAnswer: (slotId: string, answer: string) => void;
  onClose: () => void;
  cellNumber: number;
}

export default function AnswerDialog({
  acrossWord,
  downWord,
  acrossSolved,
  downSolved,
  onCorrectAnswer,
  onClose,
  cellNumber,
}: AnswerDialogProps) {
  const [acrossInput, setAcrossInput] = useState("");
  const [downInput, setDownInput] = useState("");
  const [acrossCorrect, setAcrossCorrect] = useState(acrossSolved);
  const [downCorrect, setDownCorrect] = useState(downSolved);

  const acrossRef = useRef<HTMLInputElement>(null);
  const downRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (acrossWord && !acrossCorrect && acrossRef.current) {
      acrossRef.current.focus();
    } else if (downWord && !downCorrect && downRef.current) {
      downRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (acrossWord && !acrossCorrect) {
      const normalized = acrossInput.toUpperCase().replace(/[^A-Z]/g, "");
      if (normalized === acrossWord.answer) {
        setAcrossCorrect(true);
        onCorrectAnswer(acrossWord.slotId, acrossWord.answer);

        if (downWord && !downCorrect && downRef.current) {
          setTimeout(() => downRef.current?.focus(), 100);
        } else if (!downWord || downCorrect || downSolved) {
          setTimeout(onClose, 300);
        }
      }
    }
  }, [acrossInput]);

  useEffect(() => {
    if (downWord && !downCorrect) {
      const normalized = downInput.toUpperCase().replace(/[^A-Z]/g, "");
      if (normalized === downWord.answer) {
        setDownCorrect(true);
        onCorrectAnswer(downWord.slotId, downWord.answer);

        if (!acrossWord || acrossCorrect || acrossSolved) {
          setTimeout(onClose, 300);
        }
      }
    }
  }, [downInput]);

  const showAcross = acrossWord && !acrossSolved && !acrossCorrect;
  const showDown = downWord && !downSolved && !downCorrect;

  if (!showAcross && !showDown) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-1 rounded-3xl shadow-2xl max-w-lg w-full animate-bounce-in">
        <div className="bg-white rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🧩</span>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Cell #{cellNumber}
                </h2>
                <p className="text-sm text-gray-500">Type your answer below</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all text-xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-5">
            {showAcross && acrossWord && (
              <div
                className={`p-4 rounded-2xl transition-all ${
                  acrossCorrect
                    ? "bg-emerald-100 border-2 border-emerald-400"
                    : "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">➡️</span>
                  <span className="font-black text-amber-600 text-lg">
                    {acrossWord.number} ACROSS
                  </span>
                  <span className="text-sm text-amber-500 font-medium">
                    ({acrossWord.length} letters)
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-3 text-lg leading-relaxed">
                  {acrossWord.clue}
                </p>
                {!acrossCorrect && (
                  <input
                    ref={acrossRef}
                    type="text"
                    value={acrossInput}
                    onChange={(e) => setAcrossInput(e.target.value)}
                    maxLength={acrossWord.length + 5}
                    placeholder={`Enter ${acrossWord.length} letters...`}
                    className="w-full px-4 py-3 text-xl font-bold uppercase tracking-widest border-3 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-500 bg-white transition-all"
                    autoComplete="off"
                    spellCheck="false"
                  />
                )}
                {acrossCorrect && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
                    <span>✅</span> {acrossWord.answer}
                  </div>
                )}
              </div>
            )}

            {showDown && downWord && (
              <div
                className={`p-4 rounded-2xl transition-all ${
                  downCorrect
                    ? "bg-emerald-100 border-2 border-emerald-400"
                    : "bg-gradient-to-r from-sky-50 to-cyan-50 border-2 border-sky-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⬇️</span>
                  <span className="font-black text-sky-600 text-lg">
                    {downWord.number} DOWN
                  </span>
                  <span className="text-sm text-sky-500 font-medium">
                    ({downWord.length} letters)
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-3 text-lg leading-relaxed">
                  {downWord.clue}
                </p>
                {!downCorrect && (
                  <input
                    ref={downRef}
                    type="text"
                    value={downInput}
                    onChange={(e) => setDownInput(e.target.value)}
                    maxLength={downWord.length + 5}
                    placeholder={`Enter ${downWord.length} letters...`}
                    className="w-full px-4 py-3 text-xl font-bold uppercase tracking-widest border-3 border-sky-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-500 bg-white transition-all"
                    autoComplete="off"
                    spellCheck="false"
                  />
                )}
                {downCorrect && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
                    <span>✅</span> {downWord.answer}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            💡 Answer auto-submits when correct!
          </p>
        </div>
      </div>
    </div>
  );
}
