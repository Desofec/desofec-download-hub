import 'server-only';
import { createClient } from '@supabase/supabase-js';
import goals from '@/content/goals.json';
import tools from '@/content/tools.json';
import paths from '@/content/paths.json';
import starterPacks from '@/content/starter-packs.json';
import recommendations from '@/content/recommendations.json';
import type { Catalog } from './types';

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function loadBundledCatalog(): Catalog {
  return {
    goals,
    tools,
    paths,
    starterPacks,
    recommendations
  } as Catalog;
}

function unwrap<T>(result: { data: T | null; error: { message: string } | null }, table: string): T {
  if (result.error) {
    throw new Error(`Supabase query for "${table}" failed: ${result.error.message}`);
  }
  return result.data ?? ([] as unknown as T);
}

export async function loadSupabaseCatalog(): Promise<Catalog> {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const [goalRows, toolRows, packRows, pathRows, recRows, recToolRows, recStarterRows] = await Promise.all([
    client.from('goals').select('id, name, description, badge').order('position'),
    client.from('tools').select('id, name, category, skill, description, badge').order('position'),
    client.from('starter_packs').select('id, title, description, level, file_path').order('position'),
    client.from('paths').select('id, title, level, description, badge, goal_id, steps').order('position'),
    client.from('recommendations').select('goal_id, title, summary, steps'),
    client.from('recommendation_tools').select('goal_id, tool_id').order('position'),
    client.from('recommendation_starters').select('goal_id, pack_id').order('position')
  ]);

  const recMap: Catalog['recommendations'] = {};
  for (const row of unwrap(recRows, 'recommendations')) {
    recMap[row.goal_id] = { title: row.title, summary: row.summary, steps: row.steps, tools: [], starters: [] };
  }
  for (const row of unwrap(recToolRows, 'recommendation_tools')) {
    recMap[row.goal_id]?.tools.push(row.tool_id);
  }
  for (const row of unwrap(recStarterRows, 'recommendation_starters')) {
    recMap[row.goal_id]?.starters.push(row.pack_id);
  }

  return {
    goals: unwrap(goalRows, 'goals'),
    tools: unwrap(toolRows, 'tools'),
    starterPacks: unwrap(packRows, 'starter_packs').map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      level: row.level,
      file: row.file_path
    })),
    paths: unwrap(pathRows, 'paths').map((row) => ({
      id: row.id,
      title: row.title,
      level: row.level,
      description: row.description,
      badge: row.badge,
      goal: row.goal_id,
      steps: row.steps
    })),
    recommendations: recMap
  };
}
