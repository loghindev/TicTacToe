const userMoveSound = document.getElementById("userMoveSound");
const computerMoveSound = document.getElementById("computerMoveSound");
const mutedIcon = document.getElementById("mutedIcon");
const unmutedIcon = document.getElementById("unmutedIcon");
const startBtn = document.getElementById("startBtn");
const gameboard = document.getElementById("gameboard");
const player1Name = document.querySelector("#scoreBoard #player1 .name");
const player1Score = document.querySelector("#scoreBoard #player1 .scorespanue");
const player1Spinner = document.querySelector("#scoreBoard #player1 .spinner");
const player2Name = document.querySelector("#scoreBoard #player2 .name");
const player2Scoare = document.querySelector("#scoreBoard #player2 .scorespanue");
const player2Spinner = document.querySelector("#scoreBoard #player2 .spinner");
const tieScore = document.querySelector("#scoreBoard #tie .scorespanue");
const opponentComputer = document.querySelector("#scoreBoard #opponentOption #vsBot");
const opponentFriend = document.querySelector("#scoreBoard #opponentOption #vsFriend");
const score = {
  player1: 0,
  player2: 0,
  tie: 0,
};

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
  generateGameboard(); // sets 'click' event listeners on each cell already
  // when page loads -> user vs computer (default);
  updateInterface(player1Sign, player2Sign, opponentType);

  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hide-btn");
    startBtn.disabled = true;
    if (currPlayer === player2Sign && opponentType === "computer") {
      console.log("Computer a mutat in 'DOMContentLoaded'");
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
  if (event.target.textContent !== "" || pending || !startBtn.classList.contains("hide-btn")) return;
  // check the current player to know what type of cell to set

  console.log("Eu am mutat in 'setCell()'");
  const span = document.createElement("span");
  span.classList = "fade-in";
  span.textContent = currPlayer;
  event.target.appendChild(span);
  currPlayer === player1Sign ? makeSound(userMoveSound) : makeSound(computerMoveSound);
  updateCurrentPlayer();
  updateTurnColors();

  if (opponentType === "computer") {
    console.log("Computer a mutat in 'setCell()'");
    pending = true;
    awaitComputerMove(currPlayer, Math.floor(Math.random() * 800) + 800);
  }
}

function awaitComputerMove(currPlayer, delay) {
  const emptyCells = Array.from(document.querySelectorAll("#gameboard .cell")).filter(
    (cell) => cell.querySelector("span") === null
  );
  console.log(emptyCells);

  if (emptyCells.length) {
    const span = document.createElement("span");
    setTimeout(() => {
      pending = false;
      span.classList = "fade-in";
      span.textContent = currPlayer;
      emptyCells[Math.floor(Math.random() * emptyCells.length)].appendChild(span);
      updateCurrentPlayer();
      updateTurnColors();
      makeSound(computerMoveSound);
    }, delay);
  }
}

//
//
//
//
//

function updateInterface(p1Sign, p2Sign, opponent) {
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
//
//
// Switch Mute/Unmute Icons Top-Right Corner
unmutedIcon.addEventListener("click", () => {
  unmutedIcon.classList.add("hidden");
  mutedIcon.classList.remove("hidden");
  // stop sounds - to be continued
});
mutedIcon.addEventListener("click", () => {
  mutedIcon.classList.add("hidden");
  unmutedIcon.classList.remove("hidden");
  // start sounds - to be continued
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
