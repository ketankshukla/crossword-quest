"use client";

interface GameHeaderProps {
  score: number;
  completedCount: number;
  totalWords: number;
  timer: number;
  streak: number;
  bestStreak: number;
  theme?: string;
  category?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function GameHeader({
  score,
  completedCount,
  totalWords,
  timer,
  streak,
  bestStreak,
  theme,
  category,
}: GameHeaderProps) {
  const progress = Math.round((completedCount / totalWords) * 100);

  return (
    <div className="text-center mb-2">
      <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-1">
        🧩 Crossword Quest
      </h1>

      {(theme || category) && (
        <p className="text-purple-300 text-xs mb-1">
          {theme && <span className="mr-2">📚 {theme}</span>}
          {category && <span>🏷️ {category}</span>}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm mb-2">
        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold shadow">
          ⭐ {score.toLocaleString()}
        </span>
        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-semibold shadow">
          ✅ {completedCount}/{totalWords}
        </span>
        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full font-semibold shadow">
          ⏱️ {formatTime(timer)}
        </span>
        <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full font-semibold shadow">
          🔥 {streak}{" "}
          {bestStreak > 0 && (
            <span className="opacity-70">(Best: {bestStreak})</span>
          )}
        </span>
        {completedCount === totalWords && (
          <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full font-bold shadow animate-pulse">
            🏆 WINNER!
          </span>
        )}
      </div>

      <div className="max-w-md mx-auto h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
