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

export const shiftShape = (
  shape: ShapeData,
  shift: BoardAddress,
): ShapeData['offsets'] => {
  const offsets = shape.offsets.map((tmp) => ({
    ...tmp,
    row: shift.row + tmp.row,
    column: shift.column + tmp.column,
  }));
  return offsets;
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
  const offsets = shiftShape(shape, addr);
  return offsets.every((addr) => isTileValidUtil(addr, boardSize, board));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function unreachable(_: never) {
  // exhaustive case checking
}
