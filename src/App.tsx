/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { defaultState, reducer } from './app-state';
import Board from './Board/Board';
import Shape from './shared/Shape';

const key = 'gameState';
const useLocalStorageReducer = (
  r: typeof reducer,
  initializerArg: typeof defaultState,
  initializer: (i: typeof defaultState) => typeof defaultState,
) => {
  const [i] = React.useState(() => {
    try {
      console.log('getItem');
      // @ts-ignore
      return JSON.parse(localStorage.getItem(key)) ?? initializerArg;
    } catch (error) {
      // ignore parse errors and start with a clean game state
      console.error(error);
    }
    return initializerArg;
  });

  console.log(i);

  const [state, dispatch] = React.useReducer(r, i, initializer);

  React.useEffect(() => {
    const value = JSON.stringify(state);
    console.log('setItem', value);
    localStorage.setItem(key, value);
  }, [state]);
  const wat: [typeof state, typeof dispatch] = [state, dispatch];
  return wat;
};

function App(): JSX.Element {
  const [state, dispatch] = useLocalStorageReducer(
    reducer,
    defaultState,
    (state) => {
      return reducer(state, { type: 'Init' });
    },
  );

  React.useEffect(() => {
    document.body.classList.add('overflow-hidden');
    document.body.classList.add('bg-body');
  }, []);

  return (
    <DndProvider
      debugMode={true}
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
      }}
    >
      <div className="container mx-auto max-w-lg bg-container min-h-screen select-none">
        <header className="h-12 text-center">
          <div>Untitled Puzzle Game</div>
          Points: {state.points}
        </header>

        <Board
          boardSize={state.boardSize}
          board={state.board}
          dispatch={dispatch}
        ></Board>

        <div className="grid grid-cols-3 my-3 mx-3 gap-3">
          {state.currentSelection.map((shape, index) => (
            <div
              key={index}
              className="square rounded-2xl border-solid border-2 border-color relative"
            >
              <div className="square-content">
                {shape != null && (
                  <Shape
                    shape={shape}
                    shapeIndex={index}
                    className="center-shape"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
