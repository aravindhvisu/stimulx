export type UserPersona = 'student' | 'phd' | 'postdoc' | 'scientist';

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
  | 'community'
  | 'replication'
  | 'recruitment_board'
  | 'prereg';

export type CognitiveDomain = 'attention' | 'memory' | 'emotion' | 'executive' | 'decision';

export interface ExperimentParadigm {
  id: string;
  name: string;
  domain: CognitiveDomain;
  shortDesc: string;
  defaultTrials: number;
  supportedLanguages: string[];
  stimulusType: string;
  dependentMeasures: string[];
}

export interface ScaleItemExtended {
  id: string;
  name: string;
  fullName: string;
  domain: string;
  licenseType: 'open_access' | 'licensed_commercial';
  publisher: string;
  qualificationLevel: 'A' | 'B' | 'C';
  costPerAdminINR: number;
  languages: string[];
  itemsCount: number;
  description: string;
  citation: string;
}

export interface ReplicationStudy {
  id: string;
  originalPaper: string;
  landmarkEffect: string;
  year: number;
  originalSample: string;
  originalCulture: 'W.E.I.R.D. (North America/Europe)';
  replicationStatus: 'replicated' | 'attenuated' | 'failed' | 'in_progress';
  indianSites: string[];
  targetN: number;
  currentN: number;
  keyFinding: string;
  cloneableStudyId: string;
}

export interface PreRegistrationRecord {
  id: string;
  studyId: string;
  studyTitle: string;
  hypotheses: string;
  samplingPlan: string;
  dependentVars: string;
  independentVars: string;
  outlierCriteria: string;
  analysisPlan: string;
  timestampHash: string;
  dateRegistered: string;
  badgeAwarded: boolean;
}

export interface RecruitmentListing {
  id: string;
  studyId: string;
  title: string;
  leadInstitution: string;
  targetDemographics: string;
  compensationINR: number;
  durationMinutes: number;
  openSlots: number;
  enrolledCount: number;
  status: 'active' | 'completed' | 'paused';
  stateScope: string;
}

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
  paradigmId?: string;
  trialCount: number;
  fixationDurationMs: number;
  stimulusDurationMs: number;
  feedbackDurationMs: number;
  languages: ('English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Kannada' | 'Bengali')[];
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
  tree?: ExperimentTree;
  tasks?: TaskDefinition[];
  questionnaires?: QuestionnaireDefinition[];
  liveSessions?: LiveParticipantSession[];
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

// ==========================================
// GORILLA.SC-GRADE ARCHITECTURE TYPES
// ==========================================

export type ExperimentTreeNodeType =
  | 'start'
  | 'task'
  | 'questionnaire'
  | 'randomiser'
  | 'branch'
  | 'delay'
  | 'finish';

export interface RandomiserBranch {
  id: string;
  targetNodeId: string;
  weightPct: number; // e.g. 50%
  ratioLabel: string; // e.g. "Condition A"
}

export interface BranchCondition {
  variableName: string; // e.g. "score_phq9" or "accuracy"
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number;
  trueNodeId: string;
  falseNodeId: string;
}

export interface ExperimentTreeNode {
  id: string;
  type: ExperimentTreeNodeType;
  title: string;
  position: { x: number; y: number };
  taskId?: string;
  questionnaireId?: string;
  randomiserSettings?: {
    branches: RandomiserBranch[];
  };
  branchSettings?: BranchCondition;
  delaySettings?: {
    durationSeconds: number;
    message: string;
  };
  finishSettings?: {
    completionCode?: string;
    redirectUrl?: string;
    message: string;
  };
  next?: string; // default forward connection
}

export interface ExperimentTreeEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  condition?: string;
}

export interface ExperimentTree {
  nodes: ExperimentTreeNode[];
  edges: ExperimentTreeEdge[];
}

// Gorilla Task Builder Types (Displays + Zones + Spreadsheets)

