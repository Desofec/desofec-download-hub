import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
const origin = 'https://example.test';

function response(body, status = 200, type = 'basic') {
  return {
    status,
    type,
    ok: status >= 200 && status < 300,
    clone: () => response(body, status, type),
    text: async () => body
  };
}

function worker() {
  const handlers = new Map();
  const stores = new Map();
  let network = async () => { throw new Error('Offline'); };
  const url = (request) => new URL(typeof request === 'string' ? request : request.url, origin).href;
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async match(request) { return store.get(url(request))?.clone(); },
        async put(request, value) { store.set(url(request), value.clone()); }
      };
    },
    async match(request) {
      for (const store of stores.values()) {
        const found = store.get(url(request));
        if (found) return found.clone();
      }
      return undefined;
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); }
  };
  const self = {
    location: { origin },
    addEventListener: (name, handler) => handlers.set(name, handler),
    clients: { claim: async () => {} }
  };
  vm.runInNewContext(source, {
    self,
    caches,
    URL,
    Response: { error: () => response('', 0, 'error') },
    fetch: (...args) => network(...args)
  });

  async function fetchEvent(path, mode = 'cors') {
    let responsePromise;
    const pending = [];
    handlers.get('fetch')({
      request: { url: new URL(path, origin).href, method: 'GET', mode, headers: new Headers() },
      respondWith: (promise) => { responsePromise = promise; },
      waitUntil: (promise) => pending.push(promise)
    });
    const result = await responsePromise;
    await Promise.all(pending);
    return result;
  }

  return {
    caches,
    fetchEvent,
    setNetwork: (handler) => { network = handler; },
    async activate() {
      let pending;
      handlers.get('activate')({ waitUntil: (promise) => { pending = promise; } });
      await pending;
    }
  };
}

test('download requests revalidate online, then use the refreshed copy offline', async () => {
  const app = worker();
  const cache = await app.caches.open('desofec-studio-v1');
  const path = '/downloads/example.md';
  await cache.put(path, response('old version'));
  let cacheMode;
  app.setNetwork(async (_request, options) => {
    cacheMode = options.cache;
    return response('new version');
  });

  assert.equal(await (await app.fetchEvent(path)).text(), 'new version');
  assert.equal(cacheMode, 'no-cache', 'revalidate the browser HTTP cache');
  assert.equal(await (await cache.match(path)).text(), 'new version');

  app.setNetwork(async () => { throw new Error('Offline'); });
  assert.equal(await (await app.fetchEvent(path)).text(), 'new version');
  assert.equal((await app.fetchEvent('/downloads/not-cached.md')).type, 'error');
});

test('online download errors are not disguised as successful cached files', async () => {
  const app = worker();
  const cache = await app.caches.open('desofec-studio-v1');
  await cache.put('/downloads/missing.md', response('old version'));
  app.setNetwork(async () => response('Not found', 404));

  const result = await app.fetchEvent('/downloads/missing.md');
  assert.equal(result.status, 404);
  assert.equal(await (await cache.match('/downloads/missing.md')).text(), 'old version');
});

test('activation retains the current offline cache and removes only older app caches', async () => {
  const app = worker();
  const current = await app.caches.open('desofec-studio-v1');
  await current.put('/downloads/saved.md', response('saved worksheet'));
  await current.put('/offline.html', response('offline page'));
  await app.caches.open('desofec-studio-v0');
  await app.caches.open('another-app');

  await app.activate();
  assert.deepEqual(await app.caches.keys(), ['desofec-studio-v1', 'another-app']);
  assert.equal(await (await app.fetchEvent('/downloads/saved.md')).text(), 'saved worksheet');
  assert.equal(await (await app.fetchEvent('/uncached-page', 'navigate')).text(), 'offline page');
});
