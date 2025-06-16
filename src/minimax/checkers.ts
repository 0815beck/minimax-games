/**
 *
 * This file contains the implementation of the checkers game rules and
 * its game state class, which can be fed into the minimax algorithm.
 *
 * Checkers is played on a 8 x 8 grid. At the start of the game the white pieces
 * are positioned at the south half of the board, and the black pieces are in the
 * north. The board looks as follows:
 *
 *      -  B  -  B  -  B  -  B
 *      B  -  B  -  B  -  B  -
 *      -  B  -  B  -  B  -  B
 *      -  -  -  -  -  -  -  -
 *      -  -  -  -  -  -  -  -
 *      W  -  w  -  W  -  W  -
 *      -  W  -  W  -  W  -  W
 *      W  -  W  -  W  -  W  -
 *
 *  The full rules can be found here:
 */

import type { Node } from "./minimax";

type Piece = "WHITE" | "BLACK" | "WHITE_QUEEN" | "BLACK_QUEEN";
type Color = "WHITE" | "BLACK";
type Board = (Piece | null)[][];
type Player = "HUMAN" | "MACHINE";

class Vector2D {
  public row: number;
  public column: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }

  add(other: Vector2D): Vector2D {
    this.row += other.row;
    this.column += other.column;
    return this;
  }

  scale(lambda: number): Vector2D {
    this.row = lambda * this.row;
    this.column = lambda * this.column;
    return this;
  }
}

function add(a: Vector2D, b: Vector2D): Vector2D {
  return new Vector2D(a.row + b.row, a.column + b.column);
}

function scale(lambda: number, a: Vector2D) {
  return new Vector2D(lambda * a.row, lambda * a.column);
}

const NORTH_EAST: Vector2D = new Vector2D(1, 1);
const NORTH_WEST: Vector2D = new Vector2D(1, -1);
const SOUTH_EAST: Vector2D = new Vector2D(-1, 1);
const SOUTH_WEST: Vector2D = new Vector2D(-1, -1);

function getColorOfPiece(piece: Piece): Color {
  let color: Color;
  switch (piece) {
    case "WHITE":
      color = "WHITE";
      break;
    case "BLACK":
      color = "BLACK";
      break;
    case "WHITE_QUEEN":
      color = "WHITE";
      break;
    case "BLACK_QUEEN":
      color = "BLACK";
      break;
  }
  return color;
}

/**
 * A move in checkers can be either a normal move or a capture.
 * It is possible to capture more than one piece in a single turn. This is
 * why a capture is represented by an array of end positions.
 *
 * The last position is the position where the piece is finally at.
 */
type Move = { start: Vector2D; end: Vector2D | Vector2D[] };

/**
 * This function calculates all allowed moves in a given checkers position. If one of
 * the moves is a capture, then all other moves are ignored and only captures are
 * returned (Schlagzwang). Additionally only the captures (one or more) with the
 * highest amount of captured enemy pieces are allowed moves (Mehrheitsschlag).
 *
 * @param board - The current game state
 * @param nextToMove - The color which will move next
 * @param position - Position of the piece, if there is no piece at the position, then the
 * functions returns the empty array.
 * @returns - Array of possible moves
 */
function moves(board: Board, nextToMove: Color): Move[] {
  let moves: Move[] = [];
  for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 8; column++) {
      if (row + (column % 2) !== 0) {
        continue;
      }
      let piece = board[row][column];
      if (!piece) {
        continue;
      }
      if (getColorOfPiece(piece) !== nextToMove) {
        continue;
      }
    }
  }
  return [];
}

/*
class State implements Node {
  private board: Board;
  private nextPlayer: Player;
  private nextColor: Color;
  private turnsSinceLastCapture: number;

  constructor(
    board: Board,
    nextPlayer: Player,
    nextColor: Color,
    turnsSinceLastCapture: number = 0
  ) {
    this.board = board;
    this.nextPlayer = nextPlayer;
    this.nextColor = nextColor;
    this.turnsSinceLastCapture = turnsSinceLastCapture;
  }
}*/
