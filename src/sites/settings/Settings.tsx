import type { Symbol, Difficulty, Player } from "../../types";
import type { MouseEvent } from "react";
import styles from "./settings.module.css";

function Settings(props: {
  startPlayer: Player | null;
  startSymbol: Symbol | null;
  difficulty: Difficulty | null;
  setStartPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setStartSymbol: React.Dispatch<React.SetStateAction<Symbol | null>>;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty | null>>;
  onNewGame: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div id={styles.outerBox}>
      <p id={styles.settings}>
        <p className={styles.setting}>
          <label className={styles.settingLabel}>
            Wer soll das Spiel beginnen?
          </label>
          <div className={styles.btnGroup}>
            {(["HUMAN", "MACHINE"] as Player[]).map((player) => (
              <button
                className={styles.settingBtn}
                key={player}
                onClick={() => props.setStartPlayer(player)}
              >
                {player === "HUMAN" ? "Du" : "Computer"}
              </button>
            ))}
          </div>
        </p>
        <p className={styles.setting}>
          <label className={styles.settingLabel}>
            Welches Symbol möchtest du?
          </label>
          <div className={styles.btnGroup}>
            {(["X", "O"] as Symbol[]).map((sym) => (
              <button
                className={`${styles.settingBtn} ${styles.btnPink}`}
                key={sym}
                onClick={() => props.setStartSymbol(sym)}
              >
                {sym}
              </button>
            ))}
          </div>
        </p>
        <p className={styles.setting}>
          <label className={styles.settingLabel}>Schwierigkeitsgrad</label>
          <div className={styles.btnGroup}>
            {(["EASY", "HARD"] as Difficulty[]).map((level) => (
              <button
                className={styles.settingBtn}
                key={level}
                onClick={() => props.setDifficulty(level)}
              >
                {level === "EASY" ? "Einfach" : "Schwer"}
              </button>
            ))}
          </div>
        </p>

        <button className={styles.submitBtn} onClick={props.onNewGame}>
          Spiel starten
        </button>
      </p>
    </div>
  );
}

export default Settings;
