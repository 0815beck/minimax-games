import { type Player, invertPlayer } from "../types/Player";
import {
  add,
  equals,
  NORTH_EAST,
  NORTH_WEST,
  scale,
  SOUTH_EAST,
  SOUTH_WEST,
  subtract,
  type Vector2D,
} from "../types/Vector2D";
import { minimax, type Node } from "./minimax";

type Color = "PINK" | "BLUE";

function invertColor(color: Color): Color {
  return color === "PINK" ? "BLUE" : "PINK";
}

function invertColorIfDefined(color: Color | undefined): Color | undefined {
  if (!color) {
    return undefined;
  }
  return invertColor(color);
}

type Piece = { color: Color; promoted: boolean };
type Move = { start: Vector2D; end: Vector2D; isCapture: boolean };

function allowedDirections(piece: Piece): Vector2D[] {
  if (piece.promoted) {
    return [NORTH_EAST, NORTH_WEST, SOUTH_EAST, SOUTH_WEST];
  } else if (piece.color === "BLUE") {
    return [SOUTH_EAST, SOUTH_WEST];
  } else {
    return [NORTH_WEST, NORTH_EAST];
  }
}

class Board {
  public pieces: (Piece | null)[][];

  constructor(pieces: (Piece | null)[][]) {
    this.pieces = pieces;
  }

  static onBoard(a: Vector2D): boolean {
    return 0 <= a.row && a.row < 8 && 0 <= a.column && a.column < 8;
  }

  getPiece(position: Vector2D): Piece | null {
    return this.pieces[position.row][position.column];
  }

  getPieces(): (Piece | null)[][] {
    return this.pieces;
  }

  deletePiece(x: Vector2D): void {
    this.pieces[x.row][x.column] = null;
  }

  setPiece(position: Vector2D, piece: Piece) {
    this.pieces[position.row][position.column] = piece;
  }

  isPromoting(move: Move): boolean {
    const piece = this.getPiece(move.start);
    return piece &&
      !piece.promoted &&
      (move.end.row === 0 || move.end.row === 0)
      ? true
      : false;
  }

  copy(): Board {
    const pieces = this.pieces.map((row) => [...row]);
    const board = new Board(pieces);
    return board;
  }

  public applyMove(move: Move) {
    const piece = this.getPiece(move.start);
    if (!piece) {
      return;
    }
    this.deletePiece(move.start);
    this.setPiece(
      move.end,
      this.isPromoting(move) ? { ...piece, promoted: true } : piece
    );
    if (move.isCapture) {
      const middle = add(move.start, scale(2, subtract(move.end, move.start)));
      this.deletePiece(middle);
    }
  }

  *[Symbol.iterator](): Iterator<{ piece: Piece; position: Vector2D }> {
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        const piece = this.pieces[row][column];
        if (piece) {
          yield { piece, position: { row, column } };
        }
      }
    }
  }
}

const START_POSITION = new Board([
  [
    { color: "PINK", promoted: false },
    null,
    { color: "PINK", promoted: false },
    null,
    { color: "PINK", promoted: false },
    null,
    { color: "PINK", promoted: false },
    null,
  ],
  [
    null,
    { color: "PINK", promoted: false },
    null,
    { color: "PINK", promoted: false },
    null,
    { color: "PINK", promoted: false },
    null,
    { color: "PINK", promoted: false },
  ],
  [
    { color: "PINK", promoted: false },
    null,
    { color: "PINK", promoted: false },
    null,
    { color: "PINK", promoted: false },
    null,
    { color: "PINK", promoted: false },
    null,
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    null,
    { color: "BLUE", promoted: false },
    null,
    { color: "BLUE", promoted: false },
    null,
    { color: "BLUE", promoted: false },
    null,
    { color: "BLUE", promoted: false },
  ],
  [
    { color: "BLUE", promoted: false },
    null,
    { color: "BLUE", promoted: false },
    null,
    { color: "BLUE", promoted: false },
    null,
    { color: "BLUE", promoted: false },
    null,
  ],
  [
    null,
    { color: "BLUE", promoted: false },
    null,
    { color: "BLUE", promoted: false },
    null,
    { color: "BLUE", promoted: false },
    null,
    { color: "BLUE", promoted: false },
  ],
]);

