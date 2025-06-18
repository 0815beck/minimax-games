import {
  type Symbol,
  type Difficulty,
  type Player,
} from "../../../minimax/tictactoe";
import styles from "./Settings.module.css";
import BinarySetting from "../../../components/binarySetting/BinarySetting";
import Button from "../../../components/button/Button";

function Settings(props: {
  startPlayer: Player | null;
  userSymbol: Symbol | null;
  difficulty: Difficulty | null;
  setStartPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setUserSymbol: React.Dispatch<React.SetStateAction<Symbol | null>>;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty | null>>;
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
          settingLabel="Welches Symbol möchtest du?"
          labelLeft="X"
          labelRight="O"
          setLeft={() => props.setUserSymbol("X")}
          setRight={() => props.setUserSymbol("O")}
          selected={
            props.userSymbol === "X"
              ? "LEFT"
              : props.userSymbol !== null
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
