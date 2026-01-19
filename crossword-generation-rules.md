# Crossword Puzzle Generation System

## Overview

This document describes the rules and architecture for dynamically generating crossword puzzles from JSON data files. The system consists of:

1. **Board Templates** - Pre-defined grid layouts with symmetric patterns
2. **Puzzle JSON Files** - Word data (answers, clues, hints) that fit into templates
3. **React Component** - Renders puzzles and handles game logic

---

## Architecture

```
/crossword-app
├── /components
│   └── CrosswordPuzzle.jsx       # Main game component
├── /templates
│   ├── template-13x13-a.json     # Board template definitions
│   ├── template-13x13-b.json
│   ├── template-15x15-a.json
│   └── ...
├── /puzzles
│   ├── puzzle-001.json           # 100 puzzle data files
│   ├── puzzle-002.json
│   └── ...
└── /lib
    └── puzzleLoader.js           # Utility to load random puzzles
```

---

## Board Template Specification

### Template JSON Schema

```json
{
  "templateId": "template-13x13-a",
  "name": "Classic 13x13 Layout A",
  "size": 13,
  "description": "A symmetric 13x13 grid with dense word coverage",
  
  "slots": [
    {
      "slotId": "A1",
      "direction": "across",
      "row": 0,
      "col": 0,
      "length": 4,
      "number": 1,
      "intersections": [
        { "slotId": "D1", "position": 0, "otherPosition": 0 },
        { "slotId": "D2", "position": 1, "otherPosition": 0 },
        { "slotId": "D3", "position": 2, "otherPosition": 0 },
        { "slotId": "D4", "position": 3, "otherPosition": 0 }
      ]
    },
    {
      "slotId": "D1",
      "direction": "down",
      "row": 0,
      "col": 0,
      "length": 4,
      "number": 1,
      "intersections": [
        { "slotId": "A1", "position": 0, "otherPosition": 0 },
        { "slotId": "A10", "position": 1, "otherPosition": 0 }
      ]
    }
  ]
}
```

### Template Rules

1. **Grid Size**: Must be odd number (11, 13, 15, 17, etc.) for proper symmetry
2. **180° Rotational Symmetry**: If a black square exists at position (r, c), another must exist at (size-1-r, size-1-c)
3. **All Letters Checked**: Every white cell must be part of both an ACROSS and DOWN word
4. **Minimum Word Length**: 3 letters (no 2-letter words)
5. **No Isolated Sections**: All white cells must be connected
6. **Slot Numbering**: Numbers assigned left-to-right, top-to-bottom to cells that start a word

### Intersection Definition

Each slot defines its intersections with other slots:
- `slotId`: The ID of the intersecting slot
- `position`: Index in THIS slot where intersection occurs (0-based)
- `otherPosition`: Index in the OTHER slot where intersection occurs

---

## Puzzle JSON Specification

### Puzzle JSON Schema

```json
{
  "puzzleId": "puzzle-001",
  "templateId": "template-13x13-a",
  "theme": "Programming Languages",
  "difficulty": "medium",
  "author": "Generator",
  "createdAt": "2024-01-15T00:00:00Z",
  
  "words": [
    {
      "slotId": "A1",
      "answer": "JAVA",
      "clue": "☕ Write once, run anywhere language",
      "hint": "Think of your morning coffee from Indonesia. This language shares its name with that famous island and brew."
    },
    {
      "slotId": "D1",
      "answer": "JADE",
      "clue": "💚 Green precious stone",
      "hint": "A green gemstone popular in Chinese culture, or a template engine for Node.js (now called Pug)."
    }
  ]
}
```

### Word Rules

1. **Answer Format**: UPPERCASE letters only, A-Z
2. **Length Must Match**: `answer.length` must equal the slot's `length`
3. **Intersections Must Match**: If slot A1 intersects slot D1, the letter at the intersection must be the same in both words
4. **Clue Format**: Short, concise clue with optional emoji prefix
5. **Hint Format**: 1-3 sentences providing additional context without revealing the answer directly

### Validation Rules

Before a puzzle is valid, it must pass these checks:

