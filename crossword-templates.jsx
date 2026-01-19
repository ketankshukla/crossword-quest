import React, { useState } from 'react';

// ============================================================================
// CROSSWORD GRID TEMPLATES
// All templates use 180-degree rotational symmetry (NYT standard)
// For each black square at (r, c), there's also one at (size-1-r, size-1-c)
// ============================================================================

const TEMPLATES = [
  // ========== TEMPLATE 1: 15x15 Classic ==========
  {
    id: 'template-15x15-classic',
    name: '15×15 Classic',
    size: 15,
    description: 'Standard NYT weekday layout with balanced word distribution',
    blackSquares: [
      [0,4], [0,10],
      [1,4], [1,10],
      [2,4], [2,10],
      [3,0], [3,1], [3,7], [3,13], [3,14],
      [4,6], [4,7], [4,8],
      [5,3], [5,11],
      [6,5], [6,9],
      [7,0], [7,1], [7,4], [7,10], [7,13], [7,14],
      [8,5], [8,9],
      [9,3], [9,11],
      [10,6], [10,7], [10,8],
      [11,0], [11,1], [11,7], [11,13], [11,14],
      [12,4], [12,10],
      [13,4], [13,10],
      [14,4], [14,10],
    ],
    slots: [
      // ACROSS
      { id: 'A1', direction: 'across', row: 0, col: 0, length: 4 },
      { id: 'A5', direction: 'across', row: 0, col: 5, length: 5 },
      { id: 'A10', direction: 'across', row: 0, col: 11, length: 4 },
      { id: 'A14', direction: 'across', row: 1, col: 0, length: 4 },
      { id: 'A15', direction: 'across', row: 1, col: 5, length: 5 },
      { id: 'A16', direction: 'across', row: 1, col: 11, length: 4 },
      { id: 'A17', direction: 'across', row: 2, col: 0, length: 4 },
      { id: 'A18', direction: 'across', row: 2, col: 5, length: 5 },
      { id: 'A19', direction: 'across', row: 2, col: 11, length: 4 },
      { id: 'A20', direction: 'across', row: 3, col: 2, length: 5 },
      { id: 'A21', direction: 'across', row: 3, col: 8, length: 5 },
      { id: 'A22', direction: 'across', row: 4, col: 0, length: 6 },
      { id: 'A23', direction: 'across', row: 4, col: 9, length: 6 },
      { id: 'A24', direction: 'across', row: 5, col: 0, length: 3 },
      { id: 'A25', direction: 'across', row: 5, col: 4, length: 7 },
      { id: 'A26', direction: 'across', row: 5, col: 12, length: 3 },
      { id: 'A27', direction: 'across', row: 6, col: 0, length: 5 },
      { id: 'A28', direction: 'across', row: 6, col: 6, length: 3 },
      { id: 'A29', direction: 'across', row: 6, col: 10, length: 5 },
      { id: 'A30', direction: 'across', row: 7, col: 2, length: 2 },
      { id: 'A31', direction: 'across', row: 7, col: 5, length: 5 },
      { id: 'A32', direction: 'across', row: 7, col: 11, length: 2 },
      { id: 'A33', direction: 'across', row: 8, col: 0, length: 5 },
      { id: 'A34', direction: 'across', row: 8, col: 6, length: 3 },
      { id: 'A35', direction: 'across', row: 8, col: 10, length: 5 },
      { id: 'A36', direction: 'across', row: 9, col: 0, length: 3 },
      { id: 'A37', direction: 'across', row: 9, col: 4, length: 7 },
      { id: 'A38', direction: 'across', row: 9, col: 12, length: 3 },
      { id: 'A39', direction: 'across', row: 10, col: 0, length: 6 },
      { id: 'A40', direction: 'across', row: 10, col: 9, length: 6 },
      { id: 'A41', direction: 'across', row: 11, col: 2, length: 5 },
      { id: 'A42', direction: 'across', row: 11, col: 8, length: 5 },
      { id: 'A43', direction: 'across', row: 12, col: 0, length: 4 },
      { id: 'A44', direction: 'across', row: 12, col: 5, length: 5 },
      { id: 'A45', direction: 'across', row: 12, col: 11, length: 4 },
      { id: 'A46', direction: 'across', row: 13, col: 0, length: 4 },
      { id: 'A47', direction: 'across', row: 13, col: 5, length: 5 },
      { id: 'A48', direction: 'across', row: 13, col: 11, length: 4 },
      { id: 'A49', direction: 'across', row: 14, col: 0, length: 4 },
      { id: 'A50', direction: 'across', row: 14, col: 5, length: 5 },
      { id: 'A51', direction: 'across', row: 14, col: 11, length: 4 },
      // DOWN
      { id: 'D1', direction: 'down', row: 0, col: 0, length: 3 },
      { id: 'D2', direction: 'down', row: 0, col: 1, length: 3 },
      { id: 'D3', direction: 'down', row: 0, col: 2, length: 7 },
      { id: 'D4', direction: 'down', row: 0, col: 3, length: 5 },
      { id: 'D5', direction: 'down', row: 0, col: 5, length: 7 },
      { id: 'D6', direction: 'down', row: 0, col: 6, length: 4 },
      { id: 'D7', direction: 'down', row: 0, col: 7, length: 3 },
      { id: 'D8', direction: 'down', row: 0, col: 8, length: 4 },
      { id: 'D9', direction: 'down', row: 0, col: 9, length: 7 },
      { id: 'D10', direction: 'down', row: 0, col: 11, length: 5 },
      { id: 'D11', direction: 'down', row: 0, col: 12, length: 3 },
      { id: 'D12', direction: 'down', row: 0, col: 13, length: 3 },
      { id: 'D13', direction: 'down', row: 0, col: 14, length: 3 },
      { id: 'D14', direction: 'down', row: 3, col: 13, length: 4 },
      { id: 'D15', direction: 'down', row: 3, col: 14, length: 4 },
      { id: 'D16', direction: 'down', row: 5, col: 6, length: 5 },
      { id: 'D17', direction: 'down', row: 5, col: 8, length: 5 },
      { id: 'D18', direction: 'down', row: 8, col: 0, length: 4 },
      { id: 'D19', direction: 'down', row: 8, col: 1, length: 4 },
      { id: 'D20', direction: 'down', row: 10, col: 3, length: 5 },
      { id: 'D21', direction: 'down', row: 10, col: 11, length: 5 },
      { id: 'D22', direction: 'down', row: 12, col: 0, length: 3 },
      { id: 'D23', direction: 'down', row: 12, col: 1, length: 3 },
    ]
  },

  // ========== TEMPLATE 2: 15x15 Open Center ==========
  {
    id: 'template-15x15-open',
    name: '15×15 Open Center',
    size: 15,
    description: 'Wide open center allowing longer theme entries',
    blackSquares: [
      [0,5], [0,9],
      [1,5], [1,9],
      [2,5], [2,9],
      [3,0], [3,1], [3,2], [3,12], [3,13], [3,14],
      [4,7],
      [5,3], [5,4], [5,10], [5,11],
      [6,6], [6,8],
      [7,0], [7,14],
      [8,6], [8,8],
      [9,3], [9,4], [9,10], [9,11],
      [10,7],
      [11,0], [11,1], [11,2], [11,12], [11,13], [11,14],
      [12,5], [12,9],
      [13,5], [13,9],
      [14,5], [14,9],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 0, length: 5 },
      { id: 'A2', direction: 'across', row: 0, col: 6, length: 3 },
      { id: 'A3', direction: 'across', row: 0, col: 10, length: 5 },
      { id: 'A4', direction: 'across', row: 1, col: 0, length: 5 },
      { id: 'A5', direction: 'across', row: 1, col: 6, length: 3 },
      { id: 'A6', direction: 'across', row: 1, col: 10, length: 5 },
      { id: 'A7', direction: 'across', row: 2, col: 0, length: 5 },
      { id: 'A8', direction: 'across', row: 2, col: 6, length: 3 },
      { id: 'A9', direction: 'across', row: 2, col: 10, length: 5 },
      { id: 'A10', direction: 'across', row: 3, col: 3, length: 9 },
      { id: 'A11', direction: 'across', row: 4, col: 0, length: 7 },
      { id: 'A12', direction: 'across', row: 4, col: 8, length: 7 },
      { id: 'A13', direction: 'across', row: 5, col: 0, length: 3 },
      { id: 'A14', direction: 'across', row: 5, col: 5, length: 5 },
      { id: 'A15', direction: 'across', row: 5, col: 12, length: 3 },
      { id: 'A16', direction: 'across', row: 6, col: 0, length: 6 },
      { id: 'A17', direction: 'across', row: 6, col: 9, length: 6 },
      { id: 'A18', direction: 'across', row: 7, col: 1, length: 13 },
      { id: 'A19', direction: 'across', row: 8, col: 0, length: 6 },
      { id: 'A20', direction: 'across', row: 8, col: 9, length: 6 },
      { id: 'A21', direction: 'across', row: 9, col: 0, length: 3 },
      { id: 'A22', direction: 'across', row: 9, col: 5, length: 5 },
      { id: 'A23', direction: 'across', row: 9, col: 12, length: 3 },
      { id: 'A24', direction: 'across', row: 10, col: 0, length: 7 },
      { id: 'A25', direction: 'across', row: 10, col: 8, length: 7 },
      { id: 'A26', direction: 'across', row: 11, col: 3, length: 9 },
      { id: 'A27', direction: 'across', row: 12, col: 0, length: 5 },
      { id: 'A28', direction: 'across', row: 12, col: 6, length: 3 },
      { id: 'A29', direction: 'across', row: 12, col: 10, length: 5 },
      { id: 'A30', direction: 'across', row: 13, col: 0, length: 5 },
      { id: 'A31', direction: 'across', row: 13, col: 6, length: 3 },
      { id: 'A32', direction: 'across', row: 13, col: 10, length: 5 },
      { id: 'A33', direction: 'across', row: 14, col: 0, length: 5 },
      { id: 'A34', direction: 'across', row: 14, col: 6, length: 3 },
      { id: 'A35', direction: 'across', row: 14, col: 10, length: 5 },
    ]
  },

  // ========== TEMPLATE 3: 13x13 Compact ==========
  {
    id: 'template-13x13-compact',
    name: '13×13 Compact',
    size: 13,
    description: 'Smaller grid perfect for quick puzzles',
    blackSquares: [
      [0,4], [0,8],
      [1,4], [1,8],
      [2,4], [2,8],
      [3,0], [3,6], [3,12],
      [4,3], [4,9],
      [5,5], [5,7],
      [6,0], [6,1], [6,11], [6,12],
      [7,5], [7,7],
      [8,3], [8,9],
      [9,0], [9,6], [9,12],
      [10,4], [10,8],
      [11,4], [11,8],
      [12,4], [12,8],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 0, length: 4 },
      { id: 'A2', direction: 'across', row: 0, col: 5, length: 3 },
      { id: 'A3', direction: 'across', row: 0, col: 9, length: 4 },
      { id: 'A4', direction: 'across', row: 1, col: 0, length: 4 },
      { id: 'A5', direction: 'across', row: 1, col: 5, length: 3 },
      { id: 'A6', direction: 'across', row: 1, col: 9, length: 4 },
      { id: 'A7', direction: 'across', row: 2, col: 0, length: 4 },
      { id: 'A8', direction: 'across', row: 2, col: 5, length: 3 },
      { id: 'A9', direction: 'across', row: 2, col: 9, length: 4 },
      { id: 'A10', direction: 'across', row: 3, col: 1, length: 5 },
      { id: 'A11', direction: 'across', row: 3, col: 7, length: 5 },
      { id: 'A12', direction: 'across', row: 4, col: 0, length: 3 },
      { id: 'A13', direction: 'across', row: 4, col: 4, length: 5 },
      { id: 'A14', direction: 'across', row: 4, col: 10, length: 3 },
      { id: 'A15', direction: 'across', row: 5, col: 0, length: 5 },
      { id: 'A16', direction: 'across', row: 5, col: 8, length: 5 },
      { id: 'A17', direction: 'across', row: 6, col: 2, length: 9 },
      { id: 'A18', direction: 'across', row: 7, col: 0, length: 5 },
      { id: 'A19', direction: 'across', row: 7, col: 8, length: 5 },
      { id: 'A20', direction: 'across', row: 8, col: 0, length: 3 },
      { id: 'A21', direction: 'across', row: 8, col: 4, length: 5 },
      { id: 'A22', direction: 'across', row: 8, col: 10, length: 3 },
      { id: 'A23', direction: 'across', row: 9, col: 1, length: 5 },
      { id: 'A24', direction: 'across', row: 9, col: 7, length: 5 },
      { id: 'A25', direction: 'across', row: 10, col: 0, length: 4 },
      { id: 'A26', direction: 'across', row: 10, col: 5, length: 3 },
      { id: 'A27', direction: 'across', row: 10, col: 9, length: 4 },
      { id: 'A28', direction: 'across', row: 11, col: 0, length: 4 },
      { id: 'A29', direction: 'across', row: 11, col: 5, length: 3 },
      { id: 'A30', direction: 'across', row: 11, col: 9, length: 4 },
      { id: 'A31', direction: 'across', row: 12, col: 0, length: 4 },
      { id: 'A32', direction: 'across', row: 12, col: 5, length: 3 },
      { id: 'A33', direction: 'across', row: 12, col: 9, length: 4 },
    ]
  },

  // ========== TEMPLATE 4: 15x15 Diamond ==========
  {
    id: 'template-15x15-diamond',
    name: '15×15 Diamond',
    size: 15,
    description: 'Diamond-shaped black squares in center',
    blackSquares: [
      [0,0], [0,1], [0,13], [0,14],
      [1,0], [1,14],
      [2,6], [2,7], [2,8],
      [3,5], [3,9],
      [4,4], [4,10],
      [5,3], [5,11],
      [6,2], [6,12],
      [7,0], [7,1], [7,13], [7,14],
      [8,2], [8,12],
      [9,3], [9,11],
      [10,4], [10,10],
      [11,5], [11,9],
      [12,6], [12,7], [12,8],
      [13,0], [13,14],
      [14,0], [14,1], [14,13], [14,14],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 2, length: 11 },
      { id: 'A2', direction: 'across', row: 1, col: 1, length: 13 },
      { id: 'A3', direction: 'across', row: 2, col: 0, length: 6 },
      { id: 'A4', direction: 'across', row: 2, col: 9, length: 6 },
      { id: 'A5', direction: 'across', row: 3, col: 0, length: 5 },
      { id: 'A6', direction: 'across', row: 3, col: 6, length: 3 },
      { id: 'A7', direction: 'across', row: 3, col: 10, length: 5 },
      { id: 'A8', direction: 'across', row: 4, col: 0, length: 4 },
      { id: 'A9', direction: 'across', row: 4, col: 5, length: 5 },
      { id: 'A10', direction: 'across', row: 4, col: 11, length: 4 },
      { id: 'A11', direction: 'across', row: 5, col: 0, length: 3 },
      { id: 'A12', direction: 'across', row: 5, col: 4, length: 7 },
      { id: 'A13', direction: 'across', row: 5, col: 12, length: 3 },
      { id: 'A14', direction: 'across', row: 6, col: 0, length: 2 },
      { id: 'A15', direction: 'across', row: 6, col: 3, length: 9 },
      { id: 'A16', direction: 'across', row: 6, col: 13, length: 2 },
      { id: 'A17', direction: 'across', row: 7, col: 2, length: 11 },
      { id: 'A18', direction: 'across', row: 8, col: 0, length: 2 },
      { id: 'A19', direction: 'across', row: 8, col: 3, length: 9 },
      { id: 'A20', direction: 'across', row: 8, col: 13, length: 2 },
      { id: 'A21', direction: 'across', row: 9, col: 0, length: 3 },
      { id: 'A22', direction: 'across', row: 9, col: 4, length: 7 },
      { id: 'A23', direction: 'across', row: 9, col: 12, length: 3 },
      { id: 'A24', direction: 'across', row: 10, col: 0, length: 4 },
      { id: 'A25', direction: 'across', row: 10, col: 5, length: 5 },
      { id: 'A26', direction: 'across', row: 10, col: 11, length: 4 },
      { id: 'A27', direction: 'across', row: 11, col: 0, length: 5 },
      { id: 'A28', direction: 'across', row: 11, col: 6, length: 3 },
      { id: 'A29', direction: 'across', row: 11, col: 10, length: 5 },
      { id: 'A30', direction: 'across', row: 12, col: 0, length: 6 },
      { id: 'A31', direction: 'across', row: 12, col: 9, length: 6 },
      { id: 'A32', direction: 'across', row: 13, col: 1, length: 13 },
      { id: 'A33', direction: 'across', row: 14, col: 2, length: 11 },
    ]
  },

  // ========== TEMPLATE 5: 11x11 Mini ==========
  {
    id: 'template-11x11-mini',
    name: '11×11 Mini',
    size: 11,
    description: 'Quick mini puzzle format for daily challenges',
    blackSquares: [
      [0,5],
      [1,5],
      [2,0], [2,1], [2,9], [2,10],
      [3,4], [3,6],
      [4,3], [4,7],
      [5,0], [5,10],
      [6,3], [6,7],
      [7,4], [7,6],
      [8,0], [8,1], [8,9], [8,10],
      [9,5],
      [10,5],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 0, length: 5 },
      { id: 'A2', direction: 'across', row: 0, col: 6, length: 5 },
      { id: 'A3', direction: 'across', row: 1, col: 0, length: 5 },
      { id: 'A4', direction: 'across', row: 1, col: 6, length: 5 },
      { id: 'A5', direction: 'across', row: 2, col: 2, length: 7 },
      { id: 'A6', direction: 'across', row: 3, col: 0, length: 4 },
      { id: 'A7', direction: 'across', row: 3, col: 7, length: 4 },
      { id: 'A8', direction: 'across', row: 4, col: 0, length: 3 },
      { id: 'A9', direction: 'across', row: 4, col: 4, length: 3 },
      { id: 'A10', direction: 'across', row: 4, col: 8, length: 3 },
      { id: 'A11', direction: 'across', row: 5, col: 1, length: 9 },
      { id: 'A12', direction: 'across', row: 6, col: 0, length: 3 },
      { id: 'A13', direction: 'across', row: 6, col: 4, length: 3 },
      { id: 'A14', direction: 'across', row: 6, col: 8, length: 3 },
      { id: 'A15', direction: 'across', row: 7, col: 0, length: 4 },
      { id: 'A16', direction: 'across', row: 7, col: 7, length: 4 },
      { id: 'A17', direction: 'across', row: 8, col: 2, length: 7 },
      { id: 'A18', direction: 'across', row: 9, col: 0, length: 5 },
      { id: 'A19', direction: 'across', row: 9, col: 6, length: 5 },
      { id: 'A20', direction: 'across', row: 10, col: 0, length: 5 },
      { id: 'A21', direction: 'across', row: 10, col: 6, length: 5 },
    ]
  },

  // ========== TEMPLATE 6: 15x15 Staircase ==========
  {
    id: 'template-15x15-staircase',
    name: '15×15 Staircase',
    size: 15,
    description: 'Stepped diagonal pattern for varied word lengths',
    blackSquares: [
      [0,3], [0,7], [0,11],
      [1,3], [1,11],
      [2,3], [2,7], [2,11],
      [3,0], [3,1], [3,2], [3,7], [3,12], [3,13], [3,14],
      [4,7],
      [5,4], [5,5], [5,9], [5,10],
      [6,4], [6,10],
      [7,0], [7,4], [7,10], [7,14],
      [8,4], [8,10],
      [9,4], [9,5], [9,9], [9,10],
      [10,7],
      [11,0], [11,1], [11,2], [11,7], [11,12], [11,13], [11,14],
      [12,3], [12,7], [12,11],
      [13,3], [13,11],
      [14,3], [14,7], [14,11],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 0, length: 3 },
      { id: 'A2', direction: 'across', row: 0, col: 4, length: 3 },
      { id: 'A3', direction: 'across', row: 0, col: 8, length: 3 },
      { id: 'A4', direction: 'across', row: 0, col: 12, length: 3 },
      { id: 'A5', direction: 'across', row: 1, col: 0, length: 3 },
      { id: 'A6', direction: 'across', row: 1, col: 4, length: 7 },
      { id: 'A7', direction: 'across', row: 1, col: 12, length: 3 },
      { id: 'A8', direction: 'across', row: 2, col: 0, length: 3 },
      { id: 'A9', direction: 'across', row: 2, col: 4, length: 3 },
      { id: 'A10', direction: 'across', row: 2, col: 8, length: 3 },
      { id: 'A11', direction: 'across', row: 2, col: 12, length: 3 },
      { id: 'A12', direction: 'across', row: 3, col: 3, length: 4 },
      { id: 'A13', direction: 'across', row: 3, col: 8, length: 4 },
      { id: 'A14', direction: 'across', row: 4, col: 0, length: 7 },
      { id: 'A15', direction: 'across', row: 4, col: 8, length: 7 },
      { id: 'A16', direction: 'across', row: 5, col: 0, length: 4 },
      { id: 'A17', direction: 'across', row: 5, col: 6, length: 3 },
      { id: 'A18', direction: 'across', row: 5, col: 11, length: 4 },
      { id: 'A19', direction: 'across', row: 6, col: 0, length: 4 },
      { id: 'A20', direction: 'across', row: 6, col: 5, length: 5 },
      { id: 'A21', direction: 'across', row: 6, col: 11, length: 4 },
      { id: 'A22', direction: 'across', row: 7, col: 1, length: 3 },
      { id: 'A23', direction: 'across', row: 7, col: 5, length: 5 },
      { id: 'A24', direction: 'across', row: 7, col: 11, length: 3 },
      { id: 'A25', direction: 'across', row: 8, col: 0, length: 4 },
      { id: 'A26', direction: 'across', row: 8, col: 5, length: 5 },
      { id: 'A27', direction: 'across', row: 8, col: 11, length: 4 },
      { id: 'A28', direction: 'across', row: 9, col: 0, length: 4 },
      { id: 'A29', direction: 'across', row: 9, col: 6, length: 3 },
      { id: 'A30', direction: 'across', row: 9, col: 11, length: 4 },
      { id: 'A31', direction: 'across', row: 10, col: 0, length: 7 },
      { id: 'A32', direction: 'across', row: 10, col: 8, length: 7 },
      { id: 'A33', direction: 'across', row: 11, col: 3, length: 4 },
      { id: 'A34', direction: 'across', row: 11, col: 8, length: 4 },
      { id: 'A35', direction: 'across', row: 12, col: 0, length: 3 },
      { id: 'A36', direction: 'across', row: 12, col: 4, length: 3 },
      { id: 'A37', direction: 'across', row: 12, col: 8, length: 3 },
      { id: 'A38', direction: 'across', row: 12, col: 12, length: 3 },
      { id: 'A39', direction: 'across', row: 13, col: 0, length: 3 },
      { id: 'A40', direction: 'across', row: 13, col: 4, length: 7 },
      { id: 'A41', direction: 'across', row: 13, col: 12, length: 3 },
      { id: 'A42', direction: 'across', row: 14, col: 0, length: 3 },
      { id: 'A43', direction: 'across', row: 14, col: 4, length: 3 },
      { id: 'A44', direction: 'across', row: 14, col: 8, length: 3 },
      { id: 'A45', direction: 'across', row: 14, col: 12, length: 3 },
    ]
  },

  // ========== TEMPLATE 7: 13x13 Cross ==========
  {
    id: 'template-13x13-cross',
    name: '13×13 Cross',
    size: 13,
    description: 'Cross pattern with open corners',
    blackSquares: [
      [0,0], [0,1], [0,11], [0,12],
      [1,0], [1,12],
      [2,5], [2,6], [2,7],
      [3,5], [3,7],
      [4,5], [4,7],
      [5,0], [5,1], [5,2], [5,10], [5,11], [5,12],
      [6,0], [6,12],
      [7,0], [7,1], [7,2], [7,10], [7,11], [7,12],
      [8,5], [8,7],
      [9,5], [9,7],
      [10,5], [10,6], [10,7],
      [11,0], [11,12],
      [12,0], [12,1], [12,11], [12,12],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 2, length: 9 },
      { id: 'A2', direction: 'across', row: 1, col: 1, length: 11 },
      { id: 'A3', direction: 'across', row: 2, col: 0, length: 5 },
      { id: 'A4', direction: 'across', row: 2, col: 8, length: 5 },
      { id: 'A5', direction: 'across', row: 3, col: 0, length: 5 },
      { id: 'A6', direction: 'across', row: 3, col: 8, length: 5 },
      { id: 'A7', direction: 'across', row: 4, col: 0, length: 5 },
      { id: 'A8', direction: 'across', row: 4, col: 8, length: 5 },
      { id: 'A9', direction: 'across', row: 5, col: 3, length: 7 },
      { id: 'A10', direction: 'across', row: 6, col: 1, length: 11 },
      { id: 'A11', direction: 'across', row: 7, col: 3, length: 7 },
      { id: 'A12', direction: 'across', row: 8, col: 0, length: 5 },
      { id: 'A13', direction: 'across', row: 8, col: 8, length: 5 },
      { id: 'A14', direction: 'across', row: 9, col: 0, length: 5 },
      { id: 'A15', direction: 'across', row: 9, col: 8, length: 5 },
      { id: 'A16', direction: 'across', row: 10, col: 0, length: 5 },
      { id: 'A17', direction: 'across', row: 10, col: 8, length: 5 },
      { id: 'A18', direction: 'across', row: 11, col: 1, length: 11 },
      { id: 'A19', direction: 'across', row: 12, col: 2, length: 9 },
    ]
  },

  // ========== TEMPLATE 8: 15x15 Pinwheel ==========
  {
    id: 'template-15x15-pinwheel',
    name: '15×15 Pinwheel',
    size: 15,
    description: 'Pinwheel rotation pattern with dynamic flow',
    blackSquares: [
      [0,5], [0,6],
      [1,5],
      [2,5], [2,10], [2,11], [2,12],
      [3,0], [3,1], [3,10],
      [4,4], [4,10],
      [5,0], [5,4], [5,8], [5,9],
      [6,4], [6,8], [6,14],
      [7,3], [7,7], [7,11],
      [8,0], [8,6], [8,10],
      [9,5], [9,6], [9,10], [9,14],
      [10,4], [10,10],
      [11,4], [11,13], [11,14],
      [12,2], [12,3], [12,4], [12,9],
      [13,9],
      [14,8], [14,9],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 0, length: 5 },
      { id: 'A2', direction: 'across', row: 0, col: 7, length: 8 },
      { id: 'A3', direction: 'across', row: 1, col: 0, length: 5 },
      { id: 'A4', direction: 'across', row: 1, col: 6, length: 9 },
      { id: 'A5', direction: 'across', row: 2, col: 0, length: 5 },
      { id: 'A6', direction: 'across', row: 2, col: 6, length: 4 },
      { id: 'A7', direction: 'across', row: 2, col: 13, length: 2 },
      { id: 'A8', direction: 'across', row: 3, col: 2, length: 8 },
      { id: 'A9', direction: 'across', row: 3, col: 11, length: 4 },
      { id: 'A10', direction: 'across', row: 4, col: 0, length: 4 },
      { id: 'A11', direction: 'across', row: 4, col: 5, length: 5 },
      { id: 'A12', direction: 'across', row: 4, col: 11, length: 4 },
      { id: 'A13', direction: 'across', row: 5, col: 1, length: 3 },
      { id: 'A14', direction: 'across', row: 5, col: 5, length: 3 },
      { id: 'A15', direction: 'across', row: 5, col: 10, length: 5 },
      { id: 'A16', direction: 'across', row: 6, col: 0, length: 4 },
      { id: 'A17', direction: 'across', row: 6, col: 5, length: 3 },
      { id: 'A18', direction: 'across', row: 6, col: 9, length: 5 },
      { id: 'A19', direction: 'across', row: 7, col: 0, length: 3 },
      { id: 'A20', direction: 'across', row: 7, col: 4, length: 3 },
      { id: 'A21', direction: 'across', row: 7, col: 8, length: 3 },
      { id: 'A22', direction: 'across', row: 7, col: 12, length: 3 },
      { id: 'A23', direction: 'across', row: 8, col: 1, length: 5 },
      { id: 'A24', direction: 'across', row: 8, col: 7, length: 3 },
      { id: 'A25', direction: 'across', row: 8, col: 11, length: 4 },
      { id: 'A26', direction: 'across', row: 9, col: 0, length: 5 },
      { id: 'A27', direction: 'across', row: 9, col: 7, length: 3 },
      { id: 'A28', direction: 'across', row: 9, col: 11, length: 3 },
      { id: 'A29', direction: 'across', row: 10, col: 0, length: 4 },
      { id: 'A30', direction: 'across', row: 10, col: 5, length: 5 },
      { id: 'A31', direction: 'across', row: 10, col: 11, length: 4 },
      { id: 'A32', direction: 'across', row: 11, col: 0, length: 4 },
      { id: 'A33', direction: 'across', row: 11, col: 5, length: 8 },
      { id: 'A34', direction: 'across', row: 12, col: 0, length: 2 },
      { id: 'A35', direction: 'across', row: 12, col: 5, length: 4 },
      { id: 'A36', direction: 'across', row: 12, col: 10, length: 5 },
      { id: 'A37', direction: 'across', row: 13, col: 0, length: 9 },
      { id: 'A38', direction: 'across', row: 13, col: 10, length: 5 },
      { id: 'A39', direction: 'across', row: 14, col: 0, length: 8 },
      { id: 'A40', direction: 'across', row: 14, col: 10, length: 5 },
    ]
  },

  // ========== TEMPLATE 9: 11x11 Blocks ==========
  {
    id: 'template-11x11-blocks',
    name: '11×11 Blocks',
    size: 11,
    description: 'Block pattern with medium-length words',
    blackSquares: [
      [0,4], [0,6],
      [1,4], [1,6],
      [2,0], [2,1], [2,9], [2,10],
      [3,3], [3,7],
      [4,0], [4,3], [4,7], [4,10],
      [5,5],
      [6,0], [6,3], [6,7], [6,10],
      [7,3], [7,7],
      [8,0], [8,1], [8,9], [8,10],
      [9,4], [9,6],
      [10,4], [10,6],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 0, length: 4 },
      { id: 'A2', direction: 'across', row: 0, col: 7, length: 4 },
      { id: 'A3', direction: 'across', row: 1, col: 0, length: 4 },
      { id: 'A4', direction: 'across', row: 1, col: 7, length: 4 },
      { id: 'A5', direction: 'across', row: 2, col: 2, length: 7 },
      { id: 'A6', direction: 'across', row: 3, col: 0, length: 3 },
      { id: 'A7', direction: 'across', row: 3, col: 4, length: 3 },
      { id: 'A8', direction: 'across', row: 3, col: 8, length: 3 },
      { id: 'A9', direction: 'across', row: 4, col: 1, length: 2 },
      { id: 'A10', direction: 'across', row: 4, col: 4, length: 3 },
      { id: 'A11', direction: 'across', row: 4, col: 8, length: 2 },
      { id: 'A12', direction: 'across', row: 5, col: 0, length: 5 },
      { id: 'A13', direction: 'across', row: 5, col: 6, length: 5 },
      { id: 'A14', direction: 'across', row: 6, col: 1, length: 2 },
      { id: 'A15', direction: 'across', row: 6, col: 4, length: 3 },
      { id: 'A16', direction: 'across', row: 6, col: 8, length: 2 },
      { id: 'A17', direction: 'across', row: 7, col: 0, length: 3 },
      { id: 'A18', direction: 'across', row: 7, col: 4, length: 3 },
      { id: 'A19', direction: 'across', row: 7, col: 8, length: 3 },
      { id: 'A20', direction: 'across', row: 8, col: 2, length: 7 },
      { id: 'A21', direction: 'across', row: 9, col: 0, length: 4 },
      { id: 'A22', direction: 'across', row: 9, col: 7, length: 4 },
      { id: 'A23', direction: 'across', row: 10, col: 0, length: 4 },
      { id: 'A24', direction: 'across', row: 10, col: 7, length: 4 },
    ]
  },

  // ========== TEMPLATE 10: 15x15 Triple Stack ==========
  {
    id: 'template-15x15-triplestack',
    name: '15×15 Triple Stack',
    size: 15,
    description: 'Three 15-letter theme entries across top and bottom',
    blackSquares: [
      [3,0], [3,1], [3,2], [3,3], [3,11], [3,12], [3,13], [3,14],
      [4,5], [4,9],
      [5,5], [5,9],
      [6,0], [6,1], [6,5], [6,9], [6,13], [6,14],
      [7,4], [7,10],
      [8,0], [8,1], [8,5], [8,9], [8,13], [8,14],
      [9,5], [9,9],
      [10,5], [10,9],
      [11,0], [11,1], [11,2], [11,3], [11,11], [11,12], [11,13], [11,14],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 0, length: 15 },
      { id: 'A2', direction: 'across', row: 1, col: 0, length: 15 },
      { id: 'A3', direction: 'across', row: 2, col: 0, length: 15 },
      { id: 'A4', direction: 'across', row: 3, col: 4, length: 7 },
      { id: 'A5', direction: 'across', row: 4, col: 0, length: 5 },
      { id: 'A6', direction: 'across', row: 4, col: 6, length: 3 },
      { id: 'A7', direction: 'across', row: 4, col: 10, length: 5 },
      { id: 'A8', direction: 'across', row: 5, col: 0, length: 5 },
      { id: 'A9', direction: 'across', row: 5, col: 6, length: 3 },
      { id: 'A10', direction: 'across', row: 5, col: 10, length: 5 },
      { id: 'A11', direction: 'across', row: 6, col: 2, length: 3 },
      { id: 'A12', direction: 'across', row: 6, col: 6, length: 3 },
      { id: 'A13', direction: 'across', row: 6, col: 10, length: 3 },
      { id: 'A14', direction: 'across', row: 7, col: 0, length: 4 },
      { id: 'A15', direction: 'across', row: 7, col: 5, length: 5 },
      { id: 'A16', direction: 'across', row: 7, col: 11, length: 4 },
      { id: 'A17', direction: 'across', row: 8, col: 2, length: 3 },
      { id: 'A18', direction: 'across', row: 8, col: 6, length: 3 },
      { id: 'A19', direction: 'across', row: 8, col: 10, length: 3 },
      { id: 'A20', direction: 'across', row: 9, col: 0, length: 5 },
      { id: 'A21', direction: 'across', row: 9, col: 6, length: 3 },
      { id: 'A22', direction: 'across', row: 9, col: 10, length: 5 },
      { id: 'A23', direction: 'across', row: 10, col: 0, length: 5 },
      { id: 'A24', direction: 'across', row: 10, col: 6, length: 3 },
      { id: 'A25', direction: 'across', row: 10, col: 10, length: 5 },
      { id: 'A26', direction: 'across', row: 11, col: 4, length: 7 },
      { id: 'A27', direction: 'across', row: 12, col: 0, length: 15 },
      { id: 'A28', direction: 'across', row: 13, col: 0, length: 15 },
      { id: 'A29', direction: 'across', row: 14, col: 0, length: 15 },
    ]
  },

  // ========== TEMPLATE 11: 13x13 Spiral ==========
  {
    id: 'template-13x13-spiral',
    name: '13×13 Spiral',
    size: 13,
    description: 'Spiral pattern emanating from center',
    blackSquares: [
      [0,0], [0,6], [0,12],
      [1,3], [1,9],
      [2,3], [2,6], [2,9],
      [3,0], [3,1], [3,6], [3,11], [3,12],
      [4,4], [4,8],
      [5,4], [5,8],
      [6,0], [6,4], [6,8], [6,12],
      [7,4], [7,8],
      [8,4], [8,8],
      [9,0], [9,1], [9,6], [9,11], [9,12],
      [10,3], [10,6], [10,9],
      [11,3], [11,9],
      [12,0], [12,6], [12,12],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 1, length: 5 },
      { id: 'A2', direction: 'across', row: 0, col: 7, length: 5 },
      { id: 'A3', direction: 'across', row: 1, col: 0, length: 3 },
      { id: 'A4', direction: 'across', row: 1, col: 4, length: 5 },
      { id: 'A5', direction: 'across', row: 1, col: 10, length: 3 },
      { id: 'A6', direction: 'across', row: 2, col: 0, length: 3 },
      { id: 'A7', direction: 'across', row: 2, col: 4, length: 2 },
      { id: 'A8', direction: 'across', row: 2, col: 7, length: 2 },
      { id: 'A9', direction: 'across', row: 2, col: 10, length: 3 },
      { id: 'A10', direction: 'across', row: 3, col: 2, length: 4 },
      { id: 'A11', direction: 'across', row: 3, col: 7, length: 4 },
      { id: 'A12', direction: 'across', row: 4, col: 0, length: 4 },
      { id: 'A13', direction: 'across', row: 4, col: 5, length: 3 },
      { id: 'A14', direction: 'across', row: 4, col: 9, length: 4 },
      { id: 'A15', direction: 'across', row: 5, col: 0, length: 4 },
      { id: 'A16', direction: 'across', row: 5, col: 5, length: 3 },
      { id: 'A17', direction: 'across', row: 5, col: 9, length: 4 },
      { id: 'A18', direction: 'across', row: 6, col: 1, length: 3 },
      { id: 'A19', direction: 'across', row: 6, col: 5, length: 3 },
      { id: 'A20', direction: 'across', row: 6, col: 9, length: 3 },
      { id: 'A21', direction: 'across', row: 7, col: 0, length: 4 },
      { id: 'A22', direction: 'across', row: 7, col: 5, length: 3 },
      { id: 'A23', direction: 'across', row: 7, col: 9, length: 4 },
      { id: 'A24', direction: 'across', row: 8, col: 0, length: 4 },
      { id: 'A25', direction: 'across', row: 8, col: 5, length: 3 },
      { id: 'A26', direction: 'across', row: 8, col: 9, length: 4 },
      { id: 'A27', direction: 'across', row: 9, col: 2, length: 4 },
      { id: 'A28', direction: 'across', row: 9, col: 7, length: 4 },
      { id: 'A29', direction: 'across', row: 10, col: 0, length: 3 },
      { id: 'A30', direction: 'across', row: 10, col: 4, length: 2 },
      { id: 'A31', direction: 'across', row: 10, col: 7, length: 2 },
      { id: 'A32', direction: 'across', row: 10, col: 10, length: 3 },
      { id: 'A33', direction: 'across', row: 11, col: 0, length: 3 },
      { id: 'A34', direction: 'across', row: 11, col: 4, length: 5 },
      { id: 'A35', direction: 'across', row: 11, col: 10, length: 3 },
      { id: 'A36', direction: 'across', row: 12, col: 1, length: 5 },
      { id: 'A37', direction: 'across', row: 12, col: 7, length: 5 },
    ]
  },

  // ========== TEMPLATE 12: 15x15 Corners ==========
  {
    id: 'template-15x15-corners',
    name: '15×15 Corners',
    size: 15,
    description: 'Heavy corners with wide open center',
    blackSquares: [
      [0,0], [0,1], [0,2], [0,12], [0,13], [0,14],
      [1,0], [1,1], [1,13], [1,14],
      [2,0], [2,14],
      [3,5], [3,9],
      [4,5], [4,9],
      [5,3], [5,4], [5,10], [5,11],
      [6,7],
      [7,0], [7,7], [7,14],
      [8,7],
      [9,3], [9,4], [9,10], [9,11],
      [10,5], [10,9],
      [11,5], [11,9],
      [12,0], [12,14],
      [13,0], [13,1], [13,13], [13,14],
      [14,0], [14,1], [14,2], [14,12], [14,13], [14,14],
    ],
    slots: [
      { id: 'A1', direction: 'across', row: 0, col: 3, length: 9 },
      { id: 'A2', direction: 'across', row: 1, col: 2, length: 11 },
      { id: 'A3', direction: 'across', row: 2, col: 1, length: 13 },
      { id: 'A4', direction: 'across', row: 3, col: 0, length: 5 },
      { id: 'A5', direction: 'across', row: 3, col: 6, length: 3 },
      { id: 'A6', direction: 'across', row: 3, col: 10, length: 5 },
      { id: 'A7', direction: 'across', row: 4, col: 0, length: 5 },
      { id: 'A8', direction: 'across', row: 4, col: 6, length: 3 },
      { id: 'A9', direction: 'across', row: 4, col: 10, length: 5 },
      { id: 'A10', direction: 'across', row: 5, col: 0, length: 3 },
      { id: 'A11', direction: 'across', row: 5, col: 5, length: 5 },
      { id: 'A12', direction: 'across', row: 5, col: 12, length: 3 },
      { id: 'A13', direction: 'across', row: 6, col: 0, length: 7 },
      { id: 'A14', direction: 'across', row: 6, col: 8, length: 7 },
      { id: 'A15', direction: 'across', row: 7, col: 1, length: 6 },
      { id: 'A16', direction: 'across', row: 7, col: 8, length: 6 },
      { id: 'A17', direction: 'across', row: 8, col: 0, length: 7 },
      { id: 'A18', direction: 'across', row: 8, col: 8, length: 7 },
      { id: 'A19', direction: 'across', row: 9, col: 0, length: 3 },
      { id: 'A20', direction: 'across', row: 9, col: 5, length: 5 },
      { id: 'A21', direction: 'across', row: 9, col: 12, length: 3 },
      { id: 'A22', direction: 'across', row: 10, col: 0, length: 5 },
      { id: 'A23', direction: 'across', row: 10, col: 6, length: 3 },
      { id: 'A24', direction: 'across', row: 10, col: 10, length: 5 },
      { id: 'A25', direction: 'across', row: 11, col: 0, length: 5 },
      { id: 'A26', direction: 'across', row: 11, col: 6, length: 3 },
      { id: 'A27', direction: 'across', row: 11, col: 10, length: 5 },
      { id: 'A28', direction: 'across', row: 12, col: 1, length: 13 },
      { id: 'A29', direction: 'across', row: 13, col: 2, length: 11 },
      { id: 'A30', direction: 'across', row: 14, col: 3, length: 9 },
    ]
  },
];

