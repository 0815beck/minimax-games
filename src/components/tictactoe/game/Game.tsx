import Board from "../board/Board";
import type { Player, Symbol, Position } from "../../../minimax/tictactoe";
import type { MouseEvent } from "react";
import { getWinningSymbol } from "../../../minimax/tictactoe";
import styles from "./game.module.css";
import RobotIcon from "../../robotIcon/RobotIcon";
import Button from "../../button/Button";
import { useNavigate } from "react-router-dom";

function Game(props: {
  nextPlayer: Player | null;
  gameOver: boolean;
  board: (Symbol | null)[][];
  onFieldClick: (
    position: Position
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  let navigate = useNavigate();
  let statusMessage: string = "";
  if (props.gameOver) {
    const winningSymbol = getWinningSymbol(props.board);
    if (winningSymbol === "DRAW") {
      statusMessage = "Unentschieden! Das war ne Knappe Kiste.";
    } else if (props.nextPlayer === "MACHINE") {
      statusMessage =
        "Huch, du hast gewonnen. Damit hab ich nicht gerechnet. Lust auf noch eine Runde?";
    } else if (props.nextPlayer === "HUMAN") {
      statusMessage =
        "Da hab ich wohl gewonnen, wie immer! Willst du es trotzdem nochmal versuchen?";
    }
  }
  if (!props.gameOver && props.nextPlayer === "HUMAN") {
    statusMessage = "Du bist dran!";
  } else if (!props.gameOver && props.nextPlayer === "MACHINE") {
    statusMessage = "Die Maschine denkt.";
  } else if (!props.gameOver && !props.nextPlayer) {
    statusMessage = "Das Spiel hat noch nicht begonnen.";
  }

  return (
    <div id={styles.game}>
      <Board {...props} />
      <div id={styles.statusBox}>
        <div id={styles.speechBubble}>
          <div id={styles.bubbleContentBox}>
            <div id={styles.statusMessage}>{statusMessage}</div>
            {props.gameOver && (
              <div id={styles.btnGroup}>
                <Button
                  label="Gerne nochmal"
                  onClick={() => navigate("/tictactoe/einstellungen")}
                  className={styles.btn}
                />
                <Button
                  label="Ich hab genug"
                  onClick={() => navigate("/")}
                  className={styles.btn}
                />
              </div>
            )}
          </div>
        </div>
        <div id={styles.robotIcon}>
          <RobotIcon />
        </div>
      </div>
    </div>
  );
}

export default Game;
