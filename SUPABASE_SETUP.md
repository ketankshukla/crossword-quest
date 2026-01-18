# Supabase Setup Guide for Crossword Quest

## Overview

This document contains the complete SQL schema and setup instructions for the Crossword Quest database.

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Get your project URL and anon key from Settings > API

## Environment Variables

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database Schema

Run the following SQL in the Supabase SQL Editor:

### 1. Create Templates Table

```sql
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  description TEXT,
  slots JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_templates_template_id ON templates(template_id);
CREATE INDEX idx_templates_size ON templates(size);
```

### 2. Create Puzzles Table

```sql
CREATE TABLE puzzles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  puzzle_id TEXT UNIQUE NOT NULL,
  template_id TEXT NOT NULL REFERENCES templates(template_id),
  theme TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  author TEXT DEFAULT 'Generator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_puzzles_puzzle_id ON puzzles(puzzle_id);
CREATE INDEX idx_puzzles_template_id ON puzzles(template_id);
CREATE INDEX idx_puzzles_category ON puzzles(category);
CREATE INDEX idx_puzzles_difficulty ON puzzles(difficulty);
```

### 3. Create Words Table

```sql
CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  puzzle_id TEXT NOT NULL REFERENCES puzzles(puzzle_id) ON DELETE CASCADE,
  slot_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  clue TEXT NOT NULL,
  hint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_words_puzzle_id ON words(puzzle_id);
CREATE INDEX idx_words_slot_id ON words(slot_id);
```

## Row Level Security (RLS) Policies

Run these SQL statements to set up permissive RLS policies for development:

```sql
-- Enable RLS on all tables
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Permissive policies for development (allow all operations)
CREATE POLICY "Allow all operations on templates" ON templates
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on puzzles" ON puzzles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on words" ON words
  FOR ALL USING (true) WITH CHECK (true);
```

## Enable Realtime

To enable real-time subscriptions, run:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE templates;
ALTER PUBLICATION supabase_realtime ADD TABLE puzzles;
ALTER PUBLICATION supabase_realtime ADD TABLE words;
```

## Database Structure

### Templates Table

| Column      | Type      | Description                                                |
| ----------- | --------- | ---------------------------------------------------------- |
| id          | UUID      | Primary key                                                |
| template_id | TEXT      | Unique template identifier (e.g., "template-13x13-a")      |
| name        | TEXT      | Display name                                               |
| size        | INTEGER   | Grid size (11, 13, or 15)                                  |
| description | TEXT      | Template description                                       |
| slots       | JSONB     | Array of slot definitions with positions and intersections |
| created_at  | TIMESTAMP | Creation timestamp                                         |

### Puzzles Table

| Column      | Type      | Description                                   |
| ----------- | --------- | --------------------------------------------- |
| id          | UUID      | Primary key                                   |
| puzzle_id   | TEXT      | Unique puzzle identifier (e.g., "puzzle-001") |
| template_id | TEXT      | Reference to template                         |
| theme       | TEXT      | Puzzle theme (e.g., "World Geography")        |
| category    | TEXT      | Category (e.g., "World Capitals")             |
| difficulty  | TEXT      | easy, medium, or hard                         |
| author      | TEXT      | Puzzle author                                 |
| created_at  | TIMESTAMP | Creation timestamp                            |

### Words Table

| Column     | Type      | Description                        |
| ---------- | --------- | ---------------------------------- |
| id         | UUID      | Primary key                        |
| puzzle_id  | TEXT      | Reference to puzzle                |
| slot_id    | TEXT      | Slot identifier (e.g., "A1", "D5") |
| answer     | TEXT      | Word answer in uppercase           |
| clue       | TEXT      | Clue with optional emoji           |
| hint       | TEXT      | Detailed hint text                 |
| created_at | TIMESTAMP | Creation timestamp                 |

## Sample Data Insertion

After running the schema, insert the templates and puzzles data using the SQL scripts in the `data/` folder or via the application's seed functionality.

## Verification

To verify the setup, run:

```sql
SELECT COUNT(*) FROM templates;
SELECT COUNT(*) FROM puzzles;
SELECT COUNT(*) FROM words;
```

You should see:

- 5 templates
- 100 puzzles
- ~3000-5000 words (depending on puzzle complexity)
