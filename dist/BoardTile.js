import React from "../_snowpack/pkg/react.js";
import {Tile} from "./Tile.js";
import {useDrop} from "../_snowpack/pkg/react-dnd.js";
import {SHAPE} from "./Shape.js";
import {shiftShape} from "./utils.js";
function BoardTileImpl({
  value,
  row,
  column,
  onHover,
  isTileValid,
  dispatch
}) {
  const isShapeValid = (shape, addr) => {
    const offsets = shiftShape(shape, addr);
    return offsets.every((addr2) => isTileValid(addr2));
  };
  const [{item}, dropRef] = useDrop({
    accept: SHAPE,
    canDrop(item2, monitor) {
      if (monitor.isOver()) {
        return isShapeValid(item2.shape, {row, column});
      }
      return false;
    },
    drop(item2) {
      console.log("drop", item2);
      dispatch({
        type: "PlaceShape",
        payload: {
          boardAddress: {row, column},
          shapeIndex: item2.shapeIndex
        }
      });
    },
    collect(monitor) {
      const isOver = monitor.isOver();
      return {
        item: isOver ? monitor.getItem() : null
      };
    }
  });
  React.useEffect(() => {
    if (item) {
      if (isShapeValid(item.shape, {row, column})) {
        onHover({row, column});
      } else {
        onHover(null);
      }
    }
  });
  return /* @__PURE__ */ React.createElement(Tile, {
    ref: dropRef,
    value,
    row,
    column
  });
}
export const BoardTile = React.memo(BoardTileImpl);
