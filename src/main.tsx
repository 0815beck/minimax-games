import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TicTacToe from "./TicTacToe.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TicTacToe />
    </BrowserRouter>
  </StrictMode>
);
