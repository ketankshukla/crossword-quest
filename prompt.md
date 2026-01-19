# MASTER PROMPT: BUILD COMPLETE NEXT.JS CROSSWORD PUZZLE APP

## PROJECT OVERVIEW

Build a fully functional Next.js crossword puzzle application with the following features:
- Multiple crossword grid templates (12 different symmetric patterns)
- Geography-themed puzzles with clues and hints
- Interactive gameplay with keyboard navigation
- Scoring system with streaks and bonuses
- Hint system with point penalties
- Puzzle selection (random or by theme)
- Beautiful, modern UI with Tailwind CSS

**Tech Stack:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- JSON files for puzzle data (no database initially)

---

## FOLDER STRUCTURE TO CREATE

```
crossword-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home page with puzzle selection
│   ├── play/
│   │   └── [puzzleId]/
│   │       └── page.tsx            # Puzzle gameplay page
│   ├── templates/
│   │   └── page.tsx                # View all templates (optional)
│   └── globals.css
├── components/
│   ├── CrosswordPuzzle.tsx         # Main game component
│   ├── PuzzleSelector.tsx          # Puzzle selection UI
│   ├── GridPreview.tsx             # Small grid preview
│   ├── Confetti.tsx                # Celebration animation
│   ├── HintReveal.tsx              # Hint display component
│   └── ScorePopup.tsx              # Score animation
├── data/
│   ├── templates/
│   │   └── index.ts                # All grid templates
│   ├── puzzles/
│   │   ├── index.ts                # Puzzle loader/index
│   │   ├── template-11x11-mini/
│   │   │   ├── puzzle-001.json
│   │   │   ├── puzzle-002.json
│   │   │   └── ...
│   │   ├── template-13x13-compact/
│   │   │   └── ...
│   │   ├── template-15x15-classic/
│   │   │   └── ...
│   │   └── ... (one folder per template)
│   └── puzzle-index.json           # Master index of all puzzles
├── lib/
│   ├── puzzleUtils.ts              # Puzzle loading & validation
│   ├── gridGenerator.ts            # Generate grid from template + puzzle
│   └── types.ts                    # TypeScript interfaces
├── public/
│   └── ...
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## STEP 1: PROJECT INITIALIZATION

```bash
# Create Next.js app
npx create-next-app@latest crossword-app --typescript --tailwind --eslint --app --src-dir=false

cd crossword-app

# Install any additional dependencies if needed
npm install
```

---

## STEP 2: TYPE DEFINITIONS

**File: `lib/types.ts`**

```typescript
// Grid cell representation
export interface GridCell {
  isCell: boolean;
  isBlack: boolean;
  letter: string;
  correctLetter: string;
  number: number | null;
  filled: boolean;
  hinted: boolean;
}

// Template slot definition
export interface TemplateSlot {
  id: string;           // e.g., "A1", "D5"
  direction: 'across' | 'down';
  row: number;
  col: number;
  length: number;
}

// Grid template definition
export interface GridTemplate {
  id: string;
  name: string;
  size: number;
  description: string;
  blackSquares: [number, number][];
  slots: TemplateSlot[];
}

// Word entry in a puzzle
export interface PuzzleWord {
  slotId: string;
  answer: string;
  clue: string;
  hint: string;
}

// Complete puzzle data
export interface Puzzle {
  puzzleId: string;
  templateId: string;
  theme: string;
  subTheme?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  words: PuzzleWord[];
}

// Puzzle index entry
export interface PuzzleIndexEntry {
  puzzleId: string;
  templateId: string;
  theme: string;
  subTheme?: string;
  difficulty: string;
}

// Full puzzle with template (for gameplay)
export interface FullPuzzle {
  puzzle: Puzzle;
  template: GridTemplate;
  words: PuzzleWordWithPosition[];
}

// Word with calculated position info
export interface PuzzleWordWithPosition extends PuzzleWord {
  number: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
}
```

---

## STEP 3: GRID TEMPLATES DATA

**File: `data/templates/index.ts`**

Create this file with ALL 12 templates from the templates JSX file I provided. Export them as a TypeScript array:

```typescript
import { GridTemplate } from '@/lib/types';

