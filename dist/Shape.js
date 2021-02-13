import classNames from "../_snowpack/pkg/classnames.js";
import React from "../_snowpack/pkg/react.js";
import {useDrag} from "../_snowpack/pkg/react-dnd.js";
import {Tile} from "./Tile.js";
import {TileStates} from "./types.js";
export const SHAPE = Symbol("Shape");
function parseShape(shape) {
  const rowStrings = shape.trim().split("\n").map((str) => str.trim());
  const rows = rowStrings.length;
  const columns = rowStrings.reduce((maxWidth, row) => Math.max(maxWidth, row.length), 0);
  const offsets = rowStrings.flatMap((rowString, row) => {
    const rowTiles = [];
    for (let column = 0; column < columns; column++) {
      const element = rowString[column];
      switch (element) {
        case "x":
          rowTiles.push({row, column});
          break;
        default:
      }
    }
    return rowTiles;
  });
  return {
    columns,
    rows,
    offsets
  };
}
export const shapes = [
  `
  xx
  xx
  `,
  `
  x
  x
  xx
  `,
  `
  _x
  _x
  xx
  `
].map(parseShape);
const MAX_SHAPE_SIZE = 5;
export default function Shape({
  shape,
  shapeIndex,
  className
}) {
  const shapeRef = React.useRef(null);
  const [{isDragging}, dragRef] = useDrag({
    item: {
      type: SHAPE,
      shape,
      shapeIndex,
      width: 0,
      height: 0
    },
    begin() {
      const bbox = shapeRef.current?.getBoundingClientRect();
      console.log("begin", bbox?.width, bbox?.height);
      return {
        type: SHAPE,
        shape,
        shapeIndex,
        width: bbox?.width ?? 0,
        height: bbox?.height ?? 0
      };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });
  const maxSize = 80;
  const width = shape.columns / MAX_SHAPE_SIZE * maxSize;
  const height = shape.rows / MAX_SHAPE_SIZE * maxSize;
  return /* @__PURE__ */ React.createElement("div", {
    ref: dragRef,
    className: classNames(className, "absolute", {
      "opacity-40": isDragging
    }),
    style: {
      width: `${width}%`,
      height: `${height}%`,
      top: `${(100 - height) / 2}%`,
      left: `${(100 - width) / 2}%`
    }
  }, /* @__PURE__ */ React.createElement(ShapeUI, {
    shape,
    ref: shapeRef
  }));
}
export const ShapeUI = React.forwardRef(({shape}, ref) => {
  const tiles = shape.offsets.flatMap(({row, column}) => {
    return [
      /* @__PURE__ */ React.createElement(Tile, {
        key: `${row}x${column}`,
        row,
        column,
        value: TileStates.Filled
      })
    ];
  });
  return /* @__PURE__ */ React.createElement("div", {
    ref,
    className: "shape grid",
    style: {
      gridTemplateColumns: `repeat(${shape.columns}, minMax(0, 1fr))`,
      gridTemplateRows: `repeat(${shape.rows}, minMax(0, 1fr))`
    }
  }, tiles);
});
