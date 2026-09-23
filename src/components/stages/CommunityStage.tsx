"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  MessageCircle,
  Hammer,
  Heart,
  Users2,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Send,
  Coins,
} from "lucide-react";
import { useStimulxStore } from "@/lib/store";
import { CollaborationMatch, CollaborationPost } from "@/types";

interface CommunityStageProps {
  onToast: (msg: string) => void;
}

const COLLAB_MATCHES: CollaborationMatch[] = [
  {
    id: "collab-1",
    name: "Dr. K. Senthil Nathan",
    institution: "SCARF Chennai",
    role: "Associate Professor (Clinical Neuropsychology)",
    skills: ["Schizophrenia", "Tamil Cognitive Stimuli", "ICMR Grant Co-PI"],
    languages: ["Tamil", "English"],
    grantSeeking: "Looking for Hindi-region Co-PI for ICSSR Multilingual Stroop",
    matchScore: 98,
  },
  {
    id: "collab-2",
    name: "Dr. Ananya Roy",
    institution: "NIMHANS Bengaluru",
    role: "Assistant Professor (Cognitive Neuroscience)",
    skills: ["EEG / ERP", "Bilingualism", "DST-SERB Reviewer"],
    languages: ["Kannada", "Bengali", "English"],
    grantSeeking: "Seeking multi-site collaborators for Dravidian normative psychometrics",
    matchScore: 94,
  },
  {
    id: "collab-3",
    name: "Pooja Deshmukh (PhD)",
    institution: "TISS Mumbai",
    role: "Senior Research Fellow",
    skills: ["Qualitative IPA", "Service User Engagement", "Marathi Scales"],
    languages: ["Marathi", "Hindi", "English"],
    grantSeeking: "Looking to join ICSSR Major project on rural caregiver burden",
    matchScore: 89,
  },
];

