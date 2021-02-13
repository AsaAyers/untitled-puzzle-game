import React from "../_snowpack/pkg/react.js";
import {useDrop} from "../_snowpack/pkg/react-dnd.js";
import {BoardTile} from "./BoardTile.js";
import {SHAPE} from "./Shape.js";
import {TileStates} from "./types.js";
import {addressToIndex, isTileValidUtil, shiftShape} from "./utils.js";
export default function Board({
  boardSize,
  board,
  dispatch
}) {
  const [{isOver, item}, dropRef] = useDrop({
    accept: SHAPE,
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
        item: monitor.getItem()
      };
    }
  });
  const isTileValid = React.useCallback((addr) => isTileValidUtil(addr, boardSize, board), [board, boardSize]);
  const [hover, setHover] = React.useState();
  React.useEffect(() => {
    if (!isOver) {
      setHover(null);
    }
  }, [isOver]);
  const onHover = React.useCallback((addr) => {
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
        indexes.forEach((i) => tmpBoard[i] = TileStates.Filled);
        return tmpBoard;
      }
    }
    return board;
  }, [hover, item, board, isTileValid, boardSize]);
  const tiles = React.useMemo(() => {
    const tiles2 = [];
    for (let column = 0; column < boardSize; column++) {
      for (let row = 0; row < boardSize; row++) {
        const index = addressToIndex(boardSize, {row, column});
        const value = tilesPreview[index] || TileStates.Empty;
        tiles2.push(/* @__PURE__ */ React.createElement(BoardTile, {
          key: index,
          value,
          row,
          column,
          onHover,
          isTileValid,
          dispatch
        }));
      }
    }
    return tiles2;
  }, [tilesPreview, boardSize, onHover, isTileValid, dispatch]);
  return /* @__PURE__ */ React.createElement("div", {
    ref: dropRef,
    style: {
      gridTemplateColumns: `repeat(${boardSize}, minMax(0, 1fr))`,
      gridTemplateRows: `repeat(${boardSize}, minMax(0, 1fr))`
    },
    className: "grid max-w-lg"
  }, tiles);
}
