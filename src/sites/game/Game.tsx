import Board from "../../components/board/Board";
import type { Player, Symbol, Position } from "../../types";
import type { MouseEvent } from "react";
import { getWinningSymbol } from "../../minimax";
import styles from "./game.module.css";
import RobotIcon from "../../components/robotIcon/RobotIcon";

function Game(props: {
  nextPlayer: Player | null;
  gameOver: boolean;
  board: (Symbol | null)[][];
  onFieldClick: (
    position: Position
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
}) {
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
          <div id={styles.statusMessage}>{statusMessage}</div>
        </div>
        <div id={styles.robotIcon}>
          <RobotIcon />
        </div>
      </div>
    </div>
  );
}

export default Game;
