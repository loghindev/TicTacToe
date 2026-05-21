import { initiateState, updatePlayer } from "./logic.js";
import { renderBoard, setCell } from "./ui.js";

// @to learn - Array Interface / fill (method)
const arr = Array(3).fill(true, 1, 3);
console.log(arr);

let state = initiateState(); // gameState
console.log(state);

renderBoard((cell) => {
    if (cell.textContent !== "") return;
    setCell(cell, state.currentPlayer);
    state = updatePlayer(state);
    console.log(state);
});
