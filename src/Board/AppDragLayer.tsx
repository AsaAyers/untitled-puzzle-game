import classNames from 'classnames';
import React from 'react';
import { useDragLayer } from 'react-dnd';
import { DragShape, ShapeUI } from '../shared/Shape';
import { BoardAddress, ShapeData, TileStates } from '../types';

function useDragDebug<T>(data: T, update: boolean): T {
  const debugRef = React.useRef<T>(data);
  if (update) {
    debugRef.current = data;
  }
  // Comment this out to keep the drag layer when an item is dropped
  debugRef.current = data;

  return debugRef.current;
}

type AppDragLayerProps = {
  isOver: boolean;
  hoverAddress: BoardAddress | null | undefined;
};
export function AppDragLayer({
  isOver: isOverBoard,
  hoverAddress,
}: AppDragLayerProps): JSX.Element | null {
  const sizingRef = React.useRef<HTMLDivElement>(null);
  const tmp = useDragLayer((monitor) => {
    if (!monitor.isDragging()) {
      return null;
    }
    const item = monitor.getItem() as DragShape;

    const bbox = sizingRef.current?.getBoundingClientRect() ?? {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    return {
      item,
      // initialOffset: monitor.getInitialSourceClientOffset(),
      sourceClientOffset: monitor.getClientOffset(),
      // initialOffset: { x: 0, y: 0 },
      boardCornerOffset: { x: -bbox.x, y: -bbox.y },
      snapMouse: {
        x: bbox.width * ((item.column + 0.5) / item.shape.columns),
        y: bbox.height * ((item.row + 0.5) / item.shape.rows),
      },
    };
  });
  const collectedProps = useDragDebug(tmp, tmp?.item != null);

  if (!collectedProps) {
    return null;
  }
  const { item, sourceClientOffset, boardCornerOffset } = collectedProps;

  let positionStyle = {};
  if (sourceClientOffset) {
    const snapMouse = tmp?.snapMouse ?? { x: 0, y: 0 };

    positionStyle = {
      top: sourceClientOffset.y + boardCornerOffset.y - snapMouse.y,
      left: sourceClientOffset.x + boardCornerOffset.x - snapMouse.x,
    };
  }

  return (
    <React.Fragment>
      {isOverBoard && hoverAddress && (
        <ShapePreview
          corner={hoverAddress}
          shape={item.shape}
          positionStyle={{}}
          ghost={true}
        />
      )}
      <ShapePreview
        corner={{ row: 0, column: 0 }}
        shape={item.shape}
        sizingRef={sizingRef}
        positionStyle={positionStyle}
        ghost={false}
      />
    </React.Fragment>
  );
}
function ShapePreview({
  corner,
  shape,
  sizingRef,
  positionStyle,
  ghost,
}: {
  corner: { row: number; column: number };
  shape: ShapeData;
  sizingRef?: React.RefObject<HTMLDivElement>;
  positionStyle: React.CSSProperties;
  ghost: boolean | BoardAddress | null | undefined;
}): JSX.Element | null {
  const s = React.useMemo(() => {
    if (ghost) {
      return {
        ...shape,
        offsets: shape.offsets.map((o) => ({
          ...o,
          tileState: TileStates.Empty,
        })),
      };
    }

    return shape;
  }, [ghost, shape]);

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={makeSizingStyles(corner, s)}
      ref={sizingRef}
    >
      <div className="relative pointer-events-none" style={positionStyle}>
        <ShapeUI
          shape={s}
          className={classNames({
            'ring-4 ring-preview ring-inset': ghost,
          })}
        />
      </div>
    </div>
  );
}

function makeSizingStyles(corner: BoardAddress, shape: ShapeData) {
  return {
    gridRowStart: 1 + corner.row,
    gridColumnStart: 1 + corner.column,
    gridRowEnd: 1 + corner.row + shape.rows,
    gridColumnEnd: 1 + corner.column + shape.columns,
    height: '100%',
    width: '100%',
  };
}
