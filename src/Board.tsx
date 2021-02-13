import React from 'react';
import { useDrop } from 'react-dnd';
import type { AppDispatch } from './app-state';
import { BoardTile } from './BoardTile';
import { DragShape, SHAPE } from './Shape';
import {
  addressToIndex,
  BoardAddress,
  BoardSize,
  shiftShape,
  TileStates,
} from './types';

type HoverAddress = BoardAddress;
type BoardProps = {
  boardSize: BoardSize;
  board: TileStates[];
  dispatch: AppDispatch;
};
export default function Board({
  boardSize,
  board,
  dispatch,
}: BoardProps): JSX.Element {
  const [{ isOver, item }, dropRef] = useDrop({
    accept: SHAPE,
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
        item: monitor.getItem() as null | DragShape,
      };
    },
  });

  const isTileValid = React.useCallback(
    (addr: BoardAddress) => {
      if (addr.row >= boardSize.rows || addr.column >= boardSize.columns) {
        return false;
      }
      const i = addressToIndex(boardSize, addr);

      return board[i] === TileStates.Empty;
    },
    [board, boardSize],
  );

  const [hover, setHover] = React.useState<null | HoverAddress>();
  React.useEffect(() => {
    if (!isOver) {
      setHover(null);
    }
  }, [isOver]);
  const onHover = React.useCallback((addr: HoverAddress | null) => {
    setHover(addr);
  }, []);

  const tilesPreview = React.useMemo(() => {
    if (hover && item) {
      const offsets = shiftShape(item.shape, hover);

      const indexes = offsets.flatMap((addr) => {
        if (!isTileValid(addr)) {
          return [];
        }

        return [addressToIndex(boardSize, addr)];
      });

      if (indexes.length === item.shape.offsets.length) {
        const tmpBoard = [...board];
        indexes.forEach((i) => (tmpBoard[i] = TileStates.Filled));
        return tmpBoard;
      }
    }
    return board;
  }, [hover, item, board, isTileValid, boardSize]);

  const tiles = React.useMemo(() => {
    return tilesPreview.map((value, index) => {
      const row = Math.floor(index / boardSize.rows);
      const column = index % boardSize.columns;

      return (
        <BoardTile
          key={index}
          value={value}
          row={row}
          column={column}
          onHover={onHover}
          isTileValid={isTileValid}
          dispatch={dispatch}
        />
      );
    });
  }, [
    tilesPreview,
    boardSize.rows,
    boardSize.columns,
    onHover,
    isTileValid,
    dispatch,
  ]);
  return (
    <div
      ref={dropRef}
      style={{
        gridTemplateColumns: `repeat(${boardSize.columns}, minMax(0, 1fr))`,
        gridTemplateRows: `repeat(${boardSize.rows}, minMax(0, 1fr))`,
      }}
      className="grid max-w-lg"
    >
      {tiles}
    </div>
  );
}
