'use client';

import { useState, useEffect } from 'react';
import {
  StudyProject,
  ParticipantSession,
  CollaborationPost,
  UserPersona,
  UserAccount,
  ExperimentParadigm,
  ScaleItemExtended,
  ReplicationStudy,
  PreRegistrationRecord,
  RecruitmentListing,
  ExperimentTree,
  TaskDefinition,
  QuestionnaireDefinition,
  GorillaRawTrialLog,
  QuestionnaireResponseLog,
  LiveParticipantSession,
} from '@/types';
import {
  DEFAULT_EXPERIMENT_TREE,
  DEFAULT_TASKS,
  DEFAULT_QUESTIONNAIRES,
} from '@/lib/gorillaTemplates';

const STORAGE_KEY = 'stimulx_vault_v3';
export const AUTH_STORAGE_KEY = 'stimulx_auth_user';

export const ANONYMOUS_USER: UserAccount = {
  id: 'guest',
  email: 'researcher@stimulx.in',
  name: 'Open Science Researcher',
  institution: 'Centre for Behavioural & Cognitive Sciences',
  role: 'scientist',
  isAuthenticated: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLogin: '2026-09-25T12:00:00.000Z',
};

export const DEMO_ACCOUNTS: UserAccount[] = [
  {
    id: 'user_aravindh',
    email: 'aravindh.v@nimhans.ac.in',
    name: 'Dr. Aravindh V.',
    institution: 'Centre for Behavioural & Cognitive Sciences / NIMHANS',
    role: 'scientist',
    isAuthenticated: true,
    createdAt: '2026-01-15T09:00:00.000Z',
    lastLogin: '2026-09-23T12:00:00.000Z',
  },
  {
    id: 'user_priya',
    email: 'priya.sharma@iitd.ac.in',
    name: 'Priya Sharma',
    institution: 'Indian Institute of Technology (IIT) Delhi',
    role: 'phd',
    isAuthenticated: true,
    createdAt: '2026-02-10T11:30:00.000Z',
    lastLogin: '2026-09-23T12:00:00.000Z',
  },
  {
    id: 'user_ananya',
    email: 'ananya.sen@tiss.edu',
    name: 'Dr. Ananya Sen',
    institution: 'Tata Institute of Social Sciences (TISS) Mumbai',
    role: 'postdoc',
    isAuthenticated: true,
    createdAt: '2026-03-01T14:20:00.000Z',
    lastLogin: '2026-09-23T12:00:00.000Z',
  },
  {
    id: 'user_rohan',
    email: 'rohan.m@du.ac.in',
    name: 'Rohan Mehta',
    institution: 'Department of Psychology, University of Delhi',
    role: 'student',
    isAuthenticated: true,
    createdAt: '2026-04-12T16:00:00.000Z',
    lastLogin: '2026-09-23T12:00:00.000Z',
  },
];

export const COGNITIVE_PARADIGMS: ExperimentParadigm[] = [
  {
    id: 'stroop',
    name: 'Stroop Color-Word Interference',
    domain: 'attention',
    shortDesc: 'Measures cognitive control, selective attention, and automated reading interference across scripts.',
    defaultTrials: 24,
    supportedLanguages: ['English', 'Hindi', 'Tamil', 'Kannada', 'Bengali'],
    stimulusType: 'Colored text words with congruent/incongruent mappings',
    dependentMeasures: ['Mean Congruent RT', 'Mean Incongruent RT', 'Stroop Interference (ΔRT ms)', 'Error Rate %'],
  },
  {
    id: 'flanker',
    name: 'Eriksen Flanker Task',
    domain: 'attention',
    shortDesc: 'Tests response inhibition and selective visual attention in the presence of distracting peripheral stimuli.',
    defaultTrials: 32,
    supportedLanguages: ['English', 'Hindi'],
    stimulusType: 'Central arrow or letter flanked by matching (>>>>>) or conflicting (>><>>) distractors',
    dependentMeasures: ['Flanker Congruence Effect (ms)', 'Post-Error Slowing', 'Accuracy %'],
  },
  {
    id: 'nback',
    name: 'N-Back Working Memory Task (2-Back)',
    domain: 'memory',
    shortDesc: 'Gold standard for working memory capacity, updating, and continuous item monitoring.',
    defaultTrials: 30,
    supportedLanguages: ['English', 'Hindi'],
    stimulusType: 'Sequential visual letter stream with target match 2 steps prior',
    dependentMeasures: ['Hit Rate', 'False Alarm Rate', 'd-prime (d\') Sensitivity', 'Mean RT'],
  },
  {
    id: 'digitspan',
    name: 'Digit Span (Forward & Backward)',
    domain: 'memory',
    shortDesc: 'Evaluates verbal working memory span and mental manipulation capacity.',
    defaultTrials: 14,
    supportedLanguages: ['English', 'Hindi', 'Tamil'],
    stimulusType: 'Auditory/visual sequence of Indian digits (2 to 9 span length)',
    dependentMeasures: ['Forward Span Maximum', 'Backward Span Maximum', 'Total Memory Score'],
  },
  {
    id: 'affective_priming',
    name: 'Affective Priming & Facial Emotion (FER)',
    domain: 'emotion',
    shortDesc: 'Examines automatic emotional evaluation, valence processing, and emotion recognition.',
    defaultTrials: 28,
    supportedLanguages: ['English', 'Hindi'],
    stimulusType: 'Indian emotion faces (Happy, Fear, Sad, Neutral) with valenced word probes',
    dependentMeasures: ['Emotion Recognition Accuracy %', 'Valence Priming RT (ms)', 'Threat Bias Index'],
  },
  {
    id: 'wcst',
    name: 'Wisconsin Card Sorting (Rule Switching)',
    domain: 'executive',
    shortDesc: 'Measures cognitive flexibility, perseveration, and the ability to shift strategies under shifting feedback.',
    defaultTrials: 40,
    supportedLanguages: ['English', 'Hindi'],
    stimulusType: 'Dimensional cards matching by color, shape, or number with unannounced rule shifts',
    dependentMeasures: ['Perseverative Errors', 'Categories Completed', 'Trials to First Category'],
  },
  {
    id: 'delay_discounting',
    name: 'Intertemporal Choice & Delay Discounting',
    domain: 'decision',
    shortDesc: 'Quantifies impulsivity and monetary subjective valuation (Now vs. Future Rupee payouts).',
    defaultTrials: 20,
    supportedLanguages: ['English', 'Hindi', 'Tamil'],
    stimulusType: 'Choice pairs: e.g. ₹500 today vs. ₹1,000 in 3 months',
    dependentMeasures: ['Hyperbolic Discount Parameter (k)', 'Indifference Points (INR)', 'Choice Consistency'],
  },
];

