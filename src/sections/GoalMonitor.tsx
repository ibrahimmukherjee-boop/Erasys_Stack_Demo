import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  Activity,
  Clock,
  Bot,
  BarChart3,
  ChevronRight,
  RotateCcw,
  Settings2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Goal } from '@/types/clearframe';

const demoGoals: Goal[] = [
  {
    id: '1',
    description: 'Process customer support tickets with 95% accuracy',
    status: 'on_track',
    confidence: 94,
    lastChecked: '2026-05-04T10:30:00Z',
    agentId: 'a1',
    agentName: 'SupportBot v2',
    checkpoints: [
      { id: 'c1', description: 'Intent classification accuracy > 90%', status: 'passed', timestamp: '2026-05-04T09:00:00Z' },
      { id: 'c2', description: 'Response relevance scoring', status: 'passed', timestamp: '2026-05-04T09:30:00Z' },
      { id: 'c3', description: 'Sentiment alignment check', status: 'pending' },
      { id: 'c4', description: 'Escalation rate < 5%', status: 'pending' },
    ],
  },
  {
    id: '2',
    description: 'Generate weekly analytics reports by Monday 9 AM',
    status: 'deviated',
    confidence: 67,
    lastChecked: '2026-05-04T09:15:00Z',
    agentId: 'a2',
    agentName: 'AnalyticsAgent',
    deviationReport: 'Tool call frequency exceeded threshold by 23%. SQL query execution time avg 4.2s (target: <2s). Data freshness check failed for Q1 financials.',
    checkpoints: [
      { id: 'c1', description: 'Data collection complete', status: 'passed', timestamp: '2026-05-04T08:00:00Z' },
      { id: 'c2', description: 'Analysis pipeline execution', status: 'failed', timestamp: '2026-05-04T09:15:00Z' },
      { id: 'c3', description: 'Report generation', status: 'pending' },
      { id: 'c4', description: 'Email distribution', status: 'pending' },
    ],
  },
  {
    id: '3',
    description: 'Monitor security alerts and escalate critical issues within 5 min',
    status: 'on_track',
    confidence: 99,
    lastChecked: '2026-05-04T11:00:00Z',
    agentId: 'a3',
    agentName: 'SecurityGuard',
    checkpoints: [
      { id: 'c1', description: 'Alert ingestion rate', status: 'passed', timestamp: '2026-05-04T10:00:00Z' },
      { id: 'c2', description: 'Severity scoring accuracy', status: 'passed', timestamp: '2026-05-04T10:30:00Z' },
      { id: 'c3', description: 'Escalation time < 5min', status: 'passed', timestamp: '2026-05-04T11:00:00Z' },
    ],
  },
  {
    id: '4',
    description: 'Code review assistant: suggest improvements with 80% acceptance rate',
    status: 'paused',
    confidence: 0,
    lastChecked: '2026-05-03T18:00:00Z',
    agentId: 'a4',
    agentName: 'CodeReviewer',
    deviationReport: 'Manually paused by operator for model retraining. Acceptance rate dropped to 72%.',
    checkpoints: [
      { id: 'c1', description: 'PR ingestion', status: 'passed', timestamp: '2026-05-03T12:00:00Z' },
      { id: 'c2', description: 'Suggestion quality score', status: 'failed', timestamp: '2026-05-03T18:00:00Z' },
      { id: 'c3', description: 'Acceptance rate tracking', status: 'pending' },
    ],
  },
  {
    id: '5',
    description: 'Document processing: OCR + classification pipeline',
    status: 'completed',
    confidence: 100,
    lastChecked: '2026-05-04T08:00:00Z',
    agentId: 'a5',
    agentName: 'DocuMind',
    checkpoints: [
      { id: 'c1', description: 'OCR accuracy > 98%', status: 'passed', timestamp: '2026-05-04T07:00:00Z' },
      { id: 'c2', description: 'Classification accuracy > 95%', status: 'passed', timestamp: '2026-05-04T07:30:00Z' },
      { id: 'c3', description: 'Processing time < 30s/doc', status: 'passed', timestamp: '2026-05-04T08:00:00Z' },
    ],
  },
];

