import { START_POSITION, type State } from "../../../minimax/tictactoe";
import type { MouseEvent } from "react";
import styles from "./Game.module.css";
import Board from "../../../components/tictactoe/board/Board";
import type { Vector2D } from "../../../types/Vector2D";
import StatusBox from "../../../components/statusbox/StatusBox";
import Button from "../../../components/button/Button";
import { Navigate, useNavigate } from "react-router-dom";

function Game(props: {
  state: State | undefined;
  gameOver: boolean;
  onFieldClick: (
    position: Vector2D
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const navigate = useNavigate();

  return (
    <div id={styles.game}>
      <div id={styles.boardContainer}>
        <Board
          nextPlayer={props.state?.nextPlayer}
          gameOver={props.gameOver}
          board={
            props.state ? props.state.board.symbols : START_POSITION.symbols
          }
          onFieldClick={props.onFieldClick}
        />
      </div>
      <div id={styles.extraInfo}>
        <StatusBox message={"Wir haben Spaß"} className={styles.statusBox} />
        {true && (
          <div id={styles.buttonGroup}>
            <Button
              label={"Nochmal"}
              onClick={() => navigate("/tictactoe/einstellungen")}
            />
            <Button
              label={"Es reicht"}
              className={styles.button}
              onClick={() => navigate("/")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
