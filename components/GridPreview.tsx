"use client";

import { GridTemplate } from "@/lib/types";

interface GridPreviewProps {
  template: GridTemplate;
  size?: number;
}

export default function GridPreview({
  template,
  size = 120,
}: GridPreviewProps) {
  const cellSize = size / template.size;
  const blackSet = new Set(template.blackSquares.map(([r, c]) => `${r},${c}`));

  return (
    <div
      className="border border-gray-300 bg-white"
      style={{ width: size, height: size }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${template.size}, 1fr)`,
          width: "100%",
          height: "100%",
        }}
      >
        {Array.from({ length: template.size * template.size }).map((_, idx) => {
          const row = Math.floor(idx / template.size);
          const col = idx % template.size;
          const isBlack = blackSet.has(`${row},${col}`);

          return (
            <div
              key={idx}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: isBlack ? "#1a1a1a" : "#ffffff",
                border: "0.5px solid #ddd",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
