import React, { useState, useEffect } from 'react';
import Board from './Board';
import Shape, { shapes } from './Shape';

interface AppProps {}

const height = 10;
const width = 10;

type ShapeString = string;
type State = {
  board: string;
  currentSelection: [ShapeString, ShapeString, ShapeString];
};

const defaultState: State = {
  currentSelection: ['', shapes[0], ''],
  board: '0'.repeat(width).repeat(height),
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
type Action = PlaceShape;

const reducer: React.Reducer<State, Action> = (
  state = defaultState,
  action: Action,
) => {
  return state;
};

function App({}: AppProps) {
  const [state, dispatch] = React.useReducer(reducer, defaultState, (state) => {
    state.currentSelection[0] =
      shapes[Math.floor(Math.random() * shapes.length)];
    state.currentSelection[1] =
      shapes[Math.floor(Math.random() * shapes.length)];
    state.currentSelection[2] =
      shapes[Math.floor(Math.random() * shapes.length)];
    return state;
  });

  return (
    <div className="container mx-auto bg-blue-300 min-h-screen">
      <Board width={width} height={height} board={state.board} />

      <div className="grid grid-cols-3 my-3 mx-3 gap-3">
        {[0, 1, 2].map((idx) => (
          <div className="square rounded-2xl border-solid border-2 border-black relative">
            <div className="square-content">
              <Shape
                shape={state.currentSelection[idx]}
                className="center-shape"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
