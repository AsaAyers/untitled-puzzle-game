import React from "../_snowpack/pkg/react.js";
import {DndProvider} from "../_snowpack/pkg/react-dnd.js";
import {TouchBackend} from "../_snowpack/pkg/react-dnd-touch-backend.js";
import {defaultState, reducer} from "./app-state.js";
import {AppDragLayer} from "./AppDragLayer.js";
import Board from "./Board.js";
import Shape from "./Shape.js";
function App() {
  const [state, dispatch] = React.useReducer(reducer, defaultState, (state2) => {
    return reducer(state2, {type: "Init"});
  });
  React.useEffect(() => {
    document.body.classList.add("overflow-hidden");
  }, []);
  return /* @__PURE__ */ React.createElement(DndProvider, {
    debugMode: true,
    backend: TouchBackend,
    options: {
      enableMouseEvents: true
    }
  }, /* @__PURE__ */ React.createElement(AppDragLayer, null), /* @__PURE__ */ React.createElement("div", {
    className: "container mx-auto bg-blue-300 min-h-screen "
  }, /* @__PURE__ */ React.createElement("header", {
    className: "h-12 text-center"
  }, /* @__PURE__ */ React.createElement("div", null, "Untitled Puzzle Game"), "Points: ", state.points), /* @__PURE__ */ React.createElement(Board, {
    boardSize: state.boardSize,
    board: state.board,
    dispatch
  }), /* @__PURE__ */ React.createElement("div", {
    className: "grid grid-cols-3 my-3 mx-3 gap-3"
  }, state.currentSelection.map((shape, index) => /* @__PURE__ */ React.createElement("div", {
    key: index,
    className: "square rounded-2xl border-solid border-2 border-black relative"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "square-content"
  }, shape != null && /* @__PURE__ */ React.createElement(Shape, {
    shape,
    shapeIndex: index,
    className: "center-shape"
  })))))));
}
export default App;
