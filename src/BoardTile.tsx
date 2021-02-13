import React from 'react';
import { Tile } from './Tile';
import { useDrop } from 'react-dnd';
import { DragShape, SHAPE } from './Shape';
import { BoardAddress, ShapeData, shiftShape, TileStates } from './types';
import type { AppDispatch } from './app-state';

export type BoardTileProps = {
  value: TileStates;
  row: number;
  column: number;
  dispatch: AppDispatch;
  onHover: (addr: BoardAddress | null) => void;
  isTileValid: (addr: BoardAddress) => boolean;
};
function BoardTileImpl({
  value,
  row,
  column,
  onHover,
  isTileValid,
  dispatch,
}: BoardTileProps) {
  const isShapeValid = (shape: ShapeData, addr: BoardAddress) => {
    const offsets = shiftShape(shape, addr);
    return offsets.every((addr) => isTileValid(addr));
  };
  const [{ item }, dropRef] = useDrop({
    accept: SHAPE,
    canDrop(item: DragShape, monitor) {
      if (monitor.isOver()) {
        return isShapeValid(item.shape, { row, column });
      }
      return false;
    },
    drop(item, monitor) {
      console.log('drop', item);
      dispatch({
        type: 'PlaceShape',
        payload: {
          boardAddress: { row, column },
          shapeIndex: item.shapeIndex,
        },
      });
    },
    collect(monitor) {
      const isOver = monitor.isOver();
      return {
        item: isOver ? monitor.getItem() : null,
      };
    },
  });

  React.useEffect(() => {
    if (item) {
      if (isShapeValid(item.shape, { row, column })) {
        onHover({ row, column });
      } else {
        onHover(null);
      }
    }
  });

  return <Tile ref={dropRef} value={value} row={row} column={column} />;
}

export const BoardTile = React.memo(BoardTileImpl);
