const userMoveSound = document.getElementById("userMoveSound");
const computerMoveSound = document.getElementById("computerMoveSound");
const mutedIcon = document.getElementById("mutedIcon");
const unmutedIcon = document.getElementById("unmutedIcon");
const resetScoreBtn = document.getElementById("resetScore");
const startBtn = document.getElementById("startBtn");
const gameboard = document.getElementById("gameboard");
const player1Name = document.querySelector("#scoreBoard #player1 .name");
const player1Score = document.querySelector("#scoreBoard #player1 .score");
const player1Spinner = document.querySelector("#scoreBoard #player1 .spinner");
const player2Name = document.querySelector("#scoreBoard #player2 .name");
const player2Score = document.querySelector("#scoreBoard #player2 .score");
const player2Spinner = document.querySelector("#scoreBoard #player2 .spinner");
const tieScore = document.querySelector("#scoreBoard #tie .score");
const opponentComputer = document.querySelector("#scoreBoard #opponentOption #vsBot");
const opponentFriend = document.querySelector("#scoreBoard #opponentOption #vsFriend");

let gameOver = false;
let pending = false;
const THREE = 3;
const opponents = ["computer", "friend"];
let opponentType = opponents[0];
const signs = ["X", "0"];
const player1Sign = signs[Math.floor(Math.random() * signs.length)];
const player2Sign = setPlayer2();
let currPlayer = [player1Sign, player2Sign][Math.floor(Math.random() * 2)];
console.log(`CurrPlayer ${currPlayer} (1st move)`);

function setPlayer2() {
  return player1Sign === "X" ? signs[1] : signs[0];
}

document.addEventListener("DOMContentLoaded", () => {
  loadGameSettings();
  generateGameboard();
  updateInterface(player1Sign, player2Sign, opponentType);

  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hide-btn");
    startBtn.disabled = true;
    updateSpinnerDisplay();
    if (currPlayer === player2Sign && opponentType === "computer") {
      pending = true;
      awaitComputerMove(currPlayer, Math.floor(Math.random() * 800) + 800);
    }
  });
});

function generateGameboard() {
  for (let i = 0; i < THREE; ++i) {
    for (let j = 0; j < THREE; ++j) {
      const newCell = document.createElement("div");
      newCell.classList = "cell";
      newCell.id = i.toString() + "-" + j.toString();
      newCell.addEventListener("click", setCell);
      gameboard.appendChild(newCell);
    }
  }
}

function setCell(event) {
  if (event.target.textContent !== "" || pending || gameOver || !startBtn.classList.contains("hide-btn")) return;

  const span = document.createElement("span");
  span.classList = "fade-in";
  span.textContent = currPlayer;
  event.target.appendChild(span);
  currPlayer === player1Sign ? makeSound(userMoveSound) : makeSound(computerMoveSound);
  updateCurrentPlayer();
  updateTurnColors();
  updateSpinnerDisplay();
  checkWinner();

  if (opponentType === "computer" && !gameOver) {
    pending = true;
    awaitComputerMove(currPlayer, Math.floor(Math.random() * 1000) + 1000);
  }
}

function awaitComputerMove(currPlayer, delay) {
  const emptyCells = Array.from(document.querySelectorAll("#gameboard .cell")).filter(
    (cell) => cell.querySelector("span") === null
  );

  if (emptyCells.length) {
    const span = document.createElement("span");
    setTimeout(() => {
      span.classList = "fade-in";
      span.textContent = currPlayer;
      emptyCells[Math.floor(Math.random() * emptyCells.length)].appendChild(span);
      pending = false;
      makeSound(computerMoveSound);
      updateCurrentPlayer();
      updateTurnColors();
      updateSpinnerDisplay();
      checkWinner();
    }, delay);
  }
}

function updateSpinnerDisplay() {
  if (!startBtn.classList.contains("hide-btn")) return;
  if (currPlayer === player1Sign) {
    player1Spinner.classList.add("show-spinner");
    player2Spinner.classList.remove("show-spinner");
  } else if (currPlayer === player2Sign) {
    player2Spinner.classList.add("show-spinner");
    player1Spinner.classList.remove("show-spinner");
  }
}

