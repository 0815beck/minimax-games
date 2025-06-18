import React from "react";
import "./CheckersBoard.css";

const BOARD_SIZE = 8;

const CheckersBoard: React.FC = () => {
  const renderSquare = (row: number, col: number) => {
    const isDark = (row + col) % 2 === 1;
    const squareClass = isDark ? "square dark" : "square light";

    // Optional: Place initial pieces (3 rows for each player)
    let piece = null;
    if (isDark && row < 3) {
      piece = <div className="piece cyan" />;
    } else if (isDark && row > 4) {
      piece = <div className="piece magenta" />;
    }

    return (
      <div key={`${row}-${col}`} className={squareClass}>
        {piece}
      </div>
    );
  };

  return (
    <div className="checkers-container">
      {Array.from({ length: BOARD_SIZE }, (_, row) => (
        <div key={row} className="row">
          {Array.from({ length: BOARD_SIZE }, (_, col) =>
            renderSquare(row, col)
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckersBoard;
