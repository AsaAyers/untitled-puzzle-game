import {shapes} from "./Shape.js";
import {TileStates} from "./types.js";
import {addressToIndex, isTileValidUtil, shiftShape} from "./utils.js";
const boardSize = 10;
export const defaultState = {
  currentSelection: [null, null, null],
  boardSize,
  board: [],
  points: 0
};
export const processActions = (state = defaultState, action) => {
  switch (action.type) {
    case "Init": {
      return defaultState;
    }
    case "PlaceShape": {
      const {shapeIndex, boardAddress} = action.payload;
      const shape = state.currentSelection[shapeIndex];
      const currentSelection = [
        ...state.currentSelection
      ];
      currentSelection[shapeIndex] = null;
      if (shape) {
        const offsets = shiftShape(shape, boardAddress);
        const indexes = offsets.flatMap((addr) => {
          if (!isTileValidUtil(addr, state.boardSize, state.board)) {
            return [];
          }
          return [addressToIndex(boardSize, addr)];
        });
        if (indexes.length === shape.offsets.length) {
          const board = [...state.board];
          indexes.forEach((i) => board[i] = TileStates.Filled);
          console.log(shapeIndex, currentSelection, board);
          return {
            ...state,
            board,
            currentSelection
          };
        }
      }
    }
  }
  return state;
};
function processCurrentSelection(state) {
  if (state.currentSelection.every((s) => s == null)) {
    const currentSelection = [
      ...state.currentSelection
    ];
    currentSelection.forEach((v, index) => {
      currentSelection[index] = shapes[Math.floor(Math.random() * shapes.length)];
    });
    return {
      ...state,
      currentSelection
    };
  }
  return state;
}
const rangeArray = (length) => Array(length).fill(null).map((v, i) => i);
function processLines(state) {
  const tmp = rangeArray(state.boardSize);
  const fullRows = [];
  const fullColumns = [];
  for (let i = 0; i < state.boardSize; i++) {
    const fullRow = tmp.every((j) => {
      const idx = addressToIndex(state.boardSize, {
        row: i,
        column: j
      });
      return state.board[idx] === TileStates.Filled;
    });
    if (fullRow) {
      fullRows.push(i);
    }
    const fullColumn = tmp.every((j) => {
      const idx = addressToIndex(state.boardSize, {
        row: j,
        column: i
      });
      return state.board[idx] === TileStates.Filled;
    });
    if (fullColumn) {
      fullColumns.push(i);
    }
  }
  if (fullRows.length > 0 || fullColumns.length > 0) {
    const board = [...state.board];
    let newPoints = 0;
    fullRows.forEach((row) => {
      tmp.forEach((column) => {
        const idx = addressToIndex(state.boardSize, {row, column});
        board[idx] = TileStates.Empty;
        newPoints++;
      });
    });
    fullColumns.forEach((column) => {
      tmp.forEach((row) => {
        const idx = addressToIndex(state.boardSize, {row, column});
        board[idx] = TileStates.Empty;
        newPoints++;
      });
    });
    return {
      ...state,
      board,
      points: state.points + newPoints
    };
  }
  return state;
}
export const reducer = (state = defaultState, action) => {
  console.log("action", action);
  let nextState = processActions(state, action);
  nextState = processCurrentSelection(nextState);
  nextState = processLines(nextState);
  return nextState;
};
