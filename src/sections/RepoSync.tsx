import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Github,
  ChevronRight,
  Plus,
  GitCommit,
  GitPullRequest,
  Bug
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RepoSync as RepoSyncType } from '@/types/clearframe';

const demoRepos: RepoSyncType[] = [
  {
    id: 'r1',
    name: 'ClearFrame',
    url: 'https://github.com/ibrahimmukherjee-boop/ClearFrame',
    branch: 'main',
    lastSync: '2026-05-04T11:00:00Z',
    status: 'synced',
    commitsBehind: 0,
    description: 'Open-source AI agent protocol with auditability, safety controls, and live AgentOps dashboard',
  },
  {
    id: 'r2',
    name: 'erasys-sandbox',
    url: 'https://github.com/ibrahimmukherjee-boop/erasys-sandbox',
    branch: 'main',
    lastSync: '2026-05-04T10:45:00Z',
    status: 'synced',
    commitsBehind: 0,
    description: 'Interactive PoC & client sandbox for the Erasys AI safety stack',
  },
  {
    id: 'r3',
    name: 'FahmIQ',
    url: 'https://github.com/ibrahimmukherjee-boop/FahmIQ',
    branch: 'main',
    lastSync: '2026-05-04T10:30:00Z',
    status: 'syncing',
    commitsBehind: 2,
    description: 'Intelligence augmentation platform with reasoning transparency',
  },
  {
    id: 'r4',
    name: 'TrustRegistry',
    url: 'https://github.com/ibrahimmukherjee-boop/TrustRegistry',
    branch: 'main',
    lastSync: '2026-05-04T09:00:00Z',
    status: 'synced',
    commitsBehind: 0,
    description: 'Signed plugin registry with Ed25519 signatures and hash pinning',
  },
  {
    id: 'r5',
    name: 'Aegis-HITL',
    url: 'https://github.com/ibrahimmukherjee-boop/Aegis-HITL',
    branch: 'develop',
    lastSync: '2026-05-03T18:00:00Z',
    status: 'error',
    commitsBehind: 5,
    description: 'Human-in-the-loop gateway for agent approval workflows',
  },
];

const statusConfig = {
  synced: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20', label: 'Synced' },
  syncing: { icon: RefreshCw, color: 'text-indigo-400', bg: 'bg-indigo-500/15', border: 'border-indigo-500/20', label: 'Syncing...' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/20', label: 'Error' },
  pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/20', label: 'Pending' },
};

export function RepoSync() {
  const [repos, setRepos] = useState(demoRepos);
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const syncRepo = (repoId: string) => {
    setRepos((prev) =>
      prev.map((r) => (r.id === repoId ? { ...r, status: 'syncing' as const } : r))
    );
    setTimeout(() => {
      setRepos((prev) =>
        prev.map((r) =>
          r.id === repoId ? { ...r, status: 'synced' as const, commitsBehind: 0, lastSync: new Date().toISOString() } : r
        )
      );
    }, 2000);
  };

  const syncAll = () => {
    setIsSyncingAll(true);
    repos.forEach((repo, idx) => {
      setTimeout(() => syncRepo(repo.id), idx * 500);
    });
    setTimeout(() => setIsSyncingAll(false), repos.length * 500 + 2500);
  };

  const totalBehind = repos.reduce((acc, r) => acc + r.commitsBehind, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Repository Sync</h2>
          <p className="text-xs text-white/40 mt-1">Sync your GitHub repos with the ClearFrame ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Github size={14} className="text-white/60" />
            <span className="text-xs text-white/60">ibrahimmukherjee-boop</span>
          </div>
          <Button
            size="sm"
            className="bg-indigo-500 hover:bg-indigo-600"
            onClick={syncAll}
            disabled={isSyncingAll}
          >
            <RefreshCw size={14} className={`mr-2 ${isSyncingAll ? 'animate-spin' : ''}`} />
            {isSyncingAll ? 'Syncing All...' : 'Sync All'}
          </Button>
          <Button size="sm" variant="outline" className="border-white/10">
            <Plus size={14} className="mr-1" /> Add Repo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Total Repos</p>
                <p className="text-2xl font-bold">{repos.length}</p>
              </div>
              <GitBranch size={24} className="text-indigo-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Synced</p>
                <p className="text-2xl font-bold text-emerald-400">{repos.filter((r) => r.status === 'synced').length}</p>
              </div>
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Needs Sync</p>
                <p className="text-2xl font-bold text-amber-400">{totalBehind}</p>
              </div>
              <Clock size={24} className="text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Errors</p>
                <p className="text-2xl font-bold text-red-400">{repos.filter((r) => r.status === 'error').length}</p>
              </div>
              <AlertCircle size={24} className="text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repo List */}
      <div className="space-y-3">
        {repos.map((repo) => {
          const config = statusConfig[repo.status];
          const StatusIcon = config.icon;
          const isExpanded = expandedRepo === repo.id;

          return (
            <motion.div
              key={repo.id}
              layout
              className={`rounded-xl border ${config.bg} ${config.border} overflow-hidden`}
            >
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                    <StatusIcon size={20} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold">{repo.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      {repo.commitsBehind > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                          {repo.commitsBehind} commits behind
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{repo.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <GitBranch size={12} /> {repo.branch}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Last sync: {new Date(repo.lastSync).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs"
                      onClick={() => syncRepo(repo.id)}
                      disabled={repo.status === 'syncing'}
                    >
                      <RefreshCw size={12} className={`mr-1 ${repo.status === 'syncing' ? 'animate-spin' : ''}`} />
                      {repo.status === 'syncing' ? 'Syncing' : 'Sync'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs"
                      onClick={() => window.open(repo.url, '_blank')}
                    >
                      <ExternalLink size={12} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs"
                      onClick={() => setExpandedRepo(isExpanded ? null : repo.id)}
                    >
                      <ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 pt-4 border-t border-white/5"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <GitCommit size={12} className="text-indigo-400" />
                          <span className="text-[10px] text-white/40 uppercase">Recent Commits</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs">feat: Add goal monitor checkpoint validation</div>
                          <div className="text-xs">fix: HITL timeout handling edge case</div>
                          <div className="text-xs">chore: Update trust registry schemas</div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <GitPullRequest size={12} className="text-emerald-400" />
                          <span className="text-[10px] text-white/40 uppercase">Pull Requests</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            #47: Add Sonar integration
                          </div>
                          <div className="text-xs flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            #46: Update node registry
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Bug size={12} className="text-red-400" />
                          <span className="text-[10px] text-white/40 uppercase">Issues</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            #12: Memory leak in graph builder
                          </div>
                          <div className="text-xs flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            #11: Docs update needed
                          </div>
                        </div>
                      </div>
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
