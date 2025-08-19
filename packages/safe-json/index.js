


/**
 * Fault-tolerant JSON.parse with helpful error details.
 * @param {string} str
 * @param {{ reviver?: Function, onError?: (err: Error) => void }} [opts]
 * @returns {{ ok: true, value: any } | { ok: false, error: Error }}
 */
function parse(str, opts = {}) {
  try {
    const value = JSON.parse(str, opts.reviver);
    return { ok: true, value };
  } catch (err) {
    if (opts.onError) {
      try { opts.onError(err); } catch (_) {}
    }
    return { ok: false, error: err };
  }
}

/**
 * Safe parse returning a fallback instead of throwing.
 * @param {string} str
 * @param {any} fallback
 * @param {{ reviver?: Function, onError?: (err: Error) => void }} [opts]
 * @returns {any}
 */
function safeParse(str, fallback = null, opts = {}) {
  const res = parse(str, opts);
  return res.ok ? res.value : fallback;
}

/**
 * Safe JSON.stringify with circular detection and maxDepth limit.
 * Also serializes Error and BigInt values safely.
 * @param {any} value
 * @param {{ space?: number, maxDepth?: number }} [opts]
 * @returns {string}
 */
function safeStringify(value, opts = {}) {
  const space = typeof opts.space === 'number' ? opts.space : 0;
  const maxDepth = typeof opts.maxDepth === 'number' ? opts.maxDepth : 100;
  const seen = new WeakSet();

  function decycle(val, depth) {
    if (depth > maxDepth) return '[MaxDepth]';
    if (val === null) return null;
    const t = typeof val;

    if (t === 'bigint') return String(val) + 'n';
    if (val instanceof Error) {
      return { name: val.name, message: val.message, stack: String(val.stack || '') };
    }
    if (t !== 'object') return val;

    if (seen.has(val)) return '[Circular ~]';
    seen.add(val);

    if (Array.isArray(val)) {
      return val.map((v) => decycle(v, depth + 1));
    }

    const out = {};
    for (const k of Object.keys(val)) {
      try {
        out[k] = decycle(val[k], depth + 1);
      } catch (e) {
        out[k] = `[Unserializable: ${e && e.message ? e.message : 'error'}]`;
      }
    }
    return out;
  }

  try {
    return JSON.stringify(decycle(value, 0), null, space);
  } catch {
    try { return String(value); } catch { return '[Unstringifiable]'; }
  }
}

module.exports = { parse, safeParse, safeStringify };
