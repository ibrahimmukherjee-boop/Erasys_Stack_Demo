import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  FileSignature,
  Hash,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { TrustEntry } from '@/types/clearframe';

const demoTrustEntries: TrustEntry[] = [
  {
    id: 't1',
    pluginName: 'clearframe-goal-monitor',
    version: '0.2.1',
    author: 'ClearFrame Core Team',
    signature: 'ed25519:7a3f8c9d2e1b4f5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    hash: 'sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    status: 'verified',
    issuedAt: '2026-04-01T00:00:00Z',
    expiresAt: '2027-04-01T00:00:00Z',
    capabilities: ['goal-tracking', 'drift-detection', 'auto-pause'],
  },
  {
    id: 't2',
    pluginName: 'aegis-hitl-gateway',
    version: '0.1.5',
    author: 'Erasys Team',
    signature: 'ed25519:4c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9',
    hash: 'sha256:e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    status: 'verified',
    issuedAt: '2026-03-15T00:00:00Z',
    expiresAt: '2027-03-15T00:00:00Z',
    capabilities: ['human-approval', 'escalation', 'timeout-handling'],
  },
  {
    id: 't3',
    pluginName: 'sonar-threat-detection',
    version: '0.3.0',
    author: 'Security Team',
    signature: 'pending',
    hash: 'sha256:pending',
    status: 'pending',
    issuedAt: '2026-05-01T00:00:00Z',
    expiresAt: '2027-05-01T00:00:00Z',
    capabilities: ['prompt-injection-detection', 'data-exfiltration-guard', 'jailbreak-prevention'],
  },
  {
    id: 't4',
    pluginName: 'safepulse-audit-logger',
    version: '0.1.2',
    author: 'Erasys Team',
    signature: 'ed25519:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
    hash: 'sha256:c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    status: 'verified',
    issuedAt: '2026-02-20T00:00:00Z',
    expiresAt: '2027-02-20T00:00:00Z',
    capabilities: ['hmac-chain', 'tamper-evidence', 'forensic-export'],
  },
  {
    id: 't5',
    pluginName: 'legacy-data-connector',
    version: '0.0.8',
    author: 'External Contributor',
    signature: 'revoked:ed25519:9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b',
    hash: 'sha256:revoked1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'revoked',
    issuedAt: '2025-12-01T00:00:00Z',
    expiresAt: '2026-12-01T00:00:00Z',
    capabilities: ['database-access', 'file-read'],
  },
  {
    id: 't6',
    pluginName: 'experimental-llm-router',
    version: '0.4.0-beta',
    author: 'Research Team',
    signature: 'ed25519:2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    hash: 'sha256:f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    status: 'warning',
    issuedAt: '2026-04-20T00:00:00Z',
    expiresAt: '2026-10-20T00:00:00Z',
    capabilities: ['model-fallback', 'load-balancing'],
  },
];

const statusConfig = {
  verified: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20' },
  pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/20' },
  revoked: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/20' },
  warning: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/20' },
};

export function TrustRegistry() {
  const [entries] = useState(demoTrustEntries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'issued'>('name');

  const filtered = entries
    .filter((e) => {
      const matchesSearch = e.pluginName.toLowerCase().includes(search.toLowerCase()) ||
        e.author.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.pluginName.localeCompare(b.pluginName);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
    });

  const stats = {
    verified: entries.filter((e) => e.status === 'verified').length,
    pending: entries.filter((e) => e.status === 'pending').length,
    revoked: entries.filter((e) => e.status === 'revoked').length,
    warning: entries.filter((e) => e.status === 'warning').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Verified</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.verified}</p>
              </div>
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Pending</p>
                <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
              </div>
              <Clock size={24} className="text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Revoked</p>
                <p className="text-2xl font-bold text-red-400">{stats.revoked}</p>
              </div>
              <XCircle size={24} className="text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111118] border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Warnings</p>
                <p className="text-2xl font-bold text-orange-400">{stats.warning}</p>
              </div>
              <AlertTriangle size={24} className="text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'verified', 'pending', 'revoked', 'warning'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 outline-none"
        >
          <option value="name">Sort by Name</option>
          <option value="status">Sort by Status</option>
          <option value="issued">Sort by Date</option>
        </select>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {filtered.map((entry) => {
          const config = statusConfig[entry.status];
          const StatusIcon = config.icon;
          const isExpanded = expandedEntry === entry.id;

          return (
            <motion.div
              key={entry.id}
              layout
              className={`rounded-lg border transition-all ${config.bg} ${config.border}`}
            >
              <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
              >
                <StatusIcon size={20} className={config.color} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{entry.pluginName}</span>
                    <Badge variant="outline" className="text-[10px]">v{entry.version}</Badge>
                    <Badge className={`text-[10px] ${config.bg} ${config.color} border-${config.color}`}>
                      {entry.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">by {entry.author}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {entry.capabilities.slice(0, 2).map((cap) => (
                      <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                        {cap}
                      </span>
                    ))}
                    {entry.capabilities.length > 2 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                        +{entry.capabilities.length - 2}
                      </span>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                </div>
              </div>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-4 pb-4 border-t border-white/5 pt-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase mb-1">
                          <FileSignature size={10} /> Signature
                        </div>
                        <code className="text-[10px] text-white/60 bg-white/5 px-2 py-1 rounded block break-all">
                          {entry.signature}
                        </code>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase mb-1">
                          <Hash size={10} /> Hash
                        </div>
                        <code className="text-[10px] text-white/60 bg-white/5 px-2 py-1 rounded block break-all">
                          {entry.hash}
                        </code>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase mb-1">
                          <User size={10} /> Author
                        </div>
                        <p className="text-xs text-white/60">{entry.author}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase mb-1">
                            <Calendar size={10} /> Issued
                          </div>
                          <p className="text-xs text-white/60">{new Date(entry.issuedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase mb-1">
                            <Calendar size={10} /> Expires
                          </div>
                          <p className="text-xs text-white/60">{new Date(entry.expiresAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase mb-1">
                          <ShieldCheck size={10} /> Capabilities
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {entry.capabilities.map((cap) => (
                            <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {entry.status === 'pending' && (
                      <Button size="sm" className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600">
                        <CheckCircle2 size={12} className="mr-1" /> Approve
                      </Button>
                    )}
                    {entry.status === 'verified' && (
                      <Button size="sm" variant="outline" className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                        <XCircle size={12} className="mr-1" /> Revoke
                      </Button>
                    )}
                    {entry.status === 'revoked' && (
                      <Button size="sm" variant="outline" className="h-7 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                        <Lock size={12} className="mr-1" /> Reinstate
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 text-white/60 hover:bg-white/5">
                      <Unlock size={12} className="mr-1" /> View Audit Log
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
