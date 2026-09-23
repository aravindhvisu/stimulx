'use client';

import { useState, useEffect } from 'react';
import {
  StudyProject,
  ParticipantSession,
  CollaborationPost,
  GrantProposal,
  EthicsProtocolData,
  ExperimentConfigData,
} from '@/types';

const STORAGE_KEY = 'stimulx_vault_v1';

// Seed initial realistic participants across India
const INITIAL_SESSIONS: ParticipantSession[] = [
  {
    id: 'STX-KA-001',
    studyId: 'proj-001',
    startedAt: '2026-09-21T10:14:22.000Z',
    completedAt: '2026-09-21T10:21:05.000Z',
    demographics: { ageGroup: '18-24', state: 'Karnataka (NIMHANS cohort)', primaryLanguage: 'Kannada / English', device: 'desktop' },
    consentGiven: true,
    clinicalScores: { phq9: 4, phq9Severity: 'Minimal', gad7: 3, gad7Severity: 'Minimal' },
    summary: { meanCongruentRT: 592.4, meanIncongruentRT: 714.2, stroopInterference: 121.8, accuracyPct: 95.8, totalTrials: 24 },
    trials: [
      { trialIndex: 1, word: 'RED', color: '#dc2626', colorName: 'red', congruent: true, response: 'red', correct: true, rtMs: 580.1 },
      { trialIndex: 2, word: 'BLUE', color: '#16a34a', colorName: 'green', congruent: false, response: 'green', correct: true, rtMs: 730.4 },
      { trialIndex: 3, word: 'GREEN', color: '#16a34a', colorName: 'green', congruent: true, response: 'green', correct: true, rtMs: 605.2 },
      { trialIndex: 4, word: 'YELLOW', color: '#dc2626', colorName: 'red', congruent: false, response: 'red', correct: true, rtMs: 698.0 },
    ],
  },
  {
    id: 'STX-DL-002',
    studyId: 'proj-001',
    startedAt: '2026-09-21T11:02:10.000Z',
    completedAt: '2026-09-21T11:09:44.000Z',
    demographics: { ageGroup: '25-34', state: 'Delhi (IIT-D cohort)', primaryLanguage: 'Hindi / English', device: 'desktop' },
    consentGiven: true,
    clinicalScores: { phq9: 7, phq9Severity: 'Mild', gad7: 6, gad7Severity: 'Mild' },
    summary: { meanCongruentRT: 624.1, meanIncongruentRT: 758.3, stroopInterference: 134.2, accuracyPct: 91.7, totalTrials: 24 },
    trials: [
      { trialIndex: 1, word: 'लाल', color: '#dc2626', colorName: 'red', congruent: true, response: 'red', correct: true, rtMs: 610.5 },
      { trialIndex: 2, word: 'हरा', color: '#2563eb', colorName: 'blue', congruent: false, response: 'blue', correct: true, rtMs: 780.2 },
      { trialIndex: 3, word: 'नीला', color: '#2563eb', colorName: 'blue', congruent: true, response: 'blue', correct: true, rtMs: 638.0 },
      { trialIndex: 4, word: 'पीला', color: '#16a34a', colorName: 'green', congruent: false, response: 'green', correct: true, rtMs: 736.4 },
    ],
  },
  {
    id: 'STX-TN-003',
    studyId: 'proj-001',
    startedAt: '2026-09-21T14:30:00.000Z',
    completedAt: '2026-09-21T14:37:18.000Z',
    demographics: { ageGroup: '18-24', state: 'Tamil Nadu (IIT-M cohort)', primaryLanguage: 'Tamil / English', device: 'mobile' },
    consentGiven: true,
    clinicalScores: { phq9: 2, phq9Severity: 'Minimal', gad7: 2, gad7Severity: 'Minimal' },
    summary: { meanCongruentRT: 608.0, meanIncongruentRT: 726.5, stroopInterference: 118.5, accuracyPct: 100.0, totalTrials: 24 },
    trials: [
      { trialIndex: 1, word: 'சிவப்பு', color: '#dc2626', colorName: 'red', congruent: true, response: 'red', correct: true, rtMs: 595.0 },
      { trialIndex: 2, word: 'பச்சை', color: '#dc2626', colorName: 'red', congruent: false, response: 'red', correct: true, rtMs: 718.0 },
      { trialIndex: 3, word: 'நீலம்', color: '#2563eb', colorName: 'blue', congruent: true, response: 'blue', correct: true, rtMs: 621.0 },
      { trialIndex: 4, word: 'மஞ்சள்', color: '#ca8a04', colorName: 'yellow', congruent: true, response: 'yellow', correct: true, rtMs: 608.0 },
    ],
  },
  {
    id: 'STX-MH-004',
    studyId: 'proj-001',
    startedAt: '2026-09-22T09:12:15.000Z',
    completedAt: '2026-09-22T09:19:02.000Z',
    demographics: { ageGroup: '25-34', state: 'Maharashtra (TISS Mumbai)', primaryLanguage: 'Marathi / English', device: 'desktop' },
    consentGiven: true,
    clinicalScores: { phq9: 5, phq9Severity: 'Mild', gad7: 4, gad7Severity: 'Minimal' },
    summary: { meanCongruentRT: 631.5, meanIncongruentRT: 742.0, stroopInterference: 110.5, accuracyPct: 95.8, totalTrials: 24 },
    trials: [
      { trialIndex: 1, word: 'BLUE', color: '#2563eb', colorName: 'blue', congruent: true, response: 'blue', correct: true, rtMs: 620.0 },
      { trialIndex: 2, word: 'RED', color: '#ca8a04', colorName: 'yellow', congruent: false, response: 'yellow', correct: true, rtMs: 755.0 },
    ],
  },
  {
    id: 'STX-KL-005',
    studyId: 'proj-001',
    startedAt: '2026-09-22T11:45:20.000Z',
    completedAt: '2026-09-22T11:52:11.000Z',
    demographics: { ageGroup: '18-24', state: 'Kerala (Calicut Univ)', primaryLanguage: 'Malayalam / English', device: 'mobile' },
    consentGiven: true,
    clinicalScores: { phq9: 8, phq9Severity: 'Mild', gad7: 5, gad7Severity: 'Mild' },
    summary: { meanCongruentRT: 585.2, meanIncongruentRT: 699.4, stroopInterference: 114.2, accuracyPct: 95.8, totalTrials: 24 },
    trials: [
      { trialIndex: 1, word: 'GREEN', color: '#16a34a', colorName: 'green', congruent: true, response: 'green', correct: true, rtMs: 575.0 },
      { trialIndex: 2, word: 'YELLOW', color: '#dc2626', colorName: 'red', congruent: false, response: 'red', correct: true, rtMs: 710.0 },
    ],
  },
  {
    id: 'STX-WB-006',
    studyId: 'proj-001',
    startedAt: '2026-09-22T13:20:10.000Z',
    completedAt: '2026-09-22T13:27:00.000Z',
    demographics: { ageGroup: '35-44', state: 'West Bengal (Presidency Univ)', primaryLanguage: 'Bengali / English', device: 'desktop' },
    consentGiven: true,
    clinicalScores: { phq9: 3, phq9Severity: 'Minimal', gad7: 2, gad7Severity: 'Minimal' },
    summary: { meanCongruentRT: 642.0, meanIncongruentRT: 775.5, stroopInterference: 133.5, accuracyPct: 91.7, totalTrials: 24 },
    trials: [
      { trialIndex: 1, word: 'RED', color: '#dc2626', colorName: 'red', congruent: true, response: 'red', correct: true, rtMs: 635.0 },
      { trialIndex: 2, word: 'BLUE', color: '#16a34a', colorName: 'green', congruent: false, response: 'green', correct: true, rtMs: 790.0 },
    ],
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
    trialCount: 24,
    fixationDurationMs: 500,
    stimulusDurationMs: 2000,
    feedbackDurationMs: 300,
    languages: ['English', 'Hindi', 'Tamil'],
    includePhq9: true,
    includeGad7: true,
  },
  sessions: INITIAL_SESSIONS,
};

