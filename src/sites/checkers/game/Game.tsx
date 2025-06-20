import type { MouseEvent } from "react";
import {
  Board,
  type Move,
  type Piece,
  type State,
} from "../../../minimax/checkers";
import { equals, type Vector2D } from "../../../types/Vector2D";
import styles from "./Game.module.css";
import StatusBox from "../../../components/statusbox/StatusBox";
import Button from "../../../components/button/Button";
import { useNavigate } from "react-router-dom";
import BoardView from "../../../components/checkers/board/Board";

function Game(props: {
  state: State | undefined;
  gameOver: boolean;
  selectedField: Vector2D | undefined;
  nextMoves: Move[];
  onFieldClick: (
    position: Vector2D
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const navigate = useNavigate();

  return (
    <div id={styles.game}>
      <div id={styles.boardContainer}>
        <BoardView {...props} />
      </div>
      <div id={styles.extraInfo}>
        <StatusBox message={"Wir haben Spaß"} className={styles.statusBox} />
        {true && (
          <div id={styles.buttonGroup}>
            <Button
              label={"Nochmal"}
              onClick={() => navigate("/dame/einstellungen")}
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
