import classNames from 'classnames';
import React from 'react';
import type { State } from './app-state';
import type { AppDispatch } from './types';

export function NewGameButton({
  dispatch,
}: {
  dispatch: AppDispatch;
}): JSX.Element {
  return (
    <button
      className="app-new-game app-btn"
      onClick={() => dispatch({ type: 'NewGame' })}
    >
      New Game
    </button>
  );
}

export function GameOver({
  dispatch,
  state,
}: {
  dispatch: AppDispatch;
  state: State;
}): JSX.Element {
  const {
    gameOver,
    options: { gameOverEffect },
  } = state;

  React.useEffect(() => {
    if (gameOver && gameOverEffect != 'none') {
      console.log('start interval');
      const interval = setInterval(() => {
        console.log('tick');
        dispatch({ type: 'GameOverEffect' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [dispatch, gameOver, gameOverEffect]);
  return (
    <div
      className={classNames(
        'absolute z-50 justify-center text-center bg-game-over',
        {
          effects: gameOverEffect != 'none',
        },
      )}
      style={{
        left: '20%',
        right: '20%',
        top: '30%',
        height: 'auto',
      }}
    >
      <div
        onClick={() => dispatch({ type: 'NextGameOverEffect' })}
        className="text-3xl rounded-md px-2"
      >
        Game Over
      </div>
      {gameOverEffect !== 'none' ? (
        <div>Animation: {gameOverEffect}</div>
      ) : null}
    </div>
  );
}
