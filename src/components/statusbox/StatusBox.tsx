import styles from "./StatusBox.module.css";
import RobotIcon from "../robotIcon/RobotIcon";

function StatusBox(props: { message: string; className?: string }) {
  return (
    <div id={styles.container} className={props.className}>
      <div id={styles.statusBox}>
        <div id={styles.speechBubble}>
          <div id={styles.bubbleContentBox}>
            <div id={styles.statusMessage}>{props.message}</div>
          </div>
        </div>
        <div id={styles.robotIcon}>
          <RobotIcon />
        </div>
      </div>
    </div>
  );
}

export default StatusBox;
