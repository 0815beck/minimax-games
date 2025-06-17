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
 *      -  B  -  B  -  B  -  B
 *      B  -  B  -  B  -  B  -
 *      -  B  -  B  -  B  -  B
 *      -  -  -  -  -  -  -  -
 *      -  -  -  -  -  -  -  -
 *      W  -  w  -  W  -  W  -
 *      -  W  -  W  -  W  -  W
 *      W  -  W  -  W  -  W  -
 */

type Color = "WHITE" | "BLACK";
type Player = "HUMAN" | "MACHINE";
type Piece = { color: Color; promoted: boolean };
type Vector2D = { row: number; column: number };

function invertColor(color: Color) {
  return color === "WHITE" ? "BLACK" : "WHITE";
}

type Board = Map<Vector2D, Piece>;

const NORTH_EAST: Vector2D = { row: 1, column: 1 };
const NORTH_WEST: Vector2D = { row: 1, column: -1 };
const SOUTH_EAST: Vector2D = { row: -1, column: 1 };
const SOUTH_WEST: Vector2D = { row: -1, column: -1 };

const DIRECTIONS = {
  WHITE: [NORTH_WEST, NORTH_EAST],
  BLACK: [SOUTH_EAST, SOUTH_WEST],
  PROMOTED: [NORTH_EAST, NORTH_WEST, SOUTH_EAST, SOUTH_WEST],
};

function add(a: Vector2D, b: Vector2D): Vector2D {
  return { row: a.row + b.row, column: a.column + b.column };
}

function scale(lambda: number, a: Vector2D) {
  return { row: lambda * a.row, column: lambda * a.column };
}

function onBoard(a: Vector2D): boolean {
  return 0 <= a.row && a.row < 8 && 0 <= a.column && a.column < 8;
}

type StandardMove = { type: "standard"; start: Vector2D; end: Vector2D };
type CaptureChain = {
  type: "capture";
  path: Vector2D[];
  captures: Vector2D[];
};
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

function isPromoting(move: Move, board: Board): boolean {
  const piece = board.get(getStart(move));
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

  for (let entry of board) {
    const start: Vector2D = entry[0];
    const piece: Piece = entry[1];

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
        !onBoard(firstStep) ||
        board.get(firstStep) !== null ||
        board.get(inBetween) === null ||
        board.get(inBetween)?.color === nextToMove
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
            !onBoard(nextStep) ||
            board.get(nextStep) !== null ||
            board.get(inBetween) === null ||
            board.get(inBetween)?.color === nextToMove ||
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
      if (board.get(end) === null && onBoard(end)) {
        moves.push({ type: "standard", start, end });
      }
    }
  }

  const heuristicScore = (move: Move) => {
    let score = 0;
    // let us say that a promoted piece is three times as valuable as a standard piece
    if (isPromoting(move, board)) {
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

import type { Node } from "./minimax";

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
    for (let entry of this.board) {
      let piece = entry[1];
      if (piece.color === this.maximizingColor) {
        friendlyScore += piece.promoted ? 3 : 1;
      } else {
        enemyScore += piece.promoted ? 3 : 1;
      }
    }
    return friendlyScore - enemyScore;
  }

  private applyMove(move: Move) {
    const start = getStart(move);
    const end = getEnd(move);
    const piece = this.board.get(getStart(move));
    if (!piece) {
      return;
    }
    const promoting = isPromoting(move, this.board);
    this.board.delete(start);
    this.board.set(end, promoting ? { ...piece, promoted: true } : piece);
    if (move.type === "capture") {
      for (let capture of move.captures) {
        this.board.delete(capture);
      }
    }
    this.nextToMove = invertColor(this.nextToMove);
    if (move.type === "capture") {
      this.turnsWithoutCapture = 0;
    } else {
      this.turnsWithoutCapture += 1;
    }
  }

  *[Symbol.iterator](): Iterator<Node> {
    let moves = getMoves(this.board, this.nextToMove);
    for (let move of moves) {
      // we are copying the board, but since minimax is a depth
      // first search we will hopefully be fine memory wise
      let newBoard = new Map<Vector2D, Piece>();
      for (let [key, value] of this.board) {
        newBoard.set(key, value);
      }
      let newState = new State(
        newBoard,
        this.nextToMove,
        this.maximizingColor,
        this.turnsWithoutCapture
      );
      newState.applyMove(move);
      yield newState;
    }
  }
}
