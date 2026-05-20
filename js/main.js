import { createBoard } from "./ui.js";

const player1 = ["X", "O"][Math.floor(Math.random() * 2)];
const player2 = player1 === "X" ? "O" : "X";
let currentPlayer = [player1, player2][Math.floor(Math.random() * 2)];

// @temp
function updateCurrent() {
    currentPlayer === player1
        ? (currentPlayer = player2)
        : (currentPlayer = player1);
}

createBoard((cell) => {
    cell.textContent = currentPlayer;
    updateCurrent();
});
