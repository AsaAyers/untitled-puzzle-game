import React from 'react';
import type { State } from './app-state';
import type { AppDispatch } from './types';

export function useGameOverEffect(state: State, dispatch: AppDispatch): void {
  const {
    options: { gameOverEffect },
    gameOver,
  } = state;
  React.useEffect(() => {
    if (gameOver && gameOverEffect) {
      const interval = setInterval(() => {
        dispatch({ type: 'GameOverEffect' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [dispatch, gameOver, gameOverEffect]);
}
