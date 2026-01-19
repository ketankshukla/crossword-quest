// Pattern 5: Cross 15x15 with full horizontal and vertical symmetry
// Features a cross-like arrangement through the center

export const patternCross = {
  id: "pattern-cross",
  name: "Cross",
  size: 15,
  description: "Cross pattern with central emphasis and full symmetry",

  // 1 = black square, 0 = white square
  grid: [
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  ],

  slots: [] as Array<{
    slotId: string;
    direction: "across" | "down";
    row: number;
    col: number;
    length: number;
    number: number;
  }>,
};

function generateSlots(grid: number[][]): typeof patternCross.slots {
  const slots: typeof patternCross.slots = [];
  const size = grid.length;
  let clueNumber = 1;
  const numberedCells = new Map<string, number>();

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === 1) continue;

      const isStartOfAcross = col === 0 || grid[row][col - 1] === 1;
      const isStartOfDown = row === 0 || grid[row - 1][col] === 1;

      let acrossLength = 0;
      if (isStartOfAcross) {
        for (let c = col; c < size && grid[row][c] === 0; c++) acrossLength++;
      }

      let downLength = 0;
      if (isStartOfDown) {
        for (let r = row; r < size && grid[r][col] === 0; r++) downLength++;
      }

      const hasAcrossWord = acrossLength >= 3;
      const hasDownWord = downLength >= 3;

      if (hasAcrossWord || hasDownWord) {
        const cellKey = `${row}-${col}`;
        let num = numberedCells.get(cellKey);

        if (num === undefined) {
          num = clueNumber++;
          numberedCells.set(cellKey, num);
        }

        if (hasAcrossWord) {
          slots.push({
            slotId: `A${num}`,
            direction: "across",
            row,
            col,
            length: acrossLength,
            number: num,
          });
        }
        if (hasDownWord) {
          slots.push({
            slotId: `D${num}`,
            direction: "down",
            row,
            col,
            length: downLength,
            number: num,
          });
        }
      }
    }
  }
  return slots;
}

patternCross.slots = generateSlots(patternCross.grid);
