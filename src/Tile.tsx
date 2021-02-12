import classNames from 'classnames';
import React from 'react';

export type TileProps = {
  row?: number;
  column?: number;
  value: string;
};
export function Tile({ row, column, value }: TileProps) {
  if (value === '1') {
    return (
      <div
        className={classNames([
          'rounded-lg square',
          'bg-green-800',
          'border-2 border-black',
        ])}
        style={{
          gridRowStart: row,
          gridColumnStart: column,
        }}
      ></div>
    );
  }

  return null;
}
