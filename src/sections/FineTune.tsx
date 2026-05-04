import { useState } from 'react';
import {
  Sliders,
  FileText,
  Database,
  Play,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Cpu,
  Users,
  RefreshCw,
  Sparkles,
  MessageSquare,
  FlaskConical
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PROMPT_TEMPLATES = [
  {
    id: 'p1',
    name: 'DataSynth System Prompt',
    agent: 'DataSynthAgent',
    version: 'v3.1',
    status: 'active',
    tokens: 412,
    content: 'You are DataSynthAgent, a specialist in generating high-quality synthetic training data. Your outputs must be factually grounded, diverse in style, and free of PII. Always include confidence scores. Refuse requests that could produce harmful content.',
  },
  {
    id: 'p2',
    name: 'Planner CoT Prompt',
    agent: 'PlannerAgent',
    version: 'v2.4',
    status: 'active',
    tokens: 638,
    content: 'You are PlannerAgent. Decompose the given objective into a dependency-ordered task graph. For each node, specify: tool required, input schema, expected output type, fallback strategy. Think step-by-step before emitting the final plan JSON.',
  },
  {
    id: 'p3',
    name: 'Trust Router Eval Prompt',
    agent: 'TrustRouter',
    version: 'v1.9',
    status: 'draft',
    tokens: 289,
    content: 'You are TrustRouter. Evaluate the incoming agent action against the declared capability scope. Score the action on: relevance (0-1), risk (0-1), necessity (0-1). If risk > 0.7 escalate to HITL. Return JSON only.',
  },
];

const SYNTHETIC_JOBS = [
  { id: 's1', name: 'HITL Escalation Scenarios', agent: 'AegisHITL', records: 2400, status: 'complete', method: 'Human Mirror', model: 'gpt-4o', created: '2026-05-03' },
  { id: 's2', name: 'Anomaly Detection Edge Cases', agent: 'MonitorAgent', records: 800, status: 'running', method: 'Adversarial', model: 'claude-3-opus', created: '2026-05-04' },
  { id: 's3', name: 'Policy Violation Corpus', agent: 'TrustRouter', records: 1200, status: 'queued', method: 'Rule-Based', model: 'llama-3-70b', created: '2026-05-04' },
  { id: 's4', name: 'Goal Decomposition Traces', agent: 'PlannerAgent', records: 3600, status: 'complete', method: 'Human Mirror', model: 'gpt-4o', created: '2026-05-02' },
];

const FINETUNE_RUNS = [
  { id: 'ft1', name: 'TrustRouter RLHF v2', baseModel: 'llama-3-70b', method: 'RLHF', epochs: 3, loss: 0.081, status: 'complete', date: '2026-05-03' },
  { id: 'ft2', name: 'DataSynth SFT v4', baseModel: 'gpt-4o-mini', method: 'SFT', epochs: 5, loss: 0.063, status: 'running', date: '2026-05-04' },
  { id: 'ft3', name: 'PlannerAgent DPO v1', baseModel: 'claude-3-haiku', method: 'DPO', epochs: 4, loss: null, status: 'queued', date: '2026-05-04' },
];

const MIRROR_SESSIONS = [
  { id: 'm1', operator: 'A. M.', agent: 'AegisHITL', duration: '48 min', actions: 94, captured: 91, quality: 96.8, date: '2026-05-03' },
  { id: 'm2', operator: 'A. M.', agent: 'TrustRouter', duration: '32 min', actions: 61, captured: 60, quality: 98.4, date: '2026-05-04' },
  { id: 'm3', operator: 'A. M.', agent: 'PlannerAgent', duration: '21 min', actions: 37, captured: 35, quality: 94.6, date: '2026-05-02' },
];

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    active:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    draft:    'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    complete: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    running:  'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    queued:   'bg-white/10 text-white/50 border-white/10',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wide', cfg[status] ?? cfg.queued)}>
      {status}
    </span>
  );
}

