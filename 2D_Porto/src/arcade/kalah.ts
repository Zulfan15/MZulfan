// Kalah (Mancala) Game Engine & Rules

export type Board = number[]; // 14 slots: 0-5 player pits, 6 player store, 7-12 bot pits, 13 bot store

export interface MoveResult {
  board: Board;
  extraTurn: boolean;
  gameOver: boolean;
  captured: number;
}

export const INITIAL_SEEDS = 4;

export function createInitialBoard(): Board {
  const b = new Array(14).fill(INITIAL_SEEDS);
  b[6] = 0; // player store
  b[13] = 0; // bot store
  return b;
}

export function isValidMove(board: Board, pit: number, isPlayer: boolean): boolean {
  if (isPlayer) {
    return pit >= 0 && pit <= 5 && board[pit] > 0;
  } else {
    return pit >= 7 && pit <= 12 && board[pit] > 0;
  }
}

export function getValidMoves(board: Board, isPlayer: boolean): number[] {
  const moves: number[] = [];
  const start = isPlayer ? 0 : 7;
  const end = isPlayer ? 5 : 12;
  for (let i = start; i <= end; i++) {
    if (board[i] > 0) moves.push(i);
  }
  return moves;
}

export function executeMove(board: Board, pit: number, isPlayer: boolean): MoveResult {
  const b = [...board];
  let seeds = b[pit];
  b[pit] = 0;

  let current = pit;
  const ownStore = isPlayer ? 6 : 13;
  const oppStore = isPlayer ? 13 : 6;
  let captured = 0;

  while (seeds > 0) {
    current = (current + 1) % 14;
    // Skip opponent's store
    if (current === oppStore) continue;

    b[current]++;
    seeds--;
  }

  // Extra turn if last seed landed in own store
  const extraTurn = current === ownStore;

  // Capture rule: last seed landed in an empty pit on player's own side
  const onOwnSide = isPlayer ? current >= 0 && current <= 5 : current >= 7 && current <= 12;
  if (onOwnSide && b[current] === 1) {
    const opposite = 12 - current;
    if (b[opposite] > 0) {
      captured = b[opposite] + 1;
      b[ownStore] += captured;
      b[current] = 0;
      b[opposite] = 0;
    }
  }

  // Check game over (either side empty)
  const playerHasMoves = b.slice(0, 6).some((s) => s > 0);
  const botHasMoves = b.slice(7, 13).some((s) => s > 0);
  const gameOver = !playerHasMoves || !botHasMoves;

  if (gameOver) {
    // Sweep remaining seeds to respective stores
    for (let i = 0; i < 6; i++) {
      b[6] += b[i];
      b[i] = 0;
    }
    for (let i = 7; i < 13; i++) {
      b[13] += b[i];
      b[i] = 0;
    }
  }

  return {
    board: b,
    extraTurn,
    gameOver,
    captured,
  };
}
