import { useState, useEffect } from "react";
import type { Difficulty } from "../../minimax/tictactoe";
import type { Symbol, Player, Position } from "../../minimax/tictactoe";
import { invertPlayer, invertSymbol } from "../../minimax/tictactoe";
import type { MouseEvent } from "react";
import { bestMove, getWinningSymbol } from "../../minimax/tictactoe";
import Game from "./game/Game";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Settings from "./settings/Settings";

function TicTacToe() {
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
      navigate("/tictactoe/einstellungen");
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

  const onNewGame = () => {
    if (!startPlayer || !userSymbol || !difficulty) {
      navigate("/tictactoe/einstellungen");
      return;
    }
    const newBoard = board.map((_) => [null, null, null]);
    setBoard(newBoard);
    setNextPlayer(startPlayer);
    setNextSymbol(
      startPlayer === "HUMAN" ? userSymbol : invertSymbol(userSymbol!)
    );
    setGameOver(false);
    navigate("/tictactoe");
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

export default TicTacToe;
