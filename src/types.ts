export type SubjectId =
  | 'biology'
  | 'chemistry'
  | 'physics'
  | 'technology'
  | 'engineering'
  | 'mathematics'
  | 'coding';

export type SDG = '4' | '9' | '10';

export interface World {
  id: SubjectId;
  title: string;
  subject: string;
  mascotName: string;
  mascotSpecies: string;
  missionTitle: string;
  intro: string;
  badgeName: string;
  recap: string[];
  points: number;
  prerequisites: SubjectId[];
  sdg: SDG;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  environment: string;
  mascotPersonality: string;
}

export interface WorldProgress {
  completed: boolean;
  score: number;
  bestScore: number;
  completedAt: string | null;
}

export interface GameProgress {
  version: number;
  worlds: Record<SubjectId, WorldProgress>;
  totalPoints: number;
  badges: SubjectId[];
  conceptsLearned: string[];
}

export type Screen =
  | { name: 'home' }
  | { name: 'mission'; worldId: SubjectId }
  | { name: 'celebration' };