export const TEMPLATES: GridTemplate[] = [
  {
    id: 'template-15x15-classic',
    name: '15×15 Classic',
    size: 15,
    description: 'Standard NYT weekday layout',
    blackSquares: [
      [0,4], [0,10],
      [1,4], [1,10],
      // ... all black squares
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 0, length: 4 },
      { id: 'A5', direction: 'across', row: 0, col: 5, length: 5 },
      // ... all slots
    ]
  },
  // ... ALL 12 TEMPLATES
];

export const getTemplateById = (id: string): GridTemplate | undefined => {
  return TEMPLATES.find(t => t.id === id);
};
```

**IMPORTANT:** Copy ALL 12 complete template definitions from the `crossword-templates.jsx` file I created earlier.

---

## STEP 4: PUZZLE UTILITIES

**File: `lib/puzzleUtils.ts`**

```typescript
import { GridTemplate, Puzzle, FullPuzzle, PuzzleWordWithPosition, GridCell } from './types';
import { getTemplateById } from '@/data/templates';

// Load a puzzle by ID
export async function loadPuzzle(puzzleId: string): Promise<FullPuzzle | null> {
  try {
    // Parse puzzle ID to get template
    // Format: geo-{size}-{variant}-{number} e.g., geo-15x15-classic-001
    const parts = puzzleId.split('-');
    const templateId = `template-${parts[1]}-${parts[2]}`;
    
    // Dynamic import of puzzle JSON
    const puzzleModule = await import(`@/data/puzzles/${templateId}/${puzzleId}.json`);
    const puzzle: Puzzle = puzzleModule.default;
    
    const template = getTemplateById(puzzle.templateId);
    if (!template) return null;
    
    // Merge puzzle words with slot positions
    const words = mergeWordsWithSlots(puzzle, template);
    
    return { puzzle, template, words };
  } catch (error) {
    console.error('Failed to load puzzle:', error);
    return null;
  }
}

// Merge puzzle words with template slot positions
function mergeWordsWithSlots(puzzle: Puzzle, template: GridTemplate): PuzzleWordWithPosition[] {
  return puzzle.words.map(word => {
    const slot = template.slots.find(s => s.id === word.slotId);
    if (!slot) throw new Error(`Slot ${word.slotId} not found in template`);
    
    return {
      ...word,
      number: parseInt(word.slotId.substring(1)),
      direction: slot.direction,
      row: slot.row,
      col: slot.col,
    };
  });
}

// Generate the game grid from template and words
export function generateGrid(template: GridTemplate, words: PuzzleWordWithPosition[]): GridCell[][] {
  const { size, blackSquares } = template;
  
  // Initialize grid with all cells
  const grid: GridCell[][] = Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => ({
      isCell: true,
      isBlack: false,
      letter: '',
      correctLetter: '',
      number: null,
      filled: false,
      hinted: false,
    }))
  );
  
  // Mark black squares
  blackSquares.forEach(([row, col]) => {
    grid[row][col].isCell = false;
    grid[row][col].isBlack = true;
  });
  
  // Place words and assign numbers
  const cellNumbers: Record<string, number> = {};
  
  words.forEach(word => {
    const { answer, row, col, direction, number } = word;
    
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      
      if (r < size && c < size && !grid[r][c].isBlack) {
        grid[r][c].correctLetter = answer[i];
        
        // Assign number to first cell of word
        if (i === 0) {
          const key = `${r}-${c}`;
          if (!cellNumbers[key]) {
            cellNumbers[key] = number;
            grid[r][c].number = number;
          }
        }
      }
    }
  });
  
  return grid;
}

// Get random puzzle ID
export function getRandomPuzzleId(puzzleIndex: PuzzleIndexEntry[]): string {
  const randomIndex = Math.floor(Math.random() * puzzleIndex.length);
  return puzzleIndex[randomIndex].puzzleId;
}

