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
import { shiftOffsets } from '../utils';

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
      const offsets = shiftOffsets(shape.offsets, addr);
      return offsets.every((addr) => isTileValid(addr));
    },
    [isTileValid],
  );
  const [{ item }, dropRef] = useDrop({
    accept: SHAPE,
    canDrop(item: DragShape, monitor) {
      if (monitor.isOver()) {
        const corner = {
          row: row - item.row,
          column: column - item.column,
        };
        return isShapeValid(item.shape, corner);
      }
      return false;
    },
    drop(item) {
      const corner = {
        row: row - item.row,
        column: column - item.column,
      };
      dispatch({
        type: 'PlaceShape',
        payload: {
          boardAddress: corner,
          shapeIndex: item.shapeIndex,
        },
      });
    },
    collect(monitor) {
      const isOver = monitor.isOver();
      const item = isOver ? (monitor.getItem() as DragShape) : null;
      return {
        item,
      };
    },
  });

  React.useEffect(() => {
    if (item) {
      const corner = {
        row: row - item.row,
        column: column - item.column,
      };
      if (isShapeValid(item.shape, corner)) {
        onHover(corner);
      } else {
        onHover(null);
      }
    }
  }, [column, isShapeValid, item, onHover, row]);

  return <Tile ref={dropRef} value={value} row={row} column={column} />;
}

export const BoardTile = React.memo(BoardTileImpl);
