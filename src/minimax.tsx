import type { Symbol, Player, Position } from "./types";
import { invertPlayer, invertSymbol } from "./types";

function getWinningSymbol(board: (Symbol | null)[][]): Symbol | "DRAW" | null {
  let boardIsFull = true;
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      if (board[row][column] === null) {
        boardIsFull = false;
      }
    }
  }
  if (boardIsFull) {
    return "DRAW";
  }

  for (let row = 0; row < 3; row++) {
    if (
      board[row][0] === board[row][1] &&
      board[row][1] === board[row][2] &&
      board[row][0] !== null
    ) {
      return board[row][0];
    }
  }

  for (let column = 0; column < 3; column++) {
    if (
      board[0][column] === board[1][column] &&
      board[1][column] === board[2][column] &&
      board[0][column] !== null
    ) {
      return board[0][column];
    }
  }

  if (
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[0][0] !== null
  ) {
    return board[0][0];
  }

  if (
    board[2][0] === board[1][1] &&
    board[1][1] === board[0][2] &&
    board[2][0] !== null
  ) {
    return board[2][0];
  }

  return null;
}

function minimax(
  board: (Symbol | null)[][],
  nextSymbol: Symbol,
  nextPlayer: Player
): number {
  const winner: Symbol | "DRAW" | null = getWinningSymbol(board);
  if (winner === "DRAW") {
    return 0;
  }
  if (winner !== null && nextPlayer === "HUMAN") {
    return 10;
  }
  if (winner !== null && nextPlayer === "MACHINE") {
    return -10;
  }

  if (nextPlayer === "HUMAN") {
    let minScore = +Infinity;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (board[row][column] === null) {
          board[row][column] = nextSymbol;
          let score = minimax(
            board,
            invertSymbol(nextSymbol),
            invertPlayer(nextPlayer)
          );
          minScore = Math.min(minScore, score);
          board[row][column] = null;
        }
      }
    }
    return minScore;
  } else {
    let maxScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (board[row][column] === null) {
          board[row][column] = nextSymbol;
          let score = minimax(
            board,
            invertSymbol(nextSymbol),
            invertPlayer(nextPlayer)
          );
          maxScore = Math.max(maxScore, score);
          board[row][column] = null;
        }
      }
    }
    return maxScore;
  }
}

function bestMove(board: (Symbol | null)[][], nextSymbol: Symbol) {
  const positionScoreTable: { position: Position; score: number }[] = [];

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      if (board[row][column] === null) {
        board[row][column] = nextSymbol;
        const score = minimax(board, invertSymbol(nextSymbol), "HUMAN");
        board[row][column] = null;
        positionScoreTable.push({ position: { row, column }, score });
      }
    }
  }

  console.log(
    "The minimax algorithm has computed the following scores: ",
    positionScoreTable
  );

  return positionScoreTable.sort((a, b) => b.score - a.score)[0].position;
}

export { getWinningSymbol, bestMove };
