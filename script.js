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
const opponents = ["computer", "friend"];
let opponentType = opponents[0];

const THREE = 3;
const resetDelay = 3400;
const player1Sign = ["X", "0"][Math.floor(Math.random() * 2)];
const player2Sign = player1Sign === "X" ? "0" : "X";
let currPlayer = [player1Sign, player2Sign][Math.floor(Math.random() * 2)];
let moves = 0;
let pending = false;
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
  loadGameSettings();
  generateGameboard();
  updateInterface(player1Sign, player2Sign, opponentType);
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hide-btn");
    startBtn.disabled = true;
    updateSpinnerDisplay();
    updateTurnColors();
    if (currPlayer === player2Sign && opponentType === "computer") {
      pending = true;
      awaitComputerMove(currPlayer, Math.floor(Math.random() * 1000) + 600);
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
  const cellContent = document.createElement("span");
  cellContent.classList = "fade-in";
  cellContent.textContent = currPlayer;
  event.target.appendChild(cellContent);
  ++moves;
  currPlayer === player1Sign ? makeSound(userMoveSound) : makeSound(computerMoveSound);
  updateCurrentPlayer();
  updateTurnColors();
  updateSpinnerDisplay();
  checkWinner();

  if (opponentType === "computer" && !gameOver) {
    pending = true;
    awaitComputerMove(currPlayer, Math.floor(Math.random() * 1000) + 600);
  }
}

function awaitComputerMove(currPlayer, delay) {
  ++moves;
  const emptyCells = Array.from(document.querySelectorAll("#gameboard .cell")).filter(
    (cell) => cell.querySelector("span") === null
  );

  if (emptyCells.length) {
    const signContentOpponent = document.createElement("span");
    setTimeout(() => {
      signContentOpponent.classList = "fade-in";
      signContentOpponent.textContent = currPlayer;
      emptyCells[Math.floor(Math.random() * emptyCells.length)].appendChild(signContentOpponent);
      pending = false;
      makeSound(computerMoveSound);
      updateCurrentPlayer();
      updateTurnColors();
      updateSpinnerDisplay();
      checkWinner();
    }, delay);
  }
}

function checkWinner() {
  const cells = Array.from(gameboard.querySelectorAll(".cell")).map((cell) => {
    if (cell.querySelector("span") !== null) {
      return cell;
    }
    return null;
  });
  for (let array of winnerCases) {
    if (
      cells[array[0]] !== null &&
      cells[array[1]] !== null &&
      cells[array[2]] !== null &&
      cells[array[0]].textContent === cells[array[1]].textContent &&
      cells[array[1]].textContent === cells[array[2]].textContent
    ) {
      // winner found
      highlightWinnerCells(cells[array[0]], cells[array[1]], cells[array[2]]);
      if (cells[array[0]].textContent === player1Sign) {
        updateScoreboard(player1Score);
      } else if (cells[array[0]].textContent === player2Sign) {
        updateScoreboard(player2Score);
      }
      gameOver = true;
      break;
    }
  }
  if (moves === THREE * THREE && !gameOver) {
    gameOver = true;
    highlightWinnerCells(...cells);
    updateScoreboard(tieScore);
  }
  if (gameOver) {
    resetGame();
  }
}

function resetGame() {
  currPlayer = [player1Sign, player2Sign][Math.floor(Math.random() * 2)];
  moves = 0;
  updateSpinnerDisplay();
  updateTurnColors();
  clearGameboard();
  setTimeout(() => {
    gameOver = false;
    gameboard.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("loading-border"));
    updateSpinnerDisplay();
    updateTurnColors();
    if (currPlayer === player2Sign && opponentType === "computer") {
      pending = true;
      awaitComputerMove(currPlayer, Math.floor(Math.random() * 1000) + 600);
    }
  }, 5500);
}

function clearGameboard() {
  const filledCells = Array.from(gameboard.querySelectorAll(".cell"))
    .map((cell) => (cell.firstElementChild !== null ? cell.firstElementChild : null))
    .filter((cell) => cell !== null);

  gameboard.querySelectorAll(".cell").forEach((cell) => cell.classList.add("loading-border"));
  let delay = 0;
  filledCells.forEach((span) => {
    setTimeout(() => {
      span.classList.replace("fade-in", "fade-out");
      setTimeout(() => {
        span.remove();
      }, 490);
    }, 3300 + delay);
    delay += 200;
  });
}

