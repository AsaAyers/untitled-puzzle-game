import { shapes } from './shared/Shape';
import { BoardAddress, BoardSize, ShapeData, TileStates } from './types';

export const addressToIndex = (
  boardSize: BoardSize,
  addr: BoardAddress,
): number => addr.row * boardSize + addr.column;

export const indexToAddress = (
  boardSize: BoardSize,
  index: number,
): BoardAddress => {
  const row = Math.floor(index / boardSize);
  const column = index % boardSize;
  return { column, row };
};

export const shiftOffsets = (
  offsets: ShapeData['offsets'],
  shift: BoardAddress,
): ShapeData['offsets'] => {
  return offsets.map((tmp) => ({
    ...tmp,
    row: shift.row + tmp.row,
    column: shift.column + tmp.column,
  }));
};

export const rotateShape = (shape: ShapeData): ShapeData => {
  let { offsets } = shape;

  // Rotate 90 degrees
  offsets = offsets.map((tmp) => ({
    ...tmp,
    row: -tmp.column,
    column: tmp.row,
  }));

  // Shift everything back to the origin
  const minRow = Math.min(...offsets.map((tmp) => tmp.row));
  const minColumn = Math.min(...offsets.map((tmp) => tmp.column));
  offsets = shiftOffsets(offsets, {
    row: -minRow,
    column: -minColumn,
  });

  return {
    ...shape,
    offsets,
    rows: shape.columns,
    columns: shape.rows,
  };
};

export const isTileValidUtil = (
  addr: BoardAddress,
  boardSize: BoardSize,
  board: TileStates[],
): boolean => {
  if (addr.row >= boardSize || addr.column >= boardSize) {
    return false;
  }
  const i = addressToIndex(boardSize, addr);

  return board[i] === TileStates.Empty || board[i] == undefined;
};

export const isShapeValid = (
  shape: ShapeData,
  addr: BoardAddress,
  boardSize: BoardSize,
  board: TileStates[],
): boolean => {
  const offsets = shiftOffsets(shape.offsets, addr);
  return offsets.every((addr) => isTileValidUtil(addr, boardSize, board));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function unreachable(_: never): void {
  // exhaustive case checking
}
