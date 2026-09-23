import { ParticipantSession, StudyProject, GrantProposal, EthicsProtocolData } from '@/types';

/**
 * Universal file trigger for in-browser downloads
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain;charset=utf-8') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates tidy-format tabular CSV from participant trial sessions
 */
export function generateTidyCSV(sessions: ParticipantSession[]): string {
  const headers = [
    'participant_id',
    'timestamp',
    'device',
    'age_group',
    'state',
    'language',
    'phq9_score',
    'phq9_severity',
    'gad7_score',
    'gad7_severity',
    'trial_index',
    'word',
    'font_color',
    'congruency',
    'response',
    'correct',
    'rt_ms',
  ];

  const rows: string[] = [headers.join(',')];

  sessions.forEach((session) => {
    session.trials.forEach((trial) => {
      const row = [
        `"${session.id}"`,
        `"${session.completedAt}"`,
        `"${session.demographics.device}"`,
        `"${session.demographics.ageGroup}"`,
        `"${session.demographics.state}"`,
        `"${session.demographics.primaryLanguage}"`,
        session.clinicalScores?.phq9 ?? 'NA',
        `"${session.clinicalScores?.phq9Severity ?? 'NA'}"`,
        session.clinicalScores?.gad7 ?? 'NA',
        `"${session.clinicalScores?.gad7Severity ?? 'NA'}"`,
        trial.trialIndex,
        `"${trial.word}"`,
        `"${trial.colorName}"`,
        trial.congruent ? 'Congruent' : 'Incongruent',
        `"${trial.response}"`,
        trial.correct ? 1 : 0,
        trial.rtMs.toFixed(1),
      ];
      rows.push(row.join(','));
    });
  });

  return rows.join('\n');
}

/**
 * Generates an end-to-end reproducible R analysis script
 */
export function generateRScript(projectName: string, csvFilename: string = 'stimulx_dataset.csv'): string {
  return `# ==============================================================================
# Stimulx (stimulx.in) — Open Indian Behavioural Science Platform
# Study: ${projectName}
# Generated: ${new Date().toISOString()}
# License: CC-BY 4.0 Open Science Framework
# ==============================================================================

# 1. Install & Load Required Packages
required_pkgs <- c("tidyverse", "lme4", "lmerTest", "effectsize", "ggplot2", "ggpubr")
new_pkgs <- required_pkgs[!(required_pkgs %in% installed.packages()[, "Package"])]
if (length(new_pkgs) > 0) install.packages(new_pkgs)
lapply(required_pkgs, library, character.only = TRUE)

# 2. Import Dataset
data <- read_csv("${csvFilename}")

# 3. Data Cleaning & Trimming
# Behavioral science standard: Remove anticipations (< 200ms) and lapses (> 2500ms)
clean_data <- data %>%
  filter(correct == 1) %>%
  filter(rt_ms >= 200 & rt_ms <= 2500) %>%
  mutate(
    congruency = factor(congruency, levels = c("Congruent", "Incongruent")),
    state = as.factor(state),
    age_group = as.factor(age_group)
  )

# 4. Summary Statistics (Mean RT & Accuracy by Condition)
summary_stats <- clean_data %>%
  group_by(participant_id, congruency) %>%
  summarise(
    mean_rt = mean(rt_ms, na.rm = TRUE),
    acc = mean(correct, na.rm = TRUE),
    .groups = "drop"
  )

print("=== COHORT SUMMARY STATISTICS ===")
print(summary_stats %>% group_by(congruency) %>% summarise(
  Grand_Mean_RT = mean(mean_rt),
  SD_RT = sd(mean_rt),
  Grand_Acc = mean(acc)
))

# 5. Paired Samples t-test (Stroop Effect)
stroop_wide <- summary_stats %>%
  pivot_wider(id_cols = participant_id, names_from = congruency, values_from = mean_rt) %>%
  mutate(stroop_effect_ms = Incongruent - Congruent)

ttest_result <- t.test(stroop_wide$Incongruent, stroop_wide$Congruent, paired = TRUE)
print("=== PAIRED t-TEST RESULTS (Incongruent vs. Congruent) ===")
print(ttest_result)

# Cohen's d effect size
cohen_d <- cohens_d(stroop_wide$Incongruent, stroop_wide$Congruent, paired = TRUE)
print("=== EFFECT SIZE (Cohen's d) ===")
print(cohen_d)

# 6. Linear Mixed-Effects Model (LMM) with Random Participant Intercepts
lmm_model <- lmer(rt_ms ~ congruency + (1 | participant_id), data = clean_data)
print("=== LINEAR MIXED MODEL (LMM) ===")
print(summary(lmm_model))

# 7. APA Publication-Ready Boxplot
p <- ggplot(clean_data, aes(x = congruency, y = rt_ms, fill = congruency)) +
  geom_boxplot(alpha = 0.7, outlier.shape = 21, width = 0.4) +
  geom_jitter(width = 0.15, alpha = 0.25, size = 1.2) +
  scale_fill_manual(values = c("Congruent" = "#16a34a", "Incongruent" = "#dc2626")) +
  theme_classic(base_size = 14) +
  labs(
    title = "Multilingual Stroop Cognitive Interference (Stimulx.in)",
    subtitle = paste0("N = ", length(unique(clean_data$participant_id)), " Participants across India"),
    x = "Task Condition",
    y = "Reaction Time (milliseconds)"
  ) +
  theme(legend.position = "none")

ggsave("stimulx_stroop_plot.png", plot = p, width = 8, height = 6, dpi = 300)
print("Saved APA figure as 'stimulx_stroop_plot.png'")
`;
}

