import React from 'react';
import { useDrop } from 'react-dnd';
import { DragShape, SHAPE } from '../shared/Shape';
import { Tile } from '../shared/Tile';
import type {
  AppDispatch,
  BoardAddress,
  ShapeData,
  TileStates,
} from '../types';
import { shiftShape } from '../utils';

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
  const isShapeValid = React.useCallback(
    (shape: ShapeData, addr: BoardAddress) => {
      const offsets = shiftShape(shape, addr);
      return offsets.every((addr) => isTileValid(addr));
    },
    [isTileValid],
  );
  const [{ item }, dropRef] = useDrop({
    accept: SHAPE,
    canDrop(item: DragShape, monitor) {
      if (monitor.isOver()) {
        return isShapeValid(item.shape, { row, column });
      }
      return false;
    },
    drop(item) {
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
  }, [column, isShapeValid, item, onHover, row]);

  return <Tile ref={dropRef} value={value} row={row} column={column} />;
}

export const BoardTile = React.memo(BoardTileImpl);
