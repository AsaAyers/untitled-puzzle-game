import { shapes } from './Shape';
import {
  addressToIndex,
  BoardSize,
  ShapeData,
  shiftShape,
  TileStates,
} from './types';

type State = {
  board: TileStates[];
  boardSize: BoardSize;
  currentSelection: [ShapeData | null, ShapeData | null, ShapeData | null];
};

const boardSize: BoardSize = {
  rows: 10,
  columns: 10,
};
export const defaultState: State = {
  currentSelection: [null, null, null],
  boardSize,
  // TODO: Maybe use a sparse array here instead?
  board: Array(boardSize.rows * boardSize.columns).fill(TileStates.Empty),
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

type Action = PlaceShape | Init;

export const reducer: React.Reducer<State, Action> = (
  state = defaultState,
  action: Action,
): State => {
  console.log('action', action);
  switch (action.type) {
    case 'Init': {
      state = defaultState;
      break;
    }
    case 'PlaceShape': {
      const { shapeIndex, boardAddress } = action.payload;
      const shape = state.currentSelection[shapeIndex];
      const currentSelection: State['currentSelection'] = [
        ...state.currentSelection,
      ];
      currentSelection[shapeIndex] = null;
      if (shape) {
        const offsets = shiftShape(shape, boardAddress);

        const indexes = offsets.flatMap((addr) => {
          // if (!isTileValid(addr)) {
          //   return [];
          // }

          return [addressToIndex(boardSize, addr)];
        });

        if (indexes.length === shape.offsets.length) {
          const board = [...state.board];
          indexes.forEach((i) => (board[i] = TileStates.Filled));
          console.log(shapeIndex, currentSelection, board);

          state = {
            ...state,
            board,
            currentSelection,
          };
        }
      }
    }
  }

  return runRules(state);
};

function runRules(state: State): State {
  if (state.currentSelection.every((s) => s == null)) {
    const currentSelection: State['currentSelection'] = [
      ...state.currentSelection,
    ];
    // React didn't like map because it returns an array and not a 3-tuple
    currentSelection.forEach((v, index) => {
      currentSelection[index] =
        shapes[Math.floor(Math.random() * shapes.length)];
    });
    state = {
      ...state,
      currentSelection,
    };
  }

  return state;
}

export type AppDispatch = React.Dispatch<Action>;
