# DevKit Labs

[![CI](https://github.com/leannetinaye/devkit-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/leannetinaye/devkit-labs/actions/workflows/ci.yml)
![license](https://img.shields.io/badge/license-MIT-blue)
![npm](https://img.shields.io/npm/v/@leannetinaye/safe-json?label=safe-json)
![npm](https://img.shields.io/npm/v/@leannetinaye/csv-smart-parse?label=csv-smart-parse)
![npm](https://img.shields.io/npm/v/@leannetinaye/env-sanitizer?label=env-sanitizer)

A suite of open-source developer utilities:

- **[@leannetinaye/safe-json](https://www.npmjs.com/package/@leannetinaye/safe-json)**  
  Crash-proof JSON parsing and safe stringify with circular reference handling.

- **[@leannetinaye/csv-smart-parse](https://www.npmjs.com/package/@leannetinaye/csv-smart-parse)**  
  Robust CSV parsing with delimiter auto-detect, type inference, and streaming support.

- **[@leannetinaye/env-sanitizer](https://www.npmjs.com/package/@leannetinaye/env-sanitizer)**  
  Schema-based environment variable validation and defaults.

---

## Installation

Install all utilities at once:

```bash
npm i @leannetinaye/safe-json @leannetinaye/csv-smart-parse @leannetinaye/env-sanitizer
```

Or install only the one you need:

```bash
npm i @leannetinaye/safe-json
npm i @leannetinaye/csv-smart-parse
npm i @leannetinaye/env-sanitizer
```

---

## Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/leannetinaye/devkit-labs.git
cd devkit-labs
npm install
```

Each package is inside the [`packages/`](./packages) folder, with its own `README.md`, `LICENSE`, and `package.json`.  
You can run and test them independently.

---

## License

MIT © 2025 Leanne Tinaye  
See [LICENSE](./LICENSE) for details.