const INITIAL_COLLAB_POSTS: CollaborationPost[] = [
  {
    id: 'collab-001',
    author: 'Dr. Priya Sundaram',
    institution: 'NIMHANS, Bengaluru',
    title: 'Seeking Co-PI for Multicentric Digital Cognitive Assessment in Rural Karnataka',
    domain: 'Neuropsychiatry & Public Health',
    description: 'We are applying for an ICSSR Major Research Grant to validate smartphone-based cognitive screening for early MCI in primary health centers. Looking for a collaborator with psychometrics & Kannada translation expertise.',
    requiredSkills: ['Psychometrics', 'Kannada Validation', 'Field Logistics'],
    grantAgency: 'ICSSR Major Grant (₹30 Lakhs)',
    city: 'Bengaluru',
    state: 'Karnataka',
    contactEmail: 'priya.s@nimhans.ac.in',
    createdAt: '2026-09-21T06:00:00.000Z',
  },
  {
    id: 'collab-002',
    author: 'Prof. Rajesh K. Verma',
    institution: 'IIT Delhi (Dept of Humanities & Social Sciences)',
    title: 'Co-Investigator Needed: Affective Priming & Behavioral Economics Experiment',
    domain: 'Behavioral Economics',
    description: 'DST-SERB CRG submission on decision fatigue among informal sector gig workers. We need a behavioral scientist to lead the experimental Stroop/IAT task design and reaction time modeling.',
    requiredSkills: ['jsPsych / PsychoPy', 'Linear Mixed Models', 'Experimental Design'],
    grantAgency: 'DST-SERB CRG (₹45 Lakhs)',
    city: 'New Delhi',
    state: 'Delhi',
    contactEmail: 'rverma@hss.iitd.ac.in',
    createdAt: '2026-09-22T08:30:00.000Z',
  },
  {
    id: 'collab-003',
    author: 'Dr. Ananya Sen',
    institution: 'TISS Mumbai',
    title: 'Community Mental Health Screening in Slum Communities (DPDP & ICMR compliant)',
    domain: 'Clinical Psychology',
    description: 'Looking for a quantitative co-author to analyze PHQ-9 & GAD-7 normative distribution across 800 community respondents. Open to joint ICMR Ad-hoc proposal submission.',
    requiredSkills: ['SPSS / R', 'Epidemiological Survey', 'ICMR Ethics'],
    grantAgency: 'ICMR Ad-hoc (₹25 Lakhs)',
    city: 'Mumbai',
    state: 'Maharashtra',
    contactEmail: 'ananya.sen@tiss.edu',
    createdAt: '2026-09-22T14:15:00.000Z',
  },
];

