import type { Action } from './app-state';

export type BoardAddress = { column: number; row: number };

export enum TileStates {
  Empty,
  Filled,
  Debug,
}

export type BoardSize = number;

export type ShapeData = {
  columns: number;
  rows: number;
  offsets: Array<
    BoardAddress & {
      tileState: TileStates;
    }
  >;
};

export type AppDispatch = React.Dispatch<Action>;

export enum GameOverEffect {
  None = 'none',
  Life = 'life',
  Invert = 'invert',
  Glider = 'glider',
}
