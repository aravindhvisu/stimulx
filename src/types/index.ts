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
  srfMonths: number;
  srfStipend: number; // ₹42,000/mo DST norm
  hraPct: number; // 8, 16, or 24%
  equipment: number;
  fieldWorkTravel: number;
  participantHonorarium: number;
  contingency: number;
  overhead: number;
}

export interface GrantProposal {
  id: string;
  agencyCode: 'ICSSR' | 'DST_SERB' | 'ICMR' | 'DBT_INDIA_ALLIANCE';
  title: string;
  principalInvestigator: string;
  institution: string;
  durationMonths: number;
  totalBudgetINR: number;
  specificAims: string[];
  significanceIndianContext: string;
  methodologyOverview: string;
  expectedOutcomes: string;
  budget: BudgetBreakdown;
}

export interface EthicsProtocolData {
  protocolNumber: string;
  piName: string;
  institution: string;
  studyTitle: string;
  studyType: 'Behavioral Observation' | 'Cognitive Task (Minimal Risk)' | 'Clinical Intervention';
  riskLevel: 'Minimal Risk' | 'Less than Minimal Risk' | 'Greater than Minimal Risk';
  vulnerablePopulations: string[];
  dpdpConsentVerified: boolean;
  icmrGuidelinesYear: '2017' | '2023';
  dataStorageLocation: string;
  retentionYears: number;
  participantCompensationINR: number;
}

export interface ExperimentConfigData {
  taskName: string;
  trialCount: number;
  fixationDurationMs: number;
  stimulusDurationMs: number;
  feedbackDurationMs: number;
  languages: ('English' | 'Hindi' | 'Tamil')[];
  includePhq9: boolean;
  includeGad7: boolean;
}

export interface ParticipantTrialRecord {
  trialIndex: number;
  word: string;
  color: string;
  colorName: 'red' | 'green' | 'blue' | 'yellow';
  congruent: boolean;
  response: 'red' | 'green' | 'blue' | 'yellow' | 'none';
  correct: boolean;
  rtMs: number;
}

export interface ParticipantSession {
  id: string;
  studyId: string;
  startedAt: string;
  completedAt: string;
  demographics: {
    ageGroup: string;
    state: string;
    primaryLanguage: string;
    device: 'desktop' | 'mobile';
  };
  consentGiven: boolean;
  clinicalScores?: {
    phq9?: number;
    phq9Severity?: string;
    gad7?: number;
    gad7Severity?: string;
  };
  trials: ParticipantTrialRecord[];
  summary: {
    meanCongruentRT: number;
    meanIncongruentRT: number;
    stroopInterference: number;
    accuracyPct: number;
    totalTrials: number;
  };
}

export interface StudyProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  hypothesis: string;
  targetSampleSize: number;
  grantProposal: GrantProposal;
  ethicsProtocol: EthicsProtocolData;
  experimentConfig: ExperimentConfigData;
  sessions: ParticipantSession[];
}

export interface CollaborationPost {
  id: string;
  author: string;
  institution: string;
  title: string;
  domain: string;
  description: string;
  requiredSkills: string[];
  grantAgency: string;
  city: string;
  state: string;
  contactEmail: string;
  createdAt: string;
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
