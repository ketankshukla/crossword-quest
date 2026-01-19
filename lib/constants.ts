export const GRID_SIZE = 15;
export const CELL_SIZE = 28; // Adjusted for 15x15 grid to fit screen
export const GAP = 1;

export const SCORING = {
  POINTS_PER_LETTER: 10,
  STREAK_BONUS: 5,
  HINT_PENALTY: -20,
  TIME_BONUS_FAST: 50,
  TIME_BONUS_MEDIUM: 25,
  TIME_BONUS_SLOW: 10,
  TIME_THRESHOLD_FAST: 60,
  TIME_THRESHOLD_MEDIUM: 180,
  TIME_THRESHOLD_SLOW: 300,
  MIN_SCORE: 5,
};

export const CONFETTI_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F8B500",
  "#FF69B4",
  "#00D4FF",
];

export const GEOGRAPHY_CATEGORIES = [
  "World Capitals",
  "Countries",
  "Rivers & Lakes",
  "Mountains & Peaks",
  "Islands",
  "Continents & Regions",
  "Famous Cities",
  "Oceans & Seas",
  "Deserts",
  "Landmarks",
];

export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"] as const;
