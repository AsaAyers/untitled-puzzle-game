import React from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { defaultState, reducer } from './app-state';
import { AppDragLayer } from './AppDragLayer';
import Board from './Board';
import Shape from './Shape';

function App(): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, defaultState, (state) => {
    return reducer(state, { type: 'Init' });
  });

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
      <div className="container mx-auto max-w-lg bg-container min-h-screen ">
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
