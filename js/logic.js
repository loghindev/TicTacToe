const player1 = ["X", "O"][Math.floor(Math.random() * 2)];
const player2 = player1 === "X" ? "O" : "X";
let currentPlayer = [player1, player2][Math.floor(Math.random() * 2)];

export function initiateState() {
    return {
        player1,
        player2,
        currentPlayer,
    };
}

export function updatePlayer(state) {
    return {
        ...state,
        currentPlayer:
            state.currentPlayer === state.player1
                ? state.player2
                : state.player1,
    };
}