export const SCALE_CATALOG: ScaleItemExtended[] = [
  {
    id: 'phq9',
    name: 'PHQ-9',
    fullName: 'Patient Health Questionnaire - 9',
    domain: 'Depression & Affect',
    licenseType: 'open_access',
    publisher: 'Pfizer / Public Domain (Free CC-BY)',
    qualificationLevel: 'A',
    costPerAdminINR: 0,
    languages: ['English', 'Hindi', 'Tamil', 'Kannada', 'Telugu', 'Bengali', 'Marathi', 'Malayalam'],
    itemsCount: 9,
    description: 'Gold standard 9-item depression severity screening aligned with DSM-5 criteria.',
    citation: 'Kroenke, K., et al. (2001). J Gen Intern Med, 16(9), 606-613.',
  },
  {
    id: 'gad7',
    name: 'GAD-7',
    fullName: 'Generalized Anxiety Disorder - 7',
    domain: 'Anxiety & Worry',
    licenseType: 'open_access',
    publisher: 'Pfizer / Public Domain (Free CC-BY)',
    qualificationLevel: 'A',
    costPerAdminINR: 0,
    languages: ['English', 'Hindi', 'Tamil', 'Kannada', 'Bengali', 'Telugu'],
    itemsCount: 7,
    description: 'Rapid 7-item dimensional measure of generalized anxiety disorder severity.',
    citation: 'Spitzer, R. L., et al. (2006). Arch Intern Med, 166(10), 1092-1097.',
  },
  {
    id: 'dass21',
    name: 'DASS-21',
    fullName: 'Depression Anxiety Stress Scale - 21',
    domain: 'Tri-Partite Emotional States',
    licenseType: 'open_access',
    publisher: 'Univ of New South Wales (Free Academic Use)',
    qualificationLevel: 'A',
    costPerAdminINR: 0,
    languages: ['English', 'Hindi', 'Tamil', 'Marathi'],
    itemsCount: 21,
    description: 'Measures negative emotional states across three discrete subscales: depression, anxiety, and tension/stress.',
    citation: 'Lovibond, S.H. & Lovibond, P.F. (1995). Behav Res Ther, 33(3), 335-343.',
  },
  {
    id: 'pss10',
    name: 'PSS-10',
    fullName: 'Perceived Stress Scale - 10',
    domain: 'Stress Appraisal',
    licenseType: 'open_access',
    publisher: 'Sheldon Cohen / Public Domain',
    qualificationLevel: 'A',
    costPerAdminINR: 0,
    languages: ['English', 'Hindi', 'Tamil', 'Kannada'],
    itemsCount: 10,
    description: 'Most widely used psychological instrument for measuring the perception of stress and uncontrollability.',
    citation: 'Cohen, S., et al. (1983). J Health Soc Behav, 24(4), 385-396.',
  },
  {
    id: 'whodas2',
    name: 'WHODAS 2.0',
    fullName: 'WHO Disability Assessment Schedule 2.0',
    domain: 'Functional Health & Disability',
    licenseType: 'open_access',
    publisher: 'World Health Organization (WHO)',
    qualificationLevel: 'A',
    costPerAdminINR: 0,
    languages: ['English', 'Hindi', 'Tamil', 'Bengali'],
    itemsCount: 12,
    description: 'Generic assessment instrument for health and disability across 6 functional life domains.',
    citation: 'Üstün, T.B., et al. (2010). Epidemiol Psichiatr Soc, 19(2), 160-170.',
  },
  {
    id: 'panas',
    name: 'PANAS',
    fullName: 'Positive and Negative Affect Schedule',
    domain: 'Mood & Affective Disposition',
    licenseType: 'open_access',
    publisher: 'Watson & Clark (Free for Research)',
    qualificationLevel: 'A',
    costPerAdminINR: 0,
    languages: ['English', 'Hindi', 'Tamil'],
    itemsCount: 20,
    description: 'Brief 20-item scale assessing both positive affect (PA) and negative affect (NA).',
    citation: 'Watson, D., et al. (1988). J Pers Soc Psychol, 54(6), 1063-1070.',
  },
  {
    id: 'wais4',
    name: 'WAIS-IV India',
    fullName: 'Wechsler Adult Intelligence Scale (Indian Edition)',
    domain: 'Cognitive & Intellectual Ability',
    licenseType: 'licensed_commercial',
    publisher: 'Pearson Clinical Assessment India',
    qualificationLevel: 'C',
    costPerAdminINR: 350,
    languages: ['English', 'Hindi adaptation'],
    itemsCount: 15,
    description: 'Comprehensive clinical instrument for assessing cognitive capability in adults aged 16-90 with Indian norms.',
    citation: 'Pearson Clinical Assessment (2014). Indian Normative Standardization.',
  },
  {
    id: 'bdi2',
    name: 'BDI-II',
    fullName: 'Beck Depression Inventory - Second Edition',
    domain: 'Clinical Depression',
    licenseType: 'licensed_commercial',
    publisher: 'Pearson Clinical Assessment',
    qualificationLevel: 'B',
    costPerAdminINR: 120,
    languages: ['English', 'Hindi adaptation'],
    itemsCount: 21,
    description: 'Standard 21-item self-report rating inventory measuring characteristic attitudes and symptoms of depression.',
    citation: 'Beck, A. T., et al. (1996). Psychol Assess, 8(4), 387.',
  },
  {
    id: 'mmpi3',
    name: 'MMPI-3',
    fullName: 'Minnesota Multiphasic Personality Inventory - 3',
    domain: 'Personality & Psychopathology',
    licenseType: 'licensed_commercial',
    publisher: 'Univ of Minnesota Press / Pearson',
    qualificationLevel: 'C',
    costPerAdminINR: 480,
    languages: ['English'],
    itemsCount: 335,
    description: 'Comprehensive psychological assessment tool for evaluating personality traits and psychopathology.',
    citation: 'Ben-Porath, Y.S., & Tellegen, A. (2020). Pearson.',
  },
];