// Grid visualization component
const GridPreview = ({ template }) => {
  const { size, blackSquares } = template;
  const blackSet = new Set(blackSquares.map(([r, c]) => `${r}-${c}`));
  
  const cellSize = Math.min(20, Math.floor(300 / size));
  
  return (
    <div 
      className="inline-grid gap-px bg-slate-600 p-px rounded"
      style={{
        gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
      }}
    >
      {Array(size).fill(null).map((_, row) =>
        Array(size).fill(null).map((_, col) => {
          const isBlack = blackSet.has(`${row}-${col}`);
          return (
            <div
              key={`${row}-${col}`}
              style={{ width: cellSize, height: cellSize }}
              className={`${isBlack ? 'bg-slate-800' : 'bg-white'}`}
            />
          );
        })
      )}
    </div>
  );
};

// Slot summary component
const SlotSummary = ({ template }) => {
  const slots = template.slots || [];
  const acrossSlots = slots.filter(s => s.direction === 'across');
  const downSlots = slots.filter(s => s.direction === 'down');
  
  // Count word lengths
  const lengthCounts = {};
  slots.forEach(slot => {
    lengthCounts[slot.length] = (lengthCounts[slot.length] || 0) + 1;
  });
  
  return (
    <div className="text-xs space-y-2">
      <div className="flex gap-4">
        <span className="text-cyan-400">Across: {acrossSlots.length}</span>
        <span className="text-pink-400">Down: {downSlots.length}</span>
        <span className="text-white">Total: {slots.length}</span>
      </div>
      <div>
        <span className="text-gray-400">Word lengths: </span>
        <span className="text-yellow-400">
          {Object.entries(lengthCounts)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([len, count]) => `${len}(×${count})`)
            .join(', ')}
        </span>
      </div>
    </div>
  );
};

