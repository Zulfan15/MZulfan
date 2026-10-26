use wasm_bindgen::prelude::*;

pub type Board = [u8; 14];

#[derive(Clone, Copy)]
pub struct MoveResult {
    pub board: Board,
    pub extra_turn: bool,
    pub game_over: bool,
}

pub fn execute_move(board: &Board, pit: usize, is_player: bool) -> MoveResult {
    let mut b = *board;
    let mut seeds = b[pit];
    b[pit] = 0;

    let mut current = pit;
    let own_store = if is_player { 6 } else { 13 };
    let opp_store = if is_player { 13 } else { 6 };

    while seeds > 0 {
        current = (current + 1) % 14;
        if current == opp_store {
            continue;
        }
        b[current] += 1;
        seeds -= 1;
    }

    let extra_turn = current == own_store;

    let on_own_side = if is_player { current <= 5 } else { (7..=12).contains(&current) };
    if on_own_side && b[current] == 1 {
        let opposite = 12 - current;
        if b[opposite] > 0 {
            b[own_store] += b[opposite] + 1;
            b[current] = 0;
            b[opposite] = 0;
        }
    }

    let player_has_moves = b[0..6].iter().any(|&s| s > 0);
    let bot_has_moves = b[7..13].iter().any(|&s| s > 0);
    let game_over = !player_has_moves || !bot_has_moves;

    if game_over {
        for i in 0..6 {
            b[6] += b[i];
            b[i] = 0;
        }
        for i in 7..13 {
            b[13] += b[i];
            b[i] = 0;
        }
    }

    MoveResult { board: b, extra_turn, game_over }
}

fn evaluate(b: &Board) -> i32 {
    let store_diff = (b[13] as i32) - (b[6] as i32);
    let bot_pits: i32 = b[7..13].iter().map(|&x| x as i32).sum();
    let player_pits: i32 = b[0..6].iter().map(|&x| x as i32).sum();
    store_diff * 10 + (bot_pits - player_pits)
}

fn alpha_beta(b: &Board, depth: u8, mut alpha: i32, mut beta: i32, is_maximizing: bool) -> i32 {
    if depth == 0 {
        return evaluate(b);
    }

    let start = if is_maximizing { 7 } else { 0 };
    let end = if is_maximizing { 12 } else { 5 };
    let mut any_move = false;

    if is_maximizing {
        let mut max_eval = i32::MIN;
        for pit in start..=end {
            if b[pit] == 0 { continue; }
            any_move = true;
            let res = execute_move(b, pit, false);
            let next_depth = if res.extra_turn { depth } else { depth - 1 };
            let eval = alpha_beta(&res.board, next_depth, alpha, beta, res.extra_turn);
            max_eval = max_eval.max(eval);
            alpha = alpha.max(eval);
            if beta <= alpha { break; }
        }
        if !any_move { evaluate(b) } else { max_eval }
    } else {
        let mut min_eval = i32::MAX;
        for pit in start..=end {
            if b[pit] == 0 { continue; }
            any_move = true;
            let res = execute_move(b, pit, true);
            let next_depth = if res.extra_turn { depth } else { depth - 1 };
            let eval = alpha_beta(&res.board, next_depth, alpha, beta, !res.extra_turn);
            min_eval = min_eval.min(eval);
            beta = beta.min(eval);
            if beta <= alpha { break; }
        }
        if !any_move { evaluate(b) } else { min_eval }
    }
}

#[wasm_bindgen]
pub fn find_best_kalah_move(board_slice: &[u8], depth: u8) -> i32 {
    if board_slice.len() < 14 {
        return -1;
    }
    let mut b = [0u8; 14];
    b.copy_from_slice(&board_slice[..14]);

    let mut best_move = -1;
    let mut best_score = i32::MIN;

    for pit in 7..=12 {
        if b[pit] == 0 { continue; }
        let res = execute_move(&b, pit, false);
        let score = alpha_beta(&res.board, depth.saturating_sub(1), i32::MIN, i32::MAX, res.extra_turn);
        if score > best_score {
            best_score = score;
            best_move = pit as i32;
        }
    }

    best_move
}
