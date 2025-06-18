import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Was möchtest du spielen?</h1>
      <Link to="/tictactoe">Tic Tac Toe</Link>
      <Link to="/checkers">Dame</Link>
    </div>
  );
}

export default Home;
