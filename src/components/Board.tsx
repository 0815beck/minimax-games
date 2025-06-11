import type { Symbol, Player, Position } from "../types";
import Field from "./Field";
import type { MouseEvent } from "react";

function Board(props: {
  nextPlayer: Player | null;
  gameOver: boolean;
  board: (Symbol | null)[][];
  onFieldClick: (
    position: Position
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  let fields = [];
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      let disabled =
        props.nextPlayer !== "HUMAN" ||
        props.gameOver === true ||
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
    <div className="w-full">
      <div
        className={"w-9/10 md:w-5/10 max-w-96 grid grid-cols-3 gap-2 m-auto"}
      >
        {fields}
      </div>
    </div>
  );
}

export default Board;
