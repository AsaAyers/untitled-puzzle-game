import React from 'react';
import { useDrop } from 'react-dnd';
import { SHAPE } from '../shared/Shape';
import { AppDispatch, BoardAddress, BoardSize, TileStates } from '../types';
import { addressToIndex, isTileValidUtil } from '../utils';
import { AppDragLayer } from './AppDragLayer';
import { BoardTile } from './Tile';

type HoverAddress = BoardAddress;
type BoardProps = {
  boardSize: BoardSize;
  board: TileStates[];
  dispatch: AppDispatch;
  children?: React.ReactNode;
};
export default function Board({
  boardSize,
  board,
  dispatch,
  children,
}: BoardProps): JSX.Element {
  // const boardRef = React.useRef(undefined) as any;
  const [isOver, boardRef] = useDrop({
    accept: SHAPE,
    collect(monitor) {
      return monitor.isOver();
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
    setHover((current) => {
      if (
        !current ||
        !addr ||
        current.row !== addr.row ||
        current.column !== addr?.column
      ) {
        return addr;
      }
      return current;
    });
  }, []);

  const tiles = React.useMemo(() => {
    const tiles: JSX.Element[] = [];
    for (let column = 0; column < boardSize; column++) {
      for (let row = 0; row < boardSize; row++) {
        const index = addressToIndex(boardSize, { row, column });
        const value = board[index] || TileStates.Empty;

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
  }, [boardSize, board, onHover, isTileValid, dispatch]);
  return (
    <div
      ref={boardRef}
      style={{
        gridTemplateColumns: `repeat(${boardSize}, minMax(0, 1fr))`,
        gridTemplateRows: `repeat(${boardSize}, minMax(0, 1fr))`,
      }}
      className="grid relative mx-3 my-3"
    >
      <AppDragLayer isOver={isOver} hoverAddress={hover} />
      {tiles}
      {children}
    </div>
  );
}
