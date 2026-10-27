// Mancala WASM Engine Web Worker
let wasmExportsPromise = (async () => {
  try {
    const res = await fetch('/wasm/mancala.wasm');
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        const streamRes = await WebAssembly.instantiateStreaming(res.clone(), {});
        return streamRes.instance.exports;
      } catch (e) {
        // Fallback to arrayBuffer if streaming failed
      }
    }
    const buffer = await res.arrayBuffer();
    const compiled = await WebAssembly.instantiate(buffer, {});
    return compiled.instance.exports;
  } catch (err) {
    console.error('Failed to load /wasm/mancala.wasm:', err);
    throw err;
  }
})();

function getStateView(exports) {
  return new Int32Array(exports.memory.buffer, exports.state_ptr(), 14);
}

self.onmessage = async (e) => {
  const req = e.data;
  try {
    const exports = await wasmExportsPromise;
    let resp;
    if (req.op === 'board') {
      exports.load_board(req.index);
      resp = {
        id: req.id,
        op: 'board',
        state: [...getStateView(exports)],
        count: exports.board_count(),
      };
    } else if (req.op === 'apply') {
      getStateView(exports).set(req.state);
      const next = exports.apply_move(req.player, req.move);
      if (next < 0) throw new Error('Illegal move');
      resp = {
        id: req.id,
        op: 'apply',
        state: [...getStateView(exports)],
        next: next,
        over: exports.game_over() === 1,
      };
    } else {
      getStateView(exports).set(req.state);
      const start = performance.now();
      const move = exports.choose(req.player, req.timeMs);
      resp = {
        id: req.id,
        op: 'choose',
        move: move,
        depth: exports.last_depth(),
        nodes: exports.last_nodes(),
        ms: performance.now() - start,
        value: exports.last_value(),
      };
    }
    self.postMessage(resp);
  } catch (err) {
    self.postMessage({
      id: req.id,
      op: 'error',
      message: err instanceof Error ? err.message : String(err),
    });
  }
};
