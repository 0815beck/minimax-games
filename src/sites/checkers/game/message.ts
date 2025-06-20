import type { State } from "../../../minimax/checkers";

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
    const winningPlayer = state.getWinningPlayer();
    if (winningPlayer === "DRAW") {
      return "Unentschieden! Wir haben 50 Züge ohne einen Schlag gespielt. Hast du Lust auf noch eine Runde?";
    } else if (winningPlayer === "HUMAN") {
      return "Du hast gewonnen! Nicht schlecht. Hast du Lust auf noch eine Runde?";
    } else if (winningPlayer === "MACHINE") {
      return (
        "Da habe wohl ich gewonnen, wie üblich. " +
        "Mach dir nichts draus! Traust du dich noch eine Runde zu spielen?"
      );
    }
  }
  return "Wir haben Spaß!";
}

export { message };
