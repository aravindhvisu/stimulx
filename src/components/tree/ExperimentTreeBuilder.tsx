'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  GitBranch,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Brain,
  Shuffle,
  Clock,
  Flag,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Layers,
  Settings2,
  Link2,
  Unlink,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  ExperimentTree,
  ExperimentTreeNode,
  ExperimentTreeEdge,
  ExperimentTreeNodeType,
  RandomiserBranch,
  BranchCondition,
  StudyProject,
} from '@/types';
import { useStimulxStore } from '@/lib/store';
import { DEFAULT_EXPERIMENT_TREE, PRESET_EXPERIMENT_TREES } from '@/lib/gorillaTemplates';

interface ExperimentTreeBuilderProps {
  onOpenTaskBuilder?: (taskId?: string) => void;
  onOpenQuestionnaireBuilder?: (qId?: string) => void;
  onLaunchParticipantPreview?: () => void;
  onToast: (msg: string) => void;
}

export function ExperimentTreeBuilder({
  onOpenTaskBuilder,
  onOpenQuestionnaireBuilder,
  onLaunchParticipantPreview,
  onToast,
}: ExperimentTreeBuilderProps) {
  const { activeProject, updateExperimentTree } = useStimulxStore();

  const tree: ExperimentTree = activeProject.tree && activeProject.tree.nodes.length > 0
    ? activeProject.tree
    : DEFAULT_EXPERIMENT_TREE;

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNode = tree.nodes.find((n) => n.id === selectedNodeId) || null;

  // Validation logic
  const validateTree = (currentTree: ExperimentTree) => {
    const issues: string[] = [];
    const nodeMap = new Map(currentTree.nodes.map((n) => [n.id, n]));

    const startNodes = currentTree.nodes.filter((n) => n.type === 'start');
    if (startNodes.length === 0) issues.push('Tree has no Start node.');
    if (startNodes.length > 1) issues.push('Tree has multiple Start nodes.');

    const finishNodes = currentTree.nodes.filter((n) => n.type === 'finish');
    if (finishNodes.length === 0) issues.push('Tree has no Finish node.');

    // Check for unbound tasks or questionnaires
    currentTree.nodes.forEach((n) => {
      if (n.type === 'task' && !n.taskId) {
        issues.push(`Task node "${n.title}" has no task assigned.`);
      }
      if (n.type === 'questionnaire' && !n.questionnaireId) {
        issues.push(`Questionnaire node "${n.title}" has no questionnaire assigned.`);
      }
      if (n.type === 'randomiser') {
        const branches = n.randomiserSettings?.branches || [];
        if (branches.length < 2) {
          issues.push(`Randomizer "${n.title}" requires at least 2 branches.`);
        }
        const totalWeight = branches.reduce((sum, b) => sum + (b.weightPct || 0), 0);
        if (Math.abs(totalWeight - 100) > 0.1) {
          issues.push(`Randomizer "${n.title}" branch weights total ${totalWeight}%, must equal 100%.`);
        }
      }
    });

    // Check reachability from start
    if (startNodes.length === 1) {
      const visited = new Set<string>();
      const queue = [startNodes[0].id];

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (!visited.has(currentId)) {
          visited.add(currentId);
          // find outgoing edges
          const outEdges = currentTree.edges.filter((e) => e.fromNodeId === currentId);
          for (const edge of outEdges) {
            if (!visited.has(edge.toNodeId) && nodeMap.has(edge.toNodeId)) {
              queue.push(edge.toNodeId);
            }
          }
          // also check direct next pointer
          const node = nodeMap.get(currentId);
          if (node?.next && !visited.has(node.next) && nodeMap.has(node.next)) {
            queue.push(node.next);
          }
        }
      }

      const unreachable = currentTree.nodes.filter((n) => !visited.has(n.id));
      if (unreachable.length > 0) {
        issues.push(`${unreachable.length} node(s) cannot be reached from Start (${unreachable.map((u) => u.title).join(', ')}).`);
      }
    }

    return issues;
  };

  const validationIssues = validateTree(tree);

  // Synchronize edges with node next/branches
  const updateTreeState = (newNodes: ExperimentTreeNode[], newEdges?: ExperimentTreeEdge[]) => {
    let edges = newEdges || [...tree.edges];

    // Rebuild edges to ensure consistency
    const generatedEdges: ExperimentTreeEdge[] = [];
    newNodes.forEach((node) => {
      if (node.next && newNodes.some((n) => n.id === node.next)) {
        generatedEdges.push({
          id: `e_${node.id}_${node.next}`,
          fromNodeId: node.id,
          toNodeId: node.next,
          label: 'Next',
        });
      }
      if (node.type === 'randomiser' && node.randomiserSettings?.branches) {
        node.randomiserSettings.branches.forEach((b) => {
          if (b.targetNodeId && newNodes.some((n) => n.id === b.targetNodeId)) {
            generatedEdges.push({
              id: `e_rnd_${node.id}_${b.targetNodeId}`,
              fromNodeId: node.id,
              toNodeId: b.targetNodeId,
              label: `${b.weightPct}% ${b.ratioLabel || ''}`.trim(),
            });
          }
        });
      }
      if (node.type === 'branch' && node.branchSettings) {
        if (node.branchSettings.trueNodeId) {
          generatedEdges.push({
            id: `e_br_true_${node.id}`,
            fromNodeId: node.id,
            toNodeId: node.branchSettings.trueNodeId,
            label: `If True (${node.branchSettings.variableName} ${node.branchSettings.operator} ${node.branchSettings.value})`,
          });
        }
        if (node.branchSettings.falseNodeId) {
          generatedEdges.push({
            id: `e_br_false_${node.id}`,
            fromNodeId: node.id,
            toNodeId: node.branchSettings.falseNodeId,
            label: 'Else',
          });
        }
      }
    });

    const finalTree: ExperimentTree = {
      nodes: newNodes,
      edges: generatedEdges,
    };

    updateExperimentTree(finalTree);
  };

  // Dragging handlers
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggedNodeId(nodeId);

    const node = tree.nodes.find((n) => n.id === nodeId);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: (e.clientX - rect.left) / zoomLevel - node.position.x,
        y: (e.clientY - rect.top) / zoomLevel - node.position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.round((e.clientX - rect.left) / zoomLevel - dragOffset.x));
    const newY = Math.max(20, Math.round((e.clientY - rect.top) / zoomLevel - dragOffset.y));

    const updatedNodes = tree.nodes.map((n) =>
      n.id === draggedNodeId ? { ...n, position: { x: newX, y: newY } } : n
    );

    updateTreeState(updatedNodes);
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Node additions
  const handleAddNode = (type: ExperimentTreeNodeType) => {
    const timestamp = Date.now().toString().slice(-4);
    const id = `node_${type}_${timestamp}`;

    let title = 'New Node';
    let taskId: string | undefined = undefined;
    let questionnaireId: string | undefined = undefined;
    let randomiserSettings = undefined;
    let branchSettings = undefined;
    let delaySettings = undefined;
    let finishSettings = undefined;

    const existingX = tree.nodes.map((n) => n.position.x);
    const maxX = existingX.length > 0 ? Math.max(...existingX) : 100;
    const position = { x: maxX + 180, y: 150 };

    switch (type) {
      case 'start':
        title = 'Protocol Start';
        break;
      case 'task':
        title = 'Cognitive Task';
        taskId = activeProject.tasks?.[0]?.id || 'task_stroop';
        break;
      case 'questionnaire':
        title = 'Survey / Scale';
        questionnaireId = activeProject.questionnaires?.[0]?.id || 'q_consent';
        break;
      case 'randomiser':
        title = 'Condition Split';
        randomiserSettings = {
          branches: [
            { id: 'b1', targetNodeId: '', weightPct: 50, ratioLabel: 'Group A' },
            { id: 'b2', targetNodeId: '', weightPct: 50, ratioLabel: 'Group B' },
          ],
        };
        break;
      case 'branch':
        title = 'Score Branch Filter';
        branchSettings = {
          variableName: 'score_phq9',
          operator: 'greater_than' as const,
          value: 10,
          trueNodeId: '',
          falseNodeId: '',
        };
        break;
      case 'delay':
        title = 'Participant Break';
        delaySettings = {
          durationSeconds: 120,
          message: 'Please take a 2-minute cognitive rest before continuing.',
        };
        break;
      case 'finish':
        title = 'Completion & Token';
        finishSettings = {
          completionCode: `STX-${Math.floor(1000 + Math.random() * 9000)}`,
          message: 'Experiment completed! Thank you for participating.',
        };
        break;
    }

    const newNode: ExperimentTreeNode = {
      id,
      type,
      title,
      position,
      taskId,
      questionnaireId,
      randomiserSettings,
      branchSettings,
      delaySettings,
      finishSettings,
    };

    updateTreeState([...tree.nodes, newNode]);
    setSelectedNodeId(id);
    setShowAddMenu(false);
    onToast(`Added ${type.toUpperCase()} node to experiment tree ✓`);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (tree.nodes.length <= 1) {
      onToast('An experiment must contain at least one node.');
      return;
    }
    const updated = tree.nodes.filter((n) => n.id !== nodeId);
    // clean up references
    const cleaned = updated.map((n) => {
      let next = n.next === nodeId ? undefined : n.next;
      let randomiserSettings = n.randomiserSettings;
      if (randomiserSettings?.branches) {
        randomiserSettings = {
          branches: randomiserSettings.branches.map((b) =>
            b.targetNodeId === nodeId ? { ...b, targetNodeId: '' } : b
          ),
        };
      }
      return { ...n, next, randomiserSettings };
    });

    updateTreeState(cleaned);
    setSelectedNodeId(null);
    onToast('Node removed from experiment tree.');
  };

  const handleUpdateSelectedNode = (partial: Partial<ExperimentTreeNode>) => {
    if (!selectedNodeId) return;
    const updatedNodes = tree.nodes.map((n) =>
      n.id === selectedNodeId ? { ...n, ...partial } : n
    );
    updateTreeState(updatedNodes);
  };

  const handleAutoLayout = () => {
    const startNode = tree.nodes.find((n) => n.type === 'start');
    if (!startNode) return;

    const layers: string[][] = [];
    const visited = new Set<string>();

    let currentLayer = [startNode.id];
    while (currentLayer.length > 0) {
      layers.push(currentLayer);
      currentLayer.forEach((id) => visited.add(id));

      const nextLayerSet = new Set<string>();
      currentLayer.forEach((id) => {
        const edges = tree.edges.filter((e) => e.fromNodeId === id);
        edges.forEach((e) => {
          if (!visited.has(e.toNodeId)) {
            nextLayerSet.add(e.toNodeId);
          }
        });
      });
      currentLayer = Array.from(nextLayerSet);
    }

    // Include unvisited / orphaned nodes in a side layer
    const remaining = tree.nodes.filter((n) => !visited.has(n.id)).map((n) => n.id);
    if (remaining.length > 0) {
      layers.push(remaining);
    }

    const updatedNodes = tree.nodes.map((node) => {
      let layerIdx = 0;
      let rowIdx = 0;

      layers.forEach((layer, lIdx) => {
        const found = layer.indexOf(node.id);
        if (found >= 0) {
          layerIdx = lIdx;
          rowIdx = found;
        }
      });

      const totalInLayer = layers[layerIdx]?.length || 1;
      const verticalOffset = (rowIdx - (totalInLayer - 1) / 2) * 160 + 200;

      return {
        ...node,
        position: {
          x: 60 + layerIdx * 240,
          y: Math.max(60, verticalOffset),
        },
      };
    });

    updateTreeState(updatedNodes);
    onToast('Auto-arranged nodes into sequential layout ✓');
  };

  const handleResetDefault = () => {
    updateExperimentTree(DEFAULT_EXPERIMENT_TREE);
    setSelectedNodeId(null);
    onToast('Reset experiment tree to gold-standard Stroop & Flanker template ✓');
  };

  // Node type styling helpers
  const getNodeColor = (type: ExperimentTreeNodeType) => {
    switch (type) {
      case 'start':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', badge: 'bg-emerald-600 text-white', icon: Play };
      case 'questionnaire':
        return { bg: 'bg-indigo-500/10', border: 'border-indigo-500/40', badge: 'bg-indigo-600 text-white', icon: FileText };
      case 'task':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/40', badge: 'bg-amber-600 text-white', icon: Brain };
      case 'randomiser':
        return { bg: 'bg-purple-500/10', border: 'border-purple-500/40', badge: 'bg-purple-600 text-white', icon: Shuffle };
      case 'branch':
        return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', badge: 'bg-cyan-600 text-white', icon: GitBranch };
      case 'delay':
        return { bg: 'bg-orange-500/10', border: 'border-orange-500/40', badge: 'bg-orange-600 text-white', icon: Clock };
      case 'finish':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', badge: 'bg-emerald-700 text-white', icon: Flag };
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0f1d] text-slate-100 overflow-hidden select-none">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#0d1424] z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-white">
                Experiment Tree Architecture
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Gorilla Flow v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Visual participant workflow engine • {tree.nodes.length} nodes • {tree.edges.length} connections
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Add Node Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Node
            </button>

            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Select Node Type
                </div>
                <button
                  onClick={() => handleAddNode('questionnaire')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-medium">Questionnaire Node</div>
                    <div className="text-[10px] text-slate-400">Surveys, Likert scales, consent</div>
                  </div>
                </button>
                <button
                  onClick={() => handleAddNode('task')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-amber-600/20 hover:text-amber-300 transition-colors text-left"
                >
                  <Brain className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-medium">Task Node</div>
                    <div className="text-[10px] text-slate-400">Reaction-time cognitive displays</div>
                  </div>
                </button>
                <button
                  onClick={() => handleAddNode('randomiser')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-purple-600/20 hover:text-purple-300 transition-colors text-left"
                >
                  <Shuffle className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-medium">Randomiser Node</div>
                    <div className="text-[10px] text-slate-400">50/50 between-subject condition split</div>
                  </div>
                </button>
                <button
                  onClick={() => handleAddNode('branch')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-cyan-600/20 hover:text-cyan-300 transition-colors text-left"
                >
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-medium">Conditional Branch</div>
                    <div className="text-[10px] text-slate-400">Route participant based on scores</div>
                  </div>
                </button>
                <button
                  onClick={() => handleAddNode('delay')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-orange-600/20 hover:text-orange-300 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-orange-400" />
                  <div>
                    <div className="font-medium">Delay / Rest Node</div>
                    <div className="text-[10px] text-slate-400">Fixed duration cognitive break</div>
                  </div>
                </button>
                <button
                  onClick={() => handleAddNode('finish')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-emerald-600/20 hover:text-emerald-300 transition-colors text-left"
                >
                  <Flag className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-medium">Finish Node</div>
                    <div className="text-[10px] text-slate-400">Completion code & data save</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPresetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 transition-colors border border-purple-800/80 shadow-sm"
            title="Load Pre-Built Experiment Tree Protocols"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Preset Protocols
          </button>

          <button
            onClick={handleAutoLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            title="Auto-organize layout"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Auto Layout
          </button>

          <button
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Reset to default template"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Validation Pill */}
          {validationIssues.length === 0 ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tree Ready</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-medium cursor-pointer"
              title={validationIssues.join('\n')}
              onClick={() => onToast(`⚠️ ${validationIssues[0]}`)}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{validationIssues.length} Warning{validationIssues.length > 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Launch Participant Runner */}
          {onLaunchParticipantPreview && (
            <button
              onClick={onLaunchParticipantPreview}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm shadow-emerald-950 ml-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Test Run Tree
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas + Inspector Split View */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Visual Graph Canvas Area */}
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => setSelectedNodeId(null)}
          className="flex-1 h-full w-full relative overflow-auto cursor-grab active:cursor-grabbing"
          style={{
            backgroundImage: `radial-gradient(circle, #1e293b 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundColor: '#070b14',
          }}
        >
          {/* SVG Overlay for Connections / Edges */}
          <svg className="absolute inset-0 pointer-events-none w-[2800px] h-[1600px] z-0">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
              </marker>
              <marker
                id="arrowhead-selected"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
              </marker>
            </defs>

            {tree.edges.map((edge) => {
              const fromNode = tree.nodes.find((n) => n.id === edge.fromNodeId);
              const toNode = tree.nodes.find((n) => n.id === edge.toNodeId);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.position.x + 190;
              const y1 = fromNode.position.y + 45;
              const x2 = toNode.position.x;
              const y2 = toNode.position.y + 45;

              const deltaX = Math.abs(x2 - x1);
              const controlPointOffset = Math.max(50, deltaX * 0.45);

              const isEdgeActive =
                selectedNodeId === edge.fromNodeId || selectedNodeId === edge.toNodeId;

              const pathString = `M ${x1} ${y1} C ${x1 + controlPointOffset} ${y1}, ${x2 - controlPointOffset} ${y2}, ${x2} ${y2}`;

              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={edge.id}>
                  {/* Glowing background line for active edge */}
                  {isEdgeActive && (
                    <path
                      d={pathString}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="5"
                      opacity="0.3"
                    />
                  )}
                  {/* Core connection curve */}
                  <path
                    d={pathString}
                    fill="none"
                    stroke={isEdgeActive ? '#38bdf8' : '#4f46e5'}
                    strokeWidth={isEdgeActive ? '2.5' : '2'}
                    markerEnd={isEdgeActive ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
                    strokeDasharray={edge.label?.includes('If') ? '4 2' : 'none'}
                  />
                  {/* Label badge */}
                  {edge.label && (
                    <g transform={`translate(${midX}, ${midY - 10})`}>
                      <rect
                        x="-45"
                        y="-10"
                        width="90"
                        height="20"
                        rx="4"
                        fill="#0f172a"
                        stroke={isEdgeActive ? '#38bdf8' : '#334155'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {edge.label.length > 15 ? edge.label.slice(0, 14) + '…' : edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Node Cards */}
          <div className="relative w-[2800px] h-[1600px] z-10">
            {tree.nodes.map((node) => {
              const { bg, border, badge, icon: Icon } = getNodeColor(node.type);
              const isSelected = selectedNodeId === node.id;

              // Node summary info
              let subInfo = '';
              if (node.type === 'task') {
                const boundTask = activeProject.tasks?.find((t) => t.id === node.taskId);
                subInfo = boundTask
                  ? `${boundTask.displays.length} screens • ${boundTask.spreadsheet.length} trials`
                  : '⚠️ No task linked';
              } else if (node.type === 'questionnaire') {
                const boundQ = activeProject.questionnaires?.find((q) => q.id === node.questionnaireId);
                const itemsCount = boundQ?.pages.reduce((acc, p) => acc + p.items.length, 0) || 0;
                subInfo = boundQ ? `${itemsCount} items • ${boundQ.category}` : '⚠️ No scale linked';
              } else if (node.type === 'randomiser') {
                const branches = node.randomiserSettings?.branches || [];
                subInfo = `${branches.length} branches • ${branches.map((b) => `${b.weightPct}%`).join('/')}`;
              } else if (node.type === 'branch') {
                subInfo = `${node.branchSettings?.variableName || 'score'} ${node.branchSettings?.operator || '>'} ${node.branchSettings?.value || 0}`;
              } else if (node.type === 'delay') {
                subInfo = `${node.delaySettings?.durationSeconds || 60}s break`;
              } else if (node.type === 'finish') {
                subInfo = `Code: ${node.finishSettings?.completionCode || 'AUTO'}`;
              } else if (node.type === 'start') {
                subInfo = 'Participant entry';
              }

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  style={{
                    transform: `translate(${node.position.x}px, ${node.position.y}px)`,
                  }}
                  className={`absolute w-52 rounded-xl border transition-shadow cursor-grab active:cursor-grabbing backdrop-blur-md ${bg} ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-xl shadow-cyan-950'
                      : `${border} hover:border-slate-500 shadow-md shadow-black/40`
                  }`}
                >
                  {/* Top Bar of Node */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge}`}
                    >
                      {node.type}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  {/* Body */}
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-white truncate" title={node.title}>
                      {node.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 truncate" title={subInfo}>
                      {subInfo}
                    </p>
                  </div>

                  {/* Output Port Indicator */}
                  {node.type !== 'finish' && (
                    <div
                      className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center shadow"
                      title="Next node connector"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}

                  {/* Input Port Indicator */}
                  {node.type !== 'start' && (
                    <div
                      className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-600 border-2 border-slate-900 flex items-center justify-center shadow"
                      title="Input connection"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Inspector Drawer */}
        {selectedNode ? (
          <div className="w-80 border-l border-slate-800 bg-[#0d1424] flex flex-col h-full overflow-y-auto z-20 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Node Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inspector Content */}
            <div className="p-4 space-y-5 flex-1">
              {/* Title Field */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Node Title
                </label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => handleUpdateSelectedNode({ title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Node-Type Specific Configurations */}
              {selectedNode.type === 'task' && (
                <div className="space-y-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Linked Cognitive Task
                    </span>
                    {onOpenTaskBuilder && (
                      <button
                        onClick={() => onOpenTaskBuilder(selectedNode.taskId)}
                        className="text-[11px] text-amber-300 hover:underline flex items-center gap-1"
                      >
                        Edit Task <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <select
                    value={selectedNode.taskId || ''}
                    onChange={(e) => handleUpdateSelectedNode({ taskId: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select a task...</option>
                    {activeProject.tasks?.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.spreadsheet.length} trials)
                      </option>
                    ))}
                  </select>

                  {selectedNode.taskId && (
                    <div className="text-[11px] text-slate-400 space-y-1">
                      {(() => {
                        const t = activeProject.tasks?.find((task) => task.id === selectedNode.taskId);
                        if (!t) return null;
                        return (
                          <>
                            <div>Displays: {t.displays.map((d) => d.name).join(' ➔ ')}</div>
                            <div>Randomized: {t.randomizeTrials ? 'Yes' : 'No'}</div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {selectedNode.type === 'questionnaire' && (
                <div className="space-y-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                      Linked Questionnaire
                    </span>
                    {onOpenQuestionnaireBuilder && (
                      <button
                        onClick={() => onOpenQuestionnaireBuilder(selectedNode.questionnaireId)}
                        className="text-[11px] text-indigo-300 hover:underline flex items-center gap-1"
                      >
                        Edit Form <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <select
                    value={selectedNode.questionnaireId || ''}
                    onChange={(e) => handleUpdateSelectedNode({ questionnaireId: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select a questionnaire...</option>
                    {activeProject.questionnaires?.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name} ({q.category})
                      </option>
                    ))}
                  </select>

                  {selectedNode.questionnaireId && (
                    <div className="text-[11px] text-slate-400 space-y-1">
                      {(() => {
                        const q = activeProject.questionnaires?.find((item) => item.id === selectedNode.questionnaireId);
                        if (!q) return null;
                        const totalItems = q.pages.reduce((a, p) => a + p.items.length, 0);
                        return (
                          <>
                            <div>Pages: {q.pages.length} • Total Items: {totalItems}</div>
                            {q.scoringRule && <div>Scoring: {q.scoringRule.scaleName || 'Enabled'}</div>}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {selectedNode.type === 'randomiser' && (
                <div className="space-y-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                    Randomization Branches
                  </span>
                  <div className="space-y-2">
                    {(selectedNode.randomiserSettings?.branches || []).map((branch, idx) => (
                      <div key={branch.id} className="p-2 rounded bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={branch.ratioLabel}
                            onChange={(e) => {
                              const newBranches = [...(selectedNode.randomiserSettings?.branches || [])];
                              newBranches[idx].ratioLabel = e.target.value;
                              handleUpdateSelectedNode({
                                randomiserSettings: { branches: newBranches },
                              });
                            }}
                            className="w-2/3 px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-200"
                            placeholder="Branch Label"
                          />
                          <div className="flex items-center gap-1 w-1/3">
                            <input
                              type="number"
                              value={branch.weightPct}
                              onChange={(e) => {
                                const newBranches = [...(selectedNode.randomiserSettings?.branches || [])];
                                newBranches[idx].weightPct = Number(e.target.value);
                                handleUpdateSelectedNode({
                                  randomiserSettings: { branches: newBranches },
                                });
                              }}
                              className="w-full px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-200 text-center"
                            />
                            <span className="text-xs text-slate-400">%</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400">Target Node:</label>
                          <select
                            value={branch.targetNodeId || ''}
                            onChange={(e) => {
                              const newBranches = [...(selectedNode.randomiserSettings?.branches || [])];
                              newBranches[idx].targetNodeId = e.target.value;
                              handleUpdateSelectedNode({
                                randomiserSettings: { branches: newBranches },
                              });
                            }}
                            className="w-full mt-1 px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-200"
                          >
                            <option value="">Select target node...</option>
                            {tree.nodes
                              .filter((n) => n.id !== selectedNode.id && n.type !== 'start')
                              .map((n) => (
                                <option key={n.id} value={n.id}>
                                  {n.title} ({n.type})
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.type === 'finish' && (
                <div className="space-y-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Completion Settings
                  </span>
                  <div>
                    <label className="text-[10px] text-slate-400">Completion Code Token</label>
                    <input
                      type="text"
                      value={selectedNode.finishSettings?.completionCode || ''}
                      onChange={(e) =>
                        handleUpdateSelectedNode({
                          finishSettings: {
                            message: selectedNode.finishSettings?.message || '',
                            completionCode: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-emerald-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Thank You Message</label>
                    <textarea
                      rows={3}
                      value={selectedNode.finishSettings?.message || ''}
                      onChange={(e) =>
                        handleUpdateSelectedNode({
                          finishSettings: {
                            completionCode: selectedNode.finishSettings?.completionCode || '',
                            message: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* Next Connection (for linear nodes) */}
              {selectedNode.type !== 'randomiser' && selectedNode.type !== 'branch' && selectedNode.type !== 'finish' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Connects Forward To
                  </label>
                  <select
                    value={selectedNode.next || ''}
                    onChange={(e) => handleUpdateSelectedNode({ next: e.target.value || undefined })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">No outgoing connection (dead end)</option>
                    {tree.nodes
                      .filter((n) => n.id !== selectedNode.id && n.type !== 'start')
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          ➔ {n.title} ({n.type})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Delete Node Button */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Node
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-72 border-l border-slate-800 bg-[#0d1424] p-4 flex flex-col justify-between text-xs text-slate-400">
            <div>
              <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Tree Canvas Guide</span>
              </div>
              <p className="leading-relaxed">
                Click any node to configure its properties, link tasks/questionnaires, or define routing logic.
              </p>
              <div className="mt-4 space-y-2 border-t border-slate-800 pt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Start & Finish endpoints</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span>Questionnaires & Scales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Cognitive Task Displays</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Between-subject randomizers</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="font-semibold text-slate-300 mb-1">Gorilla Architecture</div>
              <p className="text-[11px] text-slate-500">
                Nodes are evaluated sequentially by the unified participant runtime.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preset Protocols Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Preset Experiment Tree Protocols</h3>
                  <p className="text-xs text-slate-400">
                    Validated end-to-end behavioural science pipelines with consent, screeners, randomizers, and tasks
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPresetModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Cards */}
            <div className="p-6 overflow-y-auto space-y-4">
              {PRESET_EXPERIMENT_TREES.map((preset) => {
                const nodeCount = preset.tree.nodes.length;
                const edgeCount = preset.tree.edges.length;
                const taskNodes = preset.tree.nodes.filter((n) => n.type === 'task').length;
                const surveyNodes = preset.tree.nodes.filter((n) => n.type === 'questionnaire').length;
                const hasRandomizer = preset.tree.nodes.some((n) => n.type === 'randomiser');

                return (
                  <div
                    key={preset.id}
                    className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-semibold text-white text-sm">{preset.name}</h4>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/80 text-purple-300">
                          {preset.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2.5 leading-relaxed">{preset.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{nodeCount} Nodes</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{edgeCount} Connectors</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300">{surveyNodes} Questionnaires</span>
                        <span className="px-2 py-0.5 rounded bg-amber-950/70 text-amber-300">{taskNodes} Cognitive Tasks</span>
                        {hasRandomizer && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300">Between-Subject Randomizer</span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => {
                          updateExperimentTree(preset.tree);
                          setShowPresetModal(false);
                          onToast(`Loaded protocol: ${preset.name} ✓`);
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-950 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Load Protocol
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
