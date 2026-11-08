import type { Tool, ToolReview } from '@/lib/types';

type ReviewRecord = ToolReview & { toolName: string; toolUrl: string; description: string };

export function withToolReviews(tools: Tool[], reviews: Record<string, ReviewRecord>): Tool[] {
  return tools.map((tool) => {
    const review = reviews[tool.id];
    if (!review || review.toolName !== tool.name || review.toolUrl !== tool.url || review.description !== tool.description) {
      return { ...tool, review: undefined };
    }
    return { ...tool, review: { reviewedOn: review.reviewedOn, sourceUrl: review.sourceUrl } };
  });
}
