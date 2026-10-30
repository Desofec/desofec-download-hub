import { cacheLife } from 'next/cache';
import { isSupabaseConfigured, loadBundledCatalog, loadSupabaseCatalog } from './catalog-source';
import type { Catalog } from './types';

export async function getCatalog(): Promise<Catalog> {
  'use cache';
  cacheLife('hours');

  return isSupabaseConfigured() ? loadSupabaseCatalog() : loadBundledCatalog();
}
