import classNames from 'classnames';
import React from 'react';

export type TileProps = {
  className?: string;
  row?: number;
  column?: number;
  value: string;
};

export const Tile = React.forwardRef<any, TileProps>(
  ({ row, column, value, className }, ref) => {
    if (value === '1' || value === '0') {
      return (
        <div
          ref={ref}
          className={classNames(
            className,
            'rounded-lg square border-2 border-black',
            {
              'bg-green-800': value === '0',
              'bg-blue-800': value === '1',
            },
          )}
          style={{
            gridRowStart: row != undefined ? row + 1 : row,
            gridColumnStart: column != undefined ? column + 1 : column,
          }}
        ></div>
      );
    }

    return null;
  },
);
