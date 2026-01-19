// Pattern 1: Classic NYT-style 15x15 with 180-degree rotational symmetry
// Black squares represented as 1, white squares as 0
// This pattern has clean diagonal flow with proper word lengths

export const patternClassic = {
  id: "pattern-classic",
  name: "Classic",
  size: 15,
  description:
    "Traditional NYT-style crossword pattern with balanced black square distribution",

  // Grid where 1 = black square, 0 = white square
  // 180-degree rotational symmetry: grid[r][c] === grid[14-r][14-c]
  grid: [
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],

  // Slot definitions will be auto-generated from the grid
  slots: [] as Array<{
    slotId: string;
    direction: "across" | "down";
    row: number;
    col: number;
    length: number;
    number: number;
  }>,
};

// Function to generate slots from grid
function generateSlots(grid: number[][]): typeof patternClassic.slots {
  const slots: typeof patternClassic.slots = [];
  const size = grid.length;
  let clueNumber = 1;
  const numberedCells: Set<string> = new Set();

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === 1) continue; // Skip black squares

      const isStartOfAcross = col === 0 || grid[row][col - 1] === 1;
      const isStartOfDown = row === 0 || grid[row - 1][col] === 1;
      const hasAcrossWord =
        isStartOfAcross && col < size - 1 && grid[row][col + 1] === 0;
      const hasDownWord =
        isStartOfDown && row < size - 1 && grid[row + 1][col] === 0;

      if (hasAcrossWord || hasDownWord) {
        const cellKey = `${row}-${col}`;
        const needsNumber = !numberedCells.has(cellKey);

        if (needsNumber) {
          numberedCells.add(cellKey);
        }

        if (hasAcrossWord) {
          let length = 0;
          for (let c = col; c < size && grid[row][c] === 0; c++) {
            length++;
          }
          if (length >= 3) {
            slots.push({
              slotId: `A${clueNumber}`,
              direction: "across",
              row,
              col,
              length,
              number: clueNumber,
            });
          }
        }

        if (hasDownWord) {
          let length = 0;
          for (let r = row; r < size && grid[r][col] === 0; r++) {
            length++;
          }
          if (length >= 3) {
            slots.push({
              slotId: `D${clueNumber}`,
              direction: "down",
              row,
              col,
              length,
              number: clueNumber,
            });
          }
        }

        if (needsNumber && (hasAcrossWord || hasDownWord)) {
          clueNumber++;
        }
      }
    }
  }

  return slots;
}

// Generate slots for this pattern
patternClassic.slots = generateSlots(patternClassic.grid);
