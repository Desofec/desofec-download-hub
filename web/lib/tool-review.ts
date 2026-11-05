import type { Tool, ToolReview } from '@/lib/types';

type ReviewRecord = ToolReview & { toolUrl: string; description: string };

export function withToolReviews(tools: Tool[], reviews: Record<string, ReviewRecord>): Tool[] {
  return tools.map((tool) => {
    const review = reviews[tool.id];
    if (!review || review.toolUrl !== tool.url || review.description !== tool.description) return tool;
    return { ...tool, review: { reviewedOn: review.reviewedOn, sourceUrl: review.sourceUrl } };
  });
}
