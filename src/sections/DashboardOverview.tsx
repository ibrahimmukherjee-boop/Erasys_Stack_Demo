import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Target,
  UserCheck,
  GitBranch,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Zap,
  Lock,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Goal, HITLRequest, TrustEntry, RepoSync, AgentRuntime } from '@/types/clearframe';

interface Props {
  onNavigate: (view: string) => void;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

// Demo data
const demoGoals: Goal[] = [
  { id: '1', description: 'Process customer support tickets with 95% accuracy', status: 'on_track', confidence: 94, lastChecked: '2026-05-04T10:30:00Z', agentId: 'a1', agentName: 'SupportBot v2', checkpoints: [{ id: 'c1', description: 'Intent classification', status: 'passed' }, { id: 'c2', description: 'Response generation', status: 'passed' }, { id: 'c3', description: 'Sentiment alignment', status: 'pending' }] },
  { id: '2', description: 'Generate weekly analytics reports', status: 'deviated', confidence: 67, lastChecked: '2026-05-04T09:15:00Z', agentId: 'a2', agentName: 'AnalyticsAgent', deviationReport: 'Tool call frequency exceeded threshold by 23%', checkpoints: [{ id: 'c1', description: 'Data collection', status: 'passed' }, { id: 'c2', description: 'Analysis pipeline', status: 'failed' }] },
  { id: '3', description: 'Monitor security alerts and escalate critical issues', status: 'on_track', confidence: 99, lastChecked: '2026-05-04T11:00:00Z', agentId: 'a3', agentName: 'SecurityGuard', checkpoints: [{ id: 'c1', description: 'Alert ingestion', status: 'passed' }, { id: 'c2', description: 'Severity scoring', status: 'passed' }] },
];

const demoHITL: HITLRequest[] = [
  { id: 'h1', agentId: 'a1', agentName: 'SupportBot v2', type: 'approval', payload: 'Draft response: "Your refund of $499.99 has been processed and will appear in 3-5 business days."', status: 'pending', createdAt: '2026-05-04T11:30:00Z', timeoutAt: '2026-05-04T12:30:00Z' },
  { id: 'h2', agentId: 'a2', agentName: 'AnalyticsAgent', type: 'revision', payload: 'Data access request for Q1 financial records - sensitivity level: HIGH', status: 'pending', createdAt: '2026-05-04T10:45:00Z', timeoutAt: '2026-05-04T11:45:00Z' },
];

const demoTrust: TrustEntry[] = [
  { id: 't1', pluginName: 'clearframe-goal-monitor', version: '0.2.1', author: 'ClearFrame Core', signature: 'ed25519:7a3f...9e2b', hash: 'sha256:a1b2...c3d4', status: 'verified', issuedAt: '2026-04-01', expiresAt: '2027-04-01', capabilities: ['goal-tracking', 'drift-detection'] },
  { id: 't2', pluginName: 'aegis-hitl-gateway', version: '0.1.5', author: 'Erasys Team', signature: 'ed25519:4c8d...1f3a', hash: 'sha256:e5f6...g7h8', status: 'verified', issuedAt: '2026-03-15', expiresAt: '2027-03-15', capabilities: ['human-approval', 'escalation'] },
  { id: 't3', pluginName: 'sonar-threat-detection', version: '0.3.0', author: 'Security Team', signature: 'ed25519:pending', hash: 'sha256:pending', status: 'pending', issuedAt: '2026-05-01', expiresAt: '2027-05-01', capabilities: ['prompt-injection-detection', 'data-exfiltration-guard'] },
];

const demoRepos: RepoSync[] = [
  { id: 'r1', name: 'ClearFrame', url: 'https://github.com/ibrahimmukherjee-boop/ClearFrame', branch: 'main', lastSync: '2026-05-04T11:00:00Z', status: 'synced', commitsBehind: 0, description: 'Core AI agent protocol' },
  { id: 'r2', name: 'erasys-sandbox', url: 'https://github.com/ibrahimmukherjee-boop/erasys-sandbox', branch: 'main', lastSync: '2026-05-04T10:45:00Z', status: 'synced', commitsBehind: 0, description: 'Interactive sandbox for AI safety stack' },
  { id: 'r3', name: 'FahmIQ', url: 'https://github.com/ibrahimmukherjee-boop/FahmIQ', branch: 'main', lastSync: '2026-05-04T10:30:00Z', status: 'syncing', commitsBehind: 2, description: 'Intelligence augmentation platform' },
];

const demoRuntimes: AgentRuntime[] = [
  { id: 'rt1', name: 'SupportBot v2', graphId: 'g1', status: 'running', startTime: '2026-05-04T09:00:00Z', toolCalls: 142, tokensUsed: 28400, currentNode: 'llm_openai', logs: [] },
  { id: 'rt2', name: 'AnalyticsAgent', graphId: 'g2', status: 'paused', startTime: '2026-05-04T08:30:00Z', toolCalls: 89, tokensUsed: 15200, currentNode: 'tool_sql', logs: [] },
  { id: 'rt3', name: 'SecurityGuard', graphId: 'g3', status: 'running', startTime: '2026-05-04T07:00:00Z', toolCalls: 256, tokensUsed: 42100, currentNode: 'tool_sonar', logs: [] },
];

export function DashboardOverview({ onNavigate }: Props) {
  const [animatedStats, setAnimatedStats] = useState({ agents: 0, trust: 0, goals: 0, hitl: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ agents: 3, trust: 98, goals: 3, hitl: 2 });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div {...fadeIn} transition={{ delay: 0 }}>
          <Card className="bg-[#111118] border-white/5 hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => onNavigate('builder')}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 mb-1">Active Agents</p>
                  <p className="text-2xl font-bold">{animatedStats.agents}</p>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <Activity size={10} /> 2 running, 1 paused
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <Bot size={22} className="text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="bg-[#111118] border-white/5 hover:border-emerald-500/30 transition-colors cursor-pointer" onClick={() => onNavigate('trust')}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 mb-1">Trust Score</p>
                  <p className="text-2xl font-bold">{animatedStats.trust}%</p>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={10} /> 2 verified, 1 pending
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <ShieldCheck size={22} className="text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <Card className="bg-[#111118] border-white/5 hover:border-pink-500/30 transition-colors cursor-pointer" onClick={() => onNavigate('goals')}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 mb-1">Goals Tracked</p>
                  <p className="text-2xl font-bold">{animatedStats.goals}</p>
                  <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                    <AlertTriangle size={10} /> 1 deviation detected
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/15 flex items-center justify-center">
                  <Target size={22} className="text-pink-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
          <Card className="bg-[#111118] border-white/5 hover:border-amber-500/30 transition-colors cursor-pointer" onClick={() => onNavigate('aegis')}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 mb-1">Pending Approvals</p>
                  <p className="text-2xl font-bold">{animatedStats.hitl}</p>
                  <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> Awaiting review
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <UserCheck size={22} className="text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Agents + HITL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Agents */}
        <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
          <Card className="bg-[#111118] border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Zap size={14} className="text-indigo-400" />
                  Active Agent Runtimes
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onNavigate('builder')}>
                  View All <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoRuntimes.map((rt) => (
                <div key={rt.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0',
                    rt.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                    rt.status === 'paused' ? 'bg-amber-400' :
                    rt.status === 'error' ? 'bg-red-400' : 'bg-white/20'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{rt.name}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                        rt.status === 'running' ? 'bg-emerald-500/15 text-emerald-400' :
                        rt.status === 'paused' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-red-500/15 text-red-400'
                      )}>{rt.status}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                      <span>{rt.toolCalls} tool calls</span>
                      <span>{(rt.tokensUsed / 1000).toFixed(1)}k tokens</span>
                      <span className="text-indigo-400">{rt.currentNode}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending HITL */}
        <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
          <Card className="bg-[#111118] border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Eye size={14} className="text-amber-400" />
                  Aegis Human-in-the-Loop
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onNavigate('aegis')}>
                  Review <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoHITL.map((req) => (
                <div key={req.id} className="p-3 rounded-lg bg-white/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-amber-400">{req.agentName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 uppercase">{req.type}</span>
                  </div>
                  <p className="text-xs text-white/60 line-clamp-2 mb-2">{req.payload}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30">
                      <Clock size={10} className="inline mr-1" />
                      Expires {new Date(req.timeoutAt).toLocaleTimeString()}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-6 text-[10px] border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">Approve</Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] border-red-500/30 text-red-400 hover:bg-red-500/10">Reject</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Goals + Trust + Repos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals */}
        <motion.div {...fadeIn} transition={{ delay: 0.6 }}>
          <Card className="bg-[#111118] border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Target size={14} className="text-pink-400" />
                  Goal Monitor
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onNavigate('goals')}>
                  Details <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoGoals.map((goal) => (
                <div key={goal.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium truncate pr-2">{goal.description}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0',
                      goal.status === 'on_track' ? 'bg-emerald-500/15 text-emerald-400' :
                      goal.status === 'deviated' ? 'bg-red-500/15 text-red-400' :
                      'bg-amber-500/15 text-amber-400'
                    )}>{goal.status}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-1000',
                        goal.confidence >= 90 ? 'bg-emerald-400' :
                        goal.confidence >= 70 ? 'bg-amber-400' : 'bg-red-400'
                      )}
                      style={{ width: `${goal.confidence}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-white/30">{goal.confidence}% confidence</span>
                    <span className="text-[10px] text-white/30">{goal.agentName}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Registry */}
        <motion.div {...fadeIn} transition={{ delay: 0.7 }}>
          <Card className="bg-[#111118] border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Lock size={14} className="text-emerald-400" />
                  Trust Registry
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onNavigate('trust')}>
                  View All <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoTrust.map((entry) => (
                <div key={entry.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{entry.pluginName}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full',
                      entry.status === 'verified' ? 'bg-emerald-500/15 text-emerald-400' :
                      entry.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-red-500/15 text-red-400'
                    )}>{entry.status}</span>
                  </div>
                  <p className="text-[10px] text-white/40 mb-1">v{entry.version} by {entry.author}</p>
                  <div className="flex flex-wrap gap-1">
                    {entry.capabilities.slice(0, 2).map((cap) => (
                      <span key={cap} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50">{cap}</span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Repo Sync */}
        <motion.div {...fadeIn} transition={{ delay: 0.8 }}>
          <Card className="bg-[#111118] border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <GitBranch size={14} className="text-indigo-400" />
                  Repository Sync
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onNavigate('repos')}>
                  Sync All <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoRepos.map((repo) => (
                <div key={repo.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{repo.name}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full',
                      repo.status === 'synced' ? 'bg-emerald-500/15 text-emerald-400' :
                      repo.status === 'syncing' ? 'bg-indigo-500/15 text-indigo-400' :
                      'bg-red-500/15 text-red-400'
                    )}>{repo.status}</span>
                  </div>
                  <p className="text-[10px] text-white/40 mb-1">{repo.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30">{repo.branch}</span>
                    {repo.commitsBehind > 0 && (
                      <span className="text-[10px] text-amber-400">{repo.commitsBehind} commits behind</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
