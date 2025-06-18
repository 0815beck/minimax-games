import Board from "../../../components/tictactoe/board/Board";
import type { Player, Symbol, Position } from "../../../minimax/tictactoe";
import type { MouseEvent } from "react";
import { getWinningSymbol } from "../../../minimax/tictactoe";
import styles from "./Game.module.css";
import StatusBox from "../../../components/statusbox/StatusBox";

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
      <StatusBox message={statusMessage} className={styles.statusBox} />
    </div>
  );
}

export default Game;
