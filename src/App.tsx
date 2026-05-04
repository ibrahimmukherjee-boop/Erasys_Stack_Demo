import { useState, useCallback } from 'react';
import {
  LayoutDashboard,
  Workflow,
  ShieldCheck,
  Target,
  UserCheck,
  GitBranch,
  Settings,
  Menu,
  X,
  Bot,
  Activity,
  Radio,
  Sliders
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardOverview } from '@/sections/DashboardOverview';
import { AgentBuilder } from '@/sections/AgentBuilder';
import { TrustRegistry } from '@/sections/TrustRegistry';
import { GoalMonitor } from '@/sections/GoalMonitor';
import { AegisHITL } from '@/sections/AegisHITL';
import { RepoSync } from '@/sections/RepoSync';
import { SettingsPanel } from '@/sections/SettingsPanel';
import { Sonar } from '@/sections/Sonar';
import { FineTune } from '@/sections/FineTune';

type View = 'dashboard' | 'builder' | 'trust' | 'goals' | 'aegis' | 'repos' | 'settings' | 'sonar' | 'finetune';

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'builder', label: 'Agent Builder', icon: Workflow },
  { id: 'trust', label: 'Trust Registry', icon: ShieldCheck },
  { id: 'goals', label: 'Goal Monitor', icon: Target },
  { id: 'aegis', label: 'Aegis HITL', icon: UserCheck },
  { id: 'repos', label: 'Repo Sync', icon: GitBranch },
  { id: 'sonar', label: 'Sonar', icon: Radio },
  { id: 'finetune', label: 'Fine-Tune', icon: Sliders },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view as View);
  }, []);

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview onNavigate={handleNavigate} />;
      case 'builder':
        return <AgentBuilder />;
      case 'trust':
        return <TrustRegistry />;
      case 'goals':
        return <GoalMonitor />;
      case 'aegis':
        return <AegisHITL />;
      case 'repos':
        return <RepoSync />;
      case 'sonar':
        return <Sonar />;
      case 'finetune':
        return <FineTune />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardOverview onNavigate={handleNavigate} />;
    }
  }, [currentView, handleNavigate]);

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex-shrink-0 bg-[#111118] border-r border-white/5 flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h1 className="text-sm font-bold leading-tight">ClearFrame</h1>
                <p className="text-[10px] text-white/40 leading-tight">Control Plane</p>
              </div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
                  currentView === item.id
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                )}
              >
                <Icon size={18} className={cn(
                  'flex-shrink-0',
                  currentView === item.id && 'text-indigo-400'
                )} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                {currentView === item.id && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Status */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/5">
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">System Status</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Active Agents</span>
                <span className="text-xs font-medium">3 running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Trust Score</span>
                <span className="text-xs font-medium text-emerald-400">98.2%</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[#111118]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {navItems.find((n) => n.id === currentView)?.label}
            </h2>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">All Systems Operational</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Bot size={14} className="text-indigo-400" />
              <span className="text-xs text-white/60">ClearFrame v0.2.1</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-xs text-white/60">Erasys Stack</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
              IM
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
