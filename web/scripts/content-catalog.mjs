import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const catalogFiles = {
  goals: 'goals.json',
  tools: 'tools.json',
  paths: 'paths.json',
  starterPacks: 'starter-packs.json',
  recommendations: 'recommendations.json'
};

function assertString(value, field, context) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${context}: "${field}" must be a non-empty string.`);
  }
}

function assertStringArray(value, field, context, { allowEmpty = false } = {}) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    throw new Error(`${context}: "${field}" must be ${allowEmpty ? 'an array' : 'a non-empty array'}.`);
  }
  value.forEach((entry, index) => assertString(entry, `${field}[${index}]`, context));
}

function assertUniqueIds(entries, label) {
  const seen = new Set();
  for (const [index, entry] of entries.entries()) {
    const context = `${label}[${index}]`;
    assertString(entry?.id, 'id', context);
    if (seen.has(entry.id)) {
      throw new Error(`${context}: duplicate id "${entry.id}".`);
    }
    seen.add(entry.id);
  }
  return seen;
}

function assertFields(entries, label, fields) {
  entries.forEach((entry, index) => {
    const context = `${label}[${index}]`;
    for (const field of fields) assertString(entry?.[field], field, context);
  });
}

function assertReferences(ids, allowedIds, context) {
  const seen = new Set();
  for (const id of ids) {
    if (!allowedIds.has(id)) throw new Error(`${context}: unknown reference "${id}".`);
    if (seen.has(id)) throw new Error(`${context}: duplicate reference "${id}".`);
    seen.add(id);
  }
}

export async function readAndValidateCatalog(repoDir) {
  const dataDir = path.join(repoDir, 'data');
  const catalog = {};
  for (const [key, file] of Object.entries(catalogFiles)) {
    catalog[key] = JSON.parse(await readFile(path.join(dataDir, file), 'utf8'));
  }

  for (const key of ['goals', 'tools', 'paths', 'starterPacks']) {
    if (!Array.isArray(catalog[key]) || catalog[key].length === 0) {
      throw new Error(`data/${catalogFiles[key]} must contain a non-empty array.`);
    }
  }
  if (!catalog.recommendations || Array.isArray(catalog.recommendations) || typeof catalog.recommendations !== 'object') {
    throw new Error('data/recommendations.json must contain an object keyed by goal id.');
  }

  const goalIds = assertUniqueIds(catalog.goals, 'goals');
  const toolIds = assertUniqueIds(catalog.tools, 'tools');
  assertUniqueIds(catalog.paths, 'paths');
  const starterIds = assertUniqueIds(catalog.starterPacks, 'starter-packs');

  assertFields(catalog.goals, 'goals', ['name', 'description', 'badge']);
  assertFields(catalog.tools, 'tools', ['name', 'category', 'skill', 'description', 'badge']);
  assertFields(catalog.paths, 'paths', ['title', 'level', 'description', 'badge', 'goal']);
  assertFields(catalog.starterPacks, 'starter-packs', ['title', 'description', 'level', 'file']);

  for (const [index, learningPath] of catalog.paths.entries()) {
    const context = `paths[${index}]`;
    if (!goalIds.has(learningPath.goal)) throw new Error(`${context}: unknown goal "${learningPath.goal}".`);
    assertStringArray(learningPath.steps, 'steps', context);
  }

  const downloadRoot = path.resolve(repoDir, 'downloads');
  for (const [index, pack] of catalog.starterPacks.entries()) {
    const context = `starter-packs[${index}]`;
    if (!pack.file.startsWith('downloads/')) {
      throw new Error(`${context}: "file" must point to a file under downloads/.`);
    }
    const filePath = path.resolve(repoDir, pack.file);
    const relativePath = path.relative(downloadRoot, filePath);
    if (!relativePath || relativePath.startsWith(`..${path.sep}`) || relativePath === '..' || path.isAbsolute(relativePath)) {
      throw new Error(`${context}: "file" must point to a file under downloads/.`);
    }
    await access(filePath);
    if (!(await stat(filePath)).isFile()) throw new Error(`${context}: "${pack.file}" is not a file.`);
  }

  const recommendationIds = Object.keys(catalog.recommendations);
  for (const goalId of goalIds) {
    if (!Object.hasOwn(catalog.recommendations, goalId)) {
      throw new Error(`recommendations: missing entry for goal "${goalId}".`);
    }
  }
  for (const goalId of recommendationIds) {
    const recommendation = catalog.recommendations[goalId];
    const context = `recommendations["${goalId}"]`;
    if (!goalIds.has(goalId)) throw new Error(`${context}: unknown goal.`);
    assertFields([recommendation], context, ['title', 'summary']);
    assertStringArray(recommendation.steps, 'steps', context);
    assertStringArray(recommendation.tools, 'tools', context, { allowEmpty: true });
    assertStringArray(recommendation.starters, 'starters', context, { allowEmpty: true });
    assertReferences(recommendation.tools, toolIds, `${context}.tools`);
    assertReferences(recommendation.starters, starterIds, `${context}.starters`);
  }

  return catalog;
}
