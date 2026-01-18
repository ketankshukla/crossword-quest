# 🧩 Crossword Quest - Geography Edition

A fun and challenging crossword puzzle game featuring world geography, capitals, countries, and landmarks. Built with Next.js 14, TypeScript, TailwindCSS, and Supabase.

## Features

- **100 Geography Puzzles** across 10 categories:

  - World Capitals
  - Countries
  - Rivers and Lakes
  - Mountains and Peaks
  - Islands
  - Famous Cities
  - Oceans and Seas
  - Deserts
  - Landmarks
  - Continents and Regions

- **Multiple Grid Sizes**: 11x11 (Mini) and 13x13 (Classic) templates
- **Difficulty Levels**: Easy, Medium, and Hard puzzles
- **Scoring System**: Points per letter, streak bonuses, speed bonuses
- **Hint System**: Get hints with a small score penalty
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Real-time Updates**: Supabase integration for live data
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 14 (App Router) with React Compiler
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account (for full functionality)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/crossword-app.git
cd crossword-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete database schema and setup instructions.

## Project Structure

```
crossword-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/             # React components
│   ├── CrosswordPuzzle.tsx
│   ├── CrosswordGrid.tsx
│   ├── ClueList.tsx
│   ├── AnswerDialog.tsx
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── useCrosswordGame.ts
│   ├── useSupabasePuzzles.ts
│   └── useKeyboardNavigation.ts
├── lib/                    # Utilities and types
│   ├── types.ts
│   ├── constants.ts
│   ├── supabase.ts
│   └── puzzleLoader.ts
├── data/                   # Puzzle data and seeds
│   ├── demo-puzzle.ts
│   ├── seed-templates.sql
│   └── seed-puzzles.sql
└── public/                 # Static assets
```

## Keyboard Controls

| Key         | Action                |
| ----------- | --------------------- |
| ↑↓←→        | Navigate grid         |
| Enter/Space | Open cell dialog      |
| Escape      | Close dialog          |
| Tab         | Switch between inputs |
| Ctrl+R      | Reset game            |

## Scoring

- **10 points** per letter
- **+5 points** streak bonus per consecutive word
- **+50 points** speed bonus (under 1 minute)
- **-20 points** hint penalty

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

This project is configured for deployment on Vercel via GitHub integration:

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main

## License

MIT License

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
