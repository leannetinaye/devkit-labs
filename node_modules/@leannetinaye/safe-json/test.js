const { parse, safeParse, safeStringify } = require('./index');
console.assert(parse('{"a":1}').ok);
console.assert(safeParse('{bad', 42) === 42);
const a = {}; a.self = a;
console.assert(safeStringify(a).includes('[Circular ~]'));
console.log('safe-json ok');
