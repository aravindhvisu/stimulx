'use client';

import React, { useState } from 'react';
import { useStimulxStore } from '@/lib/store';
import { ScaleItemExtended } from '@/types';
import {
  X,
  BookOpen,
  Lock,
  CheckCircle2,
  Download,
  ShieldAlert,
  Search,
  FileCheck,
  Building2,
  Upload,
} from 'lucide-react';

interface ScaleMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export function ScaleMarketplaceModal({ isOpen, onClose, onToast }: ScaleMarketplaceModalProps) {
  const { scales, activeProject, updateActiveProject } = useStimulxStore();
  const [activeTab, setActiveTab] = useState<'open' | 'licensed'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScaleForLicense, setSelectedScaleForLicense] = useState<ScaleItemExtended | null>(null);

  // License Request Form state
  const [rciNumber, setRciNumber] = useState('');
  const [institutionName, setInstitutionName] = useState('NIMHANS / University of Delhi');
  const [licenseSubmitted, setLicenseSubmitted] = useState(false);

  if (!isOpen) return null;

  const filteredScales = scales.filter(
    (s) =>
      (activeTab === 'open' ? s.licenseType === 'open_access' : s.licenseType === 'licensed_commercial') &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleImportOpenScale = (scale: ScaleItemExtended) => {
    updateActiveProject((prev) => ({
      ...prev,
      experimentConfig: {
        ...prev.experimentConfig,
        includePhq9: scale.id === 'phq9' ? true : prev.experimentConfig.includePhq9,
        includeGad7: scale.id === 'gad7' ? true : prev.experimentConfig.includeGad7,
      },
      updatedAt: new Date().toISOString(),
    }));
    onToast(`Imported ${scale.name} (${scale.fullName}) into active study protocol ✓`);
  };

  const handleRequestLicense = (e: React.FormEvent) => {
    e.preventDefault();
    setLicenseSubmitted(true);
    setTimeout(() => {
      onToast(`License verification submitted to ${selectedScaleForLicense?.publisher} for ${selectedScaleForLicense?.name} ✓`);
      setSelectedScaleForLicense(null);
      setLicenseSubmitted(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#e2ded6]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e2ded6] flex items-center justify-between bg-[#faf9f6]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e8852b]">
                Measurement Exchange
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1a1633] text-white">
                Open & Licensed Batteries
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1a1633] mt-0.5">
              Standardized Scales & Psychometric Instrument Clearinghouse
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-800 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Search Controls */}
        <div className="px-6 py-3 border-b border-[#e2ded6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('open')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'open'
                  ? 'bg-[#1a1633] text-white shadow-sm'
                  : 'bg-[#f5f3ef] text-[#6e6a82] hover:bg-[#eae6de]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>Open Access (Free CC-BY)</span>
            </button>

            <button
              onClick={() => setActiveTab('licensed')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'licensed'
                  ? 'bg-[#1a1633] text-white shadow-sm'
                  : 'bg-[#f5f3ef] text-[#6e6a82] hover:bg-[#eae6de]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#ca8a04]" />
              <span>Licensed Commercial (WAIS, MMPI, BDI)</span>
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-[#a09ec0] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search scale by name, domain, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f5f3ef] border border-[#e2ded6] rounded-lg outline-none focus:border-[#e8852b]"
            />
          </div>
        </div>

        {/* Scales List Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f5f3ef]">
          {filteredScales.map((scale) => {
            const isOpen = scale.licenseType === 'open_access';
            return (
              <div
                key={scale.id}
                className="bg-white rounded-xl border border-[#e2ded6] p-5 shadow-sm hover:border-[#b8b3a8] transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1a1633]">{scale.name}</h3>
                      <span className="text-xs font-medium text-[#6e6a82]">({scale.fullName})</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isOpen
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isOpen ? 'Free Open Access' : `Level ${scale.qualificationLevel} Required`}
                      </span>
                    </div>

                    <div className="text-xs text-[#8b879e] mt-0.5">
                      Domain: <strong>{scale.domain}</strong> • Publisher: {scale.publisher}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isOpen ? (
                      <button
                        onClick={() => handleImportOpenScale(scale)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#1a1633] hover:bg-[#e8852b] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />
                        <span>1-Click Import</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedScaleForLicense(scale)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#e8852b] hover:bg-[#d0731f] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Acquire Academic License (₹{scale.costPerAdminINR})</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#2e2a50] leading-relaxed">{scale.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f0ede6] text-[11px] text-[#8b879e]">
                  <div>
                    Languages: <strong className="text-[#1a1633]">{scale.languages.join(', ')}</strong> ({scale.itemsCount} items)
                  </div>
                  <div className="italic text-[10px] font-serif">{scale.citation}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* License Acquisition Modal Drawer */}
        {selectedScaleForLicense && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#1a1633]/20">
              <div className="flex justify-between items-center pb-2 border-b border-[#1a1633]/10">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#e8852b]" />
                  <h3 className="text-sm font-bold text-[#1a1633]">
                    Academic License: {selectedScaleForLicense.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedScaleForLicense(null)}
                  className="text-neutral-400 hover:text-neutral-800 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="bg-[#f5f3ef] p-3 rounded-xl border border-[#e2ded6] text-xs text-[#2e2a50] space-y-1">
                <p><strong>Publisher:</strong> {selectedScaleForLicense.publisher}</p>
                <p><strong>Required User Level:</strong> Qualification Level {selectedScaleForLicense.qualificationLevel} (Master&apos;s/PhD in Clinical/Cognitive Psychology)</p>
                <p><strong>Subsidized Academic Rate:</strong> ₹{selectedScaleForLicense.costPerAdminINR} per administration</p>
              </div>

              <form onSubmit={handleRequestLicense} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#1a1633] mb-1">Affiliated University / Lab</label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1a1633] mb-1">
                    Psychologist RCI Number / Faculty Registry ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CRR A-12345 (Rehabilitation Council of India)"
                    value={rciNumber}
                    onChange={(e) => setRciNumber(e.target.value)}
                    className="w-full p-2 border border-[#1a1633]/20 rounded-lg outline-none focus:border-[#e8852b]"
                  />
                </div>

                <div className="border-2 border-dashed border-[#d5cfc5] rounded-xl p-3 text-center bg-[#faf9f6]">
                  <Upload className="w-4 h-4 text-[#8b879e] mx-auto mb-1" />
                  <span className="text-[11px] text-[#6e6a82]">
                    Attach Institutional Letter / Ethics Approval (PDF)
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedScaleForLicense(null)}
                    className="px-3 py-1.5 rounded-lg border border-[#1a1633]/20 text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#e8852b] hover:bg-[#d0731f] text-white font-semibold shadow-sm"
                  >
                    {licenseSubmitted ? 'Verifying...' : 'Submit Clearance Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
