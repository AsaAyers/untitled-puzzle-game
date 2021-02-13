import {TileStates} from "./types.js";
export const addressToIndex = (boardSize, addr) => addr.row * boardSize + addr.column;
export const indexToAddress = (boardSize, index) => {
  const row = Math.floor(index / boardSize);
  const column = index % boardSize;
  return {column, row};
};
export const shiftShape = (shape, shift) => {
  const offsets = shape.offsets.map((tmp) => ({
    row: shift.row + tmp.row,
    column: shift.column + tmp.column
  }));
  return offsets;
};
export const isTileValidUtil = (addr, boardSize, board) => {
  if (addr.row >= boardSize || addr.column >= boardSize) {
    return false;
  }
  const i = addressToIndex(boardSize, addr);
  return board[i] === TileStates.Empty || board[i] == void 0;
};
export const isShapeValid = (shape, addr, boardSize, board) => {
  const offsets = shiftShape(shape, addr);
  return offsets.every((addr2) => isTileValidUtil(addr2, boardSize, board));
};
