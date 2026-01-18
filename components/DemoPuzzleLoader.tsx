"use client";

import { useState, useCallback } from "react";
import { CrosswordPuzzle } from "./CrosswordPuzzle";
import { demoPuzzle } from "@/data/demo-puzzle";

export function DemoPuzzleLoader() {
  const [key, setKey] = useState(0);

  const handleNewPuzzle = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  return (
    <CrosswordPuzzle
      key={key}
      puzzleData={demoPuzzle}
      onNewPuzzle={handleNewPuzzle}
    />
  );
}
