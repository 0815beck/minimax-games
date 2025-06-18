import styles from "./Button.module.css";
import type { MouseEvent } from "react";

function Button(props: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={`${styles.btn} ${props.className}`}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault();
        props.onClick();
      }}
    >
      {props.label}
    </button>
  );
}

export default Button;
