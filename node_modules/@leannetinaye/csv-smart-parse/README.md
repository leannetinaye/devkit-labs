# @leannetinaye/csv-smart-parse

Robust CSV parser with delimiter auto-detection, type inference, and streaming.

## Installation

```bash
npm i @leannetinaye/csv-smart-parse
```

```js
const { parseString, parseFile, iterFile } = require('@leannetinaye/csv-smart-parse');

// From string
const csv = "name,age\nAlice,30\nBob,28";
const rows = parseString(csv, { header: true });
console.log(rows);
// [ { name: "Alice", age: 30 }, { name: "Bob", age: 28 } ]

// From file (async)
(async () => {
  const data = await parseFile('./data.csv', { header: true });
  console.log(data);
})();

// Stream large CSVs row by row
(async () => {
  for await (const row of iterFile('./data.csv', { header: true })) {
    console.log(row);
  }
})();
```

```js
// API shapes
parseString(csvText, options?) // Parse CSV from a string
parseFile(filePath, options?)  // Read + parse CSV file asynchronously
iterFile(filePath, options?)   // Async iterator for very large CSVs
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
