const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadQ(nodes) {
  const context = {
    window: {},
    document: {
      querySelectorAll() {
        return nodes;
      },
    },
  };

  vm.createContext(context);
  vm.runInContext(fs.readFileSync('quentin.js', 'utf8'), context);
  return context.window.q;
}

test('data() returns empty-string dataset values for explicit keys', () => {
  const nodes = [
    {
      dataset: { label: '' },
      classList: [],
      parentNode: { children: [] },
      children: [],
      querySelectorAll() {
        return [];
      },
    },
  ];

  const q = loadQ(nodes);
  assert.equal(q('.item').data('label'), '');
});
