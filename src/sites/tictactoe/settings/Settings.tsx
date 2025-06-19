import { type Symbol, type Difficulty } from "../../../minimax/tictactoe";
import styles from "./Settings.module.css";
import BinarySetting from "../../../components/binarySetting/BinarySetting";
import Button from "../../../components/button/Button";
import type { Player } from "../../../types/Player";

function Settings(props: {
  startPlayer: Player | undefined;
  userSymbol: Symbol | undefined;
  difficulty: Difficulty | undefined;
  setStartPlayer: React.Dispatch<React.SetStateAction<Player | undefined>>;
  setUserSymbol: React.Dispatch<React.SetStateAction<Symbol | undefined>>;
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
              : props.startPlayer !== undefined
              ? "RIGHT"
              : undefined
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
              : props.userSymbol !== undefined
              ? "RIGHT"
              : undefined
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
              : props.difficulty !== undefined
              ? "RIGHT"
              : undefined
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