export const REPLICATION_STUDIES: ReplicationStudy[] = [
  {
    id: 'rep-001',
    originalPaper: 'Stroop, J. R. (1935). Studies of interference in serial verbal reactions.',
    landmarkEffect: 'Stroop Color-Word Interference Effect',
    year: 1935,
    originalSample: 'US College Undergraduates (N = 70)',
    originalCulture: 'W.E.I.R.D. (North America/Europe)',
    replicationStatus: 'replicated',
    indianSites: ['NIMHANS Bengaluru', 'IIT Delhi', 'Presidency Univ Kolkata', 'Univ of Hyderabad'],
    targetN: 500,
    currentN: 412,
    keyFinding: 'Robust interference confirmed in bilingual Indians across Devanagari and Latin scripts, with asymmetric interference favoring dominant mother tongue.',
    cloneableStudyId: 'proj-001',
  },
  {
    id: 'rep-002',
    originalPaper: 'Mischel, W., et al. (1989). Delay of gratification in children.',
    landmarkEffect: 'Marshmallow Task / Delayed Gratification',
    year: 1989,
    originalSample: 'Stanford Bing Nursery Children (High SES, California)',
    originalCulture: 'W.E.I.R.D. (North America/Europe)',
    replicationStatus: 'attenuated',
    indianSites: ['TISS Mumbai', 'IIT Madras', 'Ashoka Univ'],
    targetN: 350,
    currentN: 290,
    keyFinding: 'Waiting time is sharply moderated by institutional trust and resource scarcity rather than intrinsic willpower alone; rural children show rational immediate consumption.',
    cloneableStudyId: 'proj-002',
  },
  {
    id: 'rep-003',
    originalPaper: 'Asch, S. E. (1951). Effects of group pressure upon the modification and distortion of judgments.',
    landmarkEffect: 'Asch Line Length Conformity Effect',
    year: 1951,
    originalSample: 'Swarthmore College Male Students (USA)',
    originalCulture: 'W.E.I.R.D. (North America/Europe)',
    replicationStatus: 'replicated',
    indianSites: ['Delhi University', 'SCARF Chennai', 'Gauhati Univ'],
    targetN: 300,
    currentN: 265,
    keyFinding: 'Significantly higher normative conformity in rural joint-family cohorts compared to urban individualistic youth, demonstrating cultural mediation of group consensus.',
    cloneableStudyId: 'proj-003',
  },
  {
    id: 'rep-004',
    originalPaper: 'Tversky, A., & Kahneman, D. (1981). The framing of decisions and the psychology of choice.',
    landmarkEffect: 'Asian Disease Problem & Loss Aversion',
    year: 1981,
    originalSample: 'Stanford & UBC Undergraduates',
    originalCulture: 'W.E.I.R.D. (North America/Europe)',
    replicationStatus: 'replicated',
    indianSites: ['IISc Bengaluru', 'IIT Bombay', 'IIM Ahmedabad'],
    targetN: 450,
    currentN: 450,
    keyFinding: 'Loss aversion ratio is approximately 1.7x in Indian gig workers (vs. 2.1x in Western cohorts), modulated by everyday exposure to income volatility.',
    cloneableStudyId: 'proj-004',
  },
  {
    id: 'rep-005',
    originalPaper: 'Baumeister, R. F., et al. (1998). Ego depletion: Is the active self a limited resource?',
    landmarkEffect: 'Ego Depletion & Glucose/Self-Control Exhaustion',
    year: 1998,
    originalSample: 'Case Western Reserve Univ Undergraduates (N = 67)',
    originalCulture: 'W.E.I.R.D. (North America/Europe)',
    replicationStatus: 'failed',
    indianSites: ['NIMHANS', 'IIT Kanpur', 'Calicut Univ', 'JNU New Delhi'],
    targetN: 600,
    currentN: 580,
    keyFinding: 'Multi-lab consortium registered report observed no statistically significant depletion effect (d = 0.04, p = .42), replicating the global PSA null finding.',
    cloneableStudyId: 'proj-005',
  },
];

