import classNames from 'classnames';
import React from 'react';
import { useDrag } from 'react-dnd';
import { Tile } from './Tile';
import { BoardAddress, ShapeData, TileStates } from './types';

export const SHAPE = Symbol('Shape');
export type DragShape = {
  type: typeof SHAPE;
  shape: ShapeData;
  shapeIndex: number;
};

function parseShape(shape: string): ShapeData {
  const rowStrings = shape
    .trim()
    .split('\n')
    .map((str) => str.trim());
  const rows = rowStrings.length;
  const columns = rowStrings.reduce(
    (maxWidth, row) => Math.max(maxWidth, row.length),
    0,
  );
  const offsets: BoardAddress[] = rowStrings.flatMap((rowString, row) => {
    const rowTiles = [];
    for (let column = 0; column < columns; column++) {
      const element = rowString[column];
      switch (element) {
        case 'x':
          rowTiles.push({ row, column });
          break;
        default:
        // rowTiles.push(TileStates.Empty);
      }
    }
    return rowTiles;
  });

  return {
    columns,
    rows,
    offsets,
  };
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
].map(parseShape);

const MAX_SHAPE_SIZE = 5;
type ShapeProps = {
  className?: string;
  shape: ShapeData;
  shapeIndex: number;
};
export default function Shape({
  shape,
  shapeIndex,
  className,
}: ShapeProps): JSX.Element {
  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type: SHAPE,
      shape,
      shapeIndex,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const maxSize = 80; // %
  const width = (shape.columns / MAX_SHAPE_SIZE) * maxSize;
  const height = (shape.rows / MAX_SHAPE_SIZE) * maxSize;

  const tiles = shape.offsets.flatMap(({ row, column }) => {
    return [
      <Tile
        key={`${row}x${column}`}
        row={row}
        column={column}
        value={TileStates.Filled}
      />,
    ];
  });
  return (
    <div
      ref={dragRef}
      tabIndex={1}
      className={classNames(className, 'shape grid absolute', {
        'opacity-40': isDragging,
      })}
      style={{
        gridTemplateColumns: `repeat(${shape.columns}, minMax(0, 1fr))`,
        gridTemplateRows: `repeat(${shape.rows}, minMax(0, 1fr))`,
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
