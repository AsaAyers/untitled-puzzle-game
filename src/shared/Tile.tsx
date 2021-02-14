import classNames from 'classnames';
import React, { ForwardedRef } from 'react';
import { unreachable } from '../utils';
import { TileStates } from '../types';

export type TileProps = {
  className?: string;
  row?: number;
  column?: number;
  value: TileStates;
};

// eslint-disable-next-line react/display-name
export const Tile = React.forwardRef(
  (
    { row, column, value, className }: TileProps,
    ref: ForwardedRef<any>,
  ): JSX.Element => {
    let stateClass = '';
    switch (value) {
      case TileStates.Empty:
        stateClass = 'bg-tile-empty';
        break;
      case TileStates.Filled:
        stateClass = 'bg-tile-filled';
        break;
      case TileStates.Debug:
        // stateClass = 'bg-tile-debug';
        break;
      default:
        unreachable(value);
    }

    return (
      <div
        ref={ref}
        className={classNames(
          className,
          stateClass,
          'rounded-lg square border-2 border-color',
          // {
          //   'bg-tile-empty': value === TileStates.Empty,
          //   'bg-tile-filled': value === TileStates.Filled,
          // },
        )}
        style={{
          gridRowStart: row != undefined ? row + 1 : row,
          gridColumnStart: column != undefined ? column + 1 : column,
        }}
      ></div>
    );
  },
);
