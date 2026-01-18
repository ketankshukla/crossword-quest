"use client";

interface HintRevealProps {
  hint: string;
  isRevealed: boolean;
  onReveal: () => void;
  canReveal: boolean;
}

export function HintReveal({
  hint,
  isRevealed,
  onReveal,
  canReveal,
}: HintRevealProps) {
  if (!canReveal && !isRevealed) return null;

  return (
    <div className="mt-2">
      {!isRevealed ? (
        <button
          onClick={onReveal}
          className="w-full px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 rounded-lg text-amber-400 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          <span className="text-lg">💡</span>
          <span>Need a hint? Click here</span>
          <span className="text-xs opacity-70">(-20 pts)</span>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 animate-hintReveal">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-400/5 to-transparent" />
          <div className="relative p-3">
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Hint
                </span>
                <p className="text-amber-100 text-sm mt-1 leading-relaxed italic">
                  &ldquo;{hint}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
