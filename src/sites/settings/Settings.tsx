import {
  type Symbol,
  type Difficulty,
  type Player,
  invertPlayer,
} from "../../types";
import type { MouseEvent } from "react";
import styles from "./settings.module.css";

function Settings(props: {
  startPlayer: Player | null;
  userSymbol: Symbol | null;
  difficulty: Difficulty | null;
  setStartPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setUserSymbol: React.Dispatch<React.SetStateAction<Symbol | null>>;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty | null>>;
  onNewGame: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div id={styles.outerBox}>
      <div id={styles.settings}>
        <div className={styles.setting}>
          <label className={styles.settingLabel}>
            Wer soll das Spiel beginnen?
          </label>
          <div className={styles.btnGroup}>
            {(["HUMAN", "MACHINE"] as Player[]).map((player) => (
              <button
                className={`${styles.settingBtn} ${
                  player === props.startPlayer
                    ? styles.selected
                    : props.startPlayer
                    ? styles.notSelected
                    : ""
                }`}
                key={player}
                onClick={() => props.setStartPlayer(player)}
              >
                {player === "HUMAN" ? "Du" : "Computer"}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.setting}>
          <label className={styles.settingLabel}>
            Welches Symbol möchtest du?
          </label>
          <div className={styles.btnGroup}>
            {(["X", "O"] as Symbol[]).map((sym) => (
              <button
                className={`${styles.settingBtn} ${
                  sym === props.userSymbol
                    ? styles.selected
                    : props.userSymbol
                    ? styles.notSelected
                    : ""
                }`}
                key={sym}
                onClick={() => props.setUserSymbol(sym)}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.setting}>
          <label className={styles.settingLabel}>Schwierigkeitsgrad</label>
          <div className={styles.btnGroup}>
            {(["EASY", "HARD"] as Difficulty[]).map((level) => (
              <button
                className={`${styles.settingBtn} ${
                  level === props.difficulty
                    ? styles.selected
                    : props.difficulty
                    ? styles.notSelected
                    : ""
                }`}
                key={level}
                onClick={() => props.setDifficulty(level)}
              >
                {level === "EASY" ? "Einfach" : "Schwer"}
              </button>
            ))}
          </div>
        </div>

        <button className={styles.submitBtn} onClick={props.onNewGame}>
          Spiel starten
        </button>
      </div>
    </div>
  );
}

export default Settings;
