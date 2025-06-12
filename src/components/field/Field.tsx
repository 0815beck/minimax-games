import type { Symbol } from "../../types.ts";
import type { MouseEvent } from "react";

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
        className={"w-3/4 h-3/4 mx-auto my-auto"}
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
        className={`w-3/4 h-3/4 mx-auto my-auto`}
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
  }

  return (
    <button onClick={props.onClick} disabled={props.disabled}>
      {symbolSvg}
    </button>
  );
}

export default Field;
