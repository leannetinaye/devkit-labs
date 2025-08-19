# @leannetinaye/env-sanitizer

Schema-based environment variable validation and sanitization.

- Define schema for env vars.  
- Validate + apply defaults.  
- Prevent crashes from missing/invalid config.

## Installation

```bash
npm i @leannetinaye/env-sanitizer
```

```js
const { schema, sanitize, loadDotEnv } = require('@leannetinaye/env-sanitizer';)

// Load .env (optional)
loadDotEnv();

const config = sanitize({
  PORT: schema.int().default(3000),
  DEBUG: schema.bool().default(false),
  API_URL: schema.string().required(),
  FEATURE_FLAG: schema.enum(['on', 'off']).default('off')
}, process.env);

console.log(config);
// e.g. { PORT: 8080, DEBUG: true, API_URL: "https://api.example.com", FEATURE_FLAG: "on" }
```

```js
// Example schema shapes:
schema.string()
schema.int()
schema.bool()
schema.enum(values[])

// Modifiers:
.default(value)
.required()
.min(n) / .max(n)
.pattern(re, msg)
.url()
```

License

MIT License

Copyright (c) 2025 Leanne Tinaye

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