// Get puzzles by template
export function getPuzzlesByTemplate(puzzleIndex: PuzzleIndexEntry[], templateId: string): PuzzleIndexEntry[] {
  return puzzleIndex.filter(p => p.templateId === templateId);
}

// Get puzzles by theme
export function getPuzzlesByTheme(puzzleIndex: PuzzleIndexEntry[], theme: string): PuzzleIndexEntry[] {
  return puzzleIndex.filter(p => p.theme === theme || p.subTheme === theme);
}
```

---

## STEP 5: PUZZLE DATA GENERATION

### THIS IS THE CRITICAL STEP - GENERATE ACTUAL PUZZLE CONTENT

For EACH template, generate puzzle JSON files with geography content.

**Example Puzzle File: `data/puzzles/template-11x11-mini/geo-11x11-mini-001.json`**

```json
{
  "puzzleId": "geo-11x11-mini-001",
  "templateId": "template-11x11-mini",
  "theme": "Geography",
  "subTheme": "World Capitals",
  "difficulty": "easy",
  "words": [
    {
      "slotId": "A1",
      "answer": "PARIS",
      "clue": "🗼 French capital on the Seine",
      "hint": "Known as the City of Light, this European capital is home to the Eiffel Tower, built for the 1889 World's Fair."
    },
    {
      "slotId": "A2",
      "answer": "TOKYO",
      "clue": "🗾 Japan's bustling capital",
      "hint": "The world's most populous metropolitan area, formerly known as Edo until 1868."
    },
    {
      "slotId": "D1",
      "answer": "PERU",
      "clue": "🦙 Machu Picchu's country",
      "hint": "This South American nation was the heart of the Inca Empire. Its capital Lima sits on the Pacific coast."
    }
    // ... ALL words for ALL slots in the template
  ]
}
```

### GENERATION RULES:

1. **EVERY SLOT MUST HAVE A WORD** - Check template.slots and ensure puzzle.words has an entry for each slot ID

2. **EXACT LENGTH MATCH** - If slot.length is 5, the answer MUST be exactly 5 letters

3. **INTERSECTION CONSISTENCY** - Where words cross, letters MUST match:
   - Calculate which cells each word occupies
   - Find overlapping cells
   - Verify both words have the same letter at that position

4. **GEOGRAPHY THEME** - All answers should be:
   - Countries (PERU, CHINA, BRAZIL)
   - Capitals (PARIS, TOKYO, CAIRO)
   - Rivers (NILE, AMAZON, THAMES)
   - Mountains (ALPS, ANDES, EVEREST)
   - Oceans/Seas (PACIFIC, ATLANTIC)
   - Geographic terms (DELTA, FJORD, CAPE)
   - Landmarks (SPHINX, EIFFEL)
   - Directions (NORTH, SOUTH, EAST)

5. **QUANTITY PER TEMPLATE:**
   - template-11x11-mini: 10 puzzles
   - template-11x11-blocks: 8 puzzles
   - template-13x13-compact: 8 puzzles
   - template-13x13-cross: 6 puzzles
   - template-13x13-spiral: 6 puzzles
   - template-15x15-classic: 6 puzzles
   - template-15x15-open: 5 puzzles
   - template-15x15-diamond: 5 puzzles
   - template-15x15-staircase: 5 puzzles
   - template-15x15-pinwheel: 5 puzzles
   - template-15x15-triplestack: 3 puzzles
   - template-15x15-corners: 5 puzzles

   **TOTAL: ~72 puzzles minimum**

---

## STEP 6: PUZZLE INDEX FILE

**File: `data/puzzle-index.json`**

After generating all puzzles, create the master index:

```json
{
  "totalPuzzles": 72,
  "generatedAt": "2024-01-15",
  "puzzles": [
    {
      "puzzleId": "geo-11x11-mini-001",
      "templateId": "template-11x11-mini",
      "theme": "Geography",
      "subTheme": "World Capitals",
      "difficulty": "easy"
    },
    {
      "puzzleId": "geo-11x11-mini-002",
      "templateId": "template-11x11-mini",
      "theme": "Geography",
      "subTheme": "Rivers",
      "difficulty": "medium"
    }
    // ... all puzzles
  ]
}
```

**File: `data/puzzles/index.ts`**

```typescript
import puzzleIndex from './puzzle-index.json';
import { PuzzleIndexEntry } from '@/lib/types';

