const board = document.querySelector("#board");

export function createBoard(handleClick) {
    for (let r = 0; r < 3; ++r) {
        for (let c = 0; c < 3; ++c) {
            const cell = document.createElement("div");
            cell.id = r + "-" + c;
            cell.addEventListener("click", () => handleClick(cell));
            board.appendChild(cell);
        }
    }
}
