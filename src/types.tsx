export type BoardAddress = { column: number; row: number };

export enum TileStates {
  Empty,
  Filled,
}

export type BoardSize = {
  rows: number;
  columns: number;
};

export const addressToIndex = (board: BoardSize, addr: BoardAddress): number =>
  addr.row * board.columns + addr.column;

export const indexToAddress = (
  board: BoardSize,
  index: number,
): BoardAddress => {
  const row = Math.floor(index / board.columns);
  const column = index % board.columns;
  return { column, row };
};

export type ShapeData = {
  columns: number;
  rows: number;
  offsets: BoardAddress[];
};

export const shiftShape = (
  shape: ShapeData,
  shift: BoardAddress,
): ShapeData['offsets'] => {
  const offsets = shape.offsets.map((tmp) => ({
    row: shift.row + tmp.row,
    column: shift.column + tmp.column,
  }));
  return offsets;
};
