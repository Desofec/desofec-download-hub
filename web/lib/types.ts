export type Goal = {
  id: string;
  name: string;
  description: string;
  badge: string;
};

export type Tool = {
  id: string;
  name: string;
  category: string;
  skill: string;
  description: string;
  badge: string;
  url: string;
};

export type StarterPack = {
  id: string;
  title: string;
  description: string;
  level: string;
  file: string;
};

export type LearningPath = {
  id: string;
  title: string;
  level: string;
  description: string;
  badge: string;
  goal: string;
  steps: string[];
};

export type Recommendation = {
  title: string;
  summary: string;
  steps: string[];
  tools: string[];
  starters: string[];
};

export type Catalog = {
  goals: Goal[];
  tools: Tool[];
  paths: LearningPath[];
  starterPacks: StarterPack[];
  recommendations: Record<string, Recommendation>;
  starterPackChecklists: Record<string, string[]>;
};
