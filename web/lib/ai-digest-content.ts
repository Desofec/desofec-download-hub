import 'server-only';
import content from '@/content/ai-digests.json';
import { publishedAiDigests, readAiDigests } from '@/lib/ai-digests';

export function getPublishedAiDigests() {
  return publishedAiDigests(readAiDigests(content));
}