export const getAllPuzzles = (): PuzzleIndexEntry[] => {
  return puzzleIndex.puzzles;
};

export const getPuzzleCount = (): number => {
  return puzzleIndex.totalPuzzles;
};
```

---

## STEP 7: MAIN GAME COMPONENT

**File: `components/CrosswordPuzzle.tsx`**

This is the main gameplay component. Use the code from the `crossword-puzzle.jsx` file I created, but convert it to TypeScript and modify it to:

1. Accept props for puzzle data instead of hardcoded PUZZLE_DATA
2. Use the types from `lib/types.ts`
3. Add a "Back to Menu" button
4. Add a "New Puzzle" button

```typescript
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GridCell, PuzzleWordWithPosition, GridTemplate } from '@/lib/types';
import { generateGrid } from '@/lib/puzzleUtils';
import Confetti from './Confetti';
import HintReveal from './HintReveal';
import ScorePopup from './ScorePopup';

interface CrosswordPuzzleProps {
  template: GridTemplate;
  words: PuzzleWordWithPosition[];
  puzzleId: string;
  theme: string;
  onBack: () => void;
  onNewPuzzle: () => void;
}

export default function CrosswordPuzzle({ 
  template, 
  words, 
  puzzleId, 
  theme,
  onBack,
  onNewPuzzle 
}: CrosswordPuzzleProps) {
  // ... (Convert the entire crossword-puzzle.jsx component to TypeScript)
  // ... Use generateGrid(template, words) instead of hardcoded data
  // ... Add Back and New Puzzle buttons to the UI
}
```

**IMPORTANT:** Convert the ENTIRE `crossword-puzzle.jsx` file to TypeScript, using the props pattern above.

---

## STEP 8: PUZZLE SELECTOR COMPONENT

**File: `components/PuzzleSelector.tsx`**

```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PuzzleIndexEntry } from '@/lib/types';
import { TEMPLATES } from '@/data/templates';
import GridPreview from './GridPreview';

interface PuzzleSelectorProps {
  puzzles: PuzzleIndexEntry[];
}

