import React from 'react';
import { useDrop } from 'react-dnd';
import { BoardTile } from './BoardTile';
import { DragShape, SHAPE } from './Shape';
import { AppDispatch, BoardAddress, BoardSize, TileStates } from './types';
import { addressToIndex, isTileValidUtil, shiftShape } from './utils';

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
    (addr: BoardAddress) => isTileValidUtil(addr, boardSize, board),
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
    const tiles: JSX.Element[] = [];
    for (let column = 0; column < boardSize; column++) {
      for (let row = 0; row < boardSize; row++) {
        const index = addressToIndex(boardSize, { row, column });
        const value = tilesPreview[index] || TileStates.Empty;

        tiles.push(
          <BoardTile
            key={index}
            value={value}
            row={row}
            column={column}
            onHover={onHover}
            isTileValid={isTileValid}
            dispatch={dispatch}
          />,
        );
      }
    }
    return tiles;
  }, [tilesPreview, boardSize, onHover, isTileValid, dispatch]);
  return (
    <div
      ref={dropRef}
      style={{
        gridTemplateColumns: `repeat(${boardSize}, minMax(0, 1fr))`,
        gridTemplateRows: `repeat(${boardSize}, minMax(0, 1fr))`,
      }}
      className="grid max-w-lg"
    >
      {tiles}
    </div>
  );
}
