export type StageId =
  | 'home'
  | 'brainstorm'
  | 'ethics'
  | 'design'
  | 'recruit'
  | 'builder'
  | 'pool'
  | 'analysis'
  | 'writing'
  | 'publish'
  | 'community';

export interface IdeaItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  papersCount: number;
  gapIdentified: boolean;
  status: 'draft' | 'ready' | 'archived';
}

export interface ResearchGap {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Community need';
  tags: string[];
  interestedResearchers: number;
}

export interface JournalPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  isOpenAccess: boolean;
  isPreprint?: boolean;
}

export interface ScaleItem {
  id: string;
  name: string;
  fullName: string;
  license: string;
  languages: string[];
  itemsCount: number;
  icdAligned?: boolean;
}

export interface Participant {
  id: string;
  initials: string;
  age: number;
  state: string;
  languages: string[];
  studiesCompleted: number;
  status: 'Available' | 'In study' | 'Inactive';
}

export interface ExperimentTrial {
  id: number;
  stimulus: string;
  language: 'Hindi' | 'English' | 'Tamil';
  congruent: boolean;
  color: string;
  userResponse?: string;
  correct: boolean;
  rt: number; // in milliseconds
}

export interface StudyProject {
  id: string;
  title: string;
  institution: string;
  studyType: string;
  scientificRationale: string;
  targetN: number;
  ageRange: string;
  compensation: string;
  methodology: 'quant' | 'qual' | 'mixed';
  designType: string;
  primaryDV: string;
  groupsCount: string;
  currentStage: StageId;
}