export default function PuzzleSelector({ puzzles }: PuzzleSelectorProps) {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredPuzzles = puzzles.filter(p => {
    if (selectedTemplate && p.templateId !== selectedTemplate) return false;
    if (selectedDifficulty && p.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleRandomPuzzle = () => {
    const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
    const puzzle = filteredPuzzles[randomIndex];
    router.push(`/play/${puzzle.puzzleId}`);
  };

  const handleSelectPuzzle = (puzzleId: string) => {
    router.push(`/play/${puzzleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            🧩 Geography Crossword
          </h1>
          <p className="text-purple-300">
            {puzzles.length} puzzles available • Test your geography knowledge!
          </p>
        </div>

        {/* Quick Play Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleRandomPuzzle}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white text-xl font-bold shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all"
          >
            🎲 Random Puzzle
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* Template Filter */}
          <select
            value={selectedTemplate || ''}
            onChange={(e) => setSelectedTemplate(e.target.value || null)}
            className="px-4 py-2 bg-slate-800 border border-purple-500 rounded-lg text-white"
          >
            <option value="">All Grid Sizes</option>
            {TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty || ''}
            onChange={(e) => setSelectedDifficulty(e.target.value || null)}
            className="px-4 py-2 bg-slate-800 border border-purple-500 rounded-lg text-white"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Puzzle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPuzzles.map(puzzle => {
            const template = TEMPLATES.find(t => t.id === puzzle.templateId);
            return (
              <div
                key={puzzle.puzzleId}
                onClick={() => handleSelectPuzzle(puzzle.puzzleId)}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4">
                  {template && <GridPreview template={template} size={60} />}
                  <div>
                    <h3 className="font-bold text-white">{puzzle.subTheme || puzzle.theme}</h3>
                    <p className="text-sm text-gray-400">{template?.name}</p>
                    <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                      puzzle.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      puzzle.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {puzzle.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

## STEP 9: GRID PREVIEW COMPONENT

**File: `components/GridPreview.tsx`**

```typescript
import React from 'react';
import { GridTemplate } from '@/lib/types';

interface GridPreviewProps {
  template: GridTemplate;
  size?: number;
}

export default function GridPreview({ template, size = 100 }: GridPreviewProps) {
  const { size: gridSize, blackSquares } = template;
  const blackSet = new Set(blackSquares.map(([r, c]) => `${r}-${c}`));
  const cellSize = Math.floor(size / gridSize);

  return (
    <div
      className="inline-grid gap-px bg-slate-600 p-px rounded"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
      }}
    >
      {Array(gridSize).fill(null).map((_, row) =>
        Array(gridSize).fill(null).map((_, col) => (
          <div
            key={`${row}-${col}`}
            style={{ width: cellSize, height: cellSize }}
            className={blackSet.has(`${row}-${col}`) ? 'bg-slate-800' : 'bg-white'}
          />
        ))
      )}
    </div>
  );
}
```

---

## STEP 10: PAGE ROUTES

**File: `app/page.tsx`** (Home page)

```typescript
import PuzzleSelector from '@/components/PuzzleSelector';
import { getAllPuzzles } from '@/data/puzzles';

export default function HomePage() {
  const puzzles = getAllPuzzles();
  
  return <PuzzleSelector puzzles={puzzles} />;
}
```

**File: `app/play/[puzzleId]/page.tsx`** (Game page)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CrosswordPuzzle from '@/components/CrosswordPuzzle';
import { loadPuzzle, getRandomPuzzleId } from '@/lib/puzzleUtils';
import { getAllPuzzles } from '@/data/puzzles';
import { FullPuzzle } from '@/lib/types';

export default function PlayPage() {
  const router = useRouter();
  const params = useParams();
  const puzzleId = params.puzzleId as string;
  
  const [fullPuzzle, setFullPuzzle] = useState<FullPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await loadPuzzle(puzzleId);
      if (result) {
        setFullPuzzle(result);
      } else {
        setError('Puzzle not found');
      }
      setLoading(false);
    }
    load();
  }, [puzzleId]);

  const handleBack = () => {
    router.push('/');
  };

  const handleNewPuzzle = () => {
    const puzzles = getAllPuzzles();
    const newPuzzleId = getRandomPuzzleId(puzzles);
    router.push(`/play/${newPuzzleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-2xl text-purple-400 animate-pulse">Loading puzzle...</div>
      </div>
    );
  }

  if (error || !fullPuzzle) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-400 mb-4">{error || 'Something went wrong'}</p>
          <button onClick={handleBack} className="px-4 py-2 bg-purple-600 rounded text-white">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <CrosswordPuzzle
      template={fullPuzzle.template}
      words={fullPuzzle.words}
      puzzleId={fullPuzzle.puzzle.puzzleId}
      theme={fullPuzzle.puzzle.subTheme || fullPuzzle.puzzle.theme}
      onBack={handleBack}
      onNewPuzzle={handleNewPuzzle}
    />
  );
}
```

---

## STEP 11: LAYOUT AND GLOBAL STYLES

**File: `app/layout.tsx`**

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Geography Crossword Puzzle',
  description: 'Test your geography knowledge with fun crossword puzzles!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**File: `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes fall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

@keyframes scoreUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
}

@keyframes hintReveal {
  0% { opacity: 0; max-height: 0; transform: translateY(-10px); }
  100% { opacity: 1; max-height: 200px; transform: translateY(0); }
}

.animate-shake { animation: shake 0.4s ease-in-out; }
.animate-scoreUp { animation: scoreUp 1s ease-out forwards; }
.animate-hintReveal { animation: hintReveal 0.3s ease-out forwards; }
```

---

## STEP 12: HELPER COMPONENTS

**File: `components/Confetti.tsx`**

```typescript
import React from 'react';

