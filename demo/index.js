'use strict';

const path = require('path');
const sj = require('@leannetinaye/safe-json');
const csv = require('@leannetinaye/csv-smart-parse');
const { schema, sanitize, loadDotEnv } = require('@leannetinaye/env-sanitizer');

(async function main() {
  console.log('=== @devkit/env-sanitizer demo ===');
  loadDotEnv(path.join(__dirname, '.env'));
  try {
    const cfg = sanitize({
      PORT: schema.int().min(1).max(65535).default(3000),
      DEBUG: schema.bool().default(false),
      API_URL: schema.url().required(),
      FEATURE_FLAG: schema.enum(['on', 'off']).default('off')
    });
    console.log('Config:', cfg);
  } catch (err) {
    console.error('Config error:', err.message);
    console.log('Tip: set API_URL in demo/.env to pass validation.');
  }

  console.log('\n=== @devkit/safe-json demo ===');
  const bad = '{invalid json';
  const good = '{"hello":"world"}';

  const res1 = sj.parse(bad);
  console.log('parse(bad) ok?', res1.ok, res1.ok ? res1.value : res1.error.message);

  const val = sj.safeParse(bad, { fallback: true });
  console.log('safeParse(bad, {fallback:true}) =>', val);

  const res2 = sj.parse(good);
  console.log('parse(good) ok?', res2.ok, res2.value);

  const obj = { a: 1 }; obj.self = obj;
  console.log('safeStringify(circular):', sj.safeStringify(obj));

   console.log('\n=== @devkit/csv-smart-parse demo ===');
  const file = path.join(__dirname, 'data', 'sample.csv');

  // Helper: turn '' into null
  const normalize = (row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v === '' ? null : v]));

  // Helper: skip blank rows (all fields empty/null/undefined)
  const notBlank = (row) => Object.values(row).some(v => v !== '' && v != null);

  // Parse whole file
  const allRaw = csv.parseFile(file, { header: true });
  const all = allRaw.map(normalize).filter(notBlank);
  console.log('parseFile header:true =>', all);

  // Stream the file
  console.log('iterFile header:true =>');
  for await (const rowRaw of csv.iterFile(file, { header: true })) {
    const row = normalize(rowRaw);
    if (notBlank(row)) console.log(row);
  }

  console.log('\nDone.');
})().catch(err => { console.error(err); process.exit(1); });
