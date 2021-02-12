import classNames from 'classnames';
import React from 'react';
import { Tile } from './Tile';

function normalize(shape: string): string {
  return shape
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replaceAll('x', '1')
    .replaceAll('_', '0');
}

export const shapes = [
  `
  xx
  xx
  `,
  `
  x
  x
  xx
  `,
  `
  _x
  _x
  xx
  `,
].map(normalize);

shapes.forEach((s) => console.log(s));

const MAX_SHAPE_SIZE = 5;
type ShapeProps = {
  className?: string;
  shape: string;
};
export default function Shape({ shape, className }: ShapeProps) {
  const rows = shape.trim().split('\n');
  const numRows = rows.length;
  const numColumns = rows.reduce(
    (maxWidth, row) => Math.max(maxWidth, row.length),
    0,
  );

  console.log(shape, numRows, numColumns);

  const tiles = rows.flatMap((row, rowIndex) => {
    return row
      .split('')
      .map((tile, columnIndex) => (
        <Tile
          key={`${rowIndex}x${columnIndex}`}
          row={rowIndex + 1}
          column={columnIndex + 1}
          value={tile}
        />
      ));
  });
  console.log('tiles', tiles);

  const maxSize = 80; // %

  const width = (numColumns / MAX_SHAPE_SIZE) * maxSize;
  const height = (numRows / MAX_SHAPE_SIZE) * maxSize;

  return (
    <div
      className={classNames(className, 'shape grid absolute')}
      style={{
        gridTemplateColumns: `repeat(${numColumns}, minMax(0, 1fr))`,
        gridTemplateRows: `repeat(${numRows}, minMax(0, 1fr))`,
        width: `${width}%`,
        height: `${height}%`,
        top: `${(100 - height) / 2}%`,
        left: `${(100 - width) / 2}%`,
      }}
    >
      {tiles}
    </div>
  );
}
