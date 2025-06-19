import styles from "./BinarySetting.module.css";

function BinarySetting(props: {
  settingLabel: string;
  labelLeft: string;
  labelRight: string;
  setLeft: () => void;
  setRight: () => void;
  selected: "LEFT" | "RIGHT" | undefined;
}) {
  return (
    <div className={styles.setting}>
      <label className={styles.settingLabel}>{props.settingLabel}</label>
      <div className={styles.btnGroup}>
        <button
          className={`${styles.settingBtn} ${
            props.selected === "LEFT"
              ? styles.selected
              : props.selected !== undefined
              ? styles.notSelected
              : ""
          }`}
          key={"LEFT"}
          onClick={props.setLeft}
        >
          {props.labelLeft}
        </button>
        <button
          className={`${styles.settingBtn} ${
            props.selected === "RIGHT"
              ? styles.selected
              : props.selected !== undefined
              ? styles.notSelected
              : ""
          }`}
          key={"RIGHT"}
          onClick={props.setRight}
        >
          {props.labelRight}
        </button>
      </div>
    </div>
  );
}

export default BinarySetting;
