interface Node<State> extends Iterable<State> {
  isLeaf: () => boolean;
}

function minimax<State extends Node<State>>(
  state: State,
  evaluation: (state: State) => number,
  maxDepth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = +Infinity
): number {
  console.log("Was geht?");
  if (maxDepth === 0 || state.isLeaf()) {
    console.log("Hello");
    return evaluation(state);
  }

  if (isMaximizing) {
    let bestValue = -Infinity;
    for (let child of state) {
      let value = minimax(
        child,
        evaluation,
        maxDepth - 1,
        !isMaximizing,
        alpha,
        beta
      );
      bestValue = Math.max(bestValue, value);
      alpha = Math.max(alpha, bestValue);
      if (beta <= alpha) {
        break;
      }
    }
    return bestValue;
  } else {
    let worstValue = +Infinity;
    for (let child of state) {
      let value = minimax(
        child,
        evaluation,
        maxDepth - 1,
        !isMaximizing,
        alpha,
        beta
      );
      worstValue = Math.min(worstValue, value);
      beta = Math.min(beta, worstValue);
      if (beta <= alpha) {
        break;
      }
    }
    return worstValue;
  }
}

export type { Node };
export { minimax };
