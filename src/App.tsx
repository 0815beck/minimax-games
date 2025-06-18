import { Route, Routes } from "react-router-dom";
import TicTacToe from "./sites/tictactoe/TicTacToe";
import Home from "./sites/Home";
import Checkers from "./sites/checkers/Checkers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tictactoe/*" element={<TicTacToe />} />
      <Route path="/checkers/*" element={<Checkers />} />
    </Routes>
  );
}

export default App;
