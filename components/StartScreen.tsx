"use client";

interface StartScreenProps {
  totalWords: number;
  gridSize: number;
  theme?: string;
  category?: string;
  onStart: () => void;
}

export function StartScreen({
  totalWords,
  gridSize,
  theme,
  category,
  onStart,
}: StartScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="mb-4 animate-bounce">
          <span className="text-6xl">🧩</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 mb-2">
          Crossword Quest
        </h1>
        <p className="text-lg text-purple-200 mb-1">
          ✨ {theme || "A Word Adventure"} ✨
        </p>
        <p className="text-purple-300 mb-4 text-sm">
          {totalWords} words • {gridSize}×{gridSize} symmetric grid
          {category && ` • ${category}`}
        </p>

        <div className="bg-white/10 rounded-xl p-4 mb-4 text-left text-sm text-purple-200">
          <h3 className="font-bold text-yellow-400 mb-2">
            ⌨️ Keyboard Controls:
          </h3>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <span>↑↓←→</span>
            <span>Navigate grid</span>
            <span>Enter/Space</span>
            <span>Open cell</span>
            <span>Escape</span>
            <span>Close dialog</span>
            <span>Tab</span>
            <span>Switch inputs</span>
            <span>Ctrl+R</span>
            <span>Reset game</span>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-4 text-left text-sm text-purple-200">
          <h3 className="font-bold text-cyan-400 mb-2">🎯 Scoring:</h3>
          <ul className="space-y-1 text-xs">
            <li>• 10 points per letter</li>
            <li>• Streak bonus: +5 per consecutive word</li>
            <li>• Speed bonus: up to +50 points</li>
            <li>• 💡 Hint available once per word (-20 pts)</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          autoFocus
          className="px-8 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full text-white text-xl font-bold shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
        >
          🎮 Start Puzzle
        </button>
        <p className="text-purple-400 text-xs mt-2">
          Press Enter or Space to start
        </p>
      </div>
    </div>
  );
}
