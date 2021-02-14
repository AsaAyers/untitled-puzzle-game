/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { defaultState, reducer } from './app-state';
import Board from './Board/Board';
import { GameOver, NewGameButton } from './GameOver';
import Shape from './shared/Shape';

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
          {state.gameOver ? (
            <GameOver state={state} dispatch={dispatch} />
          ) : null}
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
