import { useState, useEffect, type MouseEvent } from "react";
import styles from "./Checkers.module.css";
import type { Player } from "../../types/Player";
import type { Color } from "../../types/Color";
import { State } from "../../minimax/checkers";
import type { Vector2D } from "../../types/Vector2D";

function Checkers() {
  const [startPlayer, setStartPlayer] = useState<Player | null>("HUMAN");
  const [userColor, setUserColor] = useState<Color | null>("PINK");
  const [searchDepth, setSearchDepth] = useState<Number | null>(10);

  const [state, setState] = useState<State | null>(null);
  const gameOver = state?.isLeaf();
  const moves = state?.nextMoves();

  const [selectedField, setSelectedField] = useState<Vector2D | null>(null);

  const possibleMovePositions: Vector2D[] = selectedField
    ? moves
        .filter(
          (move) =>
            getStart(move).row === selectedField.row &&
            getStart(move).column === selectedField.column
        )
        .map((move) => getFirstStep(move))
    : [];

  const applyMove = (move: Move) => {
    if (!nextColor || !nextPlayer) {
      return;
    }

    // only apply the first step of the move
    const start = getStart(move);
    const end = getEnd(move);
    const firstStep = getFirstStep(move);

    if (end.row !== firstStep.row || end.column !== firstStep.column) {
    }

    if (move.type === "standard") {
      const newBoard = board.copy();
      board.applyMove(move);
      setLastCapture(lastCapture + 1);
      setNextColor(invertColor(nextColor));
      setNextPlayer(invertPlayer(nextPlayer));
      const newMoves = getMoves(newBoard, nextColor);
      setBoard(newBoard);
      setMoves(newMoves);
    }
    if (move.type === "capture") {
      // only apply the first step of the move
      if (move.path.length === 2) {
      }
    }
  };

  const onClick =
    (position: Vector2D) => (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (
        selectedField &&
        possibleMovePositions.find(
          (x) => x.row === position.row && x.column === position.column
        )
      ) {
        //make move
      }
      setSelectedField(position);
    };

  console.log("Possible move positions: ", possibleMovePositions);

  const blueSVG = (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter:
          "drop-shadow(0 0 6px rgba(0, 255, 255, 0.6)) drop-shadow(0 0 8px #0ff)",
        stroke: "#0ff",
        strokeWidth: 6,
        strokeLinecap: "round",
        fill: "none",
      }}
    >
      <circle cx="50" cy="50" r="35" />
    </svg>
  );

  const pinkSVG = (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter:
          "drop-shadow(0 0 4px rgba(255, 0, 255, 0.8)) drop-shadow(0 0 8px #f0f)",
        stroke: "#f0f",
        strokeWidth: 6,
        fill: "none",
      }}
    >
      <circle cx="50" cy="50" r="35" />
    </svg>
  );

  return (
    <div id={styles.board}>
      {board
        ?.getFields()
        .map((row, rowIndex) =>
          row
            .map((piece, columnIndex) => (
              <div
                key={`${rowIndex}-${columnIndex}`}
                className={`${styles.field} ${
                  (rowIndex + columnIndex) % 2 === 1
                    ? styles.lightField
                    : styles.darkField
                } ${
                  possibleMovePositions.find(
                    (x) => x.row === rowIndex && x.column === columnIndex
                  )
                    ? styles.canBeMovedTo
                    : null
                }`}
                onClick={onClick({ row: rowIndex, column: columnIndex })}
              >
                {piece === null
                  ? null
                  : piece.color === "PINK"
                  ? pinkSVG
                  : blueSVG}
              </div>
            ))
            .reverse()
        )
        .flat()
        .slice()
        .reverse()}
    </div>
  );
}

export default Checkers;
