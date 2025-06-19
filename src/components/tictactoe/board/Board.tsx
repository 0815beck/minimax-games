import type { Symbol } from "../../../minimax/tictactoe";
import Field from "../field/Field";
import type { MouseEvent } from "react";
import styles from "./Board.module.css";
import type { Player } from "../../../types/Player";
import type { Vector2D } from "../../../types/Vector2D";

function Board(props: {
  nextPlayer: Player | undefined;
  gameOver: boolean;
  board: (Symbol | null)[][];
  onFieldClick: (
    position: Vector2D
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
        <Field
          key={JSON.stringify({ column, row })}
          disabled={disabled}
          symbol={props.board[row][column]}
          onClick={props.onFieldClick({ row, column })}
        />
      );
    }
  }

  return <div className={styles.board}>{fields}</div>;
}

export default Board;
