import type { State } from "../../../minimax/tictactoe";

function message(state: State | undefined, gameOver: boolean): string {
  if (!state) {
    return "Du solltest auf die Einstellungsseite umgeleitet werden";
  }
  if (!gameOver) {
    if (state.nextPlayer === "MACHINE") {
      return "Ich bin am denken.";
    }
    if (state.nextPlayer === "HUMAN") {
      return "Du bist dran!";
    }
  } else {
    if (state.board.getWinningSymbol() === "DRAW") {
      return "Unentschieden! Lust auf noch eine Runde?";
    } else if (state.nextPlayer === "MACHINE") {
      return "Du hast gewonnen! Nicht schlecht. Hast du Lust auf noch eine Runde?";
    } else if (state.nextPlayer === "HUMAN") {
      return (
        "Da habe wohl ich gewonnen, wie üblich. " +
        "Mach dir nichts draus! Traust du dich noch eine Runde zu spielen?"
      );
    }
  }
  return "Wir haben Spaß!";
}

export { message };
