'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Plus,
  Trash2,
  Copy,
  Layers,
  Table,
  Settings,
  Play,
  CheckCircle2,
  Eye,
  Save,
  ArrowRight,
  Move,
  Type,
  Crosshair,
  Keyboard,
  Clock,
  Sliders,
  ChevronRight,
  Download,
  Upload,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import {
  TaskDefinition,
  TaskDisplay,
  TaskZone,
  ZoneType,
  CognitiveDomain,
  TaskSpreadsheetRow,
} from '@/types';
import { useStimulxStore } from '@/lib/store';
import { DEFAULT_TASKS } from '@/lib/gorillaTemplates';

interface GorillaTaskBuilderProps {
  initialTaskId?: string;
  onToast: (msg: string) => void;
  onLaunchRunner?: () => void;
}

export function GorillaTaskBuilder({
  initialTaskId,
  onToast,
  onLaunchRunner,
}: GorillaTaskBuilderProps) {
  const { activeProject, saveTask, deleteTask } = useStimulxStore();

  const tasks = activeProject.tasks && activeProject.tasks.length > 0
    ? activeProject.tasks
    : DEFAULT_TASKS;

  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    initialTaskId || tasks[0]?.id || 'task_stroop'
  );

  const activeTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const [activeTab, setActiveTab] = useState<'displays' | 'spreadsheet' | 'settings'>('displays');
  const [selectedDisplayIndex, setSelectedDisplayIndex] = useState<number>(0);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [previewRowIndex, setPreviewRowIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'design' | 'preview'>('design');
  const [showLibraryModal, setShowLibraryModal] = useState<boolean>(false);

  const selectedDisplay: TaskDisplay | undefined = activeTask?.displays?.[selectedDisplayIndex];
  const selectedZone: TaskZone | undefined = selectedDisplay?.zones?.find(
    (z) => z.id === selectedZoneId
  );

  // Available spreadsheet column names for binding chips
  const spreadsheetColumns = activeTask?.spreadsheet?.[0]
    ? Object.keys(activeTask.spreadsheet[0])
    : ['trial_id', 'word', 'color', 'correct_key', 'congruency'];

  // Dynamic variable binder
  const resolveBinding = (
    templateString?: string,
    row?: TaskSpreadsheetRow
  ): string => {
    if (!templateString) return '';
    if (!row) return templateString;
    return templateString.replace(/\$\$([a-zA-Z0-9_]+)/g, (_, colName) => {
      return row[colName] !== undefined ? String(row[colName]) : `$$${colName}`;
    });
  };

  // Task Mutators
  const updateCurrentTask = (partial: Partial<TaskDefinition>) => {
    if (!activeTask) return;
    const updated: TaskDefinition = {
      ...activeTask,
      ...partial,
    };
    saveTask(updated);
  };

  const handleCreateNewTask = () => {
    const id = `task_${Date.now()}`;
    const newTask: TaskDefinition = {
      id,
      name: 'New Custom Cognitive Task',
      description: 'Custom reaction-time paradigm configured with displays and trial spreadsheet.',
      domain: 'attention',
      randomizeTrials: true,
      interTrialIntervalMs: 300,
      displays: [
        {
          id: `disp_fix_${Date.now()}`,
          name: 'Fixation Cross',
          durationMs: 500,
          advanceOn: 'time',
          backgroundColor: '#090d16',
          zones: [
            {
              id: `z_fix_${Date.now()}`,
              name: 'Fixation',
              type: 'fixation',
              xPct: 50,
              yPct: 50,
              widthPct: 10,
              heightPct: 10,
              content: '+',
              fontSizePx: 44,
              fontColor: '#94a3b8',
            },
          ],
        },
        {
          id: `disp_stim_${Date.now()}`,
          name: 'Stimulus Display',
          durationMs: 2000,
          advanceOn: 'response',
          backgroundColor: '#090d16',
          zones: [
            {
              id: `z_stim_${Date.now()}`,
              name: 'Target Stimulus',
              type: 'text',
              xPct: 50,
              yPct: 45,
              widthPct: 60,
              heightPct: 20,
              content: '$$stimulus_text',
              fontSizePx: 48,
              fontColor: '#f8fafc',
            },
            {
              id: `z_keys_${Date.now()}`,
              name: 'Keyboard Response Listener',
              type: 'keyboard_response',
              xPct: 10,
              yPct: 80,
              widthPct: 80,
              heightPct: 15,
              validKeys: ['f', 'j'],
              correctKey: '$$correct_key',
              timeoutMs: 2000,
            },
          ],
        },
      ],
      spreadsheet: [
        { trial_id: 1, stimulus_text: 'STIMULUS A', correct_key: 'f', condition: 'Standard' },
        { trial_id: 2, stimulus_text: 'STIMULUS B', correct_key: 'j', condition: 'Conflict' },
      ],
    };

    saveTask(newTask);
    setSelectedTaskId(id);
    setSelectedDisplayIndex(0);
    onToast('Created new task template ✓');
  };

  // Display Mutators
  const handleAddDisplay = () => {
    const newDisplay: TaskDisplay = {
      id: `disp_${Date.now()}`,
      name: `Display ${activeTask.displays.length + 1}`,
      durationMs: 1000,
      advanceOn: 'time',
      backgroundColor: '#090d16',
      zones: [
        {
          id: `z_txt_${Date.now()}`,
          name: 'Text Zone',
          type: 'text',
          xPct: 50,
          yPct: 50,
          widthPct: 60,
          heightPct: 20,
          content: 'Screen Content',
          fontSizePx: 28,
          fontColor: '#ffffff',
        },
      ],
    };

    const newDisplays = [...activeTask.displays, newDisplay];
    updateCurrentTask({ displays: newDisplays });
    setSelectedDisplayIndex(newDisplays.length - 1);
    setSelectedZoneId(newDisplay.zones[0].id);
    onToast('Added new display screen ✓');
  };

  const handleDeleteDisplay = (index: number) => {
    if (activeTask.displays.length <= 1) {
      onToast('A task must contain at least 1 display screen.');
      return;
    }
    const newDisplays = activeTask.displays.filter((_, i) => i !== index);
    updateCurrentTask({ displays: newDisplays });
    setSelectedDisplayIndex(Math.max(0, index - 1));
    onToast('Display screen removed.');
  };

  const handleUpdateDisplay = (partial: Partial<TaskDisplay>) => {
    const updatedDisplays = activeTask.displays.map((disp, i) =>
      i === selectedDisplayIndex ? { ...disp, ...partial } : disp
    );
    updateCurrentTask({ displays: updatedDisplays });
  };

  // Zone Mutators
  const handleAddZone = (type: ZoneType) => {
    if (!selectedDisplay) return;

    let name = 'New Zone';
    let content = 'Text';
    let validKeys: string[] | undefined = undefined;
    let correctKey: string | undefined = undefined;
    let options: string[] | undefined = undefined;
    let fontSizePx = 24;
    let fontColor = '#ffffff';

    switch (type) {
      case 'fixation':
        name = 'Central Fixation';
        content = '+';
        fontSizePx = 44;
        fontColor = '#94a3b8';
        break;
      case 'text':
        name = 'Text Stimulus';
        content = '$$word';
        fontSizePx = 48;
        break;
      case 'keyboard_response':
        name = 'Keyboard Listener';
        validKeys = ['r', 'g', 'b', 'y'];
        correctKey = '$$correct_key';
        break;
      case 'button_response':
        name = 'Click Buttons';
        options = ['Option A', 'Option B'];
        break;
      case 'rating_scale':
        name = 'Likert Scale';
        options = ['1', '2', '3', '4', '5', '6', '7'];
        break;
      case 'timer':
        name = 'Countdown Timer';
        content = 'Remaining Time';
        break;
    }

    const newZone: TaskZone = {
      id: `z_${type}_${Date.now()}`,
      name,
      type,
      xPct: 50,
      yPct: 50,
      widthPct: 60,
      heightPct: 18,
      content,
      fontSizePx,
      fontColor,
      validKeys,
      correctKey,
      options,
      timeoutMs: selectedDisplay.durationMs || 2000,
    };

    const updatedZones = [...selectedDisplay.zones, newZone];
    handleUpdateDisplay({ zones: updatedZones });
    setSelectedZoneId(newZone.id);
    onToast(`Added ${type} zone to display ✓`);
  };

  const handleDeleteZone = (zoneId: string) => {
    if (!selectedDisplay) return;
    const updatedZones = selectedDisplay.zones.filter((z) => z.id !== zoneId);
    handleUpdateDisplay({ zones: updatedZones });
    setSelectedZoneId(null);
    onToast('Zone deleted.');
  };

  const handleUpdateZone = (partial: Partial<TaskZone>) => {
    if (!selectedDisplay || !selectedZoneId) return;
    const updatedZones = selectedDisplay.zones.map((z) =>
      z.id === selectedZoneId ? { ...z, ...partial } : z
    );
    handleUpdateDisplay({ zones: updatedZones });
  };

  // Spreadsheet Mutators
  const handleAddSpreadsheetRow = () => {
    const lastRow = activeTask.spreadsheet[activeTask.spreadsheet.length - 1] || {};
    const newRowId = activeTask.spreadsheet.length + 1;
    const newRow: TaskSpreadsheetRow = {
      ...lastRow,
      trial_id: newRowId,
    };
    const updated = [...activeTask.spreadsheet, newRow];
    updateCurrentTask({ spreadsheet: updated });
    onToast(`Added trial row #${newRowId} ✓`);
  };

  const handleDeleteSpreadsheetRow = (index: number) => {
    if (activeTask.spreadsheet.length <= 1) {
      onToast('Task spreadsheet must have at least 1 trial.');
      return;
    }
    const updated = activeTask.spreadsheet.filter((_, i) => i !== index);
    updateCurrentTask({ spreadsheet: updated });
  };

  const handleUpdateSpreadsheetCell = (
    rowIndex: number,
    column: string,
    value: string | number
  ) => {
    const updated = activeTask.spreadsheet.map((row, idx) => {
      if (idx !== rowIndex) return row;
      return {
        ...row,
        [column]: value,
      };
    });
    updateCurrentTask({ spreadsheet: updated });
  };

  const handleAddSpreadsheetColumn = () => {
    const colName = prompt('Enter new spreadsheet column name (e.g. "language", "valence"):');
    if (!colName || !colName.trim()) return;
    const sanitized = colName.trim().replace(/\s+/g, '_').toLowerCase();

    const updated = activeTask.spreadsheet.map((row) => ({
      ...row,
      [sanitized]: '',
    }));
    updateCurrentTask({ spreadsheet: updated });
    onToast(`Added column "$$${sanitized}" to spreadsheet ✓`);
  };

  const handleExportSpreadsheetCsv = () => {
    if (!activeTask.spreadsheet || activeTask.spreadsheet.length === 0) return;
    const headers = Object.keys(activeTask.spreadsheet[0]);
    const csvLines = [headers.join(',')];

    activeTask.spreadsheet.forEach((row) => {
      const line = headers.map((h) => JSON.stringify(row[h] ?? '')).join(',');
      csvLines.push(line);
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTask.id}_trials.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Exported trial spreadsheet CSV ✓');
  };

  const currentRowForPreview = activeTask.spreadsheet[previewRowIndex] || activeTask.spreadsheet[0] || {};

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0f1d] text-slate-100 overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#0d1424] z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={activeTask.id}
                onChange={(e) => {
                  setSelectedTaskId(e.target.value);
                  setSelectedDisplayIndex(0);
                  setSelectedZoneId(null);
                }}
                className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-md px-2.5 py-1 focus:outline-none focus:border-amber-500"
              >
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.domain.toUpperCase()})
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowLibraryModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-purple-300 hover:bg-purple-500/10 rounded border border-purple-500/30 transition-colors"
                title="Browse Landmark Cognitive Paradigms"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                Paradigm Library
              </button>
              <button
                onClick={handleCreateNewTask}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-amber-300 hover:bg-amber-500/10 rounded border border-amber-500/30 transition-colors"
              >
                <Plus className="w-3 h-3" />
                New Task
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
              {activeTask.description}
            </p>
          </div>
        </div>

        {/* Workspace Mode Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('displays')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'displays'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Displays & Zones ({activeTask.displays.length})
            </button>
            <button
              onClick={() => setActiveTab('spreadsheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'spreadsheet'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Trial Spreadsheet ({activeTask.spreadsheet.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Task Settings
            </button>
          </div>

          {onLaunchRunner && (
            <button
              onClick={onLaunchRunner}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm ml-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Run Task Test
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'displays' ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column: Displays Sequencer */}
          <div className="w-64 border-r border-slate-800 bg-[#0d1424] flex flex-col h-full overflow-hidden shrink-0">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Display Sequence
              </span>
              <button
                onClick={handleAddDisplay}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Screen
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {activeTask.displays.map((disp, idx) => {
                const isSelected = selectedDisplayIndex === idx;
                return (
                  <div
                    key={disp.id}
                    onClick={() => {
                      setSelectedDisplayIndex(idx);
                      setSelectedZoneId(disp.zones[0]?.id || null);
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
                          {disp.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDisplay(idx);
                        }}
                        className="text-slate-500 hover:text-red-400 p-0.5 rounded"
                        title="Delete display"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                      <span>{disp.zones.length} zone{disp.zones.length === 1 ? '' : 's'}</span>
                      <span>•</span>
                      <span>
                        {disp.advanceOn === 'time'
                          ? `${disp.durationMs || 500}ms`
                          : 'Response'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-900/50 text-[11px] text-slate-400">
              The runtime engine executes this display timeline in order for every spreadsheet trial.
            </div>
          </div>

          {/* Middle Column: Visual Screen Canvas Simulator */}
          <div className="flex-1 flex flex-col h-full bg-[#070b14] overflow-hidden">
            {/* Screen Controls Header */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-slate-800/80 bg-[#0d1424]/60">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-200">
                  Screen Preview: {selectedDisplay?.name}
                </span>

                {/* View Mode Toggle */}
                <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setViewMode('design')}
                    className={`px-2.5 py-0.5 rounded font-medium ${
                      viewMode === 'design'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Design Mode
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-2.5 py-0.5 rounded font-medium ${
                      viewMode === 'preview'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Live Trial Preview
                  </button>
                </div>
              </div>

              {/* Trial Preview Row Selector */}
              {viewMode === 'preview' && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Previewing Trial:</span>
                  <select
                    value={previewRowIndex}
                    onChange={(e) => setPreviewRowIndex(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-emerald-400 rounded px-2 py-0.5 text-xs font-mono font-bold focus:outline-none"
                  >
                    {activeTask.spreadsheet.map((row, idx) => (
                      <option key={idx} value={idx}>
                        Trial #{row.trial_id || idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Screen Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
              <div
                className="w-full max-w-3xl aspect-[16/10] rounded-xl border border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center select-none"
                style={{
                  backgroundColor: selectedDisplay?.backgroundColor || '#090d16',
                }}
              >
                {selectedDisplay?.zones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;

                  // Evaluate content based on design mode vs preview mode
                  const displayContent =
                    viewMode === 'preview'
                      ? resolveBinding(zone.content, currentRowForPreview)
                      : zone.content || '';

                  const displayFontColor =
                    viewMode === 'preview'
                      ? resolveBinding(zone.fontColor, currentRowForPreview)
                      : zone.fontColor || '#ffffff';

                  return (
                    <div
                      key={zone.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedZoneId(zone.id);
                      }}
                      style={{
                        position: 'absolute',
                        left: `${zone.xPct}%`,
                        top: `${zone.yPct}%`,
                        transform: 'translate(-50%, -50%)',
                        width: `${zone.widthPct}%`,
                        height: `${zone.heightPct}%`,
                      }}
                      className={`flex flex-col items-center justify-center rounded-lg transition-all cursor-pointer ${
                        viewMode === 'design'
                          ? isSelected
                            ? 'ring-2 ring-amber-400 bg-amber-400/10'
                            : 'border border-dashed border-slate-600 hover:border-slate-400 bg-slate-800/20'
                          : ''
                      }`}
                    >
                      {/* Zone Name Label (in Design Mode) */}
                      {viewMode === 'design' && (
                        <div className="absolute -top-3 left-2 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[9px] font-mono text-amber-400">
                          {zone.name} ({zone.type})
                        </div>
                      )}

                      {/* Zone Content Renderers */}
                      {zone.type === 'fixation' && (
                        <span
                          style={{
                            fontSize: `${zone.fontSizePx || 44}px`,
                            color: displayFontColor,
                          }}
                          className="font-mono font-bold leading-none select-none"
                        >
                          {displayContent || '+'}
                        </span>
                      )}

                      {zone.type === 'text' && (
                        <span
                          style={{
                            fontSize: `${zone.fontSizePx || 32}px`,
                            color: displayFontColor,
                          }}
                          className="font-bold text-center leading-snug whitespace-pre-line tracking-wide drop-shadow"
                        >
                          {displayContent || 'Text Preview'}
                        </span>
                      )}

                      {zone.type === 'keyboard_response' && (
                        <div className="flex flex-col items-center gap-1 text-center">
                          {displayContent && (
                            <span className="text-xs text-emerald-400 font-semibold mb-1">
                              {displayContent}
                            </span>
                          )}
                          <div className="flex items-center gap-1.5">
                            {zone.validKeys?.map((k) => (
                              <span
                                key={k}
                                className="px-2.5 py-1 rounded bg-slate-800 border border-slate-600 text-xs font-mono font-bold text-slate-200 shadow"
                              >
                                {k.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {zone.type === 'button_response' && (
                        <div className="flex items-center gap-2">
                          {zone.options?.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Zone Inspector */}
          <div className="w-80 border-l border-slate-800 bg-[#0d1424] flex flex-col h-full overflow-y-auto shrink-0 shadow-xl">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Display & Zone Inspector
              </span>
              <div className="relative group">
                <button
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Zone
                </button>
                <div className="absolute right-0 mt-1 w-44 rounded-lg bg-slate-900 border border-slate-700 shadow-xl py-1 hidden group-hover:block z-50">
                  <button
                    onClick={() => handleAddZone('text')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-amber-600/20"
                  >
                    Text Stimulus
                  </button>
                  <button
                    onClick={() => handleAddZone('fixation')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-amber-600/20"
                  >
                    Fixation Cross
                  </button>
                  <button
                    onClick={() => handleAddZone('keyboard_response')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-amber-600/20"
                  >
                    Keyboard Listener
                  </button>
                  <button
                    onClick={() => handleAddZone('button_response')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-amber-600/20"
                  >
                    Click Buttons
                  </button>
                </div>
              </div>
            </div>

            {/* Display Properties */}
            {selectedDisplay && (
              <div className="p-4 border-b border-slate-800 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Screen Properties
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Display Name</label>
                  <input
                    type="text"
                    value={selectedDisplay.name}
                    onChange={(e) => handleUpdateDisplay({ name: e.target.value })}
                    className="w-full mt-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Advance Trigger</label>
                    <select
                      value={selectedDisplay.advanceOn}
                      onChange={(e) =>
                        handleUpdateDisplay({
                          advanceOn: e.target.value as 'time' | 'response' | 'time_or_response',
                        })
                      }
                      className="w-full mt-1 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-200"
                    >
                      <option value="time">Fixed Duration (ms)</option>
                      <option value="response">On Participant Response</option>
                      <option value="time_or_response">Response or Timeout</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Duration (ms)</label>
                    <input
                      type="number"
                      step={50}
                      value={selectedDisplay.durationMs || 500}
                      onChange={(e) =>
                        handleUpdateDisplay({ durationMs: Number(e.target.value) })
                      }
                      className="w-full mt-1 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Zone Properties */}
            {selectedZone ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Selected Zone: {selectedZone.name}
                  </div>
                  <button
                    onClick={() => handleDeleteZone(selectedZone.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete zone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Zone Label</label>
                  <input
                    type="text"
                    value={selectedZone.name}
                    onChange={(e) => handleUpdateZone({ name: e.target.value })}
                    className="w-full mt-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100"
                  />
                </div>

                {/* Content / Dynamic Binding */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-400">Content / Stimulus</label>
                    <span className="text-[9px] text-amber-400 font-mono">Use $$column</span>
                  </div>
                  <input
                    type="text"
                    value={selectedZone.content || ''}
                    onChange={(e) => handleUpdateZone({ content: e.target.value })}
                    className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-amber-300 font-mono"
                    placeholder="e.g. $$word or Fixed Text"
                  />

                  {/* Spreadsheet Column Chips for 1-click binding */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {spreadsheetColumns.map((col) => (
                      <button
                        key={col}
                        onClick={() => handleUpdateZone({ content: `$$${col}` })}
                        className="px-1.5 py-0.5 text-[9px] rounded bg-slate-800 hover:bg-amber-600/30 text-slate-300 hover:text-amber-300 border border-slate-700"
                      >
                        + $${col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Styling */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Font Size (px)</label>
                    <input
                      type="number"
                      value={selectedZone.fontSizePx || 28}
                      onChange={(e) =>
                        handleUpdateZone({ fontSizePx: Number(e.target.value) })
                      }
                      className="w-full mt-1 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Font Color</label>
                    <input
                      type="text"
                      value={selectedZone.fontColor || '#ffffff'}
                      onChange={(e) => handleUpdateZone({ fontColor: e.target.value })}
                      className="w-full mt-1 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                      placeholder="#hex or $$color"
                    />
                  </div>
                </div>

                {/* Keyboard Listener Specifics */}
                {selectedZone.type === 'keyboard_response' && (
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Keyboard Input Mapping
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Valid Keys (comma-separated)</label>
                      <input
                        type="text"
                        value={selectedZone.validKeys?.join(', ') || ''}
                        onChange={(e) =>
                          handleUpdateZone({
                            validKeys: e.target.value
                              .split(',')
                              .map((k) => k.trim().toLowerCase())
                              .filter(Boolean),
                          })
                        }
                        className="w-full mt-1 px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono"
                        placeholder="r, g, b, y"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Correct Key Binding</label>
                      <input
                        type="text"
                        value={selectedZone.correctKey || ''}
                        onChange={(e) => handleUpdateZone({ correctKey: e.target.value })}
                        className="w-full mt-1 px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-emerald-300 font-mono"
                        placeholder="e.g. $$correct_key"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                Click any zone on the screen canvas to customize its stimuli, timing, and dynamic bindings.
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'spreadsheet' ? (
        /* Spreadsheet Editor View */
        <div className="flex-1 flex flex-col h-full bg-[#070b14] overflow-hidden">
          {/* Spreadsheet Header Toolbar */}
          <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-800 bg-[#0d1424]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white">
                Task Spreadsheet: {activeTask.spreadsheet.length} Trials
              </span>
              <span className="text-[11px] text-slate-400">
                Each row drives one trial of the display sequence.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddSpreadsheetColumn}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                Add Column
              </button>
              <button
                onClick={handleAddSpreadsheetRow}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Trial Row
              </button>
              <button
                onClick={handleExportSpreadsheetCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Export as CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                CSV
              </button>
            </div>
          </div>

          {/* Interactive Editable Table */}
          <div className="flex-1 overflow-auto p-6">
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0d1424] shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3 border-r border-slate-800 w-12 text-center">#</th>
                    {spreadsheetColumns.map((col) => (
                      <th key={col} className="py-2.5 px-3 border-r border-slate-800 uppercase font-semibold">
                        <span className="text-amber-400">$${col}</span>
                      </th>
                    ))}
                    <th className="py-2.5 px-3 w-16 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {activeTask.spreadsheet.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-500 border-r border-slate-800 bg-slate-900/30">
                        {rIdx + 1}
                      </td>
                      {spreadsheetColumns.map((col) => (
                        <td key={col} className="p-1 border-r border-slate-800">
                          <input
                            type="text"
                            value={row[col] !== undefined ? String(row[col]) : ''}
                            onChange={(e) =>
                              handleUpdateSpreadsheetCell(rIdx, col, e.target.value)
                            }
                            className="w-full px-2 py-1 bg-transparent text-slate-200 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded font-mono text-xs"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleDeleteSpreadsheetRow(rIdx)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded"
                          title="Delete trial row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Settings Tab View */
        <div className="flex-1 overflow-y-auto p-8 max-w-3xl space-y-6">
          <div className="p-6 rounded-xl bg-[#0d1424] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              General Paradigm Settings
            </h3>
            <div>
              <label className="text-xs text-slate-400">Task Name</label>
              <input
                type="text"
                value={activeTask.name}
                onChange={(e) => updateCurrentTask({ name: e.target.value })}
                className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-md text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Description</label>
              <textarea
                rows={3}
                value={activeTask.description}
                onChange={(e) => updateCurrentTask({ description: e.target.value })}
                className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400">Cognitive Domain</label>
                <select
                  value={activeTask.domain}
                  onChange={(e) =>
                    updateCurrentTask({ domain: e.target.value as CognitiveDomain })
                  }
                  className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200"
                >
                  <option value="attention">Attention & Executive Control</option>
                  <option value="memory">Working Memory</option>
                  <option value="emotion">Emotion & Social Cognition</option>
                  <option value="executive">Cognitive Flexibility</option>
                  <option value="decision">Decision Making & Economics</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Inter-Trial Interval (ms)</label>
                <input
                  type="number"
                  step={50}
                  value={activeTask.interTrialIntervalMs || 300}
                  onChange={(e) =>
                    updateCurrentTask({ interTrialIntervalMs: Number(e.target.value) })
                  }
                  className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <input
                type="checkbox"
                id="rnd_toggle"
                checked={activeTask.randomizeTrials}
                onChange={(e) => updateCurrentTask({ randomizeTrials: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
              <label htmlFor="rnd_toggle" className="text-xs text-slate-300 font-medium cursor-pointer">
                Randomize trial presentation order for each participant
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Paradigm Library Modal */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Classic Paradigm Library</h3>
                  <p className="text-xs text-slate-400">
                    Pre-configured cognitive assays with verified displays, zones, and trial spreadsheets
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLibraryModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Cards */}
            <div className="p-6 overflow-y-auto space-y-4">
              {DEFAULT_TASKS.map((template) => {
                const isCurrent = activeTask.id === template.id;
                return (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm">{template.name}</h4>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/80 text-purple-300">
                          {template.domain}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 font-medium">
                            Active in Builder
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{template.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span>{template.displays.length} Displays</span>
                        <span>•</span>
                        <span>{template.spreadsheet.length} Spreadsheet Trials</span>
                        <span>•</span>
                        <span>ITI: {template.interTrialIntervalMs || 300}ms</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const exists = tasks.some((t) => t.id === template.id);
                          if (!exists) {
                            saveTask(template);
                          }
                          setSelectedTaskId(template.id);
                          setSelectedDisplayIndex(0);
                          setSelectedZoneId(null);
                          setShowLibraryModal(false);
                          onToast(`Loaded ${template.name} ✓`);
                        }}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                      >
                        Load Paradigm
                      </button>
                      <button
                        onClick={() => {
                          const cloned: TaskDefinition = {
                            ...template,
                            id: `task_${Date.now()}`,
                            name: `${template.name} (Custom Clone)`,
                          };
                          saveTask(cloned);
                          setSelectedTaskId(cloned.id);
                          setSelectedDisplayIndex(0);
                          setSelectedZoneId(null);
                          setShowLibraryModal(false);
                          onToast(`Cloned ${template.name} into custom task ✓`);
                        }}
                        className="px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      >
                        Clone Task
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