/**
 * Generates an IBM SPSS Syntax file (.sps)
 */
export function generateSPSSSyntax(csvFilename: string = 'stimulx_dataset.csv'): string {
  return `* ==============================================================================
* Stimulx (stimulx.in) — IBM SPSS Syntax for Repeated Measures Analysis
* ==============================================================================

GET DATA
  /TYPE=TXT
  /FILE="${csvFilename}"
  /DELCASE=LINE
  /DELIMITERS=","
  /QUALIFIER='"'
  /ARRANGEMENT=DELIMITED
  /FIRSTCASE=2
  /VARIABLES=
    participant_id A50
    timestamp A30
    device A15
    age_group A15
    state A30
    language A20
    phq9_score F3.0
    phq9_severity A25
    gad7_score F3.0
    gad7_severity A25
    trial_index F4.0
    word A20
    font_color A20
    congruency A15
    response A15
    correct F2.0
    rt_ms F6.1.
CACHE.
EXECUTE.

* Filter outlier reaction times.
SELECT IF (correct EQ 1 AND rt_ms GE 200 AND rt_ms LE 2500).
EXECUTE.

* Aggregate to participant means by condition.
DATASET DECLARE agg_rt.
AGGREGATE
  /OUTFILE='agg_rt'
  /BREAK=participant_id congruency
  /mean_rt=MEAN(rt_ms).

* Reshape to wide format for Paired T-Test.
DATASET ACTIVATE agg_rt.
CASESTOVARS
  /ID=participant_id
  /INDEX=congruency
  /GROUPBY=VARIABLE.

* Run Paired Samples T-Test.
T-TEST PAIRS=Congruent WITH Incongruent (PAIRED)
  /CRITERIA=CI(.9500)
  /MISSING=ANALYSIS.
`;
}

/**
 * Generates an official formatted Government Grant Proposal (DST-SERB / ICSSR format)
 */
