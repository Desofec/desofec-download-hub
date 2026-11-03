export type ItemType = 'path' | 'pack' | 'tutorial' | 'tool';

export type WorkspaceItem = { type: ItemType; id: string; title: string; href: string };

export const itemTypeLabels: Record<ItemType, string> = {
  path: 'Learning path',
  pack: 'Starter pack',
  tutorial: 'Tutorial',
  tool: 'Tool'
};

export const INVITE_DAYS = 7;

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// The raw token only ever lives in the invite link; the database stores its SHA-256 hash.
export async function createInviteToken() {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  return { token, hash: await hashInviteToken(token) };
}

export async function hashInviteToken(token: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return toHex(new Uint8Array(digest));
}
