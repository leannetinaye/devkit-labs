const { parseString } = require('./index');
const out = parseString('name,age\nAlice,30\n', { header: true });
console.assert(out[0].name === 'Alice' && out[0].age === 30);
console.log('csv-smart-parse ok');
