import { useState, useEffect, type MouseEvent, useRef } from "react";
import { type Player } from "../../types/Player";
import {
  invertColorIfDefined,
  State,
  type Color,
  START_POSITION,
  type Move,
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

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../../workers/minimaxWorker", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!startPlayer || !userColor || !difficulty) {
      navigate("/dame/einstellungen");
      return;
    }
    if (!state) {
      const newState = new State(START_POSITION, startColor!, startPlayer, 0);
      setState(newState);
    }
  }, []);

  const onNewGame = () => {
    if (!startPlayer || !userColor || !searchDepth) {
      navigate("/dame/einstellungen");
      return;
    }
    const newState = new State(START_POSITION, startColor!, startPlayer, 0);
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
      }
    };

  useEffect(() => {
    if (!state || !searchDepth) return;
    if (state.nextPlayer !== "MACHINE" || gameOver) return;
    const worker = workerRef.current;
    if (!worker) return;

    const handleMachineMove = (event: MessageEvent<Move>) => {
      if (state?.nextPlayer !== "MACHINE") {
        return;
      }
      const move = event.data;
      const newState = state.copy();
      newState.applyMove(move);
      setState(newState);
    };

    worker.addEventListener("message", handleMachineMove);

    worker.postMessage({
      pieces: state.board.pieces,
      nextColor: state.nextColor,
      nextPlayer: state.nextPlayer,
      lastCapture: state.lastCapture,
      mustMoveNext: state.mustMoveNext,
      searchDepth,
    });

    return () => {
      worker.removeEventListener("message", handleMachineMove);
    };
  }, [state]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Game
            userColor={userColor}
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
