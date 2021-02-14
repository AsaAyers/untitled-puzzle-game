/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { defaultState, reducer } from './app-state';
import Board from './Board/Board';
import Shape from './shared/Shape';
import type { AppDispatch } from './types';
import { useGameOverEffect as useGameOferEffect } from './useGameOverEffect';

function NewGameButton({ dispatch }: { dispatch: AppDispatch }): JSX.Element {
  return (
    <button
      className="app-new-game bg-blue-300 rounded-md px-2 py-2 mx-3 my-3 "
      onClick={() => dispatch({ type: 'NewGame' })}
    >
      New Game
    </button>
  );
}

function GameOver({ dispatch }: { dispatch: AppDispatch }): JSX.Element {
  return (
    <div
      className="relative z-50 justify-center text-center bg-body"
      style={{
        // gridRow: '4 / 7 / 4 / 7',
        gridRowStart: 4,
        gridRowEnd: 7,
        gridColumnStart: 4,
        gridColumnEnd: 7,
      }}
    >
      <div
        onClick={() => dispatch({ type: 'NextGameOverEffect' })}
        className="text-3xl rounded-md px-2"
      >
        Game Over
      </div>
      <NewGameButton dispatch={dispatch} />
    </div>
  );
}
// TODO: appDispatchContext

const key = 'gameState';
const useLocalStorageReducer = (
  r: typeof reducer,
  initializerArg: typeof defaultState,
  initializer: (i: typeof defaultState) => typeof defaultState,
) => {
  const [i] = React.useState(() => {
    try {
      return {
        ...initializerArg,
        // @ts-ignore
        ...JSON.parse(localStorage.getItem(key)),
      };
    } catch (error) {
      // Ignore parse errors
    }
    return initializerArg;
  });

  const [state, dispatch] = React.useReducer(r, i, initializer);

  React.useEffect(() => {
    const value = JSON.stringify(state);
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
  useGameOferEffect(state, dispatch);

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
      <div className="app-container text-white container gap-3 px-3 py-3 mx-auto max-w-lg bg-container min-h-screen select-none">
        <header className="app-header text-center text-xl">
          <div>Untitled Puzzle Game</div>
        </header>
        <div className="app-score text-center  text-lg">
          Score: {state.score}
        </div>
        {state.highScore > 0 ? (
          <div className="app-high-score text center text-lg">
            High Score: {state.highScore}
          </div>
        ) : null}
        <NewGameButton dispatch={dispatch} />

        <Board
          className="app-board"
          boardSize={state.boardSize}
          board={state.board}
          dispatch={dispatch}
        >
          {state.gameOver ? <GameOver dispatch={dispatch} /> : null}
        </Board>

        {state.currentSelection.map((shape, index) => (
          <div
            key={index}
            className={`app-shape-${
              index + 1
            } square rounded-2xl border-solid border-2 border-color relative`}
          >
            <div className="square-content">
              {shape != null && (
                <Shape
                  shape={shape}
                  gameOver={state.gameOver}
                  shapeIndex={index}
                  className="center-shape"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </DndProvider>
  );
}

export default App;
