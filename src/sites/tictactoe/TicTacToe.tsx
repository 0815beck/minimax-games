import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import {
  invertSymbolIfExists,
  START_POSITION,
  type Difficulty,
  type Move,
} from "../../minimax/tictactoe";
import { type Player } from "../../types/Player";
import { type Symbol } from "../../minimax/tictactoe";
import { State, bestMove } from "../../minimax/tictactoe";
import Game from "./game/Game";
import Settings from "./settings/Settings";
import type { Vector2D } from "../../types/Vector2D";

function TicTacToe() {
  const [startPlayer, setStartPlayer] = useState<Player | undefined>(undefined);
  const [userSymbol, setUserSymbol] = useState<Symbol | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    undefined
  );
  const [state, setState] = useState<State | undefined>(undefined);

  const startSymbol =
    startPlayer === "HUMAN" ? userSymbol : invertSymbolIfExists(userSymbol);
  const gameOver: boolean = state ? state.isLeaf() : true;
  const navigate = useNavigate();

  useEffect(() => {
    if (!startPlayer || !userSymbol || !difficulty) {
      navigate("/tictactoe/einstellungen");
      return;
    }
    if (!state) {
      setState(new State(START_POSITION, startSymbol!, startPlayer));
    }
  }, []);

  const onNewGame = () => {
    if (!startPlayer || !userSymbol || !difficulty) {
      navigate("/tictactoe/einstellungen");
      return;
    }
    setState(new State(START_POSITION, startSymbol!, startPlayer));
    navigate("/tictactoe");
  };

  const onFieldClick = (position: Vector2D) => {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!state?.nextPlayer || !state.nextSymbol || gameOver) {
        return;
      }
      const newState = state.copy();
      const move: Move = { position, symbol: state.nextSymbol };
      newState.applyMove(move);
      setState(newState);
    };
  };

  useEffect(() => {
    if (
      !state ||
      state.nextPlayer !== "MACHINE" ||
      gameOver ||
      !state.nextSymbol
    ) {
      return;
    }
    const searchDepth = difficulty === "HARD" ? 9 : 2;
    const machineMove = bestMove(state, searchDepth);
    const newState = state.copy();
    newState.applyMove(machineMove);
    setState(newState);
  }, [state]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Game state={state} gameOver={gameOver} onFieldClick={onFieldClick} />
        }
      />
      <Route
        path="/einstellungen"
        element={
          <Settings
            startPlayer={startPlayer}
            userSymbol={userSymbol}
            difficulty={difficulty}
            setStartPlayer={setStartPlayer}
            setUserSymbol={setUserSymbol}
            setDifficulty={setDifficulty}
            onNewGame={onNewGame}
          />
        }
      />
    </Routes>
  );
}

export default TicTacToe;