interface VaultData {
  projects: StudyProject[];
  activeProjectId: string;
  collaborationPosts: CollaborationPost[];
}

export function useStimulxStore() {
  const [vault, setVault] = useState<VaultData>({
    projects: [INITIAL_PROJECT],
    activeProjectId: INITIAL_PROJECT.id,
    collaborationPosts: INITIAL_COLLAB_POSTS,
  });
  const [hydrated, setHydrated] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as VaultData;
        if (parsed.projects && parsed.projects.length > 0) {
          setVault(parsed);
        }
      }
    } catch (e) {
      console.warn('Stimulx vault load warning:', e);
    }
    setHydrated(true);
  }, []);

  // Save to LocalStorage on mutation
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

  const setActiveProject = (projectId: string) => {
    persistVault({ ...vault, activeProjectId: projectId });
  };

  const createProject = (name: string, hypothesis: string) => {
    const newProj: StudyProject = {
      ...INITIAL_PROJECT,
      id: `proj-${Date.now()}`,
      name,
      hypothesis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

      // Realistic Gaussian-like RT generation
      const baseCongruent = 560 + Math.random() * 80;
      const interference = 95 + Math.random() * 50; // ~95-145ms Stroop effect
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

  const resetToDefaults = () => {
    persistVault({
      projects: [INITIAL_PROJECT],
      activeProjectId: INITIAL_PROJECT.id,
      collaborationPosts: INITIAL_COLLAB_POSTS,
    });
  };

  return {
    hydrated,
    projects: vault.projects,
    activeProject,
    collaborationPosts: vault.collaborationPosts,
    setActiveProject,
    createProject,
    updateActiveProject,
    addParticipantSession,
    deleteParticipantSession,
    simulateParticipants,
    addCollaborationPost,
    resetToDefaults,
  };
}
