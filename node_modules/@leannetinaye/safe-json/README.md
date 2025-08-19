# @leannetinaye/safe-json

Crash-proof JSON parsing and safe stringify.

- `parse` — wrapper around `JSON.parse` that includes an `.ok` flag.
- `safeParse` — safely parse JSON with fallback values.
- `safeStringify` — stringify objects, handling circular references gracefully.

## Installation

```bash
npm i @leannetinaye/safe-json
```

```js
const { parse, safeParse, safeStringify } = require('@leannetinaye/safe-json');

// Regular parse
const good = parse('{"a":1}');
console.log(good.ok, good.value); 
// true { a: 1 }

// Parse invalid JSON
const bad = parse('{oops}');
console.log(bad.ok, bad.error && bad.error.message); 
// false "Unexpected token o ..."

// Safe parse with fallback
const safe = safeParse('{oops}', { fallback: true });
console.log(safe); 
// { fallback: true }

// Safe stringify with circular refs
const obj = { a: 1 };
obj.self = obj;
console.log(safeStringify(obj));
// {"a":1,"self":"[Circular ~]"}
```

```js
{ ok: boolean, value?: any, error?: Error }
```

## License

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