interface ConfettiProps {
  active: boolean;
}

export default function Confetti({ active }: ConfettiProps) {
  if (!active) return null;
  
  const pieces = Array(80).fill(null).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F8B500', '#FF69B4', '#00D4FF'][Math.floor(Math.random() * 10)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute w-2 h-2"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animation: `fall ${p.duration}s ${p.delay}s linear forwards`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  );
}
```

**File: `components/ScorePopup.tsx`**

```typescript
import React from 'react';

interface ScorePopupProps {
  score: number | null;
  position: { x: string; y: string };
}

export default function ScorePopup({ score, position }: ScorePopupProps) {
  if (!score) return null;
  
  return (
    <div 
      className="fixed pointer-events-none z-50 animate-scoreUp" 
      style={{ left: position.x, top: position.y }}
    >
      <span className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
        +{score}
      </span>
    </div>
  );
}
```

**File: `components/HintReveal.tsx`**

```typescript
import React from 'react';

interface HintRevealProps {
  hint: string;
  isRevealed: boolean;
  onReveal: () => void;
  canReveal: boolean;
}

export default function HintReveal({ hint, isRevealed, onReveal, canReveal }: HintRevealProps) {
  if (!canReveal && !isRevealed) return null;

  return (
    <div className="mt-2">
      {!isRevealed ? (
        <button
          onClick={onReveal}
          className="w-full px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 rounded-lg text-amber-400 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span className="text-lg">💡</span>
          <span>Need a hint? Click here</span>
          <span className="text-xs opacity-70">(-20 pts)</span>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 animate-hintReveal">
          <div className="relative p-3">
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Hint</span>
                <p className="text-amber-100 text-sm mt-1 leading-relaxed italic">"{hint}"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## EXECUTION CHECKLIST

### Phase 1: Setup
- [ ] Create Next.js project with TypeScript and Tailwind
- [ ] Create folder structure as specified
- [ ] Add type definitions (`lib/types.ts`)

### Phase 2: Templates
- [ ] Create `data/templates/index.ts` with ALL 12 templates
- [ ] Verify each template has correct blackSquares and slots arrays

### Phase 3: Puzzle Generation (CRITICAL)
- [ ] For EACH template, generate the required number of puzzle JSON files
- [ ] Verify EVERY slot has a word entry
- [ ] Verify EVERY answer length matches slot length EXACTLY
- [ ] Verify ALL intersections have matching letters
- [ ] Use GEOGRAPHY terms only

### Phase 4: Components
- [ ] Create all components (CrosswordPuzzle, PuzzleSelector, GridPreview, etc.)
- [ ] Convert crossword-puzzle.jsx to TypeScript CrosswordPuzzle.tsx

### Phase 5: Pages & Routing
- [ ] Create home page with puzzle selector
- [ ] Create dynamic play page for gameplay
- [ ] Add navigation between pages

### Phase 6: Testing
- [ ] Run `npm run dev`
- [ ] Test random puzzle selection
- [ ] Test filtering by template/difficulty
- [ ] Play through at least one puzzle completely
- [ ] Verify scoring, hints, and confetti work

---

## FILES PROVIDED TO YOU

You have been given these files to reference:

1. **crossword-puzzle.jsx** - The complete game component (convert to TypeScript)
2. **crossword-templates.jsx** - All 12 grid templates with slots defined
3. **CROSSWORD_GENERATION_RULES.md** - Documentation on puzzle structure

Use these as your source material. The crossword-puzzle.jsx contains all the game logic - you need to convert it to TypeScript and make it accept props instead of hardcoded data.

---

## START BUILDING

Begin with:
1. Project initialization
2. Type definitions
3. Template data
4. Generate AT LEAST 5 puzzles for template-11x11-mini first (simplest)
5. Test that one template works end-to-end
6. Then generate remaining puzzles for all templates

The most time-consuming part is generating valid puzzle content. Take your time to ensure intersections match correctly.

Good luck! Build an amazing geography crossword app!