const statusConfig = {
  on_track: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20', label: 'On Track' },
  deviated: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/20', label: 'Deviated' },
  paused: { icon: PauseCircle, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/20', label: 'Paused' },
  completed: { icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/20', label: 'Completed' },
};

const checkpointStatus = {
  passed: { icon: CheckCircle2, color: 'text-emerald-400' },
  failed: { icon: AlertTriangle, color: 'text-red-400' },
  pending: { icon: Clock, color: 'text-white/30' },
};

export function GoalMonitor() {
  const [goals, setGoals] = useState(demoGoals);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredGoals = statusFilter === 'all' ? goals : goals.filter((g) => g.status === statusFilter);

  const stats = {
    onTrack: goals.filter((g) => g.status === 'on_track').length,
    deviated: goals.filter((g) => g.status === 'deviated').length,
    paused: goals.filter((g) => g.status === 'paused').length,
    completed: goals.filter((g) => g.status === 'completed').length,
    avgConfidence: Math.round(goals.filter((g) => g.status !== 'paused').reduce((acc, g) => acc + g.confidence, 0) / goals.filter((g) => g.status !== 'paused').length),
  };

  const toggleGoalPause = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, status: g.status === 'paused' ? 'on_track' : 'paused' as any } : g
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">On Track</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.onTrack}</p>
              </div>
              <TrendingUp size={24} className="text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Deviated</p>
                <p className="text-2xl font-bold text-red-400">{stats.deviated}</p>
              </div>
              <TrendingDown size={24} className="text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Paused</p>
                <p className="text-2xl font-bold text-amber-400">{stats.paused}</p>
              </div>
              <PauseCircle size={24} className="text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Completed</p>
                <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
              </div>
              <CheckCircle2 size={24} className="text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Avg Confidence</p>
                <p className="text-2xl font-bold text-indigo-400">{stats.avgConfidence}%</p>
              </div>
              <Activity size={24} className="text-indigo-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {['all', 'on_track', 'deviated', 'paused', 'completed'].map((s) => {
          const label = s === 'all' ? 'All' : s === 'on_track' ? 'On Track' : s.charAt(0).toUpperCase() + s.slice(1);
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map((goal) => {
          const config = statusConfig[goal.status];
          const StatusIcon = config.icon;
          const isExpanded = expandedGoal === goal.id;

          return (
            <motion.div
              key={goal.id}
              layout
              className={`rounded-xl border ${config.bg} ${config.border} overflow-hidden`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                    <StatusIcon size={20} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-semibold">{goal.description}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Bot size={12} /> {goal.agentName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Last checked: {new Date(goal.lastChecked).toLocaleTimeString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={12} /> {goal.checkpoints.filter((c) => c.status === 'passed').length}/{goal.checkpoints.length} checkpoints
                      </span>
                    </div>

                    {/* Confidence Bar */}
                    {goal.status !== 'paused' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-white/40">Confidence Score</span>
                          <span className={`text-xs font-medium ${
                            goal.confidence >= 90 ? 'text-emerald-400' :
                            goal.confidence >= 70 ? 'text-amber-400' : 'text-red-400'
                          }`}>{goal.confidence}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.confidence}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              goal.confidence >= 90 ? 'bg-emerald-400' :
                              goal.confidence >= 70 ? 'bg-amber-400' : 'bg-red-400'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Deviation Report */}
                    {goal.deviationReport && (
                      <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle size={12} className="text-red-400" />
                          <span className="text-[10px] text-red-400 uppercase font-medium">Deviation Report</span>
                        </div>
                        <p className="text-xs text-white/60">{goal.deviationReport}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                      >
                        {isExpanded ? 'Hide' : 'View'} Checkpoints <ChevronRight size={12} className={`ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </Button>
                      {(goal.status === 'on_track' || goal.status === 'deviated') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          onClick={() => toggleGoalPause(goal.id)}
                        >
                          <PauseCircle size={12} className="mr-1" /> Pause
                        </Button>
                      )}
                      {goal.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => toggleGoalPause(goal.id)}
                        >
                          <RotateCcw size={12} className="mr-1" /> Resume
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 text-xs">
                        <Settings2 size={12} className="mr-1" /> Configure
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Checkpoints */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 ml-14"
                  >
                    <div className="space-y-2">
                      {goal.checkpoints.map((cp, idx) => {
                        const cpConfig = checkpointStatus[cp.status];
                        const CpIcon = cpConfig.icon;
                        return (
                          <div key={cp.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-[10px] text-white/40 font-medium">
                              {idx + 1}
                            </div>
                            <CpIcon size={14} className={cpConfig.color} />
                            <span className="text-xs flex-1">{cp.description}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              cp.status === 'passed' ? 'bg-emerald-500/15 text-emerald-400' :
                              cp.status === 'failed' ? 'bg-red-500/15 text-red-400' :
                              'bg-white/5 text-white/40'
                            }`}>
                              {cp.status}
                            </span>
                            {cp.timestamp && (
                              <span className="text-[10px] text-white/30">{new Date(cp.timestamp).toLocaleTimeString()}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
