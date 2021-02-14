import classNames from 'classnames';
import React from 'react';
import { useDrag } from 'react-dnd';
import { ShapeData, TileStates } from '../types';
import { Tile } from './Tile';

export const SHAPE = Symbol('Shape');
export type DragShape = {
  type: typeof SHAPE;
  shape: ShapeData;
  shapeIndex: number;
  row: number;
  column: number;
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
  const offsets: ShapeData['offsets'] = rowStrings.flatMap((rowString, row) => {
    const rowTiles = [];
    for (let column = 0; column < columns; column++) {
      const element = rowString[column];
      switch (element) {
        case 'x':
          rowTiles.push({ row, column, tileState: TileStates.Filled });
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
  xxx
  `,
  `
  x
  xx
  `,
  `x`,
  `xx`,
  `xxx`,
  `xxxx`,
  `xxxxx`,
].map(parseShape);

type Collected = { isDragging: boolean };
function useShapeDrag(
  shape: ShapeData,
  shapeIndex: number,
  sizeRef: React.MutableRefObject<HTMLDivElement | null>,
) {
  return useDrag<DragShape, unknown, Collected>({
    item: {
      type: SHAPE,
      shape,
      shapeIndex,
      row: -1,
      column: -1,
    },
    begin(monitor): DragShape {
      // Because this is in the begin callback, the ref will definitely be
      // populated and we will have an offset because the drag is starting.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const bbox = sizeRef.current!.getBoundingClientRect();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const diff = monitor.getClientOffset()!;

      const column = Math.floor(
        ((diff.x - bbox.x) / bbox.width) * shape.columns,
      );
      const row = Math.floor(((diff.y - bbox.y) / bbox.height) * shape.rows);

      return {
        type: SHAPE,
        shape,
        shapeIndex,
        row,
        column,
      };
    },
    isDragging(monitor) {
      const item = monitor.getItem();
      return item && item.type === SHAPE && Object.is(item.shape, shape);
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
}

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
  const sizeRef = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, dragRef] = useShapeDrag(shape, shapeIndex, sizeRef);

  const maxSize = 80; // %
  const width = (shape.columns / MAX_SHAPE_SIZE) * maxSize;
  const height = (shape.rows / MAX_SHAPE_SIZE) * maxSize;

  return (
    <div
      ref={sizeRef}
      className={classNames(className, 'absolute', {
        'opacity-40': isDragging,
      })}
      style={{
        width: `${width}%`,
        height: `${height}%`,
        top: `${(100 - height) / 2}%`,
        left: `${(100 - width) / 2}%`,
      }}
    >
      <ShapeUI shape={shape} ref={dragRef} />
    </div>
  );
}

type ShapeUIProps = {
  className?: string;
  shape: ShapeData;
};
// eslint-disable-next-line react/display-name
export const ShapeUI = React.forwardRef(
  (
    { shape, className }: ShapeUIProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const tiles = shape.offsets.flatMap(({ row, column, tileState }) => {
      return [
        <Tile
          className={className}
          key={`${row}x${column}`}
          row={row}
          column={column}
          value={tileState}
        />,
      ];
    });
    return (
      <div
        ref={ref}
        className="shape grid"
        style={{
          gridTemplateColumns: `repeat(${shape.columns}, minMax(0, 1fr))`,
          gridTemplateRows: `repeat(${shape.rows}, minMax(0, 1fr))`,
        }}
      >
        {tiles}
      </div>
    );
  },
);
