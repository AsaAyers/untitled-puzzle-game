import type { Action } from './app-state';

export type BoardAddress = { column: number; row: number };

export enum TileStates {
  Empty,
  Filled,
}

export type BoardSize = number;

export type ShapeData = {
  columns: number;
  rows: number;
  offsets: BoardAddress[];
};

export type AppDispatch = React.Dispatch<Action>;
