/**
 * CHECKERS - RULES AND GAME STATE
 *
 * This file contains the implementation of the checkers game rules and
 * its game state class, which can be fed into the minimax algorithm.
 *
 * Pieces move diagonally on an 8x8 board. Non-promoted pieces move forward,
 * while promoted pieces can move in all diagonal directions.
 *
 * Board layout at game start:
 *
 *
 *   row
 *
 *    7        -  B  -  B  -  B  -  B
 *    6        B  -  B  -  B  -  B  -
 *    5        -  B  -  B  -  B  -  B
 *    4        -  -  -  -  -  -  -  -
 *    3        -  -  -  -  -  -  -  -
 *    2        P  -  P  -  P  -  P  -
 *    1        -  P  -  P  -  P  -  P
 *    0        P  -  P  -  P  -  P  -
 *
 *   column    0  1  2  3  4  5  6  7
 *
 */

type Player = "HUMAN" | "MACHINE";
type Color = "PINK" | "BLUE";
type Piece = { color: Color; promoted: boolean };
type Vector2D = { row: number; column: number };

function invertColor(color: Color): Color {
  return color === "PINK" ? "BLUE" : "PINK";
}

function add(a: Vector2D, b: Vector2D): Vector2D {
  return { row: a.row + b.row, column: a.column + b.column };
}

function scale(lambda: number, a: Vector2D) {
  return { row: lambda * a.row, column: lambda * a.column };
}

const NORTH_EAST: Vector2D = { row: 1, column: 1 };
const NORTH_WEST: Vector2D = { row: 1, column: -1 };
const SOUTH_EAST: Vector2D = { row: -1, column: 1 };
const SOUTH_WEST: Vector2D = { row: -1, column: -1 };

const DIRECTIONS = {
  PINK: [NORTH_WEST, NORTH_EAST],
  BLUE: [SOUTH_EAST, SOUTH_WEST],
  PROMOTED: [NORTH_EAST, NORTH_WEST, SOUTH_EAST, SOUTH_WEST],
};

type StandardMove = { type: "standard"; start: Vector2D; end: Vector2D };
type CaptureChain = { type: "capture"; path: Vector2D[]; captures: Vector2D[] };
type Move = StandardMove | CaptureChain;

function getStart(move: Move): Vector2D {
  if (move.type === "standard") {
    return move.start;
  } else {
    return move.path[0];
  }
}

function getEnd(move: Move): Vector2D {
  if (move.type === "standard") {
    return move.end;
  } else {
    return move.path[move.path.length - 1];
  }
}

function getFirstStep(move: Move): Vector2D {
  if (move.type === "standard") {
    return move.end;
  } else {
    return move.path[1];
  }
}

class Board {
  private pieces: (Piece | null)[][];

  constructor(pieces: (Piece | null)[][]) {
    this.pieces = pieces;
  }

  static onBoard(a: Vector2D): boolean {
    return 0 <= a.row && a.row < 8 && 0 <= a.column && a.column < 8;
  }

  getPiece(x: Vector2D): Piece | null {
    return this.pieces[x.row][x.column];
  }

  getFields() {
    return this.pieces;
  }

  deletePiece(x: Vector2D): void {
    this.pieces[x.row][x.column] = null;
  }

  setPiece(x: Vector2D, piece: Piece) {
    this.pieces[x.row][x.column] = piece;
  }

  isPromoting(move: Move) {
    const piece = this.getPiece(getStart(move));
    if (!piece || piece?.promoted) {
      return false;
    }
    let endRow: number =
      move.type === "standard"
        ? move.end.row
        : move.path[move.path.length - 1].row;
    if (endRow === 7 || endRow === 0) {
      return true;
    }
    return false;
  }

  copy(): Board {
    const pieces = this.pieces.map((row) => [...row]);
    const board = new Board(pieces);
    return board;
  }

