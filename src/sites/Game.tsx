import Board from "../components/Board";
import type { Player, Symbol, Position } from "../types";
import type { MouseEvent } from "react";
import { getWinningSymbol } from "../minimax";

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
      statusMessage = "Unentschieden! Versuch es noch einmal!";
    } else if (props.nextPlayer === "MACHINE") {
      statusMessage = "Du hast gewonnen! Gratulation!";
    } else if (props.nextPlayer === "HUMAN") {
      statusMessage = "Der Computer war leider schlauer. Sei nicht traurig!";
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
    <div
      className={
        "w-screen h-screen flex flex-col items-stretch justify-center bg-slate-800"
      }
    >
      <p className="mb-12 text-2xl text-center text-white">{statusMessage}</p>
      <Board {...props} />
    </div>
  );
}

export default Game;
