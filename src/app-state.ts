import { glider, shapes } from './shared/Shape';
import {
  BoardAddress,
  BoardSize,
  GameOverEffect,
  ShapeData,
  TileStates,
} from './types';
import {
  addressToIndex,
  indexToAddress,
  isShapeValid,
  isTileValidUtil,
  rotateShape,
  shiftOffsets,
  unreachable,
} from './utils';

export type State = {
  board: TileStates[];
  boardSize: BoardSize;
  currentSelection: [ShapeData | null, ShapeData | null, ShapeData | null];
  score: number;
  highScore: number;
  gameOver: boolean;
  options: {
    gameOverEffect: GameOverEffect;
  };
};

const boardSize: BoardSize = 10;
export const defaultState: State = {
  currentSelection: [null, null, null],
  boardSize,
  board: [],
  score: 0,
  highScore: 0,
  gameOver: false,
  options: {
    gameOverEffect: GameOverEffect.None,
  },
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

type GameOverEffectAction = { type: 'GameOverEffect' };

type NextGameOverEffect = { type: 'NextGameOverEffect' };

export type Action =
  | PlaceShape
  | Init
  | NewGame
  | GameOverEffectAction
  | NextGameOverEffect;

const inBoardBoundary = (addr: BoardAddress, boardSize: number) =>
  addr.row >= 0 &&
  addr.row < boardSize &&
  addr.column >= 0 &&
  addr.column < boardSize;

const getAdjacent = (addr: BoardAddress, boardSize: number): BoardAddress[] => {
  const tiles = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x !== 0 || y !== 0) {
        tiles.push({
          row: (boardSize + addr.row + x) % boardSize,
          column: (boardSize + addr.column + y) % boardSize,
        });
      }
    }
  }
  return tiles;
};

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
      let highScore = state.highScore;
      if (!state.gameOver) {
        highScore = Math.max(state.highScore ?? 0, state.score);
      }
      return {
        ...defaultState,
        highScore,
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
      break;
    }
    case 'NextGameOverEffect': {
      console.log('nextGameOverEffect');
      let gameOverEffect: State['options']['gameOverEffect'] =
        GameOverEffect.None;
      let board = state.board;
      switch (state.options.gameOverEffect) {
        case GameOverEffect.Life: {
          gameOverEffect = GameOverEffect.Glider;
          const offsets = shiftOffsets(glider.offsets, { row: 0, column: 0 });
          board = [];
          offsets
            .map((addr) => addressToIndex(boardSize, addr))
            .forEach((i) => (board[i] = TileStates.Filled));

          console.log('glider board', board);
          break;
        }
        case GameOverEffect.Glider: {
          gameOverEffect = GameOverEffect.Invert;
          break;
        }
        case GameOverEffect.Invert:
          gameOverEffect = GameOverEffect.None;
          break;
        default:
          gameOverEffect = GameOverEffect.Life;
          break;
      }
      return {
        ...state,
        board,
        options: {
          ...state.options,
          gameOverEffect,
        },
      };
    }
    case 'GameOverEffect': {
      if (!state.gameOver) {
        return state;
      }
      const { gameOverEffect } = state.options;
      let board = state.board;

      switch (gameOverEffect) {
        case 'invert': {
          board = board.map((tile) =>
            tile === TileStates.Filled ? TileStates.Empty : TileStates.Filled,
          );
          break;
        }
        case 'glider':
        case 'life': {
          let totalAlive = 0;
          let changed = 0;
          const processTile = (self: TileStates, idx: number) => {
            const addr = indexToAddress(state.boardSize, idx);
            const adjacent = getAdjacent(addr, state.boardSize);
            console.log('adj', adjacent.length);
            const neighbors = adjacent.reduce(
              (total: number, tmp: BoardAddress) => {
                if (inBoardBoundary(tmp, state.boardSize)) {
                  const idx = addressToIndex(state.boardSize, tmp);
                  if (state.board[idx] === TileStates.Filled) {
                    return total + 1;
                  }
                }
                return total;
              },
              0,
            );

            if (self === TileStates.Filled) {
              if (neighbors == 2 || neighbors == 3) {
                totalAlive++;
                return TileStates.Filled;
              } else {
                changed++;
                return TileStates.Empty;
              }
            } else if (self === TileStates.Empty && neighbors == 3) {
              totalAlive++;
              changed++;
              return TileStates.Filled;
            }
            return TileStates.Empty;
          };

          const numTiles = state.boardSize * state.boardSize;
          if (board.length < numTiles) {
            board = [...board];
            for (let i = 0; i < numTiles; i++) {
              board[i] = board[i] || TileStates.Empty;
            }
          }
          console.log('board', board);
          board = board.map(processTile);
          if (totalAlive === 0 || changed === 0) {
            board = board.map(() =>
              Math.random() < 0.5 ? TileStates.Empty : TileStates.Filled,
            );
          }
        }
      }

      return {
        ...state,
        board,
      };
    }
    default:
      unreachable(action);
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
  const gameOver = state.gameOver;
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
    return {
      ...state,
      gameOver: true,
      highScore: Math.max(state.score, state.highScore),
    };
  }

  return state;
}

export const reducer: React.Reducer<State, Action> = (
  state = defaultState,
  action: Action,
): State => {
  let nextState = processActions(state, action);
  if (!nextState.gameOver) {
    nextState = processCurrentSelection(nextState);
    nextState = processLines(nextState);
    nextState = processGameOver(nextState);
  }

  return nextState;
};