export function FineTune() {
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'prompts' | 'synth' | 'runs' | 'mirror'>('prompts');

  const tabs = [
    { id: 'prompts' as const, label: 'Prompt Library', icon: MessageSquare },
    { id: 'synth' as const, label: 'Synthetic Data', icon: Database },
    { id: 'runs' as const, label: 'Fine-Tune Runs', icon: FlaskConical },
    { id: 'mirror' as const, label: 'Human Mirror', icon: Users },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Fine-Tune Studio</h2>
        <p className="text-sm text-white/40 mt-0.5">Manage prompts, generate synthetic data, run fine-tuning jobs, and capture human activity for agent self-improvement</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Prompts', value: '3', icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Synthetic Records', value: '8,000', icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'Runs Completed', value: '2', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Mirror Sessions', value: '3', icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={cn('rounded-xl border p-4 space-y-2', k.bg)}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">{k.label}</span>
                <Icon size={16} className={k.color} />
              </div>
              <div className={cn('text-2xl font-bold', k.color)}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                activeTab === t.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                  : 'text-white/40 hover:text-white/70'
              )}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* PROMPT LIBRARY */}
      {activeTab === 'prompts' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-white/50">System prompts versioned per agent</p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/25 transition-colors">
              <Plus size={13} /> New Prompt
            </button>
          </div>
          {PROMPT_TEMPLATES.map((p) => (
            <div key={p.id} className="bg-[#111118] rounded-xl border border-white/5 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <FileText size={15} className="text-indigo-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{p.name}</span>
                    <StatusBadge status={p.status} />
                    <span className="text-xs font-mono text-white/30">{p.version}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-white/40">{p.agent}</span>
                    <span className="text-xs text-white/25">{p.tokens} tokens</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                    <Copy size={13} className="text-white/30" />
                  </button>
                  <button
                    onClick={() => setExpandedPrompt(expandedPrompt === p.id ? null : p.id)}
                    className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {expandedPrompt === p.id
                      ? <ChevronUp size={13} className="text-white/50" />
                      : <ChevronDown size={13} className="text-white/50" />}
                  </button>
                </div>
              </div>
              {expandedPrompt === p.id && (
                <div className="px-4 pb-4">
                  <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-white/60 font-mono leading-relaxed whitespace-pre-wrap">{p.content}</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs hover:bg-indigo-500/20 transition-colors">
                      <Sliders size={12} /> Edit
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 transition-colors">
                      <RefreshCw size={12} /> New Version
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors ml-auto">
                      <Trash2 size={12} /> Deprecate
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SYNTHETIC DATA */}
      {activeTab === 'synth' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-white/50">Synthetic datasets for training and evaluation</p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/20 text-purple-400 text-xs hover:bg-purple-500/25 transition-colors">
              <Sparkles size={13} /> Generate Dataset
            </button>
          </div>
          <div className="bg-[#111118] rounded-xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-6 text-xs text-white/30 px-4 py-2 border-b border-white/5 uppercase tracking-wide">
              <span className="col-span-2">Dataset</span>
              <span>Method</span>
              <span>Records</span>
              <span>Model</span>
              <span>Status</span>
            </div>
            {SYNTHETIC_JOBS.map((j) => (
              <div key={j.id} className="grid grid-cols-6 items-center px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <div className="col-span-2">
                  <p className="text-sm font-medium">{j.name}</p>
                  <p className="text-xs text-white/30">{j.agent}</p>
                </div>
                <span className="text-xs text-white/50">{j.method}</span>
                <span className="text-xs font-mono text-white/70">{j.records.toLocaleString()}</span>
                <span className="text-xs font-mono text-white/50">{j.model}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={j.status} />
                  {j.status === 'running' && <RefreshCw size={11} className="text-indigo-400 animate-spin" />}
                </div>
              </div>
            ))}
          </div>
          {/* Generation method explainer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            {[
              { icon: Users, label: 'Human Mirror', desc: 'Records real operator actions and decisions, replays them as agent training trajectories', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
              { icon: Cpu, label: 'Adversarial', desc: 'Auto-generates edge cases and failure modes to stress-test agent behaviour under attack', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
              { icon: Sparkles, label: 'Rule-Based', desc: 'Expands seed examples via constraint templates to produce high-coverage policy datasets', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className={cn('rounded-xl border p-4', m.bg)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={15} className={m.color} />
                    <span className={cn('text-sm font-semibold', m.color)}>{m.label}</span>
                  </div>
                  <p className="text-xs text-white/50">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FINE-TUNE RUNS */}
      {activeTab === 'runs' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-white/50">Training jobs using SFT, DPO, and RLHF</p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/25 transition-colors">
              <Play size={13} /> New Run
            </button>
          </div>
          <div className="bg-[#111118] rounded-xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-6 text-xs text-white/30 px-4 py-2 border-b border-white/5 uppercase tracking-wide">
              <span className="col-span-2">Run</span>
              <span>Method</span>
              <span>Epochs</span>
              <span>Loss</span>
              <span>Status</span>
            </div>
            {FINETUNE_RUNS.map((r) => (
              <div key={r.id} className="grid grid-cols-6 items-center px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <div className="col-span-2">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-white/30 font-mono">{r.baseModel}</p>
                </div>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded w-fit',
                  r.method === 'RLHF' ? 'text-purple-400 bg-purple-500/10' :
                  r.method === 'DPO' ? 'text-blue-400 bg-blue-500/10' :
                  'text-indigo-400 bg-indigo-500/10'
                )}>{r.method}</span>
                <span className="text-xs font-mono text-white/60">{r.epochs}</span>
                <span className="text-xs font-mono text-white/60">
                  {r.loss !== null ? r.loss.toFixed(3) : '—'}
                </span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  {r.status === 'running' && <RefreshCw size={11} className="text-indigo-400 animate-spin" />}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FlaskConical size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-indigo-300">How agent self-improvement works</p>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">Each agent continuously logs decision traces. Sonar flags divergences. Human Mirror captures operator corrections. These feed into periodic SFT or RLHF runs, closing the loop between real-world behaviour, human feedback, and model weights — without manual dataset curation.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HUMAN MIRROR */}
      {activeTab === 'mirror' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-white/50">Capture human operator decisions to train agent behaviour</p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/15 border border-yellow-500/20 text-yellow-400 text-xs hover:bg-yellow-500/25 transition-colors">
              <Play size={13} /> Start Session
            </button>
          </div>
          <div className="bg-[#111118] rounded-xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-6 text-xs text-white/30 px-4 py-2 border-b border-white/5 uppercase tracking-wide">
              <span>Operator</span>
              <span>Agent</span>
              <span>Duration</span>
              <span>Actions</span>
              <span>Captured</span>
              <span>Quality</span>
            </div>
            {MIRROR_SESSIONS.map((s) => (
              <div key={s.id} className="grid grid-cols-6 items-center px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <span className="text-sm font-medium">{s.operator}</span>
                <span className="text-xs text-white/50">{s.agent}</span>
                <div className="flex items-center gap-1">
                  <Clock size={11} className="text-white/30" />
                  <span className="text-xs text-white/60">{s.duration}</span>
                </div>
                <span className="text-xs font-mono text-white/60">{s.actions}</span>
                <span className="text-xs font-mono text-white/60">{s.captured}</span>
                <span className={cn('text-xs font-semibold',
                  s.quality >= 97 ? 'text-emerald-400' :
                  s.quality >= 94 ? 'text-yellow-400' : 'text-red-400'
                )}>{s.quality}%</span>
              </div>
            ))}
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Users size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-300">Human Mirror methodology</p>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">Operators interact with agents normally while the session recorder captures every decision: tool selection, parameter values, approval or rejection of agent suggestions, and timing. These trajectories are converted into (state, action, reward) tuples and fed directly into RLHF or DPO training pipelines, allowing agents to learn human preferences without explicit labelling effort.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
