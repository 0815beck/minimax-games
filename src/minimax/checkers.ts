/**
 * CHECKERS: GAME STATE IMPLEMENTATION
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
type Piece = { color: Color; promoted: boolean };
type Vector2D = { row: number; column: number };

function invertColor(color: Color) {
  return color === "WHITE" ? "BLACK" : "WHITE";
}

type Board = Map<Vector2D, Piece | null>;

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
type CaptureChain = { type: "capture"; path: Vector2D[]; captures: Vector2D[] };
type Move = StandardMove | CaptureChain;

/**
 * Generates all legal moves for the given player in the current board state.
 *
 * Enforces the following checkers rules:
 * - If any capture is available, all non-capturing moves are disallowed (Schlagzwang)
 * - Only the longest available capture chains are legal (Mehrheitsschlag)
 *
 * @param board - Current state of the game board
 * @param nextToMove - The player whose turn it is
 * @returns A list of all legal moves for the active player
 */
function moves(board: Board, nextToMove: Color): Move[] {
  let moves: Move[] = [];

  for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 8; column++) {
      const start: Vector2D = { row, column };
      const piece = board.get(start);
      if (!piece || piece?.color !== nextToMove) {
        continue;
      }
      const directions = DIRECTIONS[piece.promoted ? "PROMOTED" : piece.color];

      // Attempt standard (non-capturing) moves
      for (let direction of directions) {
        const end = add(start, direction);
        if (board.get(end) === null && onBoard(end)) {
          moves.push({ type: "standard", start, end });
        }
      }

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
    }
  }

  // enforce Schlagzwang and Mehrheitsschlag rules
  let maxCaptures = 0;
  for (let m of moves) {
    if (m.type === "capture") {
      maxCaptures = Math.max(maxCaptures, m.captures.length);
    }
  }
  if (maxCaptures > 0) {
    moves = moves.filter(
      (m) => m.type === "capture" && m.captures.length === maxCaptures
    );
  }

  return moves;
}
