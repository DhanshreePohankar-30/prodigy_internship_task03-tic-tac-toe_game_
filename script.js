const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let currentPlayer = "X";
let gameActive = false;
let gameState = ["", "", "", "", "", "", "", "", ""];
let vsAI = false;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function startGame(aiMode) {
  vsAI = aiMode;
  currentPlayer = "X";
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winning-cell");
  });
}

function handleCellClick(e) {
  clickSound.play();
  const clickedCell = e.target;
  const cellIndex = clickedCell.getAttribute("data-index");

  if (gameState[cellIndex] !== "" || !gameActive) return;

  clickSound.play();
  makeMove(cellIndex, currentPlayer);

  if (vsAI && gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 600); // delay for AI
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;
  checkWinner();
  if (gameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function computerMove() {
  let emptyCells = gameState
    .map((val, idx) => (val === "" ? idx : null))
    .filter(val => val !== null);

  if (emptyCells.length === 0) return;

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  clickSound.play();
  makeMove(randomIndex, "O");
}

function checkWinner() {
  let roundWon = false;
  let winningCombo = [];

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      winningCombo = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `🎉 Player ${currentPlayer} Wins! 🎉`;
    gameActive = false;
    winSound.play();
    highlightWinningCells(winningCombo);
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "🤝 It's a Draw!";
    gameActive = false;
    drawSound.play();
  }
}

function highlightWinningCells(combo) {
  combo.forEach(index => {
    cells[index].classList.add("winning-cell");
  });
}

function restartGame() {
  startGame(vsAI);
}

// Event Listeners
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", restartGame);
twoPlayerBtn.addEventListener("click", () => startGame(false));
aiBtn.addEventListener("click", () => startGame(true));
