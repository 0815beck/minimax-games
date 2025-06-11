import type { Symbol, Player, Position } from "../types";
import Field from "./Field";
import type { MouseEvent } from "react";

function Board(props: {
  nextPlayer: Player | null;
  winner: Symbol | "DRAW" | null;
  board: (Symbol | null)[][];
  onFieldClick: (
    position: Position
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  let fields = [];
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      let disabled =
        props.nextPlayer === "MACHINE" ||
        props.nextPlayer === null ||
        props.winner !== null ||
        props.board[row][column] !== null
          ? true
          : false;
      fields.push(
        Field({
          disabled,
          symbol: props.board[row][column],
          onClick: props.onFieldClick({ row, column }),
        })
      );
    }
  }

  return (
    <div
      className={
        "flex-grow max-w-9/10 sm:max-w-5/10 md:max-w-96 grid grid-cols-3 gap-2"
      }
    >
      {fields}
    </div>
  );
}

export default Board;
