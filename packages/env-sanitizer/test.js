const { schema, sanitize } = require('./index');
const cfg = sanitize({
  PORT: schema.int().default(3000),
  URL: schema.url().default('https://x.com')
}, { PORT: '8080', URL: 'https://example.com' });
console.assert(cfg.PORT === 8080 && cfg.URL.startsWith('https://'));
console.log('env-sanitizer ok');
