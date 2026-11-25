const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Exercise the actual App handlers without wiring the deferred Step 3 UI.
const source = fs.readFileSync(path.join(__dirname, '../App.tsx'), 'utf8');
const ast = ts.createSourceFile('App.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function handler(name, bindings) {
  let expression;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === name) expression = node.initializer.getText(ast);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.ok(expression, `${name} must exist in App.tsx`);
  const js = ts.transpileModule(`const run = ${expression};`, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
  return new Function(...Object.keys(bindings), `${js}; return run;`)(...Object.values(bindings));
}
function fixture(saveOrder, name = 'handleSaveForLater') {
  const events = [];
  const bill = { items: [{}], totalAmount: 100 };
  const bindings = { checkoutBill: bill, isSaving: false, saveOrder,
    savingForLaterRef: { current: false }, savedForLaterBillRef: { current: null }, openingBillRef: { current: true },
    Alert: { alert: (...args) => events.push(['alert', ...args]) } };
  for (const key of ['CheckoutBill', 'SelectedServices', 'HasOpenedBill', 'IsOpeningBill', 'ShowHistoryModal', 'CurrentScreen']) {
    bindings[`set${key}`] = value => events.push([key, value]);
  }
  return { run: handler(name, bindings), bindings, events, bill };
}
test('awaits persistence, blocks duplicate taps, then clears checkout and navigates to history', async () => {
  let resolve; const calls = [];
  const f = fixture((...args) => { calls.push(args); return new Promise(r => { resolve = r; }); });
  const pending = f.run(); await f.run();
  assert.equal(calls.length, 1); assert.deepEqual(f.events, []);
  assert.deepEqual(calls[0], [f.bill, 'PENDING_PAYMENT']);
  resolve(true); await pending; await f.run();
  assert.equal(calls.length, 1);
  assert.ok(f.events.some(([key, value]) => key === 'CheckoutBill' && value === null));
  assert.ok(f.events.some(([key, value]) => key === 'CurrentScreen' && value === 'history'));
  assert.equal(f.bindings.openingBillRef.current, false);
  assert.ok(!f.events.some(([, value]) => value === 'payment'));
});
for (const throws of [false, true]) test(`persistence ${throws ? 'exception' : 'failure'} preserves checkout and permits retry`, async () => {
  let calls = 0;
  const f = fixture(async () => { calls++; if (calls === 1) { if (throws) throw new Error('storage failed'); return false; } return true; });
  await f.run();
  assert.deepEqual(f.events.map(e => e[0]), ['alert']);
  assert.equal(f.bindings.checkoutBill, f.bill);
  assert.equal(f.bindings.savingForLaterRef.current, false);
  await f.run(); assert.equal(calls, 2);
  assert.ok(f.events.some(([key, value]) => key === 'CurrentScreen' && value === 'history'));
});
test('payment confirmation retains its existing save signature and success navigation', async () => {
  const calls = []; const f = fixture(async (...args) => { calls.push(args); return true; }, 'handlePaymentConfirmed');
  await f.run(); assert.deepEqual(calls, [[f.bill]]);
  assert.ok(f.events.some(([key, value]) => key === 'CurrentScreen' && value === 'history'));
});

test('real order hook waits for storage and persists the pending status', async () => {
  const hookSource = fs.readFileSync(path.join(__dirname, '../Vreni/src/hooks/useOrderHistory.ts'), 'utf8');
  const js = ts.transpileModule(hookSource, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText;
  let finish; let stored; const exports = {};
  const storage = { getOrders: async () => [], saveOrders: orders => { stored = orders; return new Promise(resolve => { finish = resolve; }); } };
  const react = { useRef: current => ({ current }), useState: initial => [initial, () => {}], useCallback: fn => fn, useEffect: () => {} };
  new Function('require', 'exports', js)(id => id === 'react' ? react : storage, exports);
  const hook = exports.useOrderHistory();
  const bill = { items: [{ serviceId: 'fixture' }], totalAmount: 10 };
  let completed = false;
  const pending = hook.saveOrder(bill, 'PENDING_PAYMENT').then(result => { completed = true; return result; });
  await Promise.resolve();
  assert.equal(completed, false); assert.equal(stored[0].paymentStatus, 'PENDING_PAYMENT');
  assert.equal(await hook.saveOrder(bill, 'PENDING_PAYMENT'), false);
  finish(); assert.equal(await pending, true);
});