```javascript
function validatePuzzle(puzzle, template) {
  // 1. All slots must have words
  const filledSlots = new Set(puzzle.words.map(w => w.slotId));
  const allSlots = new Set(template.slots.map(s => s.slotId));
  if (!setsEqual(filledSlots, allSlots)) {
    throw new Error("Not all slots are filled");
  }
  
  // 2. Word lengths must match slot lengths
  for (const word of puzzle.words) {
    const slot = template.slots.find(s => s.slotId === word.slotId);
    if (word.answer.length !== slot.length) {
      throw new Error(`Word ${word.slotId} length mismatch`);
    }
  }
  
  // 3. Intersections must have matching letters
  for (const slot of template.slots) {
    const word = puzzle.words.find(w => w.slotId === slot.slotId);
    for (const intersection of slot.intersections) {
      const otherWord = puzzle.words.find(w => w.slotId === intersection.slotId);
      const myLetter = word.answer[intersection.position];
      const otherLetter = otherWord.answer[intersection.otherPosition];
      if (myLetter !== otherLetter) {
        throw new Error(`Intersection mismatch at ${slot.slotId}/${intersection.slotId}`);
      }
    }
  }
  
  return true;
}
```

---

## Board Templates

### Template 1: 13x13 Classic (template-13x13-a)

```
■ = black square, □ = white square

□ □ □ □ ■ □ □ □ □ ■ □ □ □
□ □ □ □ □ □ □ □ □ □ □ □ □
□ □ □ □ □ □ □ □ □ □ □ □ □
□ □ □ ■ □ □ □ □ □ ■ □ □ □
■ ■ □ □ □ ■ ■ ■ □ □ □ ■ ■
□ □ □ □ □ □ □ □ □ □ □ □ □
□ □ □ □ ■ □ □ □ ■ □ □ □ □
□ □ □ □ □ □ □ □ □ □ □ □ □
■ ■ □ □ □ ■ ■ ■ □ □ □ ■ ■
□ □ □ ■ □ □ □ □ □ ■ □ □ □
□ □ □ □ □ □ □ □ □ □ □ □ □
□ □ □ □ □ □ □ □ □ □ □ □ □
□ □ □ □ ■ □ □ □ □ ■ □ □ □
```

**Characteristics:**
- 169 total cells
- ~30 black squares
- ~45-50 words
- Good for medium difficulty

### Template 2: 15x15 Standard (template-15x15-a)

```
□ □ □ □ ■ □ □ □ □ □ ■ □ □ □ □
□ □ □ □ ■ □ □ □ □ □ ■ □ □ □ □
□ □ □ □ ■ □ □ □ □ □ ■ □ □ □ □
□ □ □ □ □ □ □ ■ □ □ □ □ □ □ □
■ ■ ■ □ □ □ ■ ■ ■ □ □ □ ■ ■ ■
□ □ □ □ □ ■ □ □ □ ■ □ □ □ □ □
□ □ □ □ □ □ □ □ □ □ □ □ □ □ □
□ □ □ ■ ■ □ □ □ □ □ ■ ■ □ □ □
□ □ □ □ □ □ □ □ □ □ □ □ □ □ □
□ □ □ □ □ ■ □ □ □ ■ □ □ □ □ □
■ ■ ■ □ □ □ ■ ■ ■ □ □ □ ■ ■ ■
□ □ □ □ □ □ □ ■ □ □ □ □ □ □ □
□ □ □ □ ■ □ □ □ □ □ ■ □ □ □ □
□ □ □ □ ■ □ □ □ □ □ ■ □ □ □ □
□ □ □ □ ■ □ □ □ □ □ ■ □ □ □ □
```

**Characteristics:**
- 225 total cells
- ~38 black squares
- ~70-78 words (NYT standard max is 78)
- Standard difficulty

### Template 3: 11x11 Mini (template-11x11-a)

```
□ □ □ □ ■ □ □ □ □ □ □
□ □ □ □ ■ □ □ □ □ □ □
□ □ □ □ □ □ □ □ □ □ □
□ □ □ ■ □ □ □ ■ □ □ □
■ ■ □ □ □ ■ □ □ □ ■ ■
□ □ □ □ ■ ■ ■ □ □ □ □
■ ■ □ □ □ ■ □ □ □ ■ ■
□ □ □ ■ □ □ □ ■ □ □ □
□ □ □ □ □ □ □ □ □ □ □
□ □ □ □ □ ■ □ □ □ □ □
□ □ □ □ □ ■ □ □ □ □ □
```

**Characteristics:**
- 121 total cells
- ~22 black squares
- ~30-35 words
- Good for quick/easy puzzles

---

## Generating Puzzles

### Word Selection Algorithm