  public applyMove(move: Move) {
    const start = getStart(move);
    const end = getEnd(move);
    const piece = this.getPiece(getStart(move));
    if (!piece) {
      return;
    }
    const promoting = this.isPromoting(move);
    this.deletePiece(start);
    this.setPiece(end, promoting ? { ...piece, promoted: true } : piece);
    if (move.type === "capture") {
      for (let capture of move.captures) {
        this.deletePiece(capture);
      }
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

/**
 * Generates all legal moves for the given player in the current board state.
 *
 * Uses the following version of the checker rules:
 * - If any capture is available, all non-capturing moves are disallowed (Schlagzwang)
 * - If a piece reaches the end row with a capture, then it must promote and
 *   can not make more (backward) captures in the same turn
 *
 * Moves which capture (one or more) pieces or promote a piece come earlier in
 * the returned list of allowed moves.
 *
 * @param board - Current state of the game board
 * @param nextToMove - The player whose turn it is
 * @returns A list of all legal moves for the active player
 */
function getMoves(board: Board, nextToMove: Color): Move[] {
  let moves: Move[] = [];
  let capturePossible: boolean = false;

  for (let { piece, position } of board) {
    const start: Vector2D = position;

    if (piece.color !== nextToMove) {
      continue;
    }

    const directions = DIRECTIONS[piece.promoted ? "PROMOTED" : piece.color];

    // Attempt single-step captures from current position
    let captureChains: CaptureChain[] = [];
    for (let direction of directions) {
      const firstStep: Vector2D = add(start, scale(2, direction));
      const inBetween: Vector2D = add(start, direction);
      if (
        !Board.onBoard(firstStep) ||
        board.getPiece(firstStep) !== null ||
        board.getPiece(inBetween) === null ||
        board.getPiece(inBetween)?.color === nextToMove
      ) {
        continue;
      }
      capturePossible = true;
      captureChains.push({
        type: "capture",
        path: [start, firstStep],
        captures: [inBetween],
      });
    }

    // extend single-step captures to multi-jump capture chains if possible
    let current: CaptureChain[] = captureChains;
    let next: CaptureChain[] = [];

    while (current.length > 0) {
      for (let chain of current) {
        let isComplete: boolean = true;
        const lastStep: Vector2D = chain.path[chain.path.length - 1];
        for (let direction of directions) {
          const nextStep: Vector2D = add(lastStep, scale(2, direction));
          const inBetween: Vector2D = add(lastStep, direction);
          if (
            !Board.onBoard(nextStep) ||
            board.getPiece(nextStep) !== null ||
            board.getPiece(inBetween) === null ||
            board.getPiece(inBetween)?.color === nextToMove ||
            chain.path.includes(nextStep) ||
            chain.captures.includes(inBetween)
          ) {
            continue;
          }
          isComplete = false;
          next.push({
            type: chain.type,
            path: [...chain.path, nextStep],
            captures: [...chain.captures, inBetween],
          });
        }
        if (isComplete) {
          // chain can not be expanded further
          moves.push(chain);
        }
      }
      current = next;
      next = [];
    }

    if (capturePossible) {
      continue;
    }

    // Attempt standard (non-capturing) moves
    for (let direction of directions) {
      const end = add(start, direction);
      if (board.getPiece(end) === null && Board.onBoard(end)) {
        moves.push({ type: "standard", start, end });
      }
    }
  }

  const heuristicScore = (move: Move) => {
    let score = 0;
    // let us say that a promoted piece is three times as valuable as a standard piece
    if (board.isPromoting(move)) {
      score += 2;
    }
    if (move.type === "capture") {
      score += move.captures.length;
    }
    return score;
  };

  moves = moves.sort((a, b) => heuristicScore(b) - heuristicScore(a));
  return moves;
}

import { minimax, type Node } from "./minimax";

class State implements Node {
  private board: Board;
  private nextToMove: Color;
  private maximizingColor: Color;
  private turnsWithoutCapture: number;

  constructor(
    board: Board,
    nextToMove: Color,
    maximizingColor: Color,
    turnsWithoutCapture: number
  ) {
    this.board = board;
    this.nextToMove = nextToMove;
    this.maximizingColor = maximizingColor;
    this.turnsWithoutCapture = turnsWithoutCapture;
  }

  // the game is over when the next player has no allowed moves
  // or there are 30 turns without a capture
  isLeaf(): boolean {
    if (this.turnsWithoutCapture >= 30) {
      return true;
    }
    const moves = getMoves(this.board, this.nextToMove);
    return moves.length === 0;
  }

  evaluation(): number {
    if (this.isLeaf()) {
      if (this.maximizingColor === this.nextToMove) {
        return -Infinity;
      } else {
        return +Infinity;
      }
    }
    let friendlyScore = 0;
    let enemyScore = 0;
    for (let { piece } of this.board) {
      if (piece.color === this.maximizingColor) {
        friendlyScore += piece.promoted ? 3 : 1;
      } else {
        enemyScore += piece.promoted ? 3 : 1;
      }
    }
    return friendlyScore - enemyScore;
  }

  public applyMove(move: Move) {
    this.board.applyMove(move);
    this.nextToMove = invertColor(this.nextToMove);
    if (move.type === "capture") {
      this.turnsWithoutCapture = 0;
    } else {
      this.turnsWithoutCapture += 1;
    }
  }

  copy(): State {
    const board = this.board.copy();
    const state = new State(
      board,
      this.nextToMove,
      this.maximizingColor,
      this.turnsWithoutCapture
    );
    return state;
  }

  *[Symbol.iterator](): Iterator<Node> {
    let moves = getMoves(this.board, this.nextToMove);
    for (let move of moves) {
      let state = this.copy();
      state.applyMove(move);
      yield state;
    }
  }
}

function bestMove(
  board: Board,
  nextColor: Color,
  turnsWithoutCapture: number,
  depth: number = 10
): Move | null {
  let moveScoreTable: { move: Move; score: number }[] = [];
  let moves = getMoves(board, nextColor);
  if (moves.length === 0) {
    return null;
  }
  for (let move of moves) {
    const state = new State(board, nextColor, nextColor, turnsWithoutCapture);
    state.applyMove(move);
    const score = minimax<State>(state, depth, false);
    moveScoreTable.push({ move, score });
  }
  return moveScoreTable.sort((a, b) => b.score - a.score)[0].move;
}

export type {
  Color,
  Piece,
  Move,
  StandardMove,
  CaptureChain,
  Vector2D,
  Player,
};
export {
  Board,
  bestMove,
  START_POSITION,
  getMoves,
  invertColor,
  getFirstStep,
  getStart,
};
