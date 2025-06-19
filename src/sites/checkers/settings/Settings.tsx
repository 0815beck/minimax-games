import BinarySetting from "../../../components/binarySetting/BinarySetting";
import Button from "../../../components/button/Button";
import type { Color } from "../../../minimax/checkers";
import type { Difficulty } from "../../../minimax/tictactoe";
import type { Player } from "../../../types/Player";
import styles from "./Settings.module.css";

function Settings(props: {
  startPlayer: Player | undefined;
  userColor: Color | undefined;
  difficulty: Difficulty | undefined;
  setStartPlayer: React.Dispatch<React.SetStateAction<Player | undefined>>;
  setUserColor: React.Dispatch<React.SetStateAction<Color | undefined>>;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty | undefined>>;
  onNewGame: () => void;
}) {
  return (
    <div id={styles.outerBox}>
      <div id={styles.settings}>
        <BinarySetting
          settingLabel="Wer soll beginnen?"
          labelLeft="Du"
          labelRight="Computer"
          setLeft={() => props.setStartPlayer("HUMAN")}
          setRight={() => props.setStartPlayer("MACHINE")}
          selected={
            props.startPlayer === "HUMAN"
              ? "LEFT"
              : props.startPlayer !== null
              ? "RIGHT"
              : null
          }
        />
        <BinarySetting
          settingLabel="Welche Farbe möchtest du?"
          labelLeft="Pink"
          labelRight="Blau"
          setLeft={() => props.setUserColor("PINK")}
          setRight={() => props.setUserColor("BLUE")}
          selected={
            props.userColor === "PINK"
              ? "LEFT"
              : props.userColor !== null
              ? "RIGHT"
              : null
          }
        />
        <BinarySetting
          settingLabel="Wie schwierig soll es sein?"
          labelLeft="Einfach"
          labelRight="Schwer"
          setLeft={() => props.setDifficulty("EASY")}
          setRight={() => props.setDifficulty("HARD")}
          selected={
            props.difficulty === "EASY"
              ? "LEFT"
              : props.difficulty !== null
              ? "RIGHT"
              : null
          }
        />

        <Button
          label="Neues Spiel"
          onClick={props.onNewGame}
          className={styles.startBtn}
        />
      </div>
    </div>
  );
}

export default Settings;
