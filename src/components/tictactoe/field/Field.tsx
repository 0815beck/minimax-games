import type { Symbol } from "../../../minimax/tictactoe";
import type { MouseEvent } from "react";
import styles from "./Field.module.css";

function Field(props: {
  disabled: boolean;
  symbol: Symbol | null;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  let symbolSvg = <></>;

  if (props.symbol === "X") {
    symbolSvg = (
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
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
        <line x1="10" y1="10" x2="90" y2="90" />
        <line x1="90" y1="10" x2="10" y2="90" />
      </svg>
    );
  } else if (props.symbol === "O") {
    symbolSvg = (
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
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
  } else {
    symbolSvg = (
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          strokeWidth: 6,
          fill: "none",
        }}
      ></svg>
    );
  }

  return (
    <button
      className={styles.field}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {symbolSvg}
    </button>
  );
}

export default Field;
