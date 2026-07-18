function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface AvatarSpec {
  cells: boolean[][];
  hue: number;
}

export function generateAvatarSpec(handle: string): AvatarSpec {
  const seed = hashString(handle);
  const cells: boolean[][] = [];

  for (let row = 0; row < 5; row++) {
    const rowCells: boolean[] = [];
    for (let col = 0; col < 3; col++) {
      const bit = (seed >> (row * 3 + col)) & 1;
      rowCells.push(bit === 1);
    }
    cells.push([...rowCells, rowCells[1], rowCells[0]]);
  }

  const hue = seed % 360;
  return { cells, hue };
}
