import { START_POSITION, type State } from "../../../minimax/tictactoe";
import type { MouseEvent } from "react";
import styles from "./Game.module.css";
import Board from "../../../components/tictactoe/board/Board";
import type { Vector2D } from "../../../types/Vector2D";

function Game(props: {
  state: State | undefined;
  gameOver: boolean;
  onFieldClick: (
    position: Vector2D
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div id={styles.game}>
      <Board
        nextPlayer={props.state?.nextPlayer}
        gameOver={props.gameOver}
        board={props.state ? props.state.board.symbols : START_POSITION.symbols}
        onFieldClick={props.onFieldClick}
      />
    </div>
  );
}

export default Game;
