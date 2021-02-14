import { shapes } from './shared/Shape';
import { BoardAddress, BoardSize, ShapeData, TileStates } from './types';
import {
  addressToIndex,
  isShapeValid,
  isTileValidUtil,
  rotateShape,
  shiftOffsets,
} from './utils';

type State = {
  board: TileStates[];
  boardSize: BoardSize;
  currentSelection: [ShapeData | null, ShapeData | null, ShapeData | null];
  score: number;
  highScore: number;
  gameOver: boolean;
};

const boardSize: BoardSize = 10;
export const defaultState: State = {
  currentSelection: [null, null, null],
  boardSize,
  board: [],
  score: 0,
  highScore: 0,
  gameOver: false,
};

type PlaceShape = {
  type: 'PlaceShape';
  payload: {
    shapeIndex: number;
    boardAddress: {
      row: number;
      column: number;
    };
  };
};
type Init = { type: 'Init' };

type NewGame = { type: 'NewGame' };

export type Action = PlaceShape | Init | NewGame;

export const processActions: React.Reducer<State, Action> = (
  state = defaultState,
  action: Action,
): State => {
  switch (action.type) {
    case 'Init': {
      // Init triggers the rules section to setup the game
      return state;
    }
    case 'NewGame': {
      return {
        ...defaultState,
        highScore: Math.max(state.highScore ?? 0, state.score),
      };
    }
    case 'PlaceShape': {
      const { shapeIndex, boardAddress } = action.payload;
      const shape = state.currentSelection[shapeIndex];
      const currentSelection: State['currentSelection'] = [
        ...state.currentSelection,
      ];
      currentSelection[shapeIndex] = null;
      if (shape) {
        const offsets = shiftOffsets(shape.offsets, boardAddress);

        const indexes = offsets.flatMap((addr) => {
          if (!isTileValidUtil(addr, state.boardSize, state.board)) {
            return [];
          }

          return [addressToIndex(boardSize, addr)];
        });

        if (indexes.length === shape.offsets.length) {
          const board = [...state.board];
          indexes.forEach((i) => (board[i] = TileStates.Filled));

          return {
            ...state,
            board,
            currentSelection,
          };
        }
      }
    }
  }
  return state;
};

function processCurrentSelection(state: State): State {
  if (state.currentSelection.every((s) => s == null)) {
    const currentSelection: State['currentSelection'] = [
      ...state.currentSelection,
    ];
    // React didn't like map because it returns an array and not a 3-tuple
    currentSelection.forEach((v, index) => {
      let tmp = shapes[Math.floor(Math.random() * shapes.length)];
      const numRotations = Math.floor(Math.random() * 4);

      for (let i = 0; i < numRotations; i++) {
        tmp = rotateShape(tmp);
      }

      currentSelection[index] = tmp;
    });

    return {
      ...state,
      currentSelection,
    };
  }

  return state;
}

const rangeArray = (length: number) =>
  Array(length)
    .fill(null)
    .map((v, i) => i);

function processLines(state: State): State {
  const tmp = rangeArray(state.boardSize);
  const fullRows: number[] = [];
  const fullColumns: number[] = [];
  for (let i = 0; i < state.boardSize; i++) {
    const fullRow = tmp.every((j) => {
      const idx = addressToIndex(state.boardSize, {
        row: i,
        column: j,
      });
      return state.board[idx] === TileStates.Filled;
    });

    if (fullRow) {
      fullRows.push(i);
    }
    const fullColumn = tmp.every((j) => {
      const idx = addressToIndex(state.boardSize, {
        row: j,
        column: i,
      });
      return state.board[idx] === TileStates.Filled;
    });
    if (fullColumn) {
      fullColumns.push(i);
    }
  }

  if (fullRows.length > 0 || fullColumns.length > 0) {
    const board = [...state.board];
    const numLines = fullRows.length + fullColumns.length;
    const newScore = state.boardSize * numLines;

    fullRows.forEach((row) => {
      tmp.forEach((column) => {
        const idx = addressToIndex(state.boardSize, { row, column });
        board[idx] = TileStates.Empty;
      });
    });
    fullColumns.forEach((column) => {
      tmp.forEach((row) => {
        const idx = addressToIndex(state.boardSize, { row, column });
        board[idx] = TileStates.Empty;
      });
    });

    return {
      ...state,
      board,
      score: state.score + newScore,
    };
  }

  return state;
}

function findValidMove(shape: ShapeData, state: State): BoardAddress | null {
  for (let row = 0; row < state.boardSize; row++) {
    //   let numFilled = 0
    for (let column = 0; column < state.boardSize; column++) {
      if (isShapeValid(shape, { row, column }, state.boardSize, state.board)) {
        return { row, column };
      }
    }
  }

  // return { row: 0, column: 0 };
  return null;
}

function processGameOver(state: State): State {
  let gameOver = state.gameOver;
  if (
    !gameOver &&
    !state.currentSelection.some((shape, index) => {
      if (shape) {
        const address = findValidMove(shape, state);

        console.log(index, shape, address);

        return address != null;
      }
      return false;
    })
  ) {
    gameOver = true;
  }

  return {
    ...state,
    gameOver,
  };
}

export const reducer: React.Reducer<State, Action> = (
  state = defaultState,
  action: Action,
): State => {
  let nextState = processActions(state, action);
  nextState = processCurrentSelection(nextState);
  nextState = processLines(nextState);
  nextState = processGameOver(nextState);

  return nextState;
};
