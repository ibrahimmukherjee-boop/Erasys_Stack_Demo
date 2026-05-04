import { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Bell,
  Database,
  Lock,
  Eye,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cpu,
  HardDrive,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type SettingsTab = 'general' | 'security' | 'notifications' | 'api' | 'system';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'system', label: 'System', icon: Server },
];

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saved, setSaved] = useState(false);

  // General settings
  const [orgName, setOrgName] = useState('Erasys Labs');
  const [defaultModel, setDefaultModel] = useState('gpt-4o');
  const [logLevel, setLogLevel] = useState('info');
  const [autoPause, setAutoPause] = useState(true);
  const [maxIterations, setMaxIterations] = useState([10]);

  // Security settings
  const [vaultEnabled, setVaultEnabled] = useState(true);
  const [hmacEnabled, setHmacEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState([60]);
  const [requireApproval, setRequireApproval] = useState(true);

  // Notification settings
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXX');
  const [alertOnDeviation, setAlertOnDeviation] = useState(true);
  const [alertOnRevocation, setAlertOnRevocation] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-xs text-white/40 uppercase">Organization Name</Label>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="mt-1 bg-white/5 border-white/10" />
            </div>
            <div>
              <Label className="text-xs text-white/40 uppercase">Default LLM Model</Label>
              <select value={defaultModel} onChange={(e) => setDefaultModel(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm text-white outline-none">
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
                <option value="mistral-large">Mistral Large</option>
                <option value="llama3">Ollama Llama 3</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-white/40 uppercase">Log Level</Label>
              <select value={logLevel} onChange={(e) => setLogLevel(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm text-white outline-none">
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <div>
                <Label className="text-sm">Auto-pause on deviation</Label>
                <p className="text-xs text-white/40">Automatically pause agents when goal deviation is detected</p>
              </div>
              <Switch checked={autoPause} onCheckedChange={setAutoPause} />
            </div>
            <div className="py-3 border-t border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-sm">Max Iterations</Label>
                  <p className="text-xs text-white/40">Maximum loop iterations for ReAct agents</p>
                </div>
                <span className="text-sm font-medium text-indigo-400">{maxIterations[0]}</span>
              </div>
              <Slider value={maxIterations} onValueChange={setMaxIterations} min={1} max={50} step={1} className="w-full" />
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3">
              <div>
                <Label className="text-sm">Encrypted Vault</Label>
                <p className="text-xs text-white/40">AES-256-GCM encrypted credential storage</p>
              </div>
              <Switch checked={vaultEnabled} onCheckedChange={setVaultEnabled} />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <div>
                <Label className="text-sm">HMAC Audit Chain</Label>
                <p className="text-xs text-white/40">Tamper-evident audit logging</p>
              </div>
              <Switch checked={hmacEnabled} onCheckedChange={setHmacEnabled} />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <div>
                <Label className="text-sm">Require HITL Approval</Label>
                <p className="text-xs text-white/40">All sensitive operations require human approval</p>
              </div>
              <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
            </div>
            <div className="py-3 border-t border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-sm">Session Timeout (minutes)</Label>
                  <p className="text-xs text-white/40">Auto-lock vault after inactivity</p>
                </div>
                <span className="text-sm font-medium text-indigo-400">{sessionTimeout[0]}m</span>
              </div>
              <Slider value={sessionTimeout} onValueChange={setSessionTimeout} min={5} max={120} step={5} className="w-full" />
            </div>
            <Card className="bg-red-500/5 border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={18} className="text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Danger Zone</p>
                    <p className="text-xs text-white/40">These actions cannot be undone</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button size="sm" variant="outline" className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">Clear Audit Log</Button>
                  <Button size="sm" variant="outline" className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">Reset Vault</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3">
              <div>
                <Label className="text-sm">Email Alerts</Label>
                <p className="text-xs text-white/40">Receive email notifications for critical events</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <div>
                <Label className="text-sm">Alert on Goal Deviation</Label>
                <p className="text-xs text-white/40">Get notified when agents deviate from goals</p>
              </div>
              <Switch checked={alertOnDeviation} onCheckedChange={setAlertOnDeviation} />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <div>
                <Label className="text-sm">Alert on Trust Revocation</Label>
                <p className="text-xs text-white/40">Get notified when plugins are revoked</p>
              </div>
              <Switch checked={alertOnRevocation} onCheckedChange={setAlertOnRevocation} />
            </div>
            <div className="py-3 border-t border-white/5">
              <Label className="text-xs text-white/40 uppercase">Slack Webhook URL</Label>
              <Input value={slackWebhook} onChange={(e) => setSlackWebhook(e.target.value)} className="mt-1 bg-white/5 border-white/10" />
              <p className="text-xs text-white/30 mt-1">Used for real-time agent status notifications</p>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="space-y-6">
            {[
              { name: 'OpenAI API Key', env: 'OPENAI_API_KEY', value: 'sk-••••••••••••••••••••••••••••••', icon: Key },
              { name: 'Anthropic API Key', env: 'ANTHROPIC_API_KEY', value: 'sk-ant-••••••••••••••••••••••••••', icon: Key },
              { name: 'ClearFrame Secret', env: 'CLEARFRAME_SECRET', value: 'cf-••••••••••••••••••••••••••••••', icon: Lock },
              { name: 'Aegis Token', env: 'AEGIS_TOKEN', value: 'aegis-•••••••••••••••••••••••••••', icon: Shield },
            ].map((key) => (
              <div key={key.env} className="p-4 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <key.icon size={14} className="text-indigo-400" />
                  <span className="text-sm font-medium">{key.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-xs text-white/60 bg-white/5 px-3 py-2 rounded">{key.value}</code>
                  <Button size="sm" variant="ghost" className="h-8 text-xs">
                    <Eye size={12} className="mr-1" /> Show
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs">
                    <RefreshCw size={12} className="mr-1" /> Rotate
                  </Button>
                </div>
                <p className="text-[10px] text-white/30 mt-1">{key.env}</p>
              </div>
            ))}
          </div>
        );
      case 'system':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={14} className="text-indigo-400" />
                    <span className="text-xs text-white/40">CPU Usage</span>
                  </div>
                  <p className="text-2xl font-bold">23%</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                    <div className="w-[23%] h-full bg-indigo-400 rounded-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive size={14} className="text-emerald-400" />
                    <span className="text-xs text-white/40">Memory</span>
                  </div>
                  <p className="text-2xl font-bold">4.2 GB</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                    <div className="w-[42%] h-full bg-emerald-400 rounded-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database size={14} className="text-amber-400" />
                    <span className="text-xs text-white/40">Storage</span>
                  </div>
                  <p className="text-2xl font-bold">127 GB</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                    <div className="w-[63%] h-full bg-amber-400 rounded-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={14} className="text-pink-400" />
                    <span className="text-xs text-white/40">Uptime</span>
                  </div>
                  <p className="text-2xl font-bold">14d 7h</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                    <div className="w-[99%] h-full bg-pink-400 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <h4 className="text-sm font-medium mb-3">System Information</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-white/40">ClearFrame Version</span><span>v0.2.1</span></div>
                <div className="flex justify-between"><span className="text-white/40">Python</span><span>3.12.1</span></div>
                <div className="flex justify-between"><span className="text-white/40">Node.js</span><span>20.11.0</span></div>
                <div className="flex justify-between"><span className="text-white/40">OS</span><span>Linux x64</span></div>
                <div className="flex justify-between"><span className="text-white/40">Kernel</span><span>6.5.0</span></div>
                <div className="flex justify-between"><span className="text-white/40">Docker</span><span>v25.0.2</span></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#111118] border-r border-white/5 p-4">
        <h3 className="text-sm font-semibold mb-4">Settings</h3>
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/15 text-indigo-400'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">{tabs.find((t) => t.id === activeTab)?.label}</h2>
            <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600" onClick={handleSave}>
              {saved ? <><CheckCircle2 size={14} className="mr-2" /> Saved</> : <><Save size={14} className="mr-2" /> Save Changes</>}
            </Button>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
