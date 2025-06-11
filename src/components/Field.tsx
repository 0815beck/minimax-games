import type { Symbol } from "../types.tsx";
import type { MouseEvent } from "react";

function Field(props: {
  disabled: boolean;
  symbol: Symbol | null;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  let buttonStyle: string = `
    aspect-square min-w-16
    bg-slate-800 shadow-[0px_0px_4px_rgba(255,255,255,0.7)]
  `;

  if (!props.disabled) {
    buttonStyle =
      buttonStyle +
      " hover:bg-slate-700" +
      "hover:shadow-[0px_0px_8px_rgba(255,255,255,0.7)]";
  }

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
    <button
      onClick={props.onClick}
      className={buttonStyle}
      disabled={props.disabled}
    >
      {symbolSvg}
    </button>
  );
}

export default Field;
