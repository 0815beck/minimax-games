import { invertPlayer, type Player } from "../types/Player";
import type { Vector2D } from "../types/Vector2D";
import type { Node } from "./minimax";
import { minimax } from "./minimax";

type Difficulty = "EASY" | "HARD";
type Symbol = "X" | "O";

function invertSymbol(symbol: Symbol): Symbol {
  return symbol === "X" ? "O" : "X";
}

function invertSymbolIfExists(symbol: Symbol | undefined): Symbol | undefined {
  if (!symbol) {
    return undefined;
  }
  return invertSymbol(symbol);
}

type Move = { position: Vector2D; symbol: Symbol };

class Board {
  public symbols: (Symbol | null)[][];

  constructor(symbols: (Symbol | null)[][]) {
    this.symbols = symbols;
  }

  getWinningSymbol(): Symbol | "DRAW" | null {
    // check if a row, column or diagonal is filled with the same symbol
    for (let row = 0; row < 3; row++) {
      if (
        this.symbols[row][0] === this.symbols[row][1] &&
        this.symbols[row][1] === this.symbols[row][2] &&
        this.symbols[row][0] !== null
      ) {
        return this.symbols[row][0];
      }
    }

    for (let column = 0; column < 3; column++) {
      if (
        this.symbols[0][column] === this.symbols[1][column] &&
        this.symbols[1][column] === this.symbols[2][column] &&
        this.symbols[0][column] !== null
      ) {
        return this.symbols[0][column];
      }
    }

    if (
      this.symbols[0][0] === this.symbols[1][1] &&
      this.symbols[1][1] === this.symbols[2][2] &&
      this.symbols[0][0] !== null
    ) {
      return this.symbols[0][0];
    }

    if (
      this.symbols[2][0] === this.symbols[1][1] &&
      this.symbols[1][1] === this.symbols[0][2] &&
      this.symbols[2][0] !== null
    ) {
      return this.symbols[2][0];
    }

    //check if the board is full
    let boardIsFull = true;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (this.symbols[row][column] === null) {
          boardIsFull = false;
        }
      }
    }
    if (boardIsFull) {
      return "DRAW";
    }

    return null;
  }

  copy(): Board {
    const newGrid = this.symbols.map((row) => [...row]);
    return new Board(newGrid);
  }

  applyMove(move: Move) {
    if (this.symbols[move.position.row][move.position.column] !== null) {
      return;
    }
    this.symbols[move.position.row][move.position.column] = move.symbol;
  }
}

const START_POSITION = new Board([
  [null, null, null],
  [null, null, null],
  [null, null, null],
]);

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
    return this.board.getWinningSymbol() !== null;
  }

  copy(): State {
    return new State(this.board.copy(), this.nextSymbol, this.nextPlayer);
  }

  applyMove(move: Move): State {
    this.board.applyMove(move);
    this.nextPlayer = invertPlayer(this.nextPlayer);
    this.nextSymbol = invertSymbol(this.nextSymbol);
    return this;
  }

  *[Symbol.iterator](): Iterator<State> {
    if (this.isLeaf()) return;

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (this.board.symbols[row][column] === null) {
          const newBoard = this.board.copy();
          newBoard.applyMove({
            position: { row, column },
            symbol: this.nextSymbol,
          });
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
  if (state.board.getWinningSymbol() === "DRAW") {
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

function bestMove(state: State, maxDepth: number) {
  const moveScoreTable: { move: Move; score: number }[] = [];

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      if (state.board.symbols[row][column] === null) {
        const childState = state.copy().applyMove({
          position: { row, column },
          symbol: state.nextSymbol,
        });
        const score = minimax<State>(childState, evaluation, maxDepth, false);
        moveScoreTable.push({
          move: { position: { row, column }, symbol: state.nextSymbol },
          score,
        });
      }
    }
  }

  return moveScoreTable.sort((a, b) => b.score - a.score)[0].move;
}

export { type Difficulty, type Symbol, invertSymbol, invertSymbolIfExists };
export { type Move, Board, START_POSITION, State, bestMove, evaluation };
