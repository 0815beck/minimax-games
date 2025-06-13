import { useState, useEffect } from "react";
import "./index.css";
import type { Difficulty, Symbol, Player, Position } from "./types";
import { invertPlayer, invertSymbol } from "./types";
import type { MouseEvent } from "react";
import { bestMove, getWinningSymbol } from "./minimax";
import Game from "./sites/game/Game";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Settings from "./sites/settings/Settings";

function App() {
  const [startPlayer, setStartPlayer] = useState<Player | null>(null);
  const [userSymbol, setUserSymbol] = useState<Symbol | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const [nextPlayer, setNextPlayer] = useState<Player | null>("HUMAN");
  const [nextSymbol, setNextSymbol] = useState<Symbol | null>("X");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [board, setBoard] = useState<(Symbol | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  let navigate = useNavigate();
  useEffect(() => {
    if (!startPlayer || !userSymbol || !difficulty) {
      navigate("/einstellungen");
      return;
    }
    if (!nextPlayer) {
      setNextPlayer(startPlayer);
    }
    if (!nextSymbol) {
      setNextSymbol(
        startPlayer === "HUMAN" ? userSymbol : invertSymbol(userSymbol!)
      );
    }
  }, []);

  const onNewGame = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!startPlayer || !userSymbol || !difficulty) {
      navigate("/einstellungen");
      return;
    }
    const newBoard = board.map((_) => [null, null, null]);
    setBoard(newBoard);
    setNextPlayer(startPlayer);
    setNextSymbol(
      startPlayer === "HUMAN" ? userSymbol : invertSymbol(userSymbol!)
    );
    setGameOver(false);
    navigate("/");
  };

  const onFieldClick = (position: Position) => {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!nextPlayer || !nextSymbol || gameOver) {
        return;
      }
      const newBoard = board.map((row) => [...row]);
      newBoard[position.row][position.column] = nextSymbol;
      setNextPlayer(invertPlayer(nextPlayer!));
      setNextSymbol(invertSymbol(nextSymbol!));
      setBoard(newBoard);
      setGameOver(getWinningSymbol(newBoard) !== null);
    };
  };

  useEffect(() => {
    if (nextPlayer !== "MACHINE" || gameOver || !nextSymbol) {
      return;
    }
    const machineMove = bestMove(board, nextSymbol);
    const newBoard = board.map((row) => [...row]);
    newBoard[machineMove.row][machineMove.column] = nextSymbol;
    setNextPlayer(invertPlayer(nextPlayer!));
    setNextSymbol(invertSymbol(nextSymbol!));
    setGameOver(getWinningSymbol(newBoard) !== null);
    setBoard(newBoard);
  }, [board]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Game
            nextPlayer={nextPlayer}
            gameOver={gameOver}
            board={board}
            onFieldClick={onFieldClick}
          />
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

export default App;
