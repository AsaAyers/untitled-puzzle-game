import classNames from 'classnames';
import React from 'react';
import { useDragLayer } from 'react-dnd';
import { DragShape, ShapeUI } from '../shared/Shape';
import type { BoardAddress } from '../types';

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
  const myRef = React.useRef<HTMLDivElement>(null);
  const tmp = useDragLayer((monitor) => {
    if (!monitor.isDragging()) {
      return null;
    }
    const item = monitor.getItem() as DragShape;

    const bbox = myRef.current?.getBoundingClientRect() ?? {
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

  let corner = { row: 0, column: 0 };
  let positionStyle = {};
  if (isOverBoard && hoverAddress) {
    corner = {
      row: hoverAddress.row - item.row,
      column: hoverAddress.column - item.column,
    };
    corner = hoverAddress;
  } else if (sourceClientOffset) {
    const snapMouse = tmp?.snapMouse ?? { x: 0, y: 0 };

    positionStyle = {
      top: sourceClientOffset.y + boardCornerOffset.y - snapMouse.y,
      left: sourceClientOffset.x + boardCornerOffset.x - snapMouse.x,
    };
  }
  const sizingStyle = {
    gridRowStart: 1 + corner.row,
    gridColumnStart: 1 + corner.column,
    gridRowEnd: 1 + corner.row + item.shape.rows,
    gridColumnEnd: 1 + corner.column + item.shape.columns,
    height: '100%',
    width: '100%',
  };

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={sizingStyle}
      ref={myRef}
    >
      <div className="relative pointer-events-none" style={positionStyle}>
        <ShapeUI
          shape={item.shape}
          className={classNames({
            'ring-4 ring-preview': isOverBoard && hoverAddress,
          })}
        />
      </div>
    </div>
  );
}
