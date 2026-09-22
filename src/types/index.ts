export type StageId =
  | 'home'
  | 'brainstorm'
  | 'grants'
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

export interface GrantAgency {
  id: string;
  name: string;
  code: 'ICSSR' | 'DST_SERB' | 'ICMR' | 'DBT_INDIA_ALLIANCE' | 'UGC';
  fullName: string;
  scheme: string;
  maxBudgetLakhs: number;
  deadline: string;
  description: string;
  eligibleInstitutions: string[];
}

export interface BudgetBreakdown {
  jrfStipend: number; // ₹37,000/mo DST norm
  jrfMonths: number;
  equipment: number;
  fieldWorkTravel: number;
  participantHonorarium: number;
  contingency: number;
  overhead: number;
}

export interface GrantProposal {
  id: string;
  agencyCode: string;
  title: string;
  principalInvestigator: string;
  institution: string;
  durationMonths: number;
  totalBudgetINR: number;
  specificAims: string[];
  significanceIndianContext: string;
  methodologyOverview: string;
  expectedOutcomes: string;
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

export interface CollaborationMatch {
  id: string;
  name: string;
  institution: string;
  role: string;
  skills: string[];
  languages: string[];
  grantSeeking: string;
  matchScore: number;
}
