import { invertPlayer, type Player } from "../types/Player";
import type { Node } from "./minimax";
import { minimax } from "./minimax";

type Symbol = "X" | "O";
type Position = { row: number; column: number };
type Board = (Symbol | null)[][];
type Difficulty = "EASY" | "HARD";

function invertSymbol(symbol: Symbol): Symbol {
  return symbol === "X" ? "O" : "X";
}

function getWinningSymbol(board: Board): Symbol | "DRAW" | null {
  // check if a row, column or diagonal is filled with the same symbol
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

  //check if the board is full
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

  return null;
}

class State implements Node<State> {
  public board: Board;
  public nextSymbol: Symbol;
  public nextPlayer: Player;

  constructor(board: Board, nextSymbol: Symbol, nextPlayer: Player) {
    this.board = board;
    this.nextSymbol = nextSymbol;
    this.nextPlayer = nextPlayer;
  }

  isLeaf(): boolean {
    return getWinningSymbol(this.board) !== null;
  }

  *[Symbol.iterator](): Iterator<State> {
    if (this.isLeaf()) return;

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (this.board[row][column] === null) {
          const newBoard = this.board.map((row) => [...row]);
          newBoard[row][column] = this.nextSymbol;

          yield new State(
            newBoard,
            invertSymbol(this.nextSymbol),
            invertPlayer(this.nextPlayer)
          );
        }
      }
    }
  }
}

function evaluation(state: State): number {
  if (!state.isLeaf()) {
    return 0;
  }
  if (getWinningSymbol(state.board) === "DRAW") {
    return 0;
  }
  if (state.nextPlayer === "HUMAN") {
    return 1;
  }
  if (state.nextPlayer === "MACHINE") {
    return -1;
  }
  return 0;
}

function bestMove(board: (Symbol | null)[][], nextSymbol: Symbol) {
  const positionScoreTable: { position: Position; score: number }[] = [];

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      if (board[row][column] === null) {
        board[row][column] = nextSymbol;
        const score = minimax<State>(
          new State(board, invertSymbol(nextSymbol), "HUMAN"),
          evaluation,
          9,
          false
        );
        board[row][column] = null;
        positionScoreTable.push({ position: { row, column }, score });
      }
    }
  }

  console.log(
    "[Info] Minimax has evaluated all possible next moves and assigned them scores." +
      " Minimax results look as follows: ",
    positionScoreTable
  );

  return positionScoreTable.sort((a, b) => b.score - a.score)[0].position;
}

export type { Symbol, Position, Player, Board, Difficulty };
export { bestMove, getWinningSymbol, invertSymbol, invertPlayer };
