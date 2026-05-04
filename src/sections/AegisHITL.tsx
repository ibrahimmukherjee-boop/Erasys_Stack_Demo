import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bot,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  History,
  Search,
  Shield,
  Zap,
  PauseCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import type { HITLRequest } from '@/types/clearframe';

const demoRequests: HITLRequest[] = [
  {
    id: 'h1',
    agentId: 'a1',
    agentName: 'SupportBot v2',
    type: 'approval',
    payload: 'Draft response to customer #4291:\n\n"Dear Sarah,\n\nYour refund of $499.99 for Order #ORD-2026-4291 has been successfully processed. The funds will appear in your original payment method within 3-5 business days.\n\nYou will receive a confirmation email shortly.\n\nBest regards,\nSupport Team"',
    status: 'pending',
    createdAt: '2026-05-04T11:30:00Z',
    timeoutAt: '2026-05-04T12:30:00Z',
  },
  {
    id: 'h2',
    agentId: 'a2',
    agentName: 'AnalyticsAgent',
    type: 'revision',
    payload: 'Data access request for Q1 Financial Reports:\n- Sensitivity: HIGH\n- Data types: Revenue, EBITDA, Cash Flow\n- Access reason: Weekly executive dashboard\n- Requesting user: finance-team@company.com\n\nThis requires explicit approval due to sensitivity classification.',
    status: 'pending',
    createdAt: '2026-05-04T10:45:00Z',
    timeoutAt: '2026-05-04T11:45:00Z',
  },
  {
    id: 'h3',
    agentId: 'a3',
    agentName: 'SecurityGuard',
    type: 'approval',
    payload: 'Critical security alert escalation:\n\nAlert ID: SEC-2026-0847\nType: Potential data exfiltration\nSource: IP 192.168.1.105\nDetails: Unusual outbound data transfer detected (2.3GB to external IP)\n\nRecommended action: Block IP and initiate forensic capture\n\nThis is a HIGH severity alert requiring immediate human confirmation.',
    status: 'pending',
    createdAt: '2026-05-04T11:15:00Z',
    timeoutAt: '2026-05-04T11:30:00Z',
  },
  {
    id: 'h4',
    agentId: 'a1',
    agentName: 'SupportBot v2',
    type: 'approval',
    payload: 'Proposed compensation offer:\n\nCustomer #3852 experienced a 48-hour service outage.\nProposed compensation: 2 months free service ($79.98 value)\n\nPolicy threshold for auto-approval: <$50\nThis offer exceeds threshold and requires approval.',
    status: 'approved',
    createdAt: '2026-05-04T09:00:00Z',
    timeoutAt: '2026-05-04T10:00:00Z',
    reviewedAt: '2026-05-04T09:15:00Z',
    reviewer: 'Ibrahim Mukherjee',
    reviewNote: 'Approved. Customer is VIP tier, compensation is appropriate.',
  },
  {
    id: 'h5',
    agentId: 'a4',
    agentName: 'CodeReviewer',
    type: 'revision',
    payload: 'Large-scale database migration request:\n\nPR: #2847 - Migrate user_profiles to encrypted store\nAffected rows: ~2.3M\nEstimated downtime: 15 minutes\nRollback plan: Available (tested)\n\nRequires senior engineer approval before execution.',
    status: 'rejected',
    createdAt: '2026-05-04T08:30:00Z',
    timeoutAt: '2026-05-04T09:30:00Z',
    reviewedAt: '2026-05-04T08:45:00Z',
    reviewer: 'Ibrahim Mukherjee',
    reviewNote: 'Rejected. Schedule this during maintenance window (Saturday 2 AM). Do not run during business hours.',
  },
];

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/20' },
  approved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/20' },
  timeout: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/20' },
};

const typeConfig = {
  approval: { icon: ThumbsUp, label: 'Approval Required' },
  rejection: { icon: XCircle, label: 'Rejection Review' },
  revision: { icon: Edit3, label: 'Revision Requested' },
};