function updateInterface(p1Sign, p2Sign, opponent) {
  // Update the interface when switch the opponent
  player1Name.textContent = `Player 1 (${p1Sign})`;
  player2Name.textContent = `${opponent === "computer" ? "Computer " : "Player 2"} (${p2Sign})`;
  updateTurnColors();
}
function updateTurnColors() {
  if (currPlayer === player1Sign) {
    player1Name.style.color = "white";
    player2Name.style.color = "var(--light-grey)";
  } else if (currPlayer === player2Sign) {
    player2Name.style.color = "white";
    player1Name.style.color = "var(--light-grey)";
  }
}
function updateCurrentPlayer() {
  // update the current player
  if (currPlayer === player1Sign) {
    currPlayer = player2Sign;
  } else if (currPlayer === player2Sign) {
    currPlayer = player1Sign;
  }
}

// Switch Mute/Unmute Icons Top-Right Corner
unmutedIcon.addEventListener("click", () => {
  unmutedIcon.classList.add("hidden");
  mutedIcon.classList.remove("hidden");
});

mutedIcon.addEventListener("click", () => {
  mutedIcon.classList.add("hidden");
  unmutedIcon.classList.remove("hidden");
});

// Update Interface according to the Opponent Type
opponentComputer.addEventListener("click", (event) => {
  opponentComputer.classList.add("hidden");
  opponentFriend.classList.remove("hidden");
  opponentType = opponents[1];
  updateInterface(player1Sign, player2Sign, opponents[1]);
});
opponentFriend.addEventListener("click", (event) => {
  opponentFriend.classList.add("hidden");
  opponentComputer.classList.remove("hidden");
  opponentType = opponents[0];
  updateInterface(player1Sign, player2Sign, opponents[0]);
});

function makeSound(sound) {
  if (unmutedIcon.classList.contains("hidden")) return;
  sound.currentTime = 0;
  sound.play();
}

function checkWinner() {
  const cells = Array.from(gameboard.querySelectorAll(".cell")).map((cell) => {
    if (cell.querySelector("span") !== null) {
      return cell;
    }
    return undefined;
  });
  console.log(cells);
  for (let array of winnerCases) {
    if (gameOver) break;
    if (cells[array[0]] !== undefined && cells[array[1]] !== undefined && cells[array[2]] !== undefined) {
      // console.log("Pot verifica in ", array);
      console.log(
        `Pot verifica: ${cells[array[0]].textContent} ${cells[array[1]].textContent} ${cells[array[2]].textContent}`
      );
      if (
        cells[array[0]].textContent === cells[array[1]].textContent &&
        cells[array[1]].textContent === cells[array[2]].textContent
      ) {
        if (cells[array[0]].textContent === player1Sign) {
          console.warn(`Winner ${player1Sign}`);
          updateScoreboard(player1Score);
        } else if (cells[array[0]].textContent === player2Sign) {
          console.warn(`Winner ${player2Sign}`);
          updateScoreboard(player2Score);
        }
        gameOver = true;
      }
    }
  }
}

function updateScoreboard(score) {
  let scoreValue = Number(score.textContent);
  score.textContent = (++scoreValue).toString();
  saveGameSettings();
}

function saveGameSettings() {
  localStorage.setItem("player1Score", player1Score.textContent);
  localStorage.setItem("player2Score", player2Score.textContent);
  localStorage.setItem("tieScore", tieScore.textContent);
  localStorage.setItem("opponent", opponentType);
  console.log(localStorage);
}

function loadGameSettings() {
  if (localStorage.getItem("player1Score") !== null) {
    player1Score.textContent = localStorage.getItem("player1Score");
  } else {
    player1Score.textContent = "0";
  }
  if (localStorage.getItem("player2Score") !== null) {
    player2Score.textContent = localStorage.getItem("player2Score");
  } else {
    player2Score.textContent = "0";
  }
  if (localStorage.getItem("tieScore") !== null) {
    tieScore.textContent = localStorage.getItem("tieScore");
  } else {
    tieScore.textContent = "0";
  }
  if (localStorage.getItem("opponent") !== null) {
    opponentType = localStorage.getItem("opponent");
  } else {
    opponentType = opponents[0]; // vs computer (default)
  }
}

resetScoreBtn.addEventListener("click", resetGameSettings);

function resetGameSettings() {
  localStorage.clear();
  console.log(localStorage);
  loadGameSettings();
}

const winnerCases = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
