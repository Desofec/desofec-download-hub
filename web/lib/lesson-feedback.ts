export function readLessonVote(data: unknown): boolean | null {
  if (data === null) return null;
  if (typeof data !== 'object' || !('helpful' in data) || typeof data.helpful !== 'boolean') {
    throw new Error('Invalid lesson feedback response');
  }
  return data.helpful;
}
