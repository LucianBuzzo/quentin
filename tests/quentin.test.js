const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function makeNode({ className = '', dataset = {}, children = [], query = {} } = {}) {
  const node = {
    className,
    dataset,
    children,
    parentNode: null,
    _query: query,
    querySelectorAll(selector) {
      return this._query[selector] || [];
    },
  };

  Object.defineProperty(node, 'classList', {
    get() {
      if (!node.className.trim()) return [];
      return node.className.trim().split(/\s+/);
    },
  });

  for (const child of children) {
    child.parentNode = node;
  }

  return node;
}

function loadQ(selectorMap) {
  const context = {
    window: {},
    document: {
      querySelectorAll(selector) {
        return selectorMap[selector] || [];
      },
    },
  };

  vm.createContext(context);
  vm.runInContext(fs.readFileSync('quentin.js', 'utf8'), context);
  return context.window.q;
}

test('class helpers: add/remove/has/toggle', () => {
  const a = makeNode({ className: 'item active' });
  const b = makeNode({ className: 'item' });
  const q = loadQ({ '.item': [a, b] });

  assert.equal(q('.item').hasClass('active'), true);

  q('.item').removeClass('active');
  assert.equal(a.className, 'item');

  q('.item').addClass('new');
  assert.equal(a.className.includes('new'), true);
  assert.equal(b.className.includes('new'), true);

  q('.item').toggleClass('new');
  assert.equal(q('.item').hasClass('new'), false);
});

test('find/first/last/eq return expected nodes', () => {
  const li1 = makeNode({ className: 'li one' });
  const li2 = makeNode({ className: 'li two' });
  const ul = makeNode({ query: { li: [li1, li2] } });

  const q = loadQ({ ul: [ul] });
  const found = q('ul').find('li');

  assert.equal(found.length, 2);
  assert.equal(found.first()[0], li1);
  assert.equal(found.last()[0], li2);
  assert.equal(found.eq(1)[0], li2);
});

test('data(key) and data() shapes', () => {
  const a = makeNode({ dataset: { id: '1', label: '' } });
  const b = makeNode({ dataset: { id: '2' } });
  const q = loadQ({ '.row': [a, b] });

  assert.deepEqual(Array.from(q('.row').data('id')), ['1', '2']);
  assert.equal(q('.row').first().data('label'), '');

  const all = Array.from(q('.row').data()).map(item => JSON.parse(JSON.stringify(item)));
  assert.equal(Array.isArray(all), true);
  assert.deepEqual(all[0], { id: '1', label: '' });
  assert.deepEqual(all[1], { id: '2' });
});

test('siblings/parent/children are based on first match', () => {
  const c1 = makeNode({ className: 'c1' });
  const c2 = makeNode({ className: 'c2' });
  const c3 = makeNode({ className: 'c3' });
  const parent = makeNode({ children: [c1, c2, c3] });

  const q = loadQ({ '.child': [c2] });

  const siblings = q('.child').siblings();
  assert.equal(siblings.length, 3);
  assert.equal(siblings[0], c1);
  assert.equal(siblings[1], c2);
  assert.equal(siblings[2], c3);

  assert.equal(q('.child').parent()[0], parent);
  assert.equal(q('.child').parent().children().length, 3);
});
