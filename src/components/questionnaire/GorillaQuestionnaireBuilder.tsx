'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Settings,
  Eye,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Award,
  ListOrdered,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Copy,
} from 'lucide-react';
import {
  QuestionnaireDefinition,
  QuestionnairePage,
  QuestionnaireItem,
  QuestionnaireQuestionType,
  QuestionnaireOption,
} from '@/types';
import { useStimulxStore } from '@/lib/store';
import { DEFAULT_QUESTIONNAIRES } from '@/lib/gorillaTemplates';

interface GorillaQuestionnaireBuilderProps {
  initialQuestionnaireId?: string;
  onToast: (msg: string) => void;
  onClose?: () => void;
}

export function GorillaQuestionnaireBuilder({
  initialQuestionnaireId,
  onToast,
  onClose,
}: GorillaQuestionnaireBuilderProps) {
  const { activeProject, saveQuestionnaire, deleteQuestionnaire } = useStimulxStore();

  const questionnaires =
    activeProject.questionnaires && activeProject.questionnaires.length > 0
      ? activeProject.questionnaires
      : DEFAULT_QUESTIONNAIRES;

  const [selectedQId, setSelectedQId] = useState<string>(
    initialQuestionnaireId || questionnaires[0]?.id || 'q_consent'
  );

  const activeQ =
    questionnaires.find((q) => q.id === selectedQId) || questionnaires[0];

  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [showScaleLibrary, setShowScaleLibrary] = useState<boolean>(false);

  // Preview state for testing form interactions
  const [previewResponses, setPreviewResponses] = useState<Record<string, any>>({});

  const activePage: QuestionnairePage | undefined = activeQ?.pages?.[activePageIndex];
  const selectedItem: QuestionnaireItem | undefined = activePage?.items?.find(
    (item) => item.id === selectedItemId
  );

  // Questionnaire mutator
  const updateCurrentQuestionnaire = (
    partial: Partial<QuestionnaireDefinition>
  ) => {
    if (!activeQ) return;
    const updated: QuestionnaireDefinition = {
      ...activeQ,
      ...partial,
    };
    saveQuestionnaire(updated);
  };

  const handleCreateNewQuestionnaire = () => {
    const id = `q_${Date.now()}`;
    const newQ: QuestionnaireDefinition = {
      id,
      name: 'Custom Psychological Survey',
      description: 'Multi-item survey with Likert rating scales and automated scoring.',
      category: 'custom',
      pages: [
        {
          id: `p_${Date.now()}`,
          title: 'Section 1: General Assessment',
          description: 'Please respond to each of the following statements based on your experience.',
          items: [
            {
              id: `item_likert_${Date.now()}`,
              type: 'likert',
              title: 'I feel motivated to engage in challenging mental tasks.',
              required: true,
              options: [
                { label: 'Strongly Disagree', value: 1, score: 1 },
                { label: 'Disagree', value: 2, score: 2 },
                { label: 'Neutral', value: 3, score: 3 },
                { label: 'Agree', value: 4, score: 4 },
                { label: 'Strongly Agree', value: 5, score: 5 },
              ],
            },
          ],
        },
      ],
      scoringRule: {
        scaleName: 'Total Motivation Score',
        sumItemIds: [],
        cutoffs: [
          { min: 1, label: 'Low' },
          { min: 3, label: 'Moderate' },
          { min: 5, label: 'High' },
        ],
      },
    };

    saveQuestionnaire(newQ);
    setSelectedQId(id);
    setActivePageIndex(0);
    setSelectedItemId(newQ.pages[0].items[0].id);
    onToast('Created new questionnaire template ✓');
  };

  // Page mutators
  const handleAddPage = () => {
    const newPage: QuestionnairePage = {
      id: `p_${Date.now()}`,
      title: `Page ${activeQ.pages.length + 1}`,
      description: 'Answer the questions on this page before proceeding.',
      items: [
        {
          id: `item_text_${Date.now()}`,
          type: 'text',
          title: 'Question Title',
          required: true,
        },
      ],
    };
    const updatedPages = [...activeQ.pages, newPage];
    updateCurrentQuestionnaire({ pages: updatedPages });
    setActivePageIndex(updatedPages.length - 1);
    setSelectedItemId(newPage.items[0].id);
    onToast('Added new questionnaire page ✓');
  };

  const handleDeletePage = (index: number) => {
    if (activeQ.pages.length <= 1) {
      onToast('Questionnaire must contain at least 1 page.');
      return;
    }
    const updatedPages = activeQ.pages.filter((_, i) => i !== index);
    updateCurrentQuestionnaire({ pages: updatedPages });
    setActivePageIndex(Math.max(0, index - 1));
    onToast('Page removed.');
  };

  const handleUpdatePage = (partial: Partial<QuestionnairePage>) => {
    const updatedPages = activeQ.pages.map((p, i) =>
      i === activePageIndex ? { ...p, ...partial } : p
    );
    updateCurrentQuestionnaire({ pages: updatedPages });
  };

  // Item mutators
  const handleAddItem = (type: QuestionnaireQuestionType) => {
    if (!activePage) return;

    let title = 'New Question';
    let options: QuestionnaireOption[] | undefined = undefined;

    switch (type) {
      case 'likert':
        title = 'Rate the extent to which you agree with this statement:';
        options = [
          { label: 'Not at all', value: 0, score: 0 },
          { label: 'Several days', value: 1, score: 1 },
          { label: 'More than half the days', value: 2, score: 2 },
          { label: 'Nearly every day', value: 3, score: 3 },
        ];
        break;
      case 'multiple_choice':
        title = 'Select the option that best describes your situation:';
        options = [
          { label: 'Option A', value: 'opt_a', score: 1 },
          { label: 'Option B', value: 'opt_b', score: 2 },
          { label: 'Option C', value: 'opt_c', score: 3 },
        ];
        break;
      case 'checkboxes':
        title = 'Select all that apply:';
        options = [
          { label: 'Item 1', value: 'item_1' },
          { label: 'Item 2', value: 'item_2' },
          { label: 'Item 3', value: 'item_3' },
        ];
        break;
      case 'dropdown':
        title = 'Select from the list:';
        options = [
          { label: 'Karnataka', value: 'Karnataka' },
          { label: 'Delhi NCR', value: 'Delhi NCR' },
          { label: 'Tamil Nadu', value: 'Tamil Nadu' },
          { label: 'Maharashtra', value: 'Maharashtra' },
        ];
        break;
      case 'consent':
        title = 'I have read and agree to participate under the ICMR & DPDP guidelines.';
        break;
      case 'instruction':
        title = 'Participant Instructions';
        break;
      case 'slider':
        title = 'Rate your perceived stress level on a scale from 0 to 100:';
        break;
      case 'text':
        title = 'Please provide your response:';
        break;
      case 'paragraph':
        title = 'Please elaborate in detail:';
        break;
    }

    const newItem: QuestionnaireItem = {
      id: `q_item_${type}_${Date.now()}`,
      type,
      title,
      required: type !== 'instruction',
      options,
      minValue: type === 'slider' ? 0 : undefined,
      maxValue: type === 'slider' ? 100 : undefined,
      minLabel: type === 'slider' ? 'Low' : undefined,
      maxLabel: type === 'slider' ? 'High' : undefined,
    };

    const updatedItems = [...activePage.items, newItem];
    handleUpdatePage({ items: updatedItems });
    setSelectedItemId(newItem.id);
    onToast(`Added ${type} question ✓`);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!activePage) return;
    const updatedItems = activePage.items.filter((item) => item.id !== itemId);
    handleUpdatePage({ items: updatedItems });
    setSelectedItemId(null);
    onToast('Question deleted.');
  };

  const handleUpdateItem = (partial: Partial<QuestionnaireItem>) => {
    if (!activePage || !selectedItemId) return;
    const updatedItems = activePage.items.map((item) =>
      item.id === selectedItemId ? { ...item, ...partial } : item
    );
    handleUpdatePage({ items: updatedItems });
  };

  // Preview score calculation
  const calculatePreviewScore = () => {
    if (!activeQ.scoringRule?.sumItemIds) return 0;
    let sum = 0;
    activeQ.pages.forEach((p) => {
      p.items.forEach((item) => {
        if (activeQ.scoringRule?.sumItemIds?.includes(item.id)) {
          const answer = previewResponses[item.id];
          if (answer !== undefined && item.options) {
            const matchedOpt = item.options.find((o) => o.value === answer);
            if (matchedOpt && matchedOpt.score !== undefined) {
              sum += matchedOpt.score;
            }
          }
        }
      });
    });
    return sum;
  };

  const previewScore = calculatePreviewScore();

  const getPreviewSeverity = () => {
    const cutoffs = activeQ.scoringRule?.cutoffs;
    if (!cutoffs || cutoffs.length === 0) return 'N/A';
    for (let i = cutoffs.length - 1; i >= 0; i--) {
      if (previewScore >= cutoffs[i].min) {
        return cutoffs[i].label;
      }
    }
    return cutoffs[0].label;
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0f1d] text-slate-100 overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#0d1424] z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={activeQ.id}
                onChange={(e) => {
                  setSelectedQId(e.target.value);
                  setActivePageIndex(0);
                  setSelectedItemId(null);
                }}
                className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-md px-2.5 py-1 focus:outline-none focus:border-indigo-500"
              >
                {questionnaires.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.category.toUpperCase()})
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowScaleLibrary(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-purple-300 hover:bg-purple-500/10 rounded border border-purple-500/30 transition-colors"
                title="Browse Standard Research Scales"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                Scale Library
              </button>
              <button
                onClick={handleCreateNewQuestionnaire}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-indigo-300 hover:bg-indigo-500/10 rounded border border-indigo-500/30 transition-colors"
              >
                <Plus className="w-3 h-3" />
                New Questionnaire
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
              {activeQ.description}
            </p>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewMode === 'editor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Form Builder
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'preview'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Participant Preview
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Pages Navigator */}
        <div className="w-64 border-r border-slate-800 bg-[#0d1424] flex flex-col h-full overflow-hidden shrink-0">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Form Pages
            </span>
            <button
              onClick={handleAddPage}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Page
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {activeQ.pages.map((page, idx) => {
              const isSelected = activePageIndex === idx;
              return (
                <div
                  key={page.id}
                  onClick={() => {
                    setActivePageIndex(idx);
                    setSelectedItemId(page.items[0]?.id || null);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                        {page.title}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(idx);
                      }}
                      className="text-slate-500 hover:text-red-400 p-0.5 rounded"
                      title="Delete page"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {page.items.length} item{page.items.length === 1 ? '' : 's'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/50 text-[11px] text-slate-400 space-y-1">
            <div>Category: <span className="text-slate-200 capitalize">{activeQ.category}</span></div>
            <div>Scoring: <span className="text-slate-200">{activeQ.scoringRule?.scaleName || 'None'}</span></div>
          </div>
        </div>

        {/* Middle Column: Form Canvas (Editor or Preview) */}
        {viewMode === 'editor' ? (
          <div className="flex-1 flex flex-col h-full bg-[#070b14] overflow-hidden">
            {/* Add Question Palette */}
            <div className="px-6 py-2.5 border-b border-slate-800/80 bg-[#0d1424]/60 flex items-center justify-between overflow-x-auto">
              <span className="text-xs font-bold text-slate-300 mr-2 shrink-0">
                + Add Question:
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleAddItem('likert')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 transition-colors"
                >
                  Likert Scale
                </button>
                <button
                  onClick={() => handleAddItem('multiple_choice')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 transition-colors"
                >
                  Multiple Choice
                </button>
                <button
                  onClick={() => handleAddItem('checkboxes')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 transition-colors"
                >
                  Checkboxes
                </button>
                <button
                  onClick={() => handleAddItem('dropdown')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 transition-colors"
                >
                  Dropdown
                </button>
                <button
                  onClick={() => handleAddItem('slider')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 transition-colors"
                >
                  Slider
                </button>
                <button
                  onClick={() => handleAddItem('text')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 transition-colors"
                >
                  Text Input
                </button>
                <button
                  onClick={() => handleAddItem('consent')}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 border border-slate-700 transition-colors"
                >
                  Consent
                </button>
              </div>
            </div>

            {/* Questions List on Active Page */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 max-w-4xl mx-auto w-full">
              {/* Page Title Header Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <input
                  type="text"
                  value={activePage?.title || ''}
                  onChange={(e) => handleUpdatePage({ title: e.target.value })}
                  placeholder="Page Header Title"
                  className="w-full text-base font-bold bg-transparent border-b border-slate-800 focus:border-indigo-500 pb-1 text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={activePage?.description || ''}
                  onChange={(e) => handleUpdatePage({ description: e.target.value })}
                  placeholder="Page Description / Instructions"
                  className="w-full text-xs text-slate-400 bg-transparent focus:outline-none"
                />
              </div>

              {/* Items List */}
              {activePage?.items.map((item, idx) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/40 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {item.type}
                        </span>
                        {item.required && (
                          <span className="text-[10px] text-red-400 font-semibold">* Required</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                    {item.description && (
                      <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
                    )}

                    {/* Preview of options */}
                    {item.options && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-1.5"
                          >
                            <span>{opt.label}</span>
                            {opt.score !== undefined && (
                              <span className="text-[9px] text-amber-400 font-mono">
                                ({opt.score} pts)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Participant Interactive Preview Mode */
          <div className="flex-1 flex flex-col h-full bg-[#070b14] overflow-y-auto p-8 items-center">
            <div className="w-full max-w-2xl bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {activeQ.name} • Page {activePageIndex + 1} of {activeQ.pages.length}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{activePage?.title}</h2>
                {activePage?.description && (
                  <p className="text-xs text-slate-400 mt-1">{activePage.description}</p>
                )}
              </div>

              {/* Interactive preview items */}
              <div className="space-y-6">
                {activePage?.items.map((item, idx) => (
                  <div key={item.id} className="space-y-2 p-3 rounded-lg bg-slate-900/40">
                    <label className="block text-xs font-semibold text-slate-200">
                      {idx + 1}. {item.title} {item.required && <span className="text-red-400">*</span>}
                    </label>

                    {item.type === 'likert' && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                        {item.options?.map((opt) => (
                          <button
                            key={String(opt.value)}
                            onClick={() =>
                              setPreviewResponses({
                                ...previewResponses,
                                [item.id]: opt.value,
                              })
                            }
                            className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                              previewResponses[item.id] === opt.value
                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <div>{opt.label}</div>
                            {opt.score !== undefined && (
                              <div className="text-[10px] text-slate-400 mt-0.5">({opt.score} pts)</div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {item.type === 'multiple_choice' && (
                      <div className="space-y-1.5 pt-1">
                        {item.options?.map((opt) => (
                          <label
                            key={String(opt.value)}
                            onClick={() =>
                              setPreviewResponses({
                                ...previewResponses,
                                [item.id]: opt.value,
                              })
                            }
                            className="flex items-center gap-2 p-2 rounded bg-slate-800/60 border border-slate-700 cursor-pointer hover:bg-slate-800"
                          >
                            <input
                              type="radio"
                              name={item.id}
                              checked={previewResponses[item.id] === opt.value}
                              onChange={() => {}}
                              className="text-indigo-600"
                            />
                            <span className="text-xs text-slate-200">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {item.type === 'consent' && (
                      <label className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={previewResponses[item.id] === true}
                          onChange={(e) =>
                            setPreviewResponses({
                              ...previewResponses,
                              [item.id]: e.target.checked,
                            })
                          }
                          className="mt-0.5 rounded text-emerald-500"
                        />
                        <span className="text-xs text-emerald-200 font-medium leading-relaxed">
                          {item.title}
                        </span>
                      </label>
                    )}

                    {item.type === 'text' && (
                      <input
                        type="text"
                        value={previewResponses[item.id] || ''}
                        onChange={(e) =>
                          setPreviewResponses({
                            ...previewResponses,
                            [item.id]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-100"
                        placeholder="Type response..."
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Live Score Output Banner */}
              {activeQ.scoringRule && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Live Scoring Engine
                    </div>
                    <div className="text-xs text-white font-medium mt-0.5">
                      {activeQ.scoringRule.scaleName}:{' '}
                      <span className="text-amber-400 font-mono font-bold text-sm">
                        {previewScore}
                      </span>{' '}
                      ({getPreviewSeverity()})
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Auto-feeds into Tree Branching
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Column: Question Inspector & Scoring Settings */}
        <div className="w-80 border-l border-slate-800 bg-[#0d1424] flex flex-col h-full overflow-y-auto shrink-0 shadow-xl">
          <div className="p-3 border-b border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Question Inspector & Scoring
            </span>
          </div>

          {selectedItem ? (
            <div className="p-4 space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Item Configuration
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Question Title / Prompt</label>
                <textarea
                  rows={2}
                  value={selectedItem.title}
                  onChange={(e) => handleUpdateItem({ title: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Optional Subtitle / Description</label>
                <input
                  type="text"
                  value={selectedItem.description || ''}
                  onChange={(e) => handleUpdateItem({ description: e.target.value })}
                  className="w-full mt-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="req_toggle"
                  checked={selectedItem.required}
                  onChange={(e) => handleUpdateItem({ required: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <label htmlFor="req_toggle" className="text-xs text-slate-300 font-medium">
                  Participant response required
                </label>
              </div>

              {/* Options Editor for Likert & Multiple Choice */}
              {selectedItem.options && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Options & Scoring Weights
                    </span>
                    <button
                      onClick={() => {
                        const newOpt: QuestionnaireOption = {
                          label: `Option ${selectedItem.options!.length + 1}`,
                          value: `opt_${selectedItem.options!.length + 1}`,
                          score: selectedItem.options!.length + 1,
                        };
                        handleUpdateItem({
                          options: [...selectedItem.options!, newOpt],
                        });
                      }}
                      className="text-[10px] text-indigo-400 hover:underline"
                    >
                      + Add Option
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {selectedItem.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => {
                            const newOpts = [...selectedItem.options!];
                            newOpts[oIdx].label = e.target.value;
                            handleUpdateItem({ options: newOpts });
                          }}
                          className="flex-1 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100"
                        />
                        <div className="flex items-center gap-1 w-20">
                          <input
                            type="number"
                            value={opt.score ?? 0}
                            onChange={(e) => {
                              const newOpts = [...selectedItem.options!];
                              newOpts[oIdx].score = Number(e.target.value);
                              handleUpdateItem({ options: newOpts });
                            }}
                            className="w-full px-1.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-amber-300 text-center font-mono"
                          />
                          <span className="text-[10px] text-slate-500">pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              Select any question card to customize its prompt, options, and scoring weights.
            </div>
          )}

          {/* Scale Scoring Settings Section */}
          <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/30">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Automated Scale Scoring
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Scale Metric Name</label>
              <input
                type="text"
                value={activeQ.scoringRule?.scaleName || ''}
                onChange={(e) =>
                  updateCurrentQuestionnaire({
                    scoringRule: {
                      ...activeQ.scoringRule,
                      scaleName: e.target.value,
                    },
                  })
                }
                className="w-full mt-1 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100"
                placeholder="e.g. PHQ-9 Severity"
              />
            </div>

            <div className="text-[11px] text-slate-400">
              Items included in sum score:
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {activeQ.pages.flatMap((p) => p.items).map((item) => {
                const isIncluded = activeQ.scoringRule?.sumItemIds?.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(isIncluded)}
                      onChange={(e) => {
                        const current = activeQ.scoringRule?.sumItemIds || [];
                        const updatedIds = e.target.checked
                          ? [...current, item.id]
                          : current.filter((id) => id !== item.id);
                        updateCurrentQuestionnaire({
                          scoringRule: {
                            ...activeQ.scoringRule,
                            sumItemIds: updatedIds,
                          },
                        });
                      }}
                      className="rounded text-amber-500"
                    />
                    <span className="truncate">{item.title}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scale Library Modal */}
      {showScaleLibrary && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Validated Scale & Survey Library</h3>
                  <p className="text-xs text-slate-400">
                    Standardized clinical instruments, ethical consents, and sociodemographic batteries
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScaleLibrary(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Cards */}
            <div className="p-6 overflow-y-auto space-y-4">
              {DEFAULT_QUESTIONNAIRES.map((template) => {
                const isCurrent = activeQ.id === template.id;
                const totalItems = template.pages.reduce((sum, p) => sum + p.items.length, 0);
                return (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm">{template.name}</h4>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-800/80 text-indigo-300">
                          {template.category}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 font-medium">
                            Active in Builder
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{template.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span>{template.pages.length} Page{template.pages.length > 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>{totalItems} Question Item{totalItems > 1 ? 's' : ''}</span>
                        {template.scoringRule && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400">Automated Scoring: {template.scoringRule.scaleName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const exists = questionnaires.some((q) => q.id === template.id);
                          if (!exists) {
                            saveQuestionnaire(template);
                          }
                          setSelectedQId(template.id);
                          setActivePageIndex(0);
                          setSelectedItemId(template.pages[0]?.items[0]?.id || null);
                          setShowScaleLibrary(false);
                          onToast(`Loaded ${template.name} ✓`);
                        }}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                      >
                        Load Scale
                      </button>
                      <button
                        onClick={() => {
                          const cloned: QuestionnaireDefinition = {
                            ...template,
                            id: `q_${Date.now()}`,
                            name: `${template.name} (Custom Clone)`,
                          };
                          saveQuestionnaire(cloned);
                          setSelectedQId(cloned.id);
                          setActivePageIndex(0);
                          setSelectedItemId(cloned.pages[0]?.items[0]?.id || null);
                          setShowScaleLibrary(false);
                          onToast(`Cloned ${template.name} into custom survey ✓`);
                        }}
                        className="px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      >
                        Clone Scale
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
