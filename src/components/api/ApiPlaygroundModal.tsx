'use client';

import React, { useState } from 'react';
import { useStimulxStore } from '@/lib/store';
import { generateTidyCSV, generateRScript, generateSPSSSyntax, downloadFile } from '@/lib/exportUtils';
import {
  Code,
  Terminal,
  Play,
  Copy,
  Check,
  X,
  FileCode,
  Database,
  ArrowRight,
  Upload,
} from 'lucide-react';

interface ApiPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export function ApiPlaygroundModal({ isOpen, onClose, onToast }: ApiPlaygroundModalProps) {
  const { activeProject, addParticipantSession } = useStimulxStore();
  const [activeLang, setActiveLang] = useState<'curl' | 'python' | 'r'>('curl');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('get_data');
  const [copiedCode, setCopiedCode] = useState(false);
  const [testOutput, setTestOutput] = useState<string>('');

  if (!isOpen) return null;

  const endpointUrl = `https://stimulx.in/api/v1/studies/${activeProject.id}`;

  const codeSnippets: Record<string, Record<'curl' | 'python' | 'r', string>> = {
    get_data: {
      curl: `curl -X GET "${endpointUrl}/data?format=tidy_csv" \\
  -H "Authorization: Bearer stx_live_sk_${activeProject.id.slice(-6)}" \\
  -H "Accept: text/csv"`,
      python: `import requests
import pandas as pd
import io

url = "${endpointUrl}/data?format=tidy_csv"
headers = {"Authorization": "Bearer stx_live_sk_${activeProject.id.slice(-6)}"}

response = requests.get(url, headers=headers)
df = pd.read_csv(io.StringIO(response.text))
print("Loaded Stimulx Dataset:", df.shape)
print(df.groupby('congruency')['rt_ms'].mean())`,
      r: `library(httr2)
library(tidyverse)

req <- request("${endpointUrl}/data?format=tidy_csv") |>
  req_headers(Authorization = "Bearer stx_live_sk_${activeProject.id.slice(-6)}")

resp <- req_perform(req)
df <- resp_body_string(resp) |> read_csv()

# Run linear mixed model
library(lme4)
model <- lmer(rt_ms ~ congruency + (1 | participant_id), data = df)
summary(model)`,
    },
    post_session: {
      curl: `curl -X POST "${endpointUrl}/sessions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer stx_live_sk_${activeProject.id.slice(-6)}" \\
  -d '{
    "participantId": "SUBJ-KA-108",
    "demographics": {"ageGroup": "18-24", "state": "Karnataka", "device": "desktop"},
    "trials": [
      {"trialIndex": 1, "word": "RED", "colorName": "red", "congruent": true, "correct": true, "rtMs": 582.4}
    ]
  }'`,
      python: `import requests

payload = {
    "participantId": "SUBJ-DL-109",
    "demographics": {"ageGroup": "25-34", "state": "Delhi", "device": "desktop"},
    "trials": [
        {"trialIndex": 1, "word": "लाल", "colorName": "red", "congruent": True, "correct": True, "rtMs": 612.0}
    ]
}

res = requests.post(
    "${endpointUrl}/sessions",
    json=payload,
    headers={"Authorization": "Bearer stx_live_sk_${activeProject.id.slice(-6)}"}
)
print("Ingestion Status:", res.status_code, res.json())`,
      r: `library(httr2)

body <- list(
  participantId = "SUBJ-TN-110",
  demographics = list(ageGroup = "18-24", state = "Tamil Nadu", device = "mobile"),
  trials = list(
    list(trialIndex = 1, word = "சிவப்பு", colorName = "red", congruent = TRUE, correct = TRUE, rtMs = 598.0)
  )
)

req <- request("${endpointUrl}/sessions") |>
  req_headers(Authorization = "Bearer stx_live_sk_${activeProject.id.slice(-6)}") |>
  req_body_json(body)

resp <- req_perform(req)
print(resp_body_json(resp))`,
    },
  };

