const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const exitButton = document.getElementById("exitButton");
const scoreDisplay = document.createElement("div");
scoreDisplay.id = "score";
document.body.appendChild(scoreDisplay);

const COLS = 10,
  ROWS = 20,
  BLOCK_SIZE = 30;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let gameInterval, currentPiece;
let score = 0;

const shapes = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [1, 1, 1],
    [0, 1, 0],
  ], // T
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
];

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell) {
        ctx.fillStyle = "cyan";
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    })
  );
}

function spawnPiece() {
  currentPiece = {
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    x: 3,
    y: 0,
  };
}

function moveDown() {
  currentPiece.y++;
  if (collision()) {
    currentPiece.y--;
    mergePiece();
    spawnPiece();
    if (collision()) {
      clearInterval(gameInterval);
      alert("Game Over");
      resetGame();
    }
    updateScore();
  }
  drawBoard();
  drawPiece();
}

function collision() {
  return currentPiece.shape.some((row, dy) =>
    row.some(
      (cell, dx) =>
        cell &&
        (board[currentPiece.y + dy]?.[currentPiece.x + dx] !== 0 ||
          currentPiece.y + dy >= ROWS)
    )
  );
}

function mergePiece() {
  currentPiece.shape.forEach((row, dy) =>
    row.forEach((cell, dx) => {
      if (cell) board[currentPiece.y + dy][currentPiece.x + dx] = 1;
    })
  );
}

function drawPiece() {
  currentPiece.shape.forEach((row, dy) =>
    row.forEach((cell, dx) => {
      if (cell) {
        ctx.fillStyle = "red";
        ctx.fillRect(
          (currentPiece.x + dx) * BLOCK_SIZE,
          (currentPiece.y + dy) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
        ctx.strokeStyle = "black";
        ctx.strokeRect(
          (currentPiece.x + dx) * BLOCK_SIZE,
          (currentPiece.y + dy) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    })
  );
}

function moveLeft() {
  currentPiece.x--;
  if (collision()) currentPiece.x++;
  drawBoard();
  drawPiece();
}

function moveRight() {
  currentPiece.x++;
  if (collision()) currentPiece.x--;
  drawBoard();
  drawPiece();
}

function rotate() {
  const newShape = currentPiece.shape[0]
    .map((_, index) => currentPiece.shape.map((row) => row[index]))
    .reverse();
  const previousShape = currentPiece.shape;
  currentPiece.shape = newShape;
  if (collision()) currentPiece.shape = previousShape;
  drawBoard();
  drawPiece();
}

function updateScore() {
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every((cell) => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      score += 10;
    }
  }
  scoreDisplay.textContent = `Score: ${score}`;
}

function startGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  spawnPiece();
  gameInterval = setInterval(moveDown, 500);
  startButton.disabled = true;
  exitButton.disabled = false;
}

function resetGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  drawBoard();
  startButton.disabled = false;
  exitButton.disabled = true;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "W") rotate();
  if (e.key === "a" || e.key === "A") moveLeft();
  if (e.key === "d" || e.key === "D") moveRight();
  if (e.key === "s" || e.key === "S") moveDown();
});

startButton.addEventListener("click", startGame);
exitButton.addEventListener("click", () => {
  clearInterval(gameInterval);
  resetGame();
});
