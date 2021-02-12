import React from 'react';
import { Tile } from './Tile';
import { useDrop } from 'react-dnd';
import { SHAPE } from './Shape';

type BoardTileProps = {
  value: string;
  row: number;
  column: number;
  onHover: (addr: HoverAddress) => void;
};
function BoardTile({ value, row, column, onHover }: BoardTileProps) {
  const [isOver, dropRef] = useDrop({
    accept: SHAPE,
    collect(monitor) {
      return monitor.isOver();
    },
  });

  React.useEffect(() => {
    if (isOver) {
      console.log('isOver', row, column);
      onHover({ row, column });
    }
  });

  return <Tile ref={dropRef} value={value} row={row} column={column} />;
}
const MemoBoardTile = React.memo(BoardTile);

type HoverAddress = { row: number; column: number };
type BoardProps = {
  width: number;
  height: number;
  board: string;
};
export default function Board({
  width,
  height,
  board,
}: BoardProps): JSX.Element {
  const myRef = React.useRef<HTMLDivElement | null>();
  const [isOver, dropRef] = useDrop({
    accept: SHAPE,
    canDrop() {
      return false;
    },
    collect(monitor) {
      return monitor.isOver();
    },
  });

  const [hover, setHover] = React.useState<null | HoverAddress>();
  React.useEffect(() => {
    if (!isOver) {
      setHover(null);
    }
  }, [isOver]);
  const onHover = React.useCallback((addr: HoverAddress) => {
    console.log('set hover', addr);
    setHover(addr);
  }, []);

  const tilesPreview = React.useMemo(() => {
    const tmp = board.split('');
    if (hover) {
      tmp[hover.row * width + hover.column] = '1';
    }
    return tmp;
  }, [board, hover, width]);

  const tiles = React.useMemo(() => {
    return tilesPreview.map((value, index) => {
      const row = Math.floor(index / height);
      const column = index % width;

      return (
        <MemoBoardTile
          key={index}
          value={value}
          row={row}
          column={column}
          onHover={onHover}
        />
      );
    });
  }, [height, onHover, tilesPreview, width]);
  return (
    <div
      ref={(el) => {
        myRef.current = el;
        return dropRef(el);
      }}
      style={{
        gridTemplateColumns: `repeat(${width}, minMax(0, 1fr))`,
        gridTemplateRows: `repeat(${height}, minMax(0, 1fr))`,
      }}
      className="grid max-w-lg"
    >
      {tiles}
    </div>
  );
}
