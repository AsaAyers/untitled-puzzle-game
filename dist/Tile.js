import classNames from "../_snowpack/pkg/classnames.js";
import React from "../_snowpack/pkg/react.js";
import {TileStates} from "./types.js";
export const Tile = React.forwardRef(({row, column, value, className}, ref) => {
  return /* @__PURE__ */ React.createElement("div", {
    ref,
    className: classNames(className, "rounded-lg square border-2 border-black", {
      "bg-green-800": value === TileStates.Empty,
      "bg-blue-800": value === TileStates.Filled
    }),
    style: {
      gridRowStart: row != void 0 ? row + 1 : row,
      gridColumnStart: column != void 0 ? column + 1 : column
    }
  });
});