export function generateGrantDocument(proposal: GrantProposal): string {
  const b = proposal.budget;
  const jrfTotal = b.jrfMonths * b.jrfStipend;
  const srfTotal = b.srfMonths * b.srfStipend;
  const hraTotal = Math.round((jrfTotal + srfTotal) * (b.hraPct / 100));
  const subtotalPersonnel = jrfTotal + srfTotal + hraTotal;
  const grandTotal = subtotalPersonnel + b.equipment + b.fieldWorkTravel + b.participantHonorarium + b.contingency + b.overhead;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${proposal.title} — Official Grant Proposal</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; color: #111; margin: 40px auto; max-width: 800px; padding: 0 20px; }
    h1 { text-align: center; font-size: 20pt; text-transform: uppercase; margin-bottom: 4px; }
    .subtitle { text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 24px; color: #333; }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 11pt; }
    .header-table td { padding: 6px 8px; border: 1px solid #777; }
    .header-table td.label { font-weight: bold; width: 32%; background-color: #f7f7f7; }
    h2 { font-size: 14pt; border-bottom: 1.5px solid #222; padding-bottom: 4px; margin-top: 24px; }
    h3 { font-size: 12pt; margin-top: 16px; }
    p, li { font-size: 11pt; text-align: justify; }
    table.budget-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; }
    table.budget-table th, table.budget-table td { border: 1px solid #333; padding: 6px 10px; }
    table.budget-table th { background-color: #f0f0f0; text-align: left; }
    .footer { font-size: 9pt; color: #777; text-align: center; margin-top: 50px; border-top: 1px solid #ccc; padding-top: 10px; }
  </style>
</head>
<body>
  <h1>GOVERNMENT OF INDIA</h1>
  <div class="subtitle">PROJECT PROPOSAL SUBMISSION FORMAT — ${proposal.agencyCode}</div>

  <table class="header-table">
    <tr><td class="label">Project Title</td><td><strong>${proposal.title}</strong></td></tr>
    <tr><td class="label">Funding Scheme</td><td>${proposal.agencyCode} Core Research Scheme</td></tr>
    <tr><td class="label">Principal Investigator (PI)</td><td>${proposal.principalInvestigator}</td></tr>
    <tr><td class="label">Host Institution</td><td>${proposal.institution}</td></tr>
    <tr><td class="label">Duration</td><td>${proposal.durationMonths} Months</td></tr>
    <tr><td class="label">Total Grant Requested</td><td><strong>₹ ${(grandTotal / 100000).toFixed(2)} Lakhs (INR ${grandTotal.toLocaleString('en-IN')})</strong></td></tr>
  </table>

  <h2>1. Specific Research Objectives & Hypotheses</h2>
  <ol>
    ${proposal.specificAims.map((aim) => `<li>${aim}</li>`).join('\n')}
  </ol>

  <h2>2. Significance in the Indian Context</h2>
  <p>${proposal.significanceIndianContext}</p>

  <h2>3. Detailed Research Methodology & Experimental Pipeline</h2>
  <p>${proposal.methodologyOverview}</p>

  <h2>4. Itemized Financial Budget (Per DST 2024 OM Norms)</h2>
  <table class="budget-table">
    <thead>
      <tr>
        <th>Budget Head</th>
        <th>Calculation Basis</th>
        <th style="text-align: right;">Amount (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Personnel: JRF (Junior Research Fellow)</strong></td>
        <td>${b.jrfMonths} person-months @ ₹${b.jrfStipend.toLocaleString('en-IN')}/month</td>
        <td style="text-align: right;">₹ ${jrfTotal.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td><strong>2. Personnel: SRF (Senior Research Fellow)</strong></td>
        <td>${b.srfMonths} person-months @ ₹${b.srfStipend.toLocaleString('en-IN')}/month</td>
        <td style="text-align: right;">₹ ${srfTotal.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td><strong>3. House Rent Allowance (HRA)</strong></td>
        <td>${b.hraPct}% of Personnel Stipend (City Classification)</td>
        <td style="text-align: right;">₹ ${hraTotal.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td><strong>4. Equipment & Computational Hardware</strong></td>
        <td>Calibrated touch tablets & reaction-time displays</td>
        <td style="text-align: right;">₹ ${b.equipment.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td><strong>5. Field Work & Multi-Centric Travel</strong></td>
        <td>Travel across research sites & participant recruitment</td>
        <td style="text-align: right;">₹ ${b.fieldWorkTravel.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td><strong>6. Participant Honorarium & Refreshments</strong></td>
        <td>Per ICMR 2017 compensation norms for participant time</td>
        <td style="text-align: right;">₹ ${b.participantHonorarium.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td><strong>7. Contingency & Consumables</strong></td>
        <td>Standard consumables, printing, secure storage licenses</td>
        <td style="text-align: right;">₹ ${b.contingency.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td><strong>8. Institutional Overhead</strong></td>
        <td>Standard institutional facilities grant (5-10%)</td>
        <td style="text-align: right;">₹ ${b.overhead.toLocaleString('en-IN')}</td>
      </tr>
      <tr style="background-color: #f7f7f7; font-weight: bold;">
        <td colspan="2">GRAND TOTAL ESTIMATED EXPENDITURE</td>
        <td style="text-align: right;">₹ ${grandTotal.toLocaleString('en-IN')}</td>
      </tr>
    </tbody>
  </table>

  <h2>5. Expected Societal & Scientific Outcomes</h2>
  <p>${proposal.expectedOutcomes}</p>

  <h2>6. Institutional Endorsement & Ethical Declarations</h2>
  <p>The undersigned Principal Investigator and Head of Institution hereby declare that the research proposal complies strictly with the <em>ICMR National Ethical Guidelines (2017)</em> and the <em>Digital Personal Data Protection (DPDP) Act 2023</em>. All data generated will be stored on sovereign Indian cloud infrastructure.</p>

  <div style="margin-top: 50px; display: flex; justify-content: space-between;">
    <div>____________________________<br>Signature of Principal Investigator</div>
    <div style="text-align: right;">____________________________<br>Registrar / Dean of Research (Seal)</div>
  </div>

  <div class="footer">
    Compiled via Stimulx.in — Open Indian Behavioural Science Research Platform • Document ID: STX-${Date.now().toString().slice(-6)}
  </div>
</body>
</html>`;
}

/**
 * Generates an official ICMR 2017 Ethics Application Package
 */
export function generateEthicsProtocolDocument(protocol: EthicsProtocolData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ICMR Ethics Application — ${protocol.protocolNumber}</title>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #111; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { text-align: center; font-size: 16pt; margin-bottom: 2px; }
    .inst { text-align: center; font-size: 12pt; font-weight: bold; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #666; padding: 6px 10px; font-size: 10pt; }
    th { background: #f0f0f0; text-align: left; }
    .sec-head { background: #1a1633; color: white; font-weight: bold; padding: 6px 10px; }
  </style>
</head>
<body>
  <h1>INSTITUTIONAL HUMAN ETHICS COMMITTEE (IEC)</h1>
  <div class="inst">APPLICATION FOR ETHICAL REVIEW OF RESEARCH ON HUMAN PARTICIPANTS<br><small>(In accordance with ICMR Guidelines 2017 & DPDP Act 2023)</small></div>

  <table>
    <tr><td colspan="2" class="sec-head">PART A: PROTOCOL IDENTIFICATION</td></tr>
    <tr><td width="35%"><strong>Protocol Number</strong></td><td>${protocol.protocolNumber}</td></tr>
    <tr><td><strong>Project Title</strong></td><td>${protocol.studyTitle}</td></tr>
    <tr><td><strong>Principal Investigator</strong></td><td>${protocol.piName}</td></tr>
    <tr><td><strong>Institution / Dept</strong></td><td>${protocol.institution}</td></tr>
    <tr><td><strong>Study Category</strong></td><td>${protocol.studyType}</td></tr>
    <tr><td><strong>Assessed Risk Category</strong></td><td><strong>${protocol.riskLevel}</strong></td></tr>

    <tr><td colspan="2" class="sec-head">PART B: VULNERABILITY & PARTICIPANT SAFEGUARDS</td></tr>
    <tr><td><strong>Vulnerable Groups</strong></td><td>${protocol.vulnerablePopulations.join(', ') || 'None identified (General adult volunteer population)'}</td></tr>
    <tr><td><strong>Participant Honorarium</strong></td><td>₹ ${protocol.participantCompensationINR} per completed session (Time/Travel compensation per ICMR norms)</td></tr>
    <tr><td><strong>Informed Consent Mode</strong></td><td>Electronic Bilingual Informed Consent (English + Regional Indian Language)</td></tr>
    <tr><td><strong>DPDP Act 2023 Compliance</strong></td><td>Verified — Explicit purpose limitation, right to withdraw, Zero-PII tokenization</td></tr>

    <tr><td colspan="2" class="sec-head">PART C: DATA STORAGE & PRIVACY PROTOCOL</td></tr>
    <tr><td><strong>Storage Infrastructure</strong></td><td>${protocol.dataStorageLocation}</td></tr>
    <tr><td><strong>Data Retention Period</strong></td><td>${protocol.retentionYears} Years (Securely archived post-publication)</td></tr>
    <tr><td><strong>Helpline & Safety Net</strong></td><td>Tele-MANAS (14416) and KIRAN (1800-599-0019) integrated in post-study debrief</td></tr>
  </table>

  <h3>Investigator Declaration</h3>
  <p style="font-size: 10pt; text-align: justify;">
    I confirm that the proposed study involves ${protocol.riskLevel.toLowerCase()} to human participants. The study procedures do not withhold essential care or induce psychological trauma. All participants retain the uninhibited right to terminate participation at any moment without penalty.
  </p>

  <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 10pt;">
    <div>Date: ${new Date().toLocaleDateString('en-IN')}<br><br>____________________________<br>Signature of Investigator</div>
    <div style="text-align: right;"><br><br>____________________________<br>Member Secretary, IEC</div>
  </div>
</body>
</html>`;
}
