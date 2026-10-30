import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readAndValidateCatalog } from './content-catalog.mjs';

const webDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoDir = path.resolve(webDir, '..');
const catalog = await readAndValidateCatalog(repoDir);

console.log(
  `Content is valid: ${catalog.goals.length} goals, ${catalog.tools.length} tools, ` +
  `${catalog.paths.length} paths, ${catalog.starterPacks.length} starter packs, ` +
  `${Object.keys(catalog.recommendations).length} recommendations.`
);
