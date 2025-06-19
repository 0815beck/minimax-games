import type { MouseEvent } from "react";
import type { Move, State } from "../../../minimax/checkers";
import { equals, type Vector2D } from "../../../types/Vector2D";
import styles from "./Game.module.css";

function Game(props: {
  state: State | undefined;
  gameOver: boolean;
  selectedField: Vector2D | undefined;
  nextMoves: Move[];
  onFieldClick: (
    position: Vector2D
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
}) {
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
      {props.state?.board.pieces
        .map((row, rowIndex) =>
          row
            .map((piece, columnIndex) => (
              <button
                key={`${rowIndex}-${columnIndex}`}
                className={`${styles.field} ${
                  (rowIndex + columnIndex) % 2 === 1
                    ? styles.lightField
                    : styles.darkField
                } ${
                  props.selectedField &&
                  props.nextMoves.find((move) =>
                    props.selectedField
                      ? equals(move.start, props.selectedField) &&
                        equals(move.end, { row: rowIndex, column: columnIndex })
                      : false
                  )
                    ? styles.canBeMovedTo
                    : ""
                }`}
                onClick={props.onFieldClick({
                  row: rowIndex,
                  column: columnIndex,
                })}
              >
                {piece === null
                  ? null
                  : piece.color === "PINK"
                  ? pinkSVG
                  : blueSVG}
              </button>
            ))
            .reverse()
        )
        .flat()
        .slice()
        .reverse()}
    </div>
  );
}

export default Game;
