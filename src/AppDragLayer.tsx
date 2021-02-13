import React from 'react';
import { useDragLayer } from 'react-dnd';
import { DragShape, ShapeUI } from './Shape';

function useDragDebug<T>(data: T, update: boolean): T {
  const debugRef = React.useRef<T>(data);
  if (update) {
    debugRef.current = data;
  }
  // Uncomment this to keep the drag layer when an item is dropped
  debugRef.current = data;

  return debugRef.current;
}

export function AppDragLayer(): JSX.Element | null {
  const tmp = useDragLayer((monitor) => {
    return {
      item: monitor.getItem() as DragShape,
      // initialOffset: monitor.getInitialSourceClientOffset(),
      initialOffset: { x: 0, y: 0 },
      currentOffset: monitor.getSourceClientOffset(),
    };
  });
  const collectedProps = useDragDebug(tmp, tmp.item != null);

  if (!collectedProps) {
    return null;
  }
  const { item, currentOffset, initialOffset } = collectedProps;
  if (!item || !currentOffset || !initialOffset) {
    return null;
  }
  console.log('w,h', item.width, item.height);

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        top: currentOffset?.y + initialOffset.x,
        left: currentOffset?.x + initialOffset.y,
        height: item.height,
        width: item.width,
      }}
    >
      <ShapeUI shape={item.shape} />
    </div>
  );
}