export function AegisHITL() {
  const [requests, setRequests] = useState(demoRequests);
  const [selectedRequest, setSelectedRequest] = useState<HITLRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [reviewNote, setReviewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests
    .filter((r) => statusFilter === 'all' || r.status === statusFilter)
    .filter((r) =>
      searchQuery === '' ||
      r.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.payload.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewer: 'Ibrahim Mukherjee', reviewNote }
          : r
      )
    );
    if (selectedRequest?.id === requestId) {
      setSelectedRequest((prev) => prev ? { ...prev, status: 'approved', reviewedAt: new Date().toISOString(), reviewer: 'Ibrahim Mukherjee', reviewNote } : null);
    }
    setReviewNote('');
  };

  const handleReject = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'rejected' as const, reviewedAt: new Date().toISOString(), reviewer: 'Ibrahim Mukherjee', reviewNote }
          : r
      )
    );
    if (selectedRequest?.id === requestId) {
      setSelectedRequest((prev) => prev ? { ...prev, status: 'rejected', reviewedAt: new Date().toISOString(), reviewer: 'Ibrahim Mukherjee', reviewNote } : null);
    }
    setReviewNote('');
  };

  const stats = {
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    timeout: requests.filter((r) => r.status === 'timeout').length,
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Panel - Request List */}
      <div className="w-[420px] bg-[#111118] border-r border-white/5 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Shield size={16} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Aegis HITL</h2>
              <p className="text-[10px] text-white/40">Human-in-the-Loop Approval</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {(['pending', 'approved', 'rejected', 'timeout'] as const).map((s) => {
              const config = statusConfig[s];
              const Icon = config.icon;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    statusFilter === s ? config.bg + ' ' + config.border : 'bg-white/5'
                  }`}
                >
                  <Icon size={14} className={config.color} />
                  <span className="text-lg font-bold">{stats[s]}</span>
                  <span className="text-[9px] text-white/40 capitalize">{s}</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-white/5 border-white/10 text-xs h-8"
            />
          </div>
        </div>

        {/* Request List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredRequests.map((req) => {
              const sConfig = statusConfig[req.status];
              const tConfig = typeConfig[req.type];
              const StatusIcon = sConfig.icon;
              const TypeIcon = tConfig.icon;
              const isSelected = selectedRequest?.id === req.id;

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => { setSelectedRequest(req); setReviewNote(''); }}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-all ${
                    isSelected ? 'bg-indigo-500/10 border-l-2 border-l-indigo-400' : 'hover:bg-white/5 border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${sConfig.bg}`}>
                      <StatusIcon size={14} className={sConfig.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{req.agentName}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${sConfig.bg} ${sConfig.color}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 line-clamp-2">{req.payload}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-white/30">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(req.createdAt).toLocaleTimeString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <TypeIcon size={10} />
                          {tConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel - Request Detail */}
      <div className="flex-1 overflow-y-auto">
        {selectedRequest ? (
          <div className="p-6 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusConfig[selectedRequest.status].bg}`}>
                {(() => {
                  const Icon = statusConfig[selectedRequest.status].icon;
                  return <Icon size={20} className={statusConfig[selectedRequest.status].color} />;
                })()}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{typeConfig[selectedRequest.type].label}</h2>
                <p className="text-xs text-white/40">from {selectedRequest.agentName} at {new Date(selectedRequest.createdAt).toLocaleString()}</p>
              </div>
              <div className="ml-auto">
                <span className={`text-xs px-3 py-1 rounded-full ${statusConfig[selectedRequest.status].bg} ${statusConfig[selectedRequest.status].color}`}>
                  {selectedRequest.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Payload */}
            <Card className="bg-[#111118] border-white/5 mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold flex items-center gap-2">
                  <MessageSquare size={12} className="text-indigo-400" />
                  Request Payload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-white/70 whitespace-pre-wrap bg-white/5 p-4 rounded-lg">{selectedRequest.payload}</pre>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-[#111118] border-white/5 mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold flex items-center gap-2">
                  <History size={12} className="text-indigo-400" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="text-xs text-white/40 w-24">Created</span>
                  <span className="text-xs">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${selectedRequest.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span className="text-xs text-white/40 w-24">Timeout</span>
                  <span className="text-xs">{new Date(selectedRequest.timeoutAt).toLocaleString()}</span>
                </div>
                {selectedRequest.reviewedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-white/40 w-24">Reviewed</span>
                    <span className="text-xs">{new Date(selectedRequest.reviewedAt).toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Review Note (if already reviewed) */}
            {selectedRequest.reviewNote && (
              <Card className="bg-[#111118] border-white/5 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs font-semibold flex items-center gap-2">
                    <UserCheck size={12} className="text-indigo-400" />
                    Review Decision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-white/40">Reviewed by:</span>
                    <span className="text-xs font-medium">{selectedRequest.reviewer}</span>
                  </div>
                  <p className="text-xs text-white/60 bg-white/5 p-3 rounded-lg">{selectedRequest.reviewNote}</p>
                </CardContent>
              </Card>
            )}

            {/* Action Panel */}
            {selectedRequest.status === 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card className="bg-[#111118] border-amber-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xs font-semibold flex items-center gap-2 text-amber-400">
                      <Zap size={12} />
                      Your Decision
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Add a note about your decision (optional)..."
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      className="bg-white/5 border-white/10 text-xs min-h-[80px]"
                    />
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => handleApprove(selectedRequest.id)}
                      >
                        <ThumbsUp size={14} className="mr-2" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleReject(selectedRequest.id)}
                      >
                        <ThumbsDown size={14} className="mr-2" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-xs">
                    <PauseCircle size={12} className="mr-1" /> Request More Info
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    <Bot size={12} className="mr-1" /> View Agent Context
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    <Shield size={12} className="mr-1" /> Security Check
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <UserCheck size={28} className="text-white/20" />
              </div>
              <p className="text-sm text-white/40">Select a request to review</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
