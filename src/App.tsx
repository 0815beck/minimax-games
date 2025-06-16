import { Route, Routes } from "react-router-dom";
import TicTacToe from "./sites/tictactoe/TicTacToe";
import GameSelection from "./sites/GameSelection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GameSelection />} />
      <Route path="/tictactoe/*" element={<TicTacToe />} />
    </Routes>
  );
}

export default App;
