import classNames from 'classnames';
import React from 'react';
import { useDrag } from 'react-dnd';
import { BoardAddress, ShapeData, TileStates } from '../types';
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

export const glider = parseShape(`
_x
__x
xxx
`);

type Collected = { isDragging: boolean };
function useShapeDrag(
  shape: ShapeData | null,
  shapeIndex: number,
  sizeRef: React.MutableRefObject<HTMLDivElement | null>,
  gameOver: boolean,
) {
  return useDrag<DragShape, unknown, Collected>({
    item: {
      type: SHAPE,
      // Since begin() will override this item, it's ok if this is null
      shape: shape!,
      shapeIndex,
      row: -1,
      column: -1,
    },
    canDrag() {
      return !gameOver && shape != null;
    },
    begin(monitor) {
      if (!shape) {
        return;
      }
      // Because this is in the begin callback, the ref will definitely be
      // populated and we will have an offset because the drag is starting.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const bbox = sizeRef.current!.getBoundingClientRect();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const diff = monitor.getClientOffset()!;

      let column = Math.floor(((diff.x - bbox.x) / bbox.width) * shape.columns);
      let row = Math.floor(((diff.y - bbox.y) / bbox.height) * shape.rows);

      // If the current row/column isn't part of the shape then snap to the
      // nearest tile. This prevents holding empty space on a corner shape.
      if (!shape.offsets.some((o) => o.row === row && o.column === column)) {
        const distance = (a: BoardAddress, b: BoardAddress) =>
          Math.sqrt(
            Math.pow(Math.abs(a.row - b.row), 2) +
              Math.pow(Math.abs(a.column - b.column), 2),
          );

        const original = { row, column };
        const closest = shape.offsets.reduce((previous, next) => {
          if (distance(original, next) < distance(original, previous)) {
            return next;
          }
          return previous;
        });
        row = closest.row;
        column = closest.column;
      }
      column = Math.floor(shape.columns / 2);
      row = shape.rows - 1;

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
  shape: ShapeData | null;
  shapeIndex: number;
  gameOver: boolean;
};
export default function Shape({
  shape,
  shapeIndex,
  className,
  gameOver,
}: ShapeProps): JSX.Element {
  const sizeRef = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, dragRef] = useShapeDrag(
    shape,
    shapeIndex,
    sizeRef,
    gameOver,
  );

  const maxSize = 80; // %
  const width = ((shape?.columns ?? 1) / MAX_SHAPE_SIZE) * maxSize;
  const height = ((shape?.rows ?? 1) / MAX_SHAPE_SIZE) * maxSize;

  return (
    <div
      key={shapeIndex}
      ref={dragRef}
      className={`app-shape-${
        shapeIndex + 1
      } square rounded-2xl border-solid border-2 border-color relative`}
    >
      {shape != null && (
        <div className="square-content">
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
            <ShapeUI shape={shape} />
          </div>
        </div>
      )}
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