class State implements Node<State> {
  public board: Board;
  public nextColor: Color;
  public nextPlayer: Player;
  public lastCapture: number;

  constructor(
    board: Board,
    nextColor: Color,
    nextPlayer: Player,
    lastCapture: number
  ) {
    this.board = board;
    this.nextColor = nextColor;
    this.nextPlayer = nextPlayer;
    this.lastCapture = lastCapture;
  }

  nextMoves(): Move[] {
    const moves: Move[] = [];
    let atLeastOneCapture = false;

    for (let { piece, position } of this.board) {
      const start: Vector2D = position;
      if (piece.color !== this.nextColor) {
        continue;
      }
      const directions = allowedDirections(piece);

      // Attempt single-step captures from current position
      for (let direction of directions) {
        const end: Vector2D = add(start, scale(2, direction));
        const inBetween: Vector2D = add(start, direction);
        if (
          !Board.onBoard(end) ||
          this.board.getPiece(end) !== null ||
          this.board.getPiece(inBetween) === null ||
          this.board.getPiece(inBetween)?.color === this.nextColor
        ) {
          continue;
        }
        atLeastOneCapture = true;
        moves.push({ start, end, isCapture: true });
      }

      if (atLeastOneCapture) {
        continue;
      }

      // Attempt standard (non-capturing) moves
      for (let direction of directions) {
        const end = add(start, direction);
        if (this.board.getPiece(end) === null && Board.onBoard(end)) {
          moves.push({ start, end, isCapture: false });
        }
      }
    }

    const heuristicScore = (move: Move) => {
      let score = 0;
      if (this.board.isPromoting(move)) {
        score += 2;
      }
      if (move.isCapture) {
        score += 1;
      }
      return score;
    };

    return moves.sort((a, b) => heuristicScore(b) - heuristicScore(a));
  }

  isLeaf(): boolean {
    if (this.lastCapture >= 30) {
      return true;
    }
    return this.nextMoves().length === 0;
  }

  applyMove(move: Move) {
    this.board.applyMove(move);
    if (
      move.isCapture &&
      this.nextMoves().find((x) => x.isCapture && equals(x.start, move.end))
    ) {
      // this move is the beginning of a capture chain
      this.lastCapture = 0;
      return;
    }
    if (move.isCapture) {
      this.lastCapture = 0;
    } else {
      this.lastCapture += 1;
    }
    this.nextColor = invertColor(this.nextColor);
    this.nextPlayer = invertPlayer(this.nextPlayer);
  }

  copy(): State {
    const board = this.board.copy();
    const state = new State(
      board,
      this.nextColor,
      this.nextPlayer,
      this.lastCapture
    );
    return state;
  }

  *[Symbol.iterator](): Iterator<State> {
    let moves = this.nextMoves();
    for (let move of moves) {
      let state = this.copy();
      state.applyMove(move);
      yield state;
    }
  }
}

function evaluation(state: State): number {
  const maximizingColor =
    state.nextPlayer === "MACHINE"
      ? state.nextColor
      : invertColor(state.nextColor);
  if (state.isLeaf()) {
    if (state.nextPlayer === "MACHINE") {
      return -Infinity;
    } else {
      return +Infinity;
    }
  }
  let friendlyScore = 0;
  let enemyScore = 0;
  for (let { piece } of state.board) {
    if (piece.color === maximizingColor) {
      friendlyScore += piece.promoted ? 2.5 : 1;
    } else {
      enemyScore += piece.promoted ? 2.5 : 1;
    }
  }
  return friendlyScore - enemyScore;
}

function bestMove(state: State, maxDepth: number): Move | null {
  let moveScoreTable: { move: Move; score: number }[] = [];
  let moves = state.nextMoves();
  if (moves.length === 0) {
    return null;
  }
  for (let move of moves) {
    const childState = state.copy();
    childState.applyMove(move);
    const score = minimax<State>(childState, evaluation, maxDepth, false);
    moveScoreTable.push({ move, score });
  }
  return moveScoreTable.sort((a, b) => b.score - a.score)[0].move;
}

export { type Color, type Piece, type Move, invertColor, invertColorIfDefined };
export { Board, START_POSITION, State, bestMove };
