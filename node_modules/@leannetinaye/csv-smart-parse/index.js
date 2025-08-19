'use strict';

const fs = require('fs');

function detectDelimiter(sample) {
  const candidates = [',', ';', '\t', '|'];
  let best = ',', bestScore = -1;
  for (const d of candidates) {
    const lines = sample.split(/\r?\n/, 5);
    const counts = lines.map(l => (l.match(new RegExp(escapeRegExp(d), 'g')) || []).length);
    const score = counts.reduce((a, b) => a + b, 0) - Math.abs(stdev(counts));
    if (score > bestScore) { best = d; bestScore = score; }
  }
  return best;
}

function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function stdev(nums){ if(!nums.length) return 0; const m=nums.reduce((a,b)=>a+b,0)/nums.length; return Math.sqrt(nums.reduce((a,b)=>a+(b-m)**2,0)/nums.length); }

/**
 * Parse a CSV string into rows (arrays or objects).
 * @param {string} text
 * @param {{ delimiter?: string, header?: boolean | string[], inferTypes?: boolean, emptyAsNull?: boolean }} [opts]
 * @returns {any[]}
 */
function parseString(text, opts = {}) {
  const delimiter = opts.delimiter || detectDelimiter(text.slice(0, 10000));
  const header = opts.header || false;
  const infer = opts.inferTypes !== false;
  const emptyAsNull = !!opts.emptyAsNull;

  const rows = [];
  let row = [];
  let field = '';
  let i = 0;
  const len = text.length;
  let inQuotes = false;
  let prevChar = '';

  while (i < len) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; prevChar = '"'; continue; }
      if (c === '"') { inQuotes = false; i++; prevChar = '"'; continue; }
      field += c; i++; prevChar = c; continue;
    }

    if (c === '"') { inQuotes = true; i++; prevChar = '"'; continue; }

    if (c === delimiter) { row.push(processField(field, infer, emptyAsNull)); field = ''; i++; prevChar = c; continue; }

    if (c === '\n') {
      if (prevChar !== '\r') { row.push(processField(field, infer, emptyAsNull)); rows.push(row); row=[]; field=''; }
      i++; prevChar = c; continue;
    }

    if (c === '\r') {
      if (text[i+1] === '\n') { row.push(processField(field, infer, emptyAsNull)); rows.push(row); row=[]; field=''; i+=2; prevChar='\n'; continue; }
      else { row.push(processField(field, infer, emptyAsNull)); rows.push(row); row=[]; field=''; i++; prevChar=c; continue; }
    }

    field += c; i++; prevChar=c;
  }

  row.push(processField(field, infer, emptyAsNull)); rows.push(row);

  if (header === true) { const [head, ...rest] = rows; return rest.map(r => rowToObject(head, r)); }
  else if (Array.isArray(header)) { return rows.map(r => rowToObject(header, r)); }
  else { return rows; }
}

function rowToObject(header, row){ const obj = {}; for (let i=0;i<header.length;i++){ const key = header[i]!=null? String(header[i]):`col${i}`; obj[key]=row[i]; } return obj; }

function processField(field, infer, emptyAsNull) {
  if (!infer) return field;
  const t = field.trim();
  if (t === '' && emptyAsNull) return null;
  if (/^(true|false)$/i.test(t)) return /^true$/i.test(t);
  if (/^null$/i.test(t)) return null;
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(t)) { const n = Number(t); if (Number.isFinite(n)) return n; }
  return field;
}

/** Parse a CSV file (sync read). */
function parseFile(filePath, opts = {}) { const text = fs.readFileSync(filePath, 'utf8'); return parseString(text, opts); }

/**
 * Async iterate rows from a CSV file with minimal memory usage.
 * Yields arrays or objects depending on header option.
 * @param {string} filePath
 * @param {{ delimiter?: string, header?: boolean | string[], inferTypes?: boolean, emptyAsNull?: boolean }} [opts]
 */
async function* iterFile(filePath, opts = {}) {
  const delimiter = opts.delimiter;
  const infer = opts.inferTypes !== false;
  const emptyAsNull = !!opts.emptyAsNull;
  let header = opts.header || false;

  const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 64 * 1024 });
  let buffer = '';
  let row = [];
  let field = '';
  let inQuotes = false;

  let effectiveDelimiter = delimiter || null;
  let headerRow = null;
  let firstChunk = true;

  for await (const chunk of stream) {
    buffer += chunk;

    if (!effectiveDelimiter && firstChunk) {
      effectiveDelimiter = detectDelimiter(buffer.slice(0, 10000));
      firstChunk = false;
    }

    let i = 0;
    while (i < buffer.length) {
      const c = buffer[i];
      if (inQuotes) {
        if (c === '"' && buffer[i + 1] === '"') { field += '"'; i += 2; continue; }
        if (c === '"') { inQuotes = false; i++; continue; }
        field += c; i++; continue;
      }

      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === effectiveDelimiter) { row.push(processField(field, infer, emptyAsNull)); field=''; i++; continue; }

      if (c === '\n' || c === '\r') {
        if (c === '\r' && buffer[i+1] === '\n') { i+=2; } else { i+=1; }
        row.push(processField(field, infer, emptyAsNull));
        if (header === true && !headerRow) { headerRow = row; }
        else if (Array.isArray(header)) { yield rowToObject(header, row); }
        else if (headerRow) { yield rowToObject(headerRow, row); }
        else { yield row; }
        row = []; field = ''; continue;
      }

      field += c; i++;
    }

    // carry over state across chunks (buffer emptied at end of loop)
    buffer = '';
  }

  // flush trailing row
  row.push(processField(field, infer, emptyAsNull));
  if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
    if (header === true && !headerRow) headerRow = row;
    else if (Array.isArray(header)) yield rowToObject(header, row);
    else if (headerRow) yield rowToObject(headerRow, row);
    else yield row;
  }
}

module.exports = { parseString, parseFile, iterFile };
