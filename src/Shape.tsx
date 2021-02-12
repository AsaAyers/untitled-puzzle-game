import classNames from 'classnames';
import React from 'react';
import { useDrag } from 'react-dnd';
import { Tile } from './Tile';

export const SHAPE = Symbol('Shape');
export type DragShape = {
  type: typeof SHAPE;
  shape: string;
};

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
  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type: SHAPE,
      shape,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const rows = shape.trim().split('\n');
  const numRows = rows.length;
  const numColumns = rows.reduce(
    (maxWidth, row) => Math.max(maxWidth, row.length),
    0,
  );
  const maxSize = 80; // %
  const width = (numColumns / MAX_SHAPE_SIZE) * maxSize;
  const height = (numRows / MAX_SHAPE_SIZE) * maxSize;

  console.log('isDragging', isDragging);
  const tiles = rows.flatMap((row, rowIndex) => {
    return row
      .split('')
      .flatMap((tile, columnIndex) =>
        tile === '0'
          ? []
          : [
              <Tile
                key={`${rowIndex}x${columnIndex}`}
                row={rowIndex}
                column={columnIndex}
                value={tile}
              />,
            ],
      );
  });
  return (
    <div
      ref={dragRef}
      tabIndex={1}
      className={classNames(className, 'shape grid absolute', {
        'opacity-40': isDragging,
      })}
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
