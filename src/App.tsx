import { useState, useEffect } from "react";
import "./index.css";
import type { Symbol, Player, Position } from "./types";
import { invertPlayer, invertSymbol } from "./types";
import type { MouseEvent } from "react";
import { bestMove, findWinner } from "./minimax";
import Board from "./components/Board";

function App() {
  const [nextPlayer, setNextPlayer] = useState<Player | null>("HUMAN");
  const [nextSymbol, setNextSymbol] = useState<Symbol | null>("X");
  const [winner, setWinner] = useState<Symbol | "DRAW" | null>(null);
  const [board, setBoard] = useState<(Symbol | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const onFieldClick = (position: Position) => {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!nextPlayer || !nextSymbol || winner) {
        return;
      }
      const newBoard = board.map((row) => [...row]);
      newBoard[position.row][position.column] = nextSymbol;
      setNextPlayer(invertPlayer(nextPlayer!));
      setNextSymbol(invertSymbol(nextSymbol!));
      setBoard(newBoard);
      setWinner(findWinner(newBoard));
    };
  };

  useEffect(() => {
    if (nextPlayer !== "MACHINE" || winner || !nextSymbol) {
      return;
    }
    const machineMove = bestMove(board, nextSymbol);
    const newBoard = board.map((row) => [...row]);
    newBoard[machineMove.row][machineMove.column] = nextSymbol;
    setNextPlayer(invertPlayer(nextPlayer!));
    setNextSymbol(invertSymbol(nextSymbol!));
    setWinner(findWinner(newBoard));
    setBoard(newBoard);
  }, [board]);

  return (
    <div
      className={
        "w-screen h-screen flex justify-center items-center bg-slate-800"
      }
    >
      <Board
        nextPlayer={nextPlayer}
        winner={winner}
        board={board}
        onFieldClick={onFieldClick}
      />
    </div>
  );
}

export default App;
