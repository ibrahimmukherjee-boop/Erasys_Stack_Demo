import { useState, useEffect } from 'react';
import {
  Radio,
  AlertTriangle,
  ShieldAlert,
  Activity,
  Eye,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bot,
  Brain,
  Lock,
  Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThreatEvent {
  id: string;
  time: string;
  agent: string;
  type: 'anomaly' | 'policy_violation' | 'prompt_injection' | 'data_leak' | 'hallucination' | 'ok';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  message: string;
  model: string;
}

const INITIAL_EVENTS: ThreatEvent[] = [
  { id: '1', time: '05:29:41', agent: 'DataSynthAgent', type: 'prompt_injection', severity: 'critical', message: 'Prompt injection attempt detected in user-supplied context', model: 'gpt-4o' },
  { id: '2', time: '05:28:17', agent: 'ReportAgent', type: 'hallucination', severity: 'high', message: 'Confidence divergence >0.4 vs retrieval ground truth', model: 'claude-3-opus' },
  { id: '3', time: '05:27:03', agent: 'TrustRouter', type: 'policy_violation', severity: 'medium', message: 'Tool call attempted outside declared capability scope', model: 'llama-3-70b' },
  { id: '4', time: '05:26:55', agent: 'MonitorAgent', type: 'ok', severity: 'info', message: 'Routine health check passed — all outputs within bounds', model: 'gpt-4o-mini' },
  { id: '5', time: '05:25:30', agent: 'DataSynthAgent', type: 'data_leak', severity: 'high', message: 'PII pattern matched in agent output before redaction pass', model: 'gpt-4o' },
  { id: '6', time: '05:24:11', agent: 'PlannerAgent', type: 'anomaly', severity: 'medium', message: 'Token usage spike: 3.8x above rolling 5-min baseline', model: 'claude-3-haiku' },
  { id: '7', time: '05:22:44', agent: 'ReportAgent', type: 'ok', severity: 'info', message: 'Output verified against policy — cleared for delivery', model: 'claude-3-opus' },
  { id: '8', time: '05:21:09', agent: 'TrustRouter', type: 'anomaly', severity: 'low', message: 'Latency outlier: p99 response 4.2s vs p99 baseline 1.1s', model: 'llama-3-70b' },
];

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400', label: 'CRITICAL' },
  high:     { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400', label: 'HIGH' },
  medium:   { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400', label: 'MEDIUM' },
  low:      { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400', label: 'LOW' },
  info:     { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400', label: 'INFO' },
};

const TYPE_ICON: Record<ThreatEvent['type'], React.ElementType> = {
  anomaly: Activity,
  policy_violation: Lock,
  prompt_injection: Zap,
  data_leak: Eye,
  hallucination: Brain,
  ok: CheckCircle2,
};

const TYPE_LABEL: Record<ThreatEvent['type'], string> = {
  anomaly: 'Anomaly',
  policy_violation: 'Policy Violation',
  prompt_injection: 'Prompt Injection',
  data_leak: 'Data Leak',
  hallucination: 'Hallucination',
  ok: 'Cleared',
};

const KPI_DATA = [
  { label: 'Active Monitors', value: '12', sub: '4 agents · 8 models', icon: Radio, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { label: 'Threats (24h)', value: '7', sub: '2 critical · 3 high', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { label: 'Avg Response Time', value: '1.4s', sub: 'p99: 3.8s', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { label: 'Policy Compliance', value: '96.3%', sub: '+1.2% vs yesterday', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

const MODEL_HEALTH = [
  { model: 'gpt-4o', calls: 1842, anomalies: 3, compliance: 97.4, status: 'healthy' },
  { model: 'claude-3-opus', calls: 924, anomalies: 2, compliance: 95.1, status: 'warning' },
  { model: 'llama-3-70b', calls: 611, anomalies: 1, compliance: 98.7, status: 'healthy' },
  { model: 'gpt-4o-mini', calls: 3201, anomalies: 0, compliance: 99.2, status: 'healthy' },
  { model: 'claude-3-haiku', calls: 780, anomalies: 1, compliance: 96.8, status: 'warning' },
];

export function Sonar() {
  const [events, setEvents] = useState<ThreatEvent[]>(INITIAL_EVENTS);
  const [filter, setFilter] = useState<'all' | ThreatEvent['severity']>('all');
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate a live feed entry every 9s
  useEffect(() => {
    if (ticker === 0) return;
    if (ticker % 3 !== 0) return;
    const types: ThreatEvent['type'][] = ['ok', 'anomaly', 'ok', 'policy_violation', 'ok'];
    const severities: ThreatEvent['severity'][] = ['info', 'low', 'info', 'medium', 'info'];
    const agents = ['PlannerAgent', 'MonitorAgent', 'TrustRouter', 'DataSynthAgent'];
    const models = ['gpt-4o-mini', 'llama-3-70b', 'gpt-4o', 'claude-3-haiku'];
    const idx = ticker % types.length;
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    const newEvent: ThreatEvent = {
      id: `live-${ticker}`,
      time: ts,
      agent: agents[idx % agents.length],
      type: types[idx],
      severity: severities[idx],
      message: types[idx] === 'ok' ? 'Output verified — no anomalies detected' : 'Deviation from baseline behaviour pattern',
      model: models[idx % models.length],
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 19)]);
  }, [ticker]);

  const filtered = filter === 'all' ? events : events.filter(e => e.severity === filter);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs text-red-400 font-mono uppercase tracking-widest">Live Feed</span>
          </div>
          <h2 className="text-2xl font-bold">Sonar</h2>
          <p className="text-sm text-white/40 mt-0.5">AI Security Operations Centre — real-time LLM &amp; agent threat monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Wifi size={13} className="text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">Monitoring Active</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={cn('rounded-xl border p-4 space-y-2', k.bg)}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">{k.label}</span>
                <Icon size={16} className={k.color} />
              </div>
              <div className={cn('text-2xl font-bold', k.color)}>{k.value}</div>
              <div className="text-xs text-white/30">{k.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Event Stream */}
        <div className="xl:col-span-2 bg-[#111118] rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-yellow-400" />
              <span className="text-sm font-semibold">Event Stream</span>
              <span className="text-xs text-white/30 font-mono">{events.length} events</span>
            </div>
            <div className="flex gap-1">
              {(['all', 'critical', 'high', 'medium', 'low', 'info'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                    filter === s
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-white/30 hover:text-white/60'
                  )}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
            {filtered.map((ev) => {
              const sev = SEVERITY_CONFIG[ev.severity];
              const TypeIcon = TYPE_ICON[ev.type];
              return (
                <div key={ev.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className={cn('mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border', sev.bg)}>
                    <TypeIcon size={12} className={sev.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('text-xs font-mono font-bold', sev.color)}>{sev.label}</span>
                      <span className="text-xs text-white/50">{TYPE_LABEL[ev.type]}</span>
                      <span className="text-xs text-white/25 font-mono">{ev.time}</span>
                    </div>
                    <p className="text-xs text-white/70 mt-0.5 truncate">{ev.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Bot size={10} className="text-indigo-400" />
                      <span className="text-[10px] text-white/40">{ev.agent}</span>
                      <span className="text-[10px] text-white/20">·</span>
                      <span className="text-[10px] text-white/40 font-mono">{ev.model}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Health */}
        <div className="bg-[#111118] rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <Brain size={15} className="text-purple-400" />
            <span className="text-sm font-semibold">Model Health</span>
          </div>
          <div className="p-4 space-y-3">
            {MODEL_HEALTH.map((m) => (
              <div key={m.model} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {m.status === 'healthy'
                      ? <CheckCircle2 size={12} className="text-emerald-400" />
                      : m.status === 'warning'
                      ? <AlertCircle size={12} className="text-yellow-400" />
                      : <XCircle size={12} className="text-red-400" />}
                    <span className="text-xs font-mono text-white/80">{m.model}</span>
                  </div>
                  <span className={cn('text-xs font-medium',
                    m.compliance >= 98 ? 'text-emerald-400' :
                    m.compliance >= 95 ? 'text-yellow-400' : 'text-red-400'
                  )}>{m.compliance}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div
                    className={cn('h-1 rounded-full transition-all',
                      m.compliance >= 98 ? 'bg-emerald-400' :
                      m.compliance >= 95 ? 'bg-yellow-400' : 'bg-red-400'
                    )}
                    style={{ width: `${m.compliance}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/30">
                  <span>{m.calls.toLocaleString()} calls</span>
                  <span>{m.anomalies} anomaly{m.anomalies !== 1 ? 'ies' : ''}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Threat breakdown */}
          <div className="border-t border-white/5 p-4">
            <p className="text-xs text-white/40 mb-3">Threat Breakdown (24h)</p>
            <div className="space-y-2">
              {[
                { label: 'Prompt Injection', count: 2, color: 'bg-red-400' },
                { label: 'Hallucination', count: 2, color: 'bg-orange-400' },
                { label: 'Data Leak', count: 1, color: 'bg-yellow-400' },
                { label: 'Policy Violation', count: 1, color: 'bg-blue-400' },
                { label: 'Anomaly', count: 3, color: 'bg-purple-400' },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{}} />
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', t.color)} />
                  <span className="text-xs text-white/50 flex-1">{t.label}</span>
                  <span className="text-xs font-mono text-white/70">{t.count}</span>
                  <div className="w-16 bg-white/5 rounded-full h-1">
                    <div className={cn('h-1 rounded-full', t.color)} style={{ width: `${(t.count / 9) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
