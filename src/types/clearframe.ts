// ClearFrame Ecosystem Types

export type NodeKind =
  | 'llm_openai' | 'llm_anthropic' | 'llm_gemini' | 'llm_mistral' | 'llm_ollama' | 'llm_huggingface'
  | 'memory_buffer' | 'memory_vector' | 'memory_redis'
  | 'tool_web_search' | 'tool_code_exec' | 'tool_rest_api' | 'tool_sql' | 'tool_file' | 'tool_email' | 'tool_calendar' | 'tool_slack' | 'tool_github' | 'tool_sonar'
  | 'router' | 'branch' | 'loop' | 'aggregator'
  | 'input' | 'output' | 'human_in_loop'
  | 'clearframe_goal' | 'prompt_template';

export type NodeCategory = 'LLM' | 'Memory' | 'Tool' | 'Flow' | 'I/O' | 'Monitoring';

export interface PortSpec {
  name: string;
  data_type: string;
  required: boolean;
  description: string;
}

export interface NodeSpec {
  kind: NodeKind;
  label: string;
  category: NodeCategory;
  description: string;
  icon: string;
  color: string;
  inputs: PortSpec[];
  outputs: PortSpec[];
  config_schema: Record<string, any>;
}

export interface NodeInstance {
  node_id: string;
  kind: NodeKind;
  display_name: string;
  config: Record<string, any>;
  position: [number, number];
  metadata: Record<string, any>;
}

export interface EdgeSpec {
  edge_id: string;
  source: { node: string; port: string };
  target: { node: string; port: string };
  metadata: Record<string, any>;
}

export interface GraphSpec {
  graph_id: string;
  name: string;
  description: string;
  version: string;
  nodes: Record<string, NodeInstance>;
  edges: EdgeSpec[];
  metadata: Record<string, any>;
}

// Trust Registry Types
export interface TrustEntry {
  id: string;
  pluginName: string;
  version: string;
  author: string;
  signature: string;
  hash: string;
  status: 'verified' | 'pending' | 'revoked' | 'warning';
  issuedAt: string;
  expiresAt: string;
  capabilities: string[];
}

// Goal Monitoring Types
export interface Goal {
  id: string;
  description: string;
  status: 'on_track' | 'deviated' | 'paused' | 'completed';
  confidence: number; // 0-100
  lastChecked: string;
  agentId: string;
  agentName: string;
  deviationReport?: string;
  checkpoints: Checkpoint[];
}

export interface Checkpoint {
  id: string;
  description: string;
  status: 'pending' | 'passed' | 'failed';
  timestamp?: string;
}

// Human-in-the-Loop (Aegis) Types
export interface HITLRequest {
  id: string;
  agentId: string;
  agentName: string;
  type: 'approval' | 'rejection' | 'revision';
  payload: string;
  status: 'pending' | 'approved' | 'rejected' | 'timeout';
  createdAt: string;
  timeoutAt: string;
  reviewedAt?: string;
  reviewer?: string;
  reviewNote?: string;
}

// GitHub Repo Sync Types
export interface RepoSync {
  id: string;
  name: string;
  url: string;
  branch: string;
  lastSync: string;
  status: 'synced' | 'syncing' | 'error' | 'pending';
  commitsBehind: number;
  description: string;
}

// Agent Runtime Types
export interface AgentRuntime {
  id: string;
  name: string;
  graphId: string;
  status: 'idle' | 'running' | 'paused' | 'error' | 'complete';
  startTime?: string;
  endTime?: string;
  toolCalls: number;
  tokensUsed: number;
  currentNode?: string;
  logs: AgentLog[];
}

export interface AgentLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  nodeId?: string;
}
