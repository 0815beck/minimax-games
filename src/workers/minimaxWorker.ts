/* eslint-disable no-restricted-globals */

import {
  bestMove,
  Board,
  State,
  type Color,
  type Piece,
} from "../minimax/checkers";
import type { Player } from "../types/Player";
import type { Vector2D } from "../types/Vector2D";

type Request = {
  pieces: (Piece | null)[][];
  nextColor: Color;
  nextPlayer: Player;
  lastCapture: number;
  mustMoveNext: Vector2D | undefined;
  searchDepth: number;
};

self.onmessage = (event: MessageEvent<Request>) => {
  const data = event.data;
  const state = new State(
    new Board(data.pieces),
    data.nextColor,
    data.nextPlayer,
    data.lastCapture,
    data.mustMoveNext
  );
  const move = bestMove(state, data.searchDepth);
  self.postMessage(move);
};