function highlightWinnerCells(...cells) {
  cells.forEach((cell) => cell.classList.add("highlight-cell"));
  setTimeout(() => {
    cells.forEach((cell) => cell.classList.remove("highlight-cell"));
  }, resetDelay);
}

function updateScoreboard(score) {
  let scoreValue = Number(score.textContent);
  score.textContent = (++scoreValue).toString();
  blinkScore(score);
  saveGameSettings();
}

function blinkScore(score) {
  score.classList.add("blink");
  setTimeout(() => {
    score.classList.remove("blink");
  }, resetDelay);
}

function saveGameSettings() {
  localStorage.setItem("player1Score", player1Score.textContent);
  localStorage.setItem("player2Score", player2Score.textContent);
  localStorage.setItem("tieScore", tieScore.textContent);
  localStorage.setItem("opponent", opponentType);
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
    if (opponentType === "friend") {
      opponentComputer.classList.add("hidden");
      opponentFriend.classList.remove("hidden");
    }
  }
}

// ----------- UPDATE INTERFACE FUNCTIONS --------------

function updateInterface(p1Sign, p2Sign, opponent) {
  // Update when switch the opponent
  player1Name.textContent = `Player 1 (${p1Sign})`;
  player2Name.textContent = `${opponent === "computer" ? "Computer " : "Player 2"} (${p2Sign})`;
}

function updateTurnColors() {
  if (gameOver) {
    player1Name.style.color = "unset";
    player2Name.style.color = "unset";
    return;
  }
  if (currPlayer === player1Sign) {
    player1Name.style.color = "white";
    player2Name.style.color = "var(--light-grey)";
  } else if (currPlayer === player2Sign) {
    player2Name.style.color = "white";
    player1Name.style.color = "var(--light-grey)";
  }
}

function updateCurrentPlayer() {
  if (currPlayer === player1Sign) {
    currPlayer = player2Sign;
  } else if (currPlayer === player2Sign) {
    currPlayer = player1Sign;
  }
}

function updateSpinnerDisplay() {
  if (!startBtn.classList.contains("hide-btn")) return;
  if (gameOver) {
    player1Spinner.classList.remove("show-spinner");
    player2Spinner.classList.remove("show-spinner");
    return;
  }

  if (currPlayer === player1Sign) {
    player1Spinner.classList.add("show-spinner");
    player2Spinner.classList.remove("show-spinner");
  } else if (currPlayer === player2Sign) {
    player2Spinner.classList.add("show-spinner");
    player1Spinner.classList.remove("show-spinner");
  }
}

unmutedIcon.addEventListener("click", () => {
  unmutedIcon.classList.add("hidden");
  mutedIcon.classList.remove("hidden");
});

mutedIcon.addEventListener("click", () => {
  mutedIcon.classList.add("hidden");
  unmutedIcon.classList.remove("hidden");
});

opponentComputer.addEventListener("click", (event) => {
  opponentComputer.classList.add("hidden");
  opponentFriend.classList.remove("hidden");
  // switch the opponent, then save it in local storage
  opponentType = opponents[1];
  localStorage.setItem("opponent", opponentType);
  // after, loadGameSettings() is invoked inside DOMContentLoaded
  window.location.reload();
});

opponentFriend.addEventListener("click", (event) => {
  opponentFriend.classList.add("hidden");
  opponentComputer.classList.remove("hidden");
  // same stuff here as in opponentComputer
  opponentType = opponents[0];
  localStorage.setItem("opponent", opponentType);
  window.location.reload();
});

resetScoreBtn.addEventListener("click", resetGameSettings);

function resetGameSettings() {
  localStorage.clear();
  window.location.reload();
}
// ------- I SHOULD SEARCH FOR MORE SOUND EFFECTS BUT THAT'S NOT MY JOB --------
function makeSound(sound) {
  if (unmutedIcon.classList.contains("hidden")) return;
  sound.currentTime = 0;
  sound.play();
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