export function CommunityStage({ onToast }: CommunityStageProps) {
  const { collaborationPosts, addCollaborationPost, activeProject } = useStimulxStore();
  const [activeTab, setActiveTab] = useState<"collab" | "learn" | "share" | "build" | "service">("collab");
  const [searchQuery, setSearchQuery] = useState("");
  const [bountyPledged, setBountyPledged] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postInstitution, setPostInstitution] = useState("NIMHANS / IIT");
  const [postDomain, setPostDomain] = useState("Cognitive Psychology");
  const [postSkills, setPostSkills] = useState("Stroop Task, R / Python, Bilingual Hindi-English");
  const [postAgency, setPostAgency] = useState("DST-SERB CRG");
  const [postDesc, setPostDesc] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    addCollaborationPost({
      author: activeProject.grantProposal?.principalInvestigator || "Dr. Researcher",
      institution: postInstitution,
      title: postTitle,
      domain: postDomain,
      description: postDesc || "Multi-centric collaboration for national behavioural science grant.",
      requiredSkills: postSkills.split(",").map((s) => s.trim()),
      grantAgency: postAgency,
      city: "Bengaluru",
      state: "Karnataka",
      contactEmail: "researcher@stimulx.in",
    });

    setShowPostModal(false);
    setPostTitle("");
    setPostDesc("");
    onToast("Collaboration call published to CollabRadar network! ✓");
  };

  const filteredCollabs = COLLAB_MATCHES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex overflow-hidden bg-[#f5f3ef]">
      {/* Left Sidebar */}
      <aside className="w-[220px] shrink-0 bg-white border-r border-[#1a1633]/10 flex flex-col overflow-y-auto">
        <div className="px-3.5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#a09ec0]">
          Community Hub
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("collab")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "collab"
              ? "bg-purple-50 border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Users2 className="w-3.5 h-3.5 shrink-0" />
          <span>Co-Investigator Matcher</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("learn")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "learn"
              ? "bg-purple-50 border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
          <span>Open Courses</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("share")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "share"
              ? "bg-purple-50 border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Discussion Forum</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("build")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "build"
              ? "bg-purple-50 border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Hammer className="w-3.5 h-3.5 shrink-0" />
          <span>Micro-Grant Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("service")}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium border-l-2 transition-all ${
            activeTab === "service"
              ? "bg-purple-50 border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-[#6b6890] hover:bg-[#f5f3ef] hover:text-[#1a1633]"
          }`}
        >
          <Heart className="w-3.5 h-3.5 shrink-0" />
          <span>Lived Experience Circle</span>
        </button>
      </aside>

      {/* Center Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
        <header>
          <div className="text-[10px] font-bold uppercase tracking-widest text-purple-700 mb-1">
            Community Infrastructure · stimulx.in
          </div>
          <h2 className="text-xl font-bold text-[#1a1633]">
            Co-Investigator Matcher & Academic Exchange
          </h2>
          <p className="text-[13px] text-[#6b6890] mt-1">
            Find Co-PIs across NIMHANS, TISS, SCARF for national grant applications · Peer scale translations · Micro-grants
          </p>
        </header>

        {activeTab === "collab" && (
          <div className="space-y-4">
            {/* Search & Banner */}
            <div className="bg-gradient-to-r from-purple-900 to-[#1a1633] text-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#f9a94e] mb-1">
                  ✦ Multi-Site Grant Collaboration Engine
                </div>
                <h3 className="text-base font-bold">
                  Need a Co-PI in another Indian state for your ICSSR / DST grant?
                </h3>
                <p className="text-[11px] text-white/70 max-w-xl mt-1">
                  Most national funding schemes favor multi-centric research across North and South India. Match with verified faculty and PhD researchers with complementary linguistic fluency.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPostModal(true)}
                className="h-[34px] px-4 bg-[#e8852b] hover:bg-[#f9a94e] text-white text-[11px] font-semibold rounded-lg shrink-0 shadow-sm"
              >
                + Post Co-PI Request
              </button>
            </div>

            {/* Modal for creating a new collaboration call */}
            {showPostModal && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#1a1633]/15">
                  <div className="flex justify-between items-center pb-2 border-b border-[#1a1633]/10">
                    <h3 className="text-sm font-bold text-[#1a1633]">Post a National Co-PI Call</h3>
                    <button
                      onClick={() => setShowPostModal(false)}
                      className="text-neutral-400 hover:text-neutral-800 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#1a1633] mb-1">Project / Call Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Co-PI needed for ICSSR study in North-East / Hindi belt"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#1a1633] mb-1">Host Institution</label>
                        <input
                          type="text"
                          value={postInstitution}
                          onChange={(e) => setPostInstitution(e.target.value)}
                          className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#1a1633] mb-1">Grant Agency</label>
                        <select
                          value={postAgency}
                          onChange={(e) => setPostAgency(e.target.value)}
                          className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                        >
                          <option value="DST-SERB CRG">DST-SERB CRG</option>
                          <option value="ICSSR Major Grant">ICSSR Major Grant</option>
                          <option value="ICMR Ad-hoc">ICMR Ad-hoc</option>
                          <option value="DBT India Alliance">DBT India Alliance</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1a1633] mb-1">Required Skills / Expertise (comma-separated)</label>
                      <input
                        type="text"
                        value={postSkills}
                        onChange={(e) => setPostSkills(e.target.value)}
                        className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1a1633] mb-1">Brief Description</label>
                      <textarea
                        rows={3}
                        placeholder="Describe the research aims, target participant population, and expectations from the collaborator..."
                        value={postDesc}
                        onChange={(e) => setPostDesc(e.target.value)}
                        className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowPostModal(false)}
                        className="px-3 py-1.5 rounded-lg border border-[#1a1633]/20 text-neutral-600 hover:bg-neutral-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#e8852b] hover:bg-[#d0731f] text-white font-semibold shadow-sm"
                      >
                        Publish Call
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <div className="bg-white border border-[#1a1633]/10 p-3 rounded-xl flex items-center gap-2">
              <Search className="w-4 h-4 text-[#a09ec0] ml-1" />
              <input
                type="text"
                placeholder="Search potential collaborators by institution, keyword, or language (e.g. SCARF, EEG, Tamil)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[12px] outline-none"
              />
            </div>

            {/* User Submitted Community Posts */}
            {collaborationPosts.length > 0 && (
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#e8852b]" />
                  <span>Live Community Collaboration Calls ({collaborationPosts.length})</span>
                </div>
                {collaborationPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-xl p-4 transition-all space-y-2.5 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[13px] font-bold text-[#1a1633]">{post.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Open Call
                          </span>
                        </div>
                        <div className="text-[11px] text-[#6b6890] mt-0.5">
                          {post.author} · <strong>{post.institution}</strong> ({post.city}, {post.state})
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const emailText = `Subject: Collaboration Interest: ${post.title}\n\nDear ${post.author},\n\nI saw your collaboration call on Stimulx.in regarding "${post.title}" for ${post.grantAgency}. I am writing from ${activeProject.grantProposal?.institution || "my institution"} with relevant expertise in ${post.requiredSkills.join(", ")}.\n\nI would be glad to discuss contributing as a Co-Investigator.\n\nBest regards,\n${activeProject.grantProposal?.principalInvestigator || "Collaborator"}`;
                          navigator.clipboard?.writeText(emailText);
                          onToast(`Drafted collaboration email copied to clipboard! ✓`);
                        }}
                        className="h-[28px] px-3 bg-[#e8852b] hover:bg-[#d0731f] text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Proposal</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-[#2e2a50] leading-relaxed">{post.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1a1633]/5">
                      <div className="flex flex-wrap gap-1.5">
                        {post.requiredSkills.map((s) => (
                          <span key={s} className="text-[9px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] text-[#a09ec0] font-mono">
                        Target: {post.grantAgency}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Match Cards */}
            <div className="space-y-3">
              {filteredCollabs.map((collab) => (
                <div
                  key={collab.id}
                  className="bg-white border border-[#1a1633]/10 hover:border-purple-300 rounded-xl p-4 transition-all space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-bold text-[#1a1633]">{collab.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          {collab.matchScore}% Grant Match
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6b6890] mt-0.5">
                        {collab.role} · <strong>{collab.institution}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToast(`Invitation to collaborate sent to ${collab.name} ✓`)}
                      className="h-[28px] px-3 bg-[#1a1633] hover:bg-purple-700 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Invite as Co-PI</span>
                    </button>
                  </div>

                  <div className="bg-[#f5f3ef] border border-[#1a1633]/5 rounded-lg p-2.5 text-[11px] text-[#2e2a50]">
                    <strong>Looking for:</strong> {collab.grantSeeking}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {collab.skills.map((s) => (
                        <span key={s} className="text-[9px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-[#a09ec0] font-mono">
                      Languages: {collab.languages.join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "learn" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div
              onClick={() => onToast("Grant Writing for Social Sciences course opened")}
              className="bg-white border border-[#1a1633]/10 rounded-xl p-4 cursor-pointer hover:border-purple-300 transition-all space-y-2"
            >
              <div className="text-2xl">💰</div>
              <h4 className="text-[13px] font-bold text-[#1a1633]">Grant Writing 101 (ICSSR/DST)</h4>
              <p className="text-[11px] text-[#6b6890] leading-relaxed">
                Step-by-step masterclass on formulating budgets, justification notes, and convincing reviewers.
              </p>
              <div className="flex gap-1.5 pt-1">
                <span className="text-[9px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Hindi</span>
                <span className="text-[9px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">English</span>
              </div>
            </div>

            <div
              onClick={() => onToast("Research Methods course opened")}
              className="bg-white border border-[#1a1633]/10 rounded-xl p-4 cursor-pointer hover:border-purple-300 transition-all space-y-2"
            >
              <div className="text-2xl">🎓</div>
              <h4 className="text-[13px] font-bold text-[#1a1633]">Cognitive Paradigms in India</h4>
              <p className="text-[11px] text-[#6b6890] leading-relaxed">
                Designing reaction-time experiments for low-literacy and multilingual participants.
              </p>
            </div>

            <div
              onClick={() => onToast("Ethics certification opened")}
              className="bg-white border border-[#1a1633]/10 rounded-xl p-4 cursor-pointer hover:border-purple-300 transition-all space-y-2"
            >
              <div className="text-2xl">🛡️</div>
              <h4 className="text-[13px] font-bold text-[#1a1633]">ICMR Ethics Certification</h4>
              <p className="text-[11px] text-[#6b6890] leading-relaxed">
                Mandatory guidelines for human participant testing and DPDP Act 2023 compliance.
              </p>
            </div>
          </div>
        )}

        {activeTab === "share" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
            <h3 className="text-[13px] font-semibold text-[#1a1633]">Live Discussions</h3>
            <div className="space-y-2.5">
              <div
                onClick={() => onToast("Discussion opened")}
                className="p-3 bg-[#f5f3ef] border border-[#1a1633]/10 rounded-lg cursor-pointer hover:border-purple-300 transition-colors"
              >
                <h4 className="text-[12px] font-bold text-[#1a1633]">
                  Has anyone successfully claimed 100% APC waiver for Indian researchers under Springer NAOP?
                </h4>
                <div className="text-[11px] text-[#6b6890] mt-1">
                  Prof. Arjun Krishnan (Delhi Univ) · 14 replies
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "build" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[13px] font-semibold text-[#1a1633]">
                  Micro-Grant & Community Bounties
                </h3>
                <p className="text-[11px] text-[#a09ec0]">
                  Small honorariums (₹5,000–₹25,000) funded by the Stimulx Non-Profit pool to validate scales
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBountyPledged(true);
                  onToast("Pledged ₹5,000 to community scale translation fund ✓");
                }}
                className="h-[28px] px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded flex items-center gap-1.5"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Pledge Bounty</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => onToast("Claimed Bounty: DASS-21 Tamil validation")}
                className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:border-emerald-400"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                    ₹15,000 Micro-Grant
                  </span>
                  <span className="text-[10px] text-emerald-800 font-medium">Bounty Open</span>
                </div>
                <h4 className="text-[12px] font-bold text-emerald-950 mt-1.5">
                  Validate DASS-21 Psychometric Reliability in Rural Tamil Nadu (N = 100)
                </h4>
              </div>

              <div
                onClick={() => onToast("Claimed Bounty: Telugu Stroop Stimuli")}
                className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:border-blue-400"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded">
                    ₹10,000 Micro-Grant
                  </span>
                  <span className="text-[10px] text-blue-800 font-medium">Bounty Open</span>
                </div>
                <h4 className="text-[12px] font-bold text-blue-950 mt-1.5">
                  Standardize Telugu Color-Word Lexicon with Frequency Norms
                </h4>
              </div>
            </div>
          </div>
        )}

        {activeTab === "service" && (
          <div className="bg-white border border-[#1a1633]/10 rounded-xl p-6 space-y-4">
            <div className="bg-[#1a1633] text-white p-5 rounded-xl">
              <blockquote className="font-serif italic text-base leading-relaxed text-white/90">
                "Your experience of living with mental health challenges is knowledge. Stimulx is a place where that knowledge shapes research — not just as data points, but as human insight."
              </blockquote>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8852b] mt-3">
                Stimulx Founding Charter
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Rail */}
      <aside className="w-[268px] shrink-0 bg-white border-l border-[#1a1633]/10 p-4 space-y-4 overflow-y-auto">
        <div>
          <div className="text-[13px] font-semibold text-[#1a1633]">Collab Stats</div>
          <div className="text-[11px] text-[#a09ec0] mb-3">Live verified contributors</div>

          <div className="space-y-2">
            <div className="bg-purple-50 border border-purple-200/60 p-2.5 rounded-lg">
              <div className="text-xl font-bold font-mono text-purple-700">842</div>
              <div className="text-[10px] uppercase font-bold text-purple-900/60">
                Registered Researchers
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200/60 p-2.5 rounded-lg">
              <div className="text-xl font-bold font-mono text-emerald-700">₹4.8L</div>
              <div className="text-[10px] uppercase font-bold text-emerald-900/60">
                Community Micro-Grant Fund
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200/60 p-2.5 rounded-lg">
              <div className="text-xl font-bold font-mono text-blue-700">19</div>
              <div className="text-[10px] uppercase font-bold text-blue-900/60">
                Active Multi-Site Grants
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1a1633]/10">
          <div className="text-[11px] font-bold uppercase text-[#a09ec0] mb-2">
            Partner Institutions
          </div>
          <div className="text-[11px] text-[#6b6890] space-y-1.5">
            <div className="flex justify-between">
              <span>NIMHANS Bengaluru</span>
              <span className="font-mono font-bold">128</span>
            </div>
            <div className="flex justify-between">
              <span>TISS Mumbai</span>
              <span className="font-mono font-bold">94</span>
            </div>
            <div className="flex justify-between">
              <span>SCARF Chennai</span>
              <span className="font-mono font-bold">67</span>
            </div>
            <div className="flex justify-between">
              <span>Delhi University</span>
              <span className="font-mono font-bold">58</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
