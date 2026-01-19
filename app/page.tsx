import PuzzleSelector from "@/components/PuzzleSelector";
import { getPuzzleIndex } from "@/lib/puzzleLoader";
import { getAllTemplates } from "@/lib/puzzleUtils";

export default function Home() {
  const puzzles = getPuzzleIndex();
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🧩</span>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Crossword Quest
              </h1>
              <p className="text-gray-500 text-sm">Geography Edition</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Choose a Puzzle
          </h2>
          <p className="text-gray-600">
            Test your geography knowledge with our collection of themed
            crossword puzzles. Each puzzle features unique clues about world
            capitals, rivers, mountains, and more!
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Easy: Great for beginners
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            Medium: A fair challenge
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            Hard: For geography experts
          </span>
        </div>

        <PuzzleSelector puzzles={puzzles} templates={templates} />

        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>
            Use arrow keys to navigate, Tab to switch direction, and type to
            fill in letters.
          </p>
          <p className="mt-1">
            🔥 Build streaks for bonus points! 💡 Use hints when stuck (-25 pts)
          </p>
        </footer>
      </main>
    </div>
  );
}
