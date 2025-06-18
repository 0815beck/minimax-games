import { useState, useEffect, type MouseEvent } from "react";
import styles from "./Checkers.module.css";

import type { Color, Move, Vector2D, Player } from "../../minimax/checkers";
import {
  Board,
  getFirstStep,
  getMoves,
  getStart,
  invertColor,
  START_POSITION,
} from "../../minimax/checkers";

function Checkers() {
  const [startPlayer, setStartPlayer] = useState<Player | null>("HUMAN");
  const [userColor, setUserColor] = useState<Color | null>("PINK");
  const [searchDepth, setSearchDepth] = useState<Number | null>(20);

  const [nextPlayer, setNextPlayer] = useState<Player | null>("HUMAN");
  const [gameOver, setGameOver] = useState<Boolean | null>(false);
  const [lastCapture, setLastCapture] = useState<Number | null>(0);
  const [board, setBoard] = useState<Board>(START_POSITION);

  const nextColor: Color | null =
    nextPlayer === "HUMAN"
      ? userColor
      : userColor
      ? invertColor(userColor)
      : null;

  const [selectedField, setSelectedField] = useState<Vector2D | null>(null);
  const [moves, setMoves] = useState<Move[]>(
    nextColor ? getMoves(board, nextColor) : []
  );

  const onClick =
    (position: Vector2D) => (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (selectedField) {
        // do move
      }
      setSelectedField(position);
    };

  const possibleMovePositions: Vector2D[] = selectedField
    ? moves
        .filter(
          (move) =>
            getStart(move).row === selectedField.row &&
            getStart(move).column === selectedField.column
        )
        .map((move) => getFirstStep(move))
    : [];

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
