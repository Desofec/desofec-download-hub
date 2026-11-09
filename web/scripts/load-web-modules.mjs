import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const Module = require('node:module');
const webDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function loadWebModules(paths) {
  const originalResolve = Module._resolveFilename;
  const originalTsLoader = Module._extensions['.ts'];
  try {
    Module._resolveFilename = function (request, parent, ...args) {
      const resolved = request.startsWith('@/') ? path.join(webDir, request.slice(2)) : request;
      return originalResolve.call(this, resolved, parent, ...args);
    };
    Module._extensions['.ts'] = (module, filename) => {
      const source = readFileSync(filename, 'utf8');
      const output = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }
      }).outputText;
      module._compile(output, filename);
    };
    return paths.map((modulePath) => require(path.join(webDir, modulePath)));
  } finally {
    Module._resolveFilename = originalResolve;
    if (originalTsLoader) Module._extensions['.ts'] = originalTsLoader;
    else delete Module._extensions['.ts'];
  }
}