  const handleCopy = () => {
    const code = codeSnippets[selectedEndpoint][activeLang];
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    onToast('Code snippet copied to clipboard! ✓');
  };

  const handleTestCall = () => {
    if (selectedEndpoint === 'get_data') {
      const csvData = generateTidyCSV(activeProject.sessions);
      setTestOutput(`HTTP/2 200 OK\ncontent-type: text/csv; charset=utf-8\nx-stimulx-study-id: ${activeProject.id}\nx-records-count: ${activeProject.sessions.length}\n\n${csvData.slice(0, 800)}...\n\n[Displaying first 800 bytes of ${activeProject.sessions.length} recorded participants]`);
    } else {
      setTestOutput(`HTTP/2 201 Created\ncontent-type: application/json\n\n{\n  "status": "success",\n  "message": "Session ingested into sovereign vault",\n  "studyId": "${activeProject.id}",\n  "recordedTrials": 24,\n  "timestamp": "${new Date().toISOString()}"\n}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#e2ded6]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2ded6] flex items-center justify-between bg-[#faf9f6]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e8852b]">
                Developer Telemetry
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1a1633] text-white">
                REST & Webhook API
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1a1633] mt-0.5">
              Open Science API Explorer & Real-Time Data Pipeline
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-800 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f5f3ef]">
          {/* Endpoint Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => {
                setSelectedEndpoint('get_data');
                setTestOutput('');
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedEndpoint === 'get_data'
                  ? 'bg-white border-[#e8852b] shadow-sm ring-2 ring-[#e8852b]/10'
                  : 'bg-white/80 border-[#e2ded6] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                  GET
                </span>
                <span className="text-xs font-bold font-mono text-[#1a1633]">/studies/{'{id}'}/data</span>
              </div>
              <p className="text-[11px] text-[#6e6a82]">
                Export tidy trial-by-trial millisecond reaction times in CSV/JSON directly to R or pandas.
              </p>
            </div>

            <div
              onClick={() => {
                setSelectedEndpoint('post_session');
                setTestOutput('');
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedEndpoint === 'post_session'
                  ? 'bg-white border-[#7C3AED] shadow-sm ring-2 ring-[#7C3AED]/10'
                  : 'bg-white/80 border-[#e2ded6] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                  POST
                </span>
                <span className="text-xs font-bold font-mono text-[#1a1633]">/studies/{'{id}'}/sessions</span>
              </div>
              <p className="text-[11px] text-[#6e6a82]">
                Ingest session data from external laboratory hardware, experimental engines, and survey tools.
              </p>
            </div>
          </div>

          {/* Code Viewer Card */}
          <div className="bg-[#1b1738] rounded-2xl p-5 text-white shadow-xl space-y-3 border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                {(['curl', 'python', 'r'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                      activeLang === lang
                        ? 'bg-[#7C3AED] text-white shadow-sm'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-[#4ade80]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={handleTestCall}
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-[#4ade80] hover:bg-[#22c55e] text-[#0f0c20] text-xs font-bold transition-all shadow-sm"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute Test Request</span>
                </button>
              </div>
            </div>

            <pre className="text-xs font-mono text-[#f9a94e] p-3 bg-black/40 rounded-xl overflow-x-auto leading-relaxed border border-white/5">
              <code>{codeSnippets[selectedEndpoint][activeLang]}</code>
            </pre>
          </div>

          {/* Test Response Console */}
          {testOutput && (
            <div className="bg-white rounded-2xl border border-[#e2ded6] p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1a1633]">
                <Terminal className="w-4 h-4 text-[#16a34a]" />
                <span>Live Server Telemetry Response</span>
              </div>
              <pre className="text-[11px] font-mono p-3 bg-[#faf9f6] border border-[#e8e4dc] rounded-xl overflow-x-auto text-[#2d2942] leading-relaxed max-h-48 overflow-y-auto">
                {testOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