export type ZoneType =
  | 'text'
  | 'fixation'
  | 'image'
  | 'keyboard_response'
  | 'button_response'
  | 'rating_scale'
  | 'text_input'
  | 'timer';

export interface TaskZone {
  id: string;
  name: string;
  type: ZoneType;
  xPct: number; // percentage from left (0 to 100)
  yPct: number; // percentage from top (0 to 100)
  widthPct: number; // width in percent
  heightPct: number; // height in percent
  content?: string; // static string or "$$variable_name"
  fontSizePx?: number;
  fontColor?: string; // hex or "$$color_variable"
  backgroundColor?: string;
  validKeys?: string[]; // e.g. ['r', 'g', 'b', 'y']
  correctKey?: string; // e.g. "$$correct_key"
  options?: string[]; // for button_response choices
  timeoutMs?: number;
  showFeedback?: boolean;
}

export interface TaskDisplay {
  id: string;
  name: string; // e.g. "Fixation", "Stimulus", "Feedback"
  durationMs?: number; // 0 or undefined for indefinite / until response
  advanceOn: 'time' | 'response' | 'time_or_response';
  backgroundColor?: string;
  zones: TaskZone[];
}

export type TaskSpreadsheetRow = Record<string, string | number | boolean>;

export interface TaskDefinition {
  id: string;
  name: string;
  description: string;
  domain: CognitiveDomain;
  displays: TaskDisplay[];
  spreadsheet: TaskSpreadsheetRow[];
  randomizeTrials: boolean;
  blockGroupingColumn?: string;
  practiceTrialsCount?: number;
  interTrialIntervalMs?: number;
}

// Gorilla Questionnaire Builder Types

export type QuestionnaireQuestionType =
  | 'instruction'
  | 'text'
  | 'paragraph'
  | 'multiple_choice'
  | 'checkboxes'
  | 'likert'
  | 'slider'
  | 'dropdown'
  | 'consent';

export interface QuestionnaireOption {
  label: string;
  value: string | number;
  score?: number;
}

export interface QuestionnaireItem {
  id: string;
  type: QuestionnaireQuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionnaireOption[];
  minLabel?: string;
  maxLabel?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

export interface QuestionnairePage {
  id: string;
  title: string;
  description?: string;
  items: QuestionnaireItem[];
}

export interface QuestionnaireDefinition {
  id: string;
  name: string;
  description: string;
  category: 'clinical' | 'consent' | 'demographics' | 'debrief' | 'custom';
  pages: QuestionnairePage[];
  scoringRule?: {
    sumItemIds?: string[];
    scaleName?: string;
    cutoffs?: { min: number; label: string }[];
  };
}

// Gorilla Real Data Metric & Session Logging Types

export interface GorillaRawTrialLog {
  rowId: string;
  sessionId: string;
  participantToken: string;
  nodeId: string;
  nodeTitle: string;
  taskId: string;
  trialIndex: number;
  displayId: string;
  displayName: string;
  zoneId?: string;
  zoneType?: string;
  response?: string;
  correct?: boolean;
  rtMs: number;
  timedOut: boolean;
  timestampIso: string;
  spreadsheetRow?: Record<string, string | number | boolean>;
}

export interface QuestionnaireResponseLog {
  sessionId: string;
  questionnaireId: string;
  questionId: string;
  questionTitle: string;
  answer: string | number | (string | number)[];
  score?: number;
  answeredAtIso: string;
}

export interface LiveParticipantSession {
  id: string;
  studyId: string;
  participantToken: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  currentNodeId: string;
  visitedNodeIds: string[];
  demographics: {
    age?: string;
    gender?: string;
    state?: string;
    device?: 'desktop' | 'mobile';
    primaryLanguage?: string;
  };
  rawTrialLogs: GorillaRawTrialLog[];
  questionnaireLogs: QuestionnaireResponseLog[];
  overallScores?: Record<string, number>;
}

