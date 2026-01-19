import PuzzleSelector from "@/components/PuzzleSelector";
import { getPuzzleIndex } from "@/lib/puzzleLoader";
import { getAllTemplates } from "@/lib/puzzleUtils";

export default function Home() {
  const puzzles = getPuzzleIndex();
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <header className="text-center mb-10">
          <div className="inline-block animate-float">
            <span className="text-7xl md:text-8xl">🧩</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 mt-4 mb-3">
            Crossword Quest
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 font-medium">
            🌍 Geography Edition 🗺️
          </p>
          <p className="text-purple-300 mt-2 max-w-xl mx-auto">
            Test your world knowledge with beautifully crafted crossword puzzles
            featuring countries, capitals, rivers, mountains and more!
          </p>
        </header>

        {/* Difficulty Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-full text-sm font-bold shadow-lg">
            🌱 Easy - Perfect for beginners
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">
            🔥 Medium - A fair challenge
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-full text-sm font-bold shadow-lg">
            💎 Hard - For geography experts
          </span>
        </div>

        {/* Puzzle Cards */}
        <PuzzleSelector puzzles={puzzles} templates={templates} />

        {/* How to Play */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🎮 How to Play</h2>
          <div className="grid md:grid-cols-3 gap-4 text-purple-100">
            <div className="bg-white/10 rounded-2xl p-4">
              <span className="text-3xl">👆</span>
              <p className="font-semibold mt-2">Click a Cell or Clue</p>
              <p className="text-sm text-purple-200">Opens the answer dialog</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <span className="text-3xl">⌨️</span>
              <p className="font-semibold mt-2">Type Your Answer</p>
              <p className="text-sm text-purple-200">
                Auto-submits when correct!
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <span className="text-3xl">🏆</span>
              <p className="font-semibold mt-2">Build Streaks</p>
              <p className="text-sm text-purple-200">Earn bonus points!</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-purple-300 text-sm">
          <p>Made with ❤️ for geography enthusiasts everywhere</p>
        </footer>
      </div>
    </div>
  );
}
