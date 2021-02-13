import classNames from 'classnames';
import React, { ForwardedRef } from 'react';
import { TileStates } from './types';

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
    return (
      <div
        ref={ref}
        className={classNames(
          className,
          'rounded-lg square border-2 border-black',
          {
            'bg-green-800': value === TileStates.Empty,
            'bg-blue-800': value === TileStates.Filled,
          },
        )}
        style={{
          gridRowStart: row != undefined ? row + 1 : row,
          gridColumnStart: column != undefined ? column + 1 : column,
        }}
      ></div>
    );
  },
);
