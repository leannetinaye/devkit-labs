

'use strict';

const fs = require('fs');

class Validator {
  constructor(kind, parseFn) {
    this.kind = kind;
    this._parse = parseFn;
    this._required = false;
    this._default = undefined;
    this._min = undefined;
    this._max = undefined;
    this._pattern = undefined;
    this._enum = undefined;
  }
  required(){ this._required = true; return this; }
  default(v){ this._default = v; return this; }
  min(v){ this._min = v; return this; }
  max(v){ this._max = v; return this; }
  pattern(re, msg){ this._pattern = { re, msg }; return this; }
  enum(values){ this._enum = Array.isArray(values) ? values.slice() : undefined; return this; }

  parse(raw, key) {
    if (raw == null || raw === '') {
      if (this._required && this._default === undefined) {
        throw new Error(`ENV ${key}: required but missing`);
      }
      return this._default;
    }
    let val = this._parse(raw, key);

    if (this._enum && !this._enum.includes(val)) {
      throw new Error(`ENV ${key}: must be one of ${JSON.stringify(this._enum)}, got ${JSON.stringify(val)}`);
    }
    if (typeof val === 'number') {
      if (this._min != null && val < this._min) throw new Error(`ENV ${key}: must be >= ${this._min}`);
      if (this._max != null && val > this._max) throw new Error(`ENV ${key}: must be <= ${this._max}`);
    }
    if (this._pattern && !this._pattern.re.test(String(val))) {
      throw new Error(`ENV ${key}: ${this._pattern.msg || 'invalid format'}`);
    }
    return val;
  }
}

const schema = {
  string(){ return new Validator('string', (raw)=>String(raw)); },
  int(){ return new Validator('int', (raw, key)=>{
    if(!/^-?\d+$/.test(String(raw))) throw new Error(`ENV ${key}: expected integer, got ${JSON.stringify(raw)}`);
    const n = Number(raw);
    if(!Number.isInteger(n)) throw new Error(`ENV ${key}: not an integer`);
    return n;
  }); },
  number(){ return new Validator('number', (raw, key)=>{
    const n = Number(raw);
    if(!Number.isFinite(n)) throw new Error(`ENV ${key}: expected number, got ${JSON.stringify(raw)}`);
    return n;
  }); },
  bool(){ return new Validator('bool', (raw, key)=>{
    const s = String(raw).toLowerCase().trim();
    if(['1','true','yes','y','on'].includes(s)) return true;
    if(['0','false','no','n','off'].includes(s)) return false;
    throw new Error(`ENV ${key}: expected boolean (true/false), got ${JSON.stringify(raw)}`);
  }); },
  url(){ return new Validator('url', (raw, key)=>{
    try { const u = new URL(String(raw)); return u.toString(); }
    catch { throw new Error(`ENV ${key}: invalid URL`); }
  }); },
  enum(values){ const v = new Validator('enum', (raw)=>String(raw)); v.enum(values); return v; },
  json(){ return new Validator('json', (raw, key)=>{
    try { return JSON.parse(String(raw)); }
    catch { throw new Error(`ENV ${key}: invalid JSON`); }
  }); },
};

/**
 * Validate and coerce process.env (or a provided object) to a typed config.
 * Throws on error with helpful messages.
 * @param {Record<string, Validator>} shape
 * @param {Record<string, string>} [env]
 * @returns {Record<string, any>}
 */
function sanitize(shape, env = process.env){
  const out = {};
  for (const [key, validator] of Object.entries(shape)){
    out[key] = validator.parse(env[key], key);
  }
  return out;
}

/**
 * Super-minimal .env loader (no dependencies).
 * Supports KEY=VALUE, trims whitespace, ignores comments (#).
 * Quotes are optional and not unescaped beyond stripping.
 * @param {string} filePath
 */
function loadDotEnv(filePath = '.env'){
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

module.exports = { schema, sanitize, loadDotEnv };
