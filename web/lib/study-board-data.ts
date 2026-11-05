export type StudyPost = {
  id: string;
  goal_id: string;
  display_name: string;
  note: string;
  created_at: string;
  mine: boolean;
  my_request_status: string | null;
  joined_workspace_id: string | null;
};

export type StudyRequest = {
  id: string;
  post_id: string;
  goal_id: string;
  display_name: string;
  message: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isStudyPost(value: unknown): value is StudyPost {
  return isRecord(value)
    && ['id', 'goal_id', 'display_name', 'note', 'created_at'].every((key) => typeof value[key] === 'string')
    && typeof value.mine === 'boolean'
    && (value.my_request_status === null || (typeof value.my_request_status === 'string'
      && ['pending', 'approved', 'declined'].includes(value.my_request_status)))
    && (value.joined_workspace_id === null || typeof value.joined_workspace_id === 'string');
}

export function isStudyRequest(value: unknown): value is StudyRequest {
  return isRecord(value)
    && ['id', 'post_id', 'goal_id', 'display_name', 'message'].every((key) => typeof value[key] === 'string');
}

export function studyRows<T>(data: unknown, isRow: (value: unknown) => value is T): T[] {
  if (!Array.isArray(data) || !data.every(isRow)) throw new Error('Invalid study board response');
  return data;
}