export const INITIAL_RECRUITMENT_LISTINGS: RecruitmentListing[] = [
  {
    id: 'rec-001',
    studyId: 'proj-001',
    title: 'Multilingual Cognitive Interference in Bilingual Indian Youth',
    leadInstitution: 'NIMHANS Bengaluru',
    targetDemographics: 'Bilingual adults aged 18–35 (Hindi, Tamil, or Kannada speakers)',
    compensationINR: 200,
    durationMinutes: 12,
    openSlots: 100,
    enrolledCount: 68,
    status: 'active',
    stateScope: 'Pan-India (Remote Smartphone / PC)',
  },
  {
    id: 'rec-002',
    studyId: 'proj-002',
    title: 'Decision Fatigue and Financial Risk Perception in Gig Economy Workers',
    leadInstitution: 'IIT Delhi & TISS Mumbai',
    targetDemographics: 'Full-time gig/delivery platform workers in Delhi NCR & Mumbai',
    compensationINR: 400,
    durationMinutes: 20,
    openSlots: 200,
    enrolledCount: 142,
    status: 'active',
    stateScope: 'Delhi NCR, Maharashtra',
  },
  {
    id: 'rec-003',
    studyId: 'proj-003',
    title: 'Screening Executive Function in Early Mild Cognitive Impairment',
    leadInstitution: 'SCARF Chennai',
    targetDemographics: 'Adults aged 55+ with self-reported memory complaints (Tamil speakers)',
    compensationINR: 350,
    durationMinutes: 25,
    openSlots: 80,
    enrolledCount: 45,
    status: 'active',
    stateScope: 'Tamil Nadu, Puducherry',
  },
];

