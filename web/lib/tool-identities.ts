// Both historical IDs represent GitHub; saved IDs remain unchanged until a user removes the favorite.
const githubIds = ['git', 'github'] as const;

function isGithubId(id: string) {
  return githubIds.some((githubId) => githubId === id);
}

export function sameToolId(first: string, second: string) {
  return first === second || (isGithubId(first) && isGithubId(second));
}

export function primaryToolId(id: string, tools: readonly { id: string }[]) {
  if (!isGithubId(id)) return id;
  return githubIds.find((candidate) => tools.some((tool) => tool.id === candidate)) ?? id;
}

export function distinctTools<T extends { id: string }>(tools: readonly T[]): T[] {
  const primaryGithubId = primaryToolId('git', tools);
  return tools.filter((tool) => !isGithubId(tool.id) || tool.id === primaryGithubId);
}

export function findToolById<T extends { id: string }>(tools: readonly T[], id: string): T | undefined {
  return tools.find((tool) => tool.id === id) ?? tools.find((tool) => sameToolId(tool.id, id));
}

export function toolDetailIds(tools: readonly { id: string }[]): string[] {
  return [...new Set(tools.flatMap((tool) => isGithubId(tool.id) ? githubIds : [tool.id]))];
}

export function toolsForIds<T extends { id: string }>(tools: readonly T[], ids: readonly string[]): T[] {
  const seen = new Set<string>();
  return ids.flatMap((id) => {
    const primaryId = primaryToolId(id, tools);
    const tool = tools.find((entry) => entry.id === primaryId);
    if (!tool || seen.has(primaryId)) return [];
    seen.add(primaryId);
    return [tool];
  });
}

export function hasToolFavorite(favorites: readonly string[], id: string) {
  return favorites.some((favorite) => sameToolId(favorite, id));
}

export function favoriteIdsAfterToggle(favorites: readonly string[], id: string, favorite: boolean) {
  const next = new Set(favorites);
  if (favorite) {
    if (!hasToolFavorite(favorites, id)) next.add(id);
  } else {
    for (const savedId of next) {
      if (sameToolId(savedId, id)) next.delete(savedId);
    }
  }
  return [...next];
}