// Main component
export default function CrosswordTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            🧩 Crossword Grid Templates
          </h1>
          <p className="text-purple-300">
            {TEMPLATES.length} symmetric patterns for puzzle generation
          </p>
          <p className="text-sm text-gray-400 mt-2">
            All grids use 180° rotational symmetry (NYT standard)
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`bg-slate-800/50 rounded-xl p-4 border-2 transition-all cursor-pointer hover:scale-[1.02] ${
                selectedTemplate.id === template.id
                  ? 'border-cyan-400 shadow-lg shadow-cyan-400/20'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
              <div className="flex justify-center mb-3">
                <GridPreview template={template} />
              </div>
              <p className="text-xs text-gray-400 mb-2">{template.description}</p>
              <SlotSummary template={template} />
            </div>
          ))}
        </div>

        {/* Selected Template Details */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">
            📤 Selected: {selectedTemplate.name}
          </h2>
          
          {/* Slot Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
              <h3 className="font-bold text-cyan-400 mb-2">➡️ Across Slots</h3>
              <div className="max-h-48 overflow-auto space-y-1">
                {selectedTemplate.slots?.filter(s => s.direction === 'across').map(slot => (
                  <div key={slot.id} className="text-xs flex justify-between text-gray-300">
                    <span className="text-yellow-400 font-mono">{slot.id}</span>
                    <span>Row {slot.row}, Col {slot.col}</span>
                    <span className="text-green-400 font-bold">{slot.length} letters</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-pink-500/10 rounded-lg p-4 border border-pink-500/30">
              <h3 className="font-bold text-pink-400 mb-2">⬇️ Down Slots</h3>
              <div className="max-h-48 overflow-auto space-y-1">
                {selectedTemplate.slots?.filter(s => s.direction === 'down').map(slot => (
                  <div key={slot.id} className="text-xs flex justify-between text-gray-300">
                    <span className="text-yellow-400 font-mono">{slot.id}</span>
                    <span>Row {slot.row}, Col {slot.col}</span>
                    <span className="text-green-400 font-bold">{slot.length} letters</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* JSON Export */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-green-400">Template JSON</h3>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedTemplate, null, 2))}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-medium transition-colors"
              >
                📋 Copy JSON
              </button>
            </div>
            <pre className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-64 text-xs text-green-400">
              {JSON.stringify(selectedTemplate, null, 2)}
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/30">
          <h2 className="text-xl font-bold text-amber-400 mb-4">
            🤖 Instructions for AI (Windsurf)
          </h2>
          <div className="text-sm text-amber-100 space-y-3">
            <p><strong>To generate a puzzle for any template:</strong></p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Copy the template JSON above</li>
              <li>For each slot, create a word entry with:
                <ul className="list-disc list-inside ml-4 mt-1 text-amber-200">
                  <li><code className="bg-slate-800 px-1 rounded">slotId</code>: Match the slot's id (e.g., "A1", "D5")</li>
                  <li><code className="bg-slate-800 px-1 rounded">answer</code>: A word with EXACT length matching the slot</li>
                  <li><code className="bg-slate-800 px-1 rounded">clue</code>: Short clue with optional emoji</li>
                  <li><code className="bg-slate-800 px-1 rounded">hint</code>: 1-3 sentence helpful hint</li>
                </ul>
              </li>
              <li><strong>Critical:</strong> Where slots intersect, the letters MUST match!</li>
            </ol>
            
            <div className="mt-4 p-3 bg-slate-800 rounded-lg">
              <p className="font-bold text-white mb-2">Example Puzzle JSON Structure:</p>
              <pre className="text-green-400 text-xs overflow-auto">
{`{
  "puzzleId": "puzzle-001",
  "templateId": "${selectedTemplate.id}",
  "theme": "Tech Terms",
  "words": [
    {
      "slotId": "A1",
      "answer": "JAVA",
      "clue": "☕ Coffee-named language",
      "hint": "Indonesian island, morning drink, or Sun Microsystems creation"
    },
    {
      "slotId": "D1", 
      "answer": "JSON",
      "clue": "📦 Data interchange format",
      "hint": "JavaScript Object Notation - curly braces and colons"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
