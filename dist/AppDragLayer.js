import React from "../_snowpack/pkg/react.js";
import {useDragLayer} from "../_snowpack/pkg/react-dnd.js";
import {ShapeUI} from "./Shape.js";
function useDragDebug(data, update) {
  const debugRef = React.useRef(data);
  if (update) {
    debugRef.current = data;
  }
  debugRef.current = data;
  return debugRef.current;
}
export function AppDragLayer() {
  const tmp = useDragLayer((monitor) => {
    return {
      item: monitor.getItem(),
      initialOffset: {x: 0, y: 0},
      currentOffset: monitor.getSourceClientOffset()
    };
  });
  const collectedProps = useDragDebug(tmp, tmp.item != null);
  if (!collectedProps) {
    return null;
  }
  const {item, currentOffset, initialOffset} = collectedProps;
  if (!item || !currentOffset || !initialOffset) {
    return null;
  }
  console.log("w,h", item.width, item.height);
  return /* @__PURE__ */ React.createElement("div", {
    className: "absolute z-50 pointer-events-none",
    style: {
      top: currentOffset?.y + initialOffset.x,
      left: currentOffset?.x + initialOffset.y,
      height: item.height,
      width: item.width
    }
  }, /* @__PURE__ */ React.createElement(ShapeUI, {
    shape: item.shape
  }));
}