When generating a puzzle for a template:

1. **Build Constraint Graph**: Create a graph where slots are nodes and intersections are edges
2. **Order Slots by Constraint**: Sort slots by number of intersections (most constrained first)
3. **Fill Slots Iteratively**:
   - Start with most constrained slot
   - Select word from dictionary that:
     - Matches required length
     - Satisfies all existing intersection constraints
   - Mark intersection letters as fixed
   - Continue to next slot
4. **Backtrack if Stuck**: If no valid word exists, backtrack and try different word for previous slot

### Word Dictionary Requirements

For each puzzle theme, maintain a dictionary with:

```json
{
  "theme": "Programming",
  "words": {
    "3": ["API", "APP", "BIT", "CSS", "GIT", "LOG", "SQL", "WEB"],
    "4": ["BASH", "BYTE", "CODE", "DATA", "HEAP", "JAVA", "LOOP", "NODE", "RUST", "TREE"],
    "5": ["AGILE", "ARRAY", "CACHE", "CLASS", "CLONE", "DEBUG", "PARSE", "PRINT", "QUERY", "QUEUE", "REACT", "SHELL", "STACK", "SWIFT", "TOKEN"],
    "6": ["BINARY", "KERNEL", "PYTHON", "SCRIPT", "STRING"],
    "7": ["BOOLEAN", "POINTER"]
  },
  "clues": {
    "API": {
      "clue": "🔌 Interface for software communication",
      "hint": "Three letters: Application Programming ____. REST is a popular style for these."
    }
  }
}
```

---

## Runtime Loading

### puzzleLoader.js

```javascript
import templates from './templates';
import puzzles from './puzzles';

export function getRandomPuzzle() {
  const puzzleFiles = Object.keys(puzzles);
  const randomIndex = Math.floor(Math.random() * puzzleFiles.length);
  const puzzleData = puzzles[puzzleFiles[randomIndex]];
  const templateData = templates[puzzleData.templateId];
  
  return mergePuzzleWithTemplate(puzzleData, templateData);
}

export function mergePuzzleWithTemplate(puzzle, template) {
  const words = puzzle.words.map(word => {
    const slot = template.slots.find(s => s.slotId === word.slotId);
    return {
      number: slot.number,
      direction: slot.direction,
      row: slot.row,
      col: slot.col,
      answer: word.answer,
      clue: word.clue,
      hint: word.hint
    };
  });
  
  return {
    size: template.size,
    words: words
  };
}
```

### Usage in Component

```jsx
import { getRandomPuzzle } from '../lib/puzzleLoader';

function CrosswordPuzzle() {
  const [puzzleData, setPuzzleData] = useState(null);
  
  const loadNewPuzzle = () => {
    const puzzle = getRandomPuzzle();
    setPuzzleData(puzzle);
  };
  
  useEffect(() => {
    loadNewPuzzle();
  }, []);
  
  // ... rest of component
}
```

---

## Hint Writing Guidelines

### Good Hints Should:

1. **Provide Context**: Reference related concepts, history, or etymology
2. **Use Wordplay**: Puns, double meanings, rhymes
3. **Give Cultural References**: Movies, songs, famous quotes
4. **Be Specific but Not Direct**: Don't give away the answer
5. **Match Difficulty**: Harder puzzles = more cryptic hints

### Hint Examples by Quality:

**Too Easy (Bad):**
> "It starts with J and is a programming language"

**Too Hard (Bad):**
> "An Indonesian island"

**Just Right (Good):**
> "Think of your morning coffee from Indonesia. This language shares its name with that famous island and brew."

### Hint Templates:

1. **Etymology Pattern**: "This word comes from [origin], meaning [original meaning]."
2. **Pop Culture Pattern**: "[Famous reference] featured this, or in tech it means..."
3. **Wordplay Pattern**: "Sounds like [homophone], but in computing it's..."
4. **Contrast Pattern**: "Not [opposite], but rather..."

---

## File Naming Convention

- Templates: `template-{size}-{variant}.json` (e.g., `template-13x13-a.json`)
- Puzzles: `puzzle-{number}.json` (e.g., `puzzle-001.json` through `puzzle-100.json`)

---

## Next Steps

1. Create 3-5 board templates of varying sizes
2. Build word dictionaries by theme
3. Generate 100 puzzle JSON files
4. Implement puzzle loader in Next.js
5. Add puzzle selection UI (random or by theme/difficulty)