const INITIAL_PROJECT: StudyProject = {
  id: 'proj-001',
  name: 'Multilingual Cognitive Interference & Linguistic Stroop in Indian Youth',
  createdAt: '2026-09-20T08:00:00.000Z',
  updatedAt: '2026-09-23T02:00:00.000Z',
  hypothesis: 'Bilingual Indian speakers (L1 Hindi/Tamil, L2 English) exhibit asymmetric cognitive control, with reduced Stroop interference in L1 relative to L2 under affective priming conditions.',
  targetSampleSize: 100,
  grantProposal: {
    id: 'grant-001',
    agencyCode: 'DST_SERB',
    title: 'Electrophysiological and Behavioral Markers of Multilingual Cognitive Control Across Urban Indian Youth',
    principalInvestigator: 'Dr. Aravindh V., Assistant Professor (Cognitive Neuroscience)',
    institution: 'Centre for Behavioural & Cognitive Sciences (CBCS) / NIMHANS',
    durationMonths: 36,
    totalBudgetINR: 4280000,
    specificAims: [
      'Quantify cross-linguistic Stroop interference across 3 language families (Indo-Aryan, Dravidian, English).',
      'Examine whether early bilingual acquisition confers resilience against cognitive interference under affective arousal.',
      'Construct India-normed RT benchmarks for open behavioural science distribution.'
    ],
    significanceIndianContext: 'India is home to over 400 living languages and the worlds largest bilingual youth demographic, yet >95% of cognitive psychology models are derived from Western monolinguals. This project provides foundational indigenous normative data.',
    methodologyOverview: 'A 3x2 mixed factorial design combining computerized millisecond reaction time assays (Stroop and Flanker) with standardized mental health batteries (PHQ-9, GAD-7) deployed on sovereign Indian infrastructure.',
    expectedOutcomes: '1 open-access norming dataset (N=500), 3 Q1 journal publications in Indian Journal of Psychiatry / Frontiers in Cognition, and an open toolkit for Indian clinical neuropsychologists.',
    budget: {
      jrfStipend: 37000,
      jrfMonths: 24,
      srfStipend: 42000,
      srfMonths: 12,
      hraPct: 24,
      equipment: 850000,
      fieldWorkTravel: 450000,
      participantHonorarium: 350000,
      contingency: 250000,
      overhead: 400000,
    },
  },
  ethicsProtocol: {
    protocolNumber: 'IEC-STX-2026-042',
    piName: 'Dr. Aravindh V.',
    institution: 'Centre for Behavioural & Cognitive Sciences (CBCS) / NIMHANS',
    studyTitle: 'Multilingual Cognitive Interference & Linguistic Stroop in Indian Youth',
    studyType: 'Cognitive Task (Minimal Risk)',
    riskLevel: 'Minimal Risk',
    vulnerablePopulations: ['University students aged 18-25'],
    dpdpConsentVerified: true,
    icmrGuidelinesYear: '2017',
    dataStorageLocation: 'Encrypted Sovereign Cloud (Mumbai Data Center) — DPDP 2023 Compliant',
    retentionYears: 5,
    participantCompensationINR: 200,
  },
  experimentConfig: {
    taskName: 'Multilingual Stroop Cognitive Interference Task',
    paradigmId: 'stroop',
    trialCount: 24,
    fixationDurationMs: 500,
    stimulusDurationMs: 2000,
    feedbackDurationMs: 300,
    languages: ['English', 'Hindi', 'Tamil'],
    includePhq9: true,
    includeGad7: true,
  },
  sessions: [],
  tree: DEFAULT_EXPERIMENT_TREE,
  tasks: DEFAULT_TASKS,
  questionnaires: DEFAULT_QUESTIONNAIRES,
  liveSessions: [],
};

interface VaultData {
  projects: StudyProject[];
  activeProjectId: string;
  activePersona: UserPersona;
  collaborationPosts: CollaborationPost[];
  recruitmentListings: RecruitmentListing[];
  preRegistrations: PreRegistrationRecord[];
}

