import { executeMove, getValidMoves, type Board } from './kalah';

function evaluate(board: Board): number {
  const storeDiff = board[13] - board[6];
  const botPits = board.slice(7, 13).reduce((a, b) => a + b, 0);
  const playerPits = board.slice(0, 6).reduce((a, b) => a + b, 0);
  return storeDiff * 10 + (botPits - playerPits);
}

function alphaBeta(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  const validMoves = getValidMoves(board, !isMaximizing);
  if (depth === 0 || validMoves.length === 0) {
    return evaluate(board);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const res = executeMove(board, move, false);
      const nextDepth = res.extraTurn ? depth : depth - 1;
      const nextEval = alphaBeta(res.board, nextDepth, alpha, beta, res.extraTurn);
      maxEval = Math.max(maxEval, nextEval);
      alpha = Math.max(alpha, nextEval);
      if (beta <= alpha) break; // Pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const res = executeMove(board, move, true);
      const nextDepth = res.extraTurn ? depth : depth - 1;
      const nextEval = alphaBeta(res.board, nextDepth, alpha, beta, !res.extraTurn);
      minEval = Math.min(minEval, nextEval);
      beta = Math.min(beta, nextEval);
      if (beta <= alpha) break; // Pruning
    }
    return minEval;
  }
}

export function findBestMove(board: Board, depth = 6): number {
  const moves = getValidMoves(board, false);
  if (moves.length === 0) return -1;
  if (moves.length === 1) return moves[0];

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const res = executeMove(board, move, false);
    const score = alphaBeta(res.board, depth - 1, -Infinity, Infinity, res.extraTurn);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

self.onmessage = (e: MessageEvent<{ board: Board; depth?: number }>) => {
  const { board, depth = 6 } = e.data;
  const bestMove = findBestMove(board, depth);
  self.postMessage({ bestMove });
};
