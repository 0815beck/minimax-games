import { useState, useEffect, type MouseEvent } from "react";
import { type Player } from "../../types/Player";
import {
  invertColorIfDefined,
  State,
  type Color,
  START_POSITION,
  bestMove,
} from "../../minimax/checkers";

import { Route, Routes, useNavigate } from "react-router-dom";
import { equals, type Vector2D } from "../../types/Vector2D";
import Game from "./game/Game";
import type { Difficulty } from "../../minimax/tictactoe";
import Settings from "./settings/Settings";

function Checkers() {
  const [startPlayer, setStartPlayer] = useState<Player | undefined>(undefined);
  const [userColor, setUserColor] = useState<Color | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    undefined
  );
  const [state, setState] = useState<State | undefined>(undefined);

  const [selectedField, setSelectedField] = useState<Vector2D | undefined>(
    undefined
  );

  const startColor =
    startPlayer === "HUMAN" ? userColor : invertColorIfDefined(userColor);
  const gameOver = state ? state.isLeaf() : true;
  const nextMoves = state?.nextMoves();
  const searchDepth = difficulty === "HARD" ? 10 : 5;

  const navigate = useNavigate();

  useEffect(() => {
    if (!startPlayer || !userColor || !difficulty) {
      navigate("/dame/einstellungen");
      return;
    }
    if (!state) {
      const newState = new State(START_POSITION, startColor!, startPlayer, 0);
      const snapshot = JSON.stringify(newState);
      console.log("Setting new state: ", snapshot);
      setState(new State(START_POSITION, startColor!, startPlayer, 0));
    }
  }, []);

  const onNewGame = () => {
    if (!startPlayer || !userColor || !searchDepth) {
      navigate("/dame/einstellungen");
      return;
    }
    const newState = new State(START_POSITION, startColor!, startPlayer, 0);
    const snapshot = JSON.stringify(newState);
    console.log("Setting new state: ", snapshot);
    setState(newState);
    navigate("/dame");
  };

  const onFieldClick =
    (position: Vector2D) => (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!selectedField) {
        setSelectedField(position);
        return;
      }
      const userMove = nextMoves?.find(
        (move) =>
          equals(move.start, selectedField) && equals(move.end, position)
      );
      if (!userMove) {
        setSelectedField(position);
        return;
      }
      if (userMove !== undefined && state !== undefined) {
        const newState = state.copy();
        newState.applyMove(userMove);
        setState(newState);
        setSelectedField(undefined);
        console.log("User move applied");
      }
    };

  useEffect(() => {
    if (!state || state.nextPlayer !== "MACHINE" || gameOver || !searchDepth) {
      return;
    }

    setTimeout(() => {
      const machineMove = bestMove(state, searchDepth);
      if (!machineMove) return;
      const newState = state.copy();
      newState.applyMove(machineMove);
      const snapshot = JSON.stringify(newState);
      console.log("Setting new state: ", snapshot);
      setState(newState);
    }, 0);
  }, [state]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Game
            state={state}
            gameOver={gameOver}
            selectedField={selectedField}
            nextMoves={nextMoves ? nextMoves : []}
            onFieldClick={onFieldClick}
          />
        }
      />
      <Route
        path="/einstellungen"
        element={
          <Settings
            startPlayer={startPlayer}
            userColor={userColor}
            difficulty={difficulty}
            setStartPlayer={setStartPlayer}
            setUserColor={setUserColor}
            setDifficulty={setDifficulty}
            onNewGame={onNewGame}
          />
        }
      />
    </Routes>
  );
}

export default Checkers;
