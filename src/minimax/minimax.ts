interface Node extends Iterable<Node> {
  isLeaf: () => boolean;
  evaluation: () => number;
}

function minimax<State extends Node>(
  state: State,
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = +Infinity
): number {
  if (depth === 0 || state.isLeaf()) {
    return state.evaluation();
  }

  if (isMaximizing) {
    let bestValue = -Infinity;
    for (let child of state) {
      let value = minimax(child, depth - 1, !isMaximizing, alpha, beta);
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
      let value = minimax(child, depth - 1, !isMaximizing, alpha, beta);
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
