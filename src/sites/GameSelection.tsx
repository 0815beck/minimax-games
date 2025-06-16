import { Link } from "react-router-dom";

function GameSelection() {
  return (
    <div>
      <h1>Was möchtest du spielen?</h1>
      <Link to="/tictactoe">Tic Tac Toe</Link>
    </div>
  );
}

export default GameSelection;
