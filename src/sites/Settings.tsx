import type { Symbol, Difficulty, Player } from "../types";
import type { MouseEvent } from "react";

function Settings(props: {
  startPlayer: Player | null;
  startSymbol: Symbol | null;
  difficulty: Difficulty | null;
  setStartPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setStartSymbol: React.Dispatch<React.SetStateAction<Symbol | null>>;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty | null>>;
  onNewGame: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const neonButton = "px-4 py-2 text-white font-bold transition duration-200";

  return (
    <div className="flex flex-col h-full items-center justify-center gap-6 min-h-screen bg-slate-800 text-white">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        <div className="w-full shadow-[0px_0px_4px_rgba(255,255,255,0.7)] p-4">
          <label className="block text-xl mb-4 text-center">
            Wer soll das Spiel beginnen?
          </label>
          <div className="flex gap-4 justify-center">
            {(["HUMAN", "MACHINE"] as Player[]).map((player) => (
              <button
                key={player}
                className={`${neonButton} ${
                  props.startPlayer === player
                    ? "bg-pink-500 shadow-[0_0_10px_#ff00ff]"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => props.setStartPlayer(player)}
              >
                {player === "HUMAN" ? "Du" : "Computer"}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full shadow-[0px_0px_4px_rgba(255,255,255,0.7)] p-4">
          <label className="block text-xl mb-4 text-center">
            Welches Symbol möchtest du?
          </label>
          <div className="flex gap-4 justify-center">
            {(["X", "O"] as Symbol[]).map((sym) => (
              <button
                key={sym}
                className={`${neonButton} text-xl ${
                  props.startSymbol === sym
                    ? "bg-cyan-500 shadow-[0_0_10px_#00ffff]"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => props.setStartSymbol(sym)}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full shadow-[0px_0px_4px_rgba(255,255,255,0.7)] p-4">
          <label className="block text-xl mb-4 text-center">
            Schwierigkeitsgrad
          </label>
          <div className="flex gap-4 justify-center">
            {(["EASY", "HARD"] as Difficulty[]).map((level) => (
              <button
                key={level}
                className={`${neonButton} ${
                  props.difficulty === level
                    ? "bg-indigo-500 shadow-[0_0_10px_#8b5cf6]"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => props.setDifficulty(level)}
              >
                {level === "EASY" ? "Einfach" : "Schwer"}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-6 align-end">
          <button
            className="px-6 py-3 me-2 bg-green-500 shadow-[0_0_15px_#00ff88] text-white text-xl font-bold hover:bg-green-400 transition duration-300"
            onClick={props.onNewGame}
          >
            Spiel starten
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