export function useStimulxStore() {
  const [vault, setVault] = useState<VaultData>({
    projects: [INITIAL_PROJECT],
    activeProjectId: INITIAL_PROJECT.id,
    activePersona: 'phd',
    collaborationPosts: [],
    recruitmentListings: INITIAL_RECRUITMENT_LISTINGS,
    preRegistrations: [
      {
        id: 'prereg-001',
        studyId: 'proj-001',
        studyTitle: 'Multilingual Cognitive Interference & Linguistic Stroop in Indian Youth',
        hypotheses: '1. Incongruent Stroop trials will produce significantly higher RT than congruent trials. 2. Interference will be significantly smaller in L1 Hindi/Tamil than L2 English.',
        samplingPlan: 'Stopping rule: Data collection will terminate exactly upon reaching N = 100 valid participant runs.',
        dependentVars: 'Reaction time (milliseconds) on correct trials; Error rate (%)',
        independentVars: 'Stimulus congruency (Congruent vs. Incongruent), Language family (Hindi vs. English)',
        outlierCriteria: 'Trials with RT < 200ms or > 2500ms will be excluded prior to statistical aggregation.',
        analysisPlan: 'Paired-samples t-test and Linear Mixed-Effects Model with random participant intercepts.',
        timestampHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        dateRegistered: '2026-09-20T12:00:00.000Z',
        badgeAwarded: true,
      },
    ],
  });
  const [currentUser, setCurrentUser] = useState<UserAccount>(ANONYMOUS_USER);
  const [hydrated, setHydrated] = useState(false);

  const normalizeProject = (p: StudyProject): StudyProject => {
    // Merge missing default tasks so new library paradigms are available
    const existingTaskIds = new Set((p.tasks || []).map((t) => t.id));
    const mergedTasks = [
      ...(p.tasks || []),
      ...DEFAULT_TASKS.filter((t) => !existingTaskIds.has(t.id)),
    ];

    // Merge missing default questionnaires
    const existingQIds = new Set((p.questionnaires || []).map((q) => q.id));
    const mergedQuestionnaires = [
      ...(p.questionnaires || []),
      ...DEFAULT_QUESTIONNAIRES.filter((q) => !existingQIds.has(q.id)),
    ];

    return {
      ...p,
      tree: p.tree && p.tree.nodes && p.tree.nodes.length > 0 ? p.tree : DEFAULT_EXPERIMENT_TREE,
      tasks: mergedTasks.length > 0 ? mergedTasks : DEFAULT_TASKS,
      questionnaires: mergedQuestionnaires.length > 0 ? mergedQuestionnaires : DEFAULT_QUESTIONNAIRES,
      liveSessions: p.liveSessions || [],
    };
  };

  useEffect(() => {
    try {
      // 1. Restore auth state
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth) as UserAccount;
        if (parsedAuth && parsedAuth.email) {
          setCurrentUser(parsedAuth);
        }
      }

      // 2. Restore study vault
      let stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Fallback to previous versions for seamless user migration
        stored = localStorage.getItem('stimulx_vault_v2') || localStorage.getItem('stimulx_vault_v1');
      }
      if (stored) {
        const parsed = JSON.parse(stored) as VaultData;
        if (parsed.projects && parsed.projects.length > 0) {
          const migratedVault: VaultData = {
            ...parsed,
            projects: parsed.projects.map(normalizeProject),
          };
          setVault(migratedVault);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedVault));
        }
      }
    } catch (e) {
      console.warn('Stimulx vault/auth load warning:', e);
    }
    setHydrated(true);
  }, []);

  const persistAuthUser = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      if (user.isAuthenticated) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Stimulx auth persist warning:', e);
    }
  };

  const login = (
    email: string,
    name?: string,
    institution?: string,
    role?: UserPersona
  ): UserAccount => {
    const trimmedEmail = email.trim().toLowerCase();
    const demoMatch = DEMO_ACCOUNTS.find(
      (d) => d.email.toLowerCase() === trimmedEmail
    );
    const userRole: UserPersona = role || demoMatch?.role || 'phd';
    const userName: string =
      name ||
      demoMatch?.name ||
      trimmedEmail
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    const userInst: string =
      institution || demoMatch?.institution || 'Indian Academic Consortium';

    const user: UserAccount = {
      id: demoMatch?.id || `user_${Date.now()}`,
      email: trimmedEmail,
      name: userName,
      institution: userInst,
      role: userRole,
      isAuthenticated: true,
      createdAt: demoMatch?.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    persistAuthUser(user);
    setActivePersona(userRole);
    return user;
  };

  const loginAsDemo = (demoAccount: UserAccount): UserAccount => {
    const user: UserAccount = {
      ...demoAccount,
      isAuthenticated: true,
      lastLogin: new Date().toISOString(),
    };
    persistAuthUser(user);
    setActivePersona(user.role);
    return user;
  };

  const signup = (details: {
    name: string;
    email: string;
    institution: string;
    role: UserPersona;
  }): UserAccount => {
    const user: UserAccount = {
      id: `user_${Date.now()}`,
      email: details.email.trim().toLowerCase(),
      name: details.name.trim(),
      institution: details.institution.trim() || 'Independent Researcher',
      role: details.role,
      isAuthenticated: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    persistAuthUser(user);
    setActivePersona(user.role);
    return user;
  };

  const logout = () => {
    persistAuthUser(ANONYMOUS_USER);
  };

  const persistVault = (newVault: VaultData) => {
    setVault(newVault);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVault));
    } catch (e) {
      console.warn('Stimulx vault persist warning:', e);
    }
  };

  const activeProject =
    vault.projects.find((p) => p.id === vault.activeProjectId) || vault.projects[0];

  const setActivePersona = (persona: UserPersona) => {
    persistVault({ ...vault, activePersona: persona });
  };

  const setActiveProject = (projectId: string) => {
    persistVault({ ...vault, activeProjectId: projectId });
  };

  const createProject = (name: string, hypothesis: string, paradigmId: string = 'stroop') => {
    const newProj: StudyProject = {
      ...INITIAL_PROJECT,
      id: `proj-${Date.now()}`,
      name,
      hypothesis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      experimentConfig: {
        ...INITIAL_PROJECT.experimentConfig,
        paradigmId,
      },
      sessions: [],
    };
    persistVault({
      ...vault,
      projects: [...vault.projects, newProj],
      activeProjectId: newProj.id,
    });
    return newProj;
  };

  const updateActiveProject = (updater: (prev: StudyProject) => StudyProject) => {
    const updated = updater(activeProject);
    const newProjects = vault.projects.map((p) => (p.id === activeProject.id ? updated : p));
    persistVault({ ...vault, projects: newProjects });
  };

  const addParticipantSession = (session: ParticipantSession) => {
    updateActiveProject((prev) => ({
      ...prev,
      sessions: [session, ...prev.sessions],
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteParticipantSession = (sessionId: string) => {
    updateActiveProject((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== sessionId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const simulateParticipants = (count: number = 10) => {
    const indianStates = [
      'Karnataka (Bengaluru)',
      'Delhi NCR',
      'Tamil Nadu (Chennai)',
      'Maharashtra (Mumbai)',
      'Kerala (Kochi)',
      'Telangana (Hyderabad)',
      'West Bengal (Kolkata)',
      'Gujarat (Ahmedabad)',
      'Uttar Pradesh (Lucknow)',
      'Punjab (Chandigarh)',
    ];
    const ageGroups = ['18-24', '25-34', '35-44'];
    const languages = ['Hindi / English', 'Tamil / English', 'Kannada / English', 'Telugu / English', 'Bengali / English'];

    const newSessions: ParticipantSession[] = [];

    for (let i = 0; i < count; i++) {
      const state = indianStates[Math.floor(Math.random() * indianStates.length)];
      const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];
      const lang = languages[Math.floor(Math.random() * languages.length)];
      const device: 'desktop' | 'mobile' = Math.random() > 0.4 ? 'desktop' : 'mobile';

      const baseCongruent = 560 + Math.random() * 80;
      const interference = 95 + Math.random() * 50;
      const baseIncongruent = baseCongruent + interference;

      const phq = Math.floor(Math.random() * 12);
      const gad = Math.floor(Math.random() * 10);

      const sess: ParticipantSession = {
        id: `STX-${Date.now().toString().slice(-4)}-${i + 1}`,
        studyId: activeProject.id,
        startedAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
        completedAt: new Date(Date.now() - (i + 1) * 3600000 + 420000).toISOString(),
        demographics: {
          ageGroup,
          state,
          primaryLanguage: lang,
          device,
        },
        consentGiven: true,
        clinicalScores: {
          phq9: phq,
          phq9Severity: phq < 5 ? 'Minimal' : phq < 10 ? 'Mild' : 'Moderate',
          gad7: gad,
          gad7Severity: gad < 5 ? 'Minimal' : gad < 10 ? 'Mild' : 'Moderate',
        },
        summary: {
          meanCongruentRT: Number(baseCongruent.toFixed(1)),
          meanIncongruentRT: Number(baseIncongruent.toFixed(1)),
          stroopInterference: Number(interference.toFixed(1)),
          accuracyPct: Number((91 + Math.random() * 8).toFixed(1)),
          totalTrials: 24,
        },
        trials: [
          { trialIndex: 1, word: 'RED', color: '#dc2626', colorName: 'red', congruent: true, response: 'red', correct: true, rtMs: baseCongruent - 20 },
          { trialIndex: 2, word: 'GREEN', color: '#2563eb', colorName: 'blue', congruent: false, response: 'blue', correct: true, rtMs: baseIncongruent + 15 },
          { trialIndex: 3, word: 'BLUE', color: '#2563eb', colorName: 'blue', congruent: true, response: 'blue', correct: true, rtMs: baseCongruent + 10 },
          { trialIndex: 4, word: 'YELLOW', color: '#dc2626', colorName: 'red', congruent: false, response: 'red', correct: true, rtMs: baseIncongruent - 10 },
        ],
      };
      newSessions.push(sess);
    }

    updateActiveProject((prev) => ({
      ...prev,
      sessions: [...newSessions, ...prev.sessions],
      updatedAt: new Date().toISOString(),
    }));
  };

  const addCollaborationPost = (post: Omit<CollaborationPost, 'id' | 'createdAt'>) => {
    const newPost: CollaborationPost = {
      ...post,
      id: `collab-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    persistVault({
      ...vault,
      collaborationPosts: [newPost, ...vault.collaborationPosts],
    });
  };

  const addRecruitmentListing = (listing: Omit<RecruitmentListing, 'id' | 'enrolledCount' | 'status'>) => {
    const newRec: RecruitmentListing = {
      ...listing,
      id: `rec-${Date.now()}`,
      enrolledCount: 0,
      status: 'active',
    };
    persistVault({
      ...vault,
      recruitmentListings: [newRec, ...vault.recruitmentListings],
    });
  };

  const addPreRegistration = (record: Omit<PreRegistrationRecord, 'id' | 'dateRegistered' | 'badgeAwarded'>) => {
    const newPrereg: PreRegistrationRecord = {
      ...record,
      id: `prereg-${Date.now()}`,
      dateRegistered: new Date().toISOString(),
      badgeAwarded: true,
    };
    persistVault({
      ...vault,
      preRegistrations: [newPrereg, ...vault.preRegistrations],
    });
    return newPrereg;
  };

  const cloneReplicationStudy = (replicationId: string) => {
    const rep = REPLICATION_STUDIES.find((r) => r.id === replicationId);
    if (!rep) return null;

    const clonedProj: StudyProject = {
      ...INITIAL_PROJECT,
      id: `proj-rep-${Date.now()}`,
      name: `Replication: ${rep.landmarkEffect} (Indian Cohort)`,
      hypothesis: `Testing the cross-cultural validity of ${rep.landmarkEffect} (${rep.originalPaper}) across Indian demographic cohorts.`,
      targetSampleSize: rep.targetN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ethicsProtocol: {
        ...INITIAL_PROJECT.ethicsProtocol,
        protocolNumber: `IEC-REP-${Date.now().toString().slice(-4)}`,
        studyTitle: `Multi-Site Replication of ${rep.landmarkEffect} under ICMR Guidelines`,
      },
      sessions: [],
    };

    persistVault({
      ...vault,
      projects: [...vault.projects, clonedProj],
      activeProjectId: clonedProj.id,
    });

    return clonedProj;
  };

  const updateExperimentTree = (tree: ExperimentTree) => {
    updateActiveProject((prev) => ({
      ...prev,
      tree,
      updatedAt: new Date().toISOString(),
    }));
  };

  const saveTask = (task: TaskDefinition) => {
    updateActiveProject((prev) => {
      const existing = prev.tasks || [];
      const index = existing.findIndex((t) => t.id === task.id);
      const updated =
        index >= 0
          ? existing.map((t) => (t.id === task.id ? task : t))
          : [...existing, task];
      return {
        ...prev,
        tasks: updated,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const deleteTask = (taskId: string) => {
    updateActiveProject((prev) => ({
      ...prev,
      tasks: (prev.tasks || []).filter((t) => t.id !== taskId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const saveQuestionnaire = (questionnaire: QuestionnaireDefinition) => {
    updateActiveProject((prev) => {
      const existing = prev.questionnaires || [];
      const index = existing.findIndex((q) => q.id === questionnaire.id);
      const updated =
        index >= 0
          ? existing.map((q) => (q.id === questionnaire.id ? questionnaire : q))
          : [...existing, questionnaire];
      return {
        ...prev,
        questionnaires: updated,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const deleteQuestionnaire = (questionnaireId: string) => {
    updateActiveProject((prev) => ({
      ...prev,
      questionnaires: (prev.questionnaires || []).filter((q) => q.id !== questionnaireId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const createLiveSession = (
    studyId: string,
    demographics: {
      age?: string;
      gender?: string;
      state?: string;
      device?: 'desktop' | 'mobile';
      primaryLanguage?: string;
    } = {}
  ): LiveParticipantSession => {
    const startNode = activeProject.tree?.nodes.find((n) => n.type === 'start');
    const firstNodeId = startNode?.next || activeProject.tree?.nodes[0]?.id || 'node_start';
    const newSession: LiveParticipantSession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studyId,
      participantToken: `PT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      currentNodeId: firstNodeId,
      visitedNodeIds: [firstNodeId],
      demographics,
      rawTrialLogs: [],
      questionnaireLogs: [],
    };

    updateActiveProject((prev) => ({
      ...prev,
      liveSessions: [newSession, ...(prev.liveSessions || [])],
      updatedAt: new Date().toISOString(),
    }));

    return newSession;
  };

  const recordLiveTrialLog = (sessionId: string, log: GorillaRawTrialLog) => {
    updateActiveProject((prev) => {
      const sessions = (prev.liveSessions || []).map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          rawTrialLogs: [...s.rawTrialLogs, log],
        };
      });
      return { ...prev, liveSessions: sessions };
    });
  };

  const recordLiveQuestionnaireResponse = (
    sessionId: string,
    log: QuestionnaireResponseLog
  ) => {
    updateActiveProject((prev) => {
      const sessions = (prev.liveSessions || []).map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          questionnaireLogs: [...s.questionnaireLogs, log],
        };
      });
      return { ...prev, liveSessions: sessions };
    });
  };

  const completeLiveSession = (
    sessionId: string,
    overallScores?: Record<string, number>
  ) => {
    updateActiveProject((prev) => {
      const sessions = (prev.liveSessions || []).map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
          overallScores: overallScores || s.overallScores,
        };
      });
      return { ...prev, liveSessions: sessions, updatedAt: new Date().toISOString() };
    });
  };

  const deleteLiveSession = (sessionId: string) => {
    updateActiveProject((prev) => ({
      ...prev,
      liveSessions: (prev.liveSessions || []).filter((s) => s.id !== sessionId),
      updatedAt: new Date().toISOString(),
    }));
  };

  return {
    hydrated,
    projects: vault.projects,
    activeProject,
    activePersona: vault.activePersona,
    collaborationPosts: vault.collaborationPosts,
    recruitmentListings: vault.recruitmentListings,
    preRegistrations: vault.preRegistrations,
    paradigms: COGNITIVE_PARADIGMS,
    scales: SCALE_CATALOG,
    replicationStudies: REPLICATION_STUDIES,
    setActivePersona,
    setActiveProject,
    createProject,
    updateActiveProject,
    addParticipantSession,
    deleteParticipantSession,
    simulateParticipants,
    addCollaborationPost,
    addRecruitmentListing,
    addPreRegistration,
    cloneReplicationStudy,
    // Auth State & Actions
    currentUser,
    demoAccounts: DEMO_ACCOUNTS,
    login,
    loginAsDemo,
    signup,
    logout,
    // Gorilla.sc Engine Methods
    updateExperimentTree,
    saveTask,
    deleteTask,
    saveQuestionnaire,
    deleteQuestionnaire,
    createLiveSession,
    recordLiveTrialLog,
    recordLiveQuestionnaireResponse,
    completeLiveSession,
    deleteLiveSession,
  };
}
