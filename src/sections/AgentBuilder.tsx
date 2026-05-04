import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import {
  Save,
  Play,
  Square,
  Download,
  Upload,
  Trash2,
  Brain,
  Database,
  Code2,
  GitBranch,
  LogIn,
  Target,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NodeSpec, NodeKind, GraphSpec, NodeInstance } from '@/types/clearframe';

// Node type definitions based on ClearFrame builder/nodes.py
const NODE_TYPES: NodeSpec[] = [
  { kind: 'llm_openai', label: 'OpenAI LLM', category: 'LLM', description: 'GPT-4o, GPT-4, GPT-3.5', icon: '', color: '#10b981', inputs: [{ name: 'prompt', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'response', data_type: 'str', required: true, description: '' }], config_schema: { model: 'gpt-4o', temperature: 0.7 } },
  { kind: 'llm_anthropic', label: 'Claude', category: 'LLM', description: 'Claude 3.5 Sonnet', icon: '', color: '#f59e0b', inputs: [{ name: 'prompt', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'response', data_type: 'str', required: true, description: '' }], config_schema: { model: 'claude-3-5-sonnet', max_tokens: 4096 } },
  { kind: 'llm_gemini', label: 'Gemini', category: 'LLM', description: 'Google Gemini Pro', icon: '', color: '#3b82f6', inputs: [{ name: 'prompt', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'response', data_type: 'str', required: true, description: '' }], config_schema: { model: 'gemini-1.5-pro' } },
  { kind: 'llm_ollama', label: 'Ollama', category: 'LLM', description: 'Local LLM models', icon: '', color: '#64748b', inputs: [{ name: 'prompt', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'response', data_type: 'str', required: true, description: '' }], config_schema: { model: 'llama3', base_url: 'http://localhost:11434' } },
  { kind: 'memory_buffer', label: 'Buffer Memory', category: 'Memory', description: 'In-process conversation buffer', icon: '', color: '#06b6d4', inputs: [{ name: 'message', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'history', data_type: 'list', required: true, description: '' }], config_schema: { max_messages: 20 } },
  { kind: 'memory_vector', label: 'Vector Memory', category: 'Memory', description: 'Semantic search memory', icon: '', color: '#06b6d4', inputs: [{ name: 'query', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'context', data_type: 'str', required: true, description: '' }], config_schema: { top_k: 5 } },
  { kind: 'tool_web_search', label: 'Web Search', category: 'Tool', description: 'Search the web', icon: '', color: '#0ea5e9', inputs: [{ name: 'query', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'results', data_type: 'str', required: true, description: '' }], config_schema: { provider: 'perplexity' } },
  { kind: 'tool_code_exec', label: 'Code Exec', category: 'Tool', description: 'Run Python/JS code', icon: '', color: '#0ea5e9', inputs: [{ name: 'code', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'stdout', data_type: 'str', required: true, description: '' }], config_schema: { runtime: 'python3', timeout: 30 } },
  { kind: 'tool_rest_api', label: 'REST API', category: 'Tool', description: 'HTTP requests', icon: '', color: '#0ea5e9', inputs: [{ name: 'url', data_type: 'str', required: true, description: '' }, { name: 'body', data_type: 'str', required: false, description: '' }], outputs: [{ name: 'response', data_type: 'str', required: true, description: '' }], config_schema: { method: 'GET' } },
  { kind: 'tool_sonar', label: 'Sonar Security', category: 'Tool', description: 'Threat detection layer', icon: '', color: '#ef4444', inputs: [{ name: 'prompt', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'safe_prompt', data_type: 'str', required: true, description: '' }], config_schema: { block_on_critical: true } },
  { kind: 'router', label: 'Router', category: 'Flow', description: 'Conditional routing', icon: '', color: '#a855f7', inputs: [{ name: 'input', data_type: 'str', required: true, description: '' }], outputs: [{ name: 'true_branch', data_type: 'str', required: true, description: '' }, { name: 'false_branch', data_type: 'str', required: true, description: '' }], config_schema: { condition: '' } },
  { kind: 'loop', label: 'Loop', category: 'Flow', description: 'Iteration control', icon: '', color: '#a855f7', inputs: [{ name: 'input', data_type: 'any', required: true, description: '' }], outputs: [{ name: 'output', data_type: 'any', required: true, description: '' }], config_schema: { max_iterations: 5 } },
  { kind: 'human_in_loop', label: 'Aegis HITL', category: 'Flow', description: 'Human approval gate', icon: '', color: '#f59e0b', inputs: [{ name: 'payload', data_type: 'any', required: true, description: '' }], outputs: [{ name: 'approved', data_type: 'any', required: true, description: '' }, { name: 'rejected', data_type: 'any', required: true, description: '' }], config_schema: { timeout: 3600 } },
  { kind: 'input', label: 'Input', category: 'I/O', description: 'Entry point', icon: '', color: '#22c55e', inputs: [], outputs: [{ name: 'data', data_type: 'any', required: true, description: '' }], config_schema: { input_type: 'text' } },
  { kind: 'output', label: 'Output', category: 'I/O', description: 'Exit point', icon: '', color: '#22c55e', inputs: [{ name: 'data', data_type: 'any', required: true, description: '' }], outputs: [], config_schema: { format: 'text' } },
  { kind: 'clearframe_goal', label: 'Goal Monitor', category: 'Monitoring', description: 'Track goal alignment', icon: '', color: '#ec4899', inputs: [{ name: 'state', data_type: 'any', required: true, description: '' }], outputs: [{ name: 'on_track', data_type: 'bool', required: true, description: '' }], config_schema: { goal: '' } },
  { kind: 'prompt_template', label: 'Prompt Template', category: 'Monitoring', description: 'Jinja2 templates', icon: '', color: '#ec4899', inputs: [{ name: 'variables', data_type: 'dict', required: true, description: '' }], outputs: [{ name: 'prompt', data_type: 'str', required: true, description: '' }], config_schema: { template: '' } },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  LLM: Brain,
  Memory: Database,
  Tool: Code2,
  Flow: GitBranch,
  'I/O': LogIn,
  Monitoring: Target,
};

// Custom Node Component
function CustomNode({ data, selected }: { data: any; selected?: boolean }) {
  const getIconForNode = (category: string) => {
    return CATEGORY_ICONS[category] || Sparkles;
  };
  const Icon = getIconForNode(data.category);
  return (
    <div
      className={`min-w-[140px] rounded-lg border-2 bg-[#1a1a24] shadow-lg transition-all ${
        selected ? 'border-indigo-400 shadow-indigo-400/20' : 'border-white/10'
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: data.color + '20' }}>
          <Icon size={12} style={{ color: data.color }} />
        </div>
        <span className="text-xs font-semibold text-white/90">{data.label}</span>
      </div>
      {data.config && Object.keys(data.config).length > 0 && (
        <div className="px-3 py-2 space-y-1">
          {Object.entries(data.config).slice(0, 2).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-[10px] text-white/40">{key}</span>
              <span className="text-[10px] text-white/60 truncate max-w-[80px]">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="px-2 py-1 text-[9px] text-white/30 uppercase tracking-wider">{data.kind}</div>
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

// Pre-built templates from ClearFrame
const TEMPLATES = [
  { name: 'Minimal', description: 'Input → Output passthrough', nodes: 2 },
  { name: 'Simple LLM', description: 'Input → LLM → Output', nodes: 3 },
  { name: 'ReAct Agent', description: 'Reasoning + tool loop', nodes: 5 },
  { name: 'HITL Approval', description: 'Human approval gate', nodes: 5 },
];

function FlowCanvas() {
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('LLM');
  const [graphName, setGraphName] = useState('Untitled Graph');
  const [isRunning, setIsRunning] = useState(false);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds: Edge[]) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeData = event.dataTransfer.getData('application/clearframe-node');
      if (!nodeData) return;

      const spec = JSON.parse(nodeData) as NodeSpec;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${spec.kind}_${Date.now()}`,
        type: 'custom',
        position,
        data: {
          label: spec.label,
          kind: spec.kind,
          category: spec.category,
          color: spec.color,
          config: spec.config_schema,
        },
      };

      setNodes((nds: Node[]) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds: Node[]) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds: Edge[]) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const loadTemplate = useCallback((templateName: string) => {
    let templateNodes: Node[] = [];
    let templateEdges: Edge[] = [];

    switch (templateName) {
      case 'Minimal':
        templateNodes = [
          { id: 'input', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'Input', kind: 'input', category: 'I/O', color: '#22c55e', config: { input_type: 'text' } } },
          { id: 'output', type: 'custom', position: { x: 500, y: 300 }, data: { label: 'Output', kind: 'output', category: 'I/O', color: '#22c55e', config: { format: 'text' } } }
        ];
        templateEdges = [{ id: 'e1', source: 'input', target: 'output', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }];
        break;
      case 'Simple LLM':
        templateNodes = [
          { id: 'input', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'Input', kind: 'input', category: 'I/O', color: '#22c55e', config: { input_type: 'text' } } },
          { id: 'llm', type: 'custom', position: { x: 400, y: 300 }, data: { label: 'OpenAI LLM', kind: 'llm_openai', category: 'LLM', color: '#10b981', config: { model: 'gpt-4o', temperature: 0.7 } } },
          { id: 'output', type: 'custom', position: { x: 700, y: 300 }, data: { label: 'Output', kind: 'output', category: 'I/O', color: '#22c55e', config: { format: 'text' } } }
        ];
        templateEdges = [
          { id: 'e1', source: 'input', target: 'llm', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e2', source: 'llm', target: 'output', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }
        ];
        break;
      case 'ReAct Agent':
        templateNodes = [
          { id: 'input', type: 'custom', position: { x: 50, y: 300 }, data: { label: 'Input', kind: 'input', category: 'I/O', color: '#22c55e', config: { input_type: 'text' } } },
          { id: 'reason', type: 'custom', position: { x: 300, y: 300 }, data: { label: 'Reason & Plan', kind: 'llm_openai', category: 'LLM', color: '#10b981', config: { model: 'gpt-4o', temperature: 0.2 } } },
          { id: 'tool', type: 'custom', position: { x: 550, y: 200 }, data: { label: 'Tool Executor', kind: 'tool_web_search', category: 'Tool', color: '#0ea5e9', config: { tool_name: 'search' } } },
          { id: 'loop', type: 'custom', position: { x: 550, y: 400 }, data: { label: 'ReAct Loop', kind: 'loop', category: 'Flow', color: '#a855f7', config: { max_iterations: 10 } } },
          { id: 'output', type: 'custom', position: { x: 800, y: 300 }, data: { label: 'Output', kind: 'output', category: 'I/O', color: '#22c55e', config: { format: 'text' } } }
        ];
        templateEdges = [
          { id: 'e1', source: 'input', target: 'reason', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e2', source: 'reason', target: 'tool', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e3', source: 'tool', target: 'loop', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e4', source: 'loop', target: 'reason', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
          { id: 'e5', source: 'loop', target: 'output', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }
        ];
        break;
      case 'HITL Approval':
        templateNodes = [
          { id: 'input', type: 'custom', position: { x: 50, y: 300 }, data: { label: 'Input', kind: 'input', category: 'I/O', color: '#22c55e', config: { input_type: 'text' } } },
          { id: 'draft', type: 'custom', position: { x: 300, y: 300 }, data: { label: 'Draft Response', kind: 'llm_openai', category: 'LLM', color: '#10b981', config: { model: 'gpt-4o', temperature: 0.7 } } },
          { id: 'review', type: 'custom', position: { x: 550, y: 300 }, data: { label: 'Human Review', kind: 'human_in_loop', category: 'Flow', color: '#f59e0b', config: { timeout: 3600 } } },
          { id: 'revise', type: 'custom', position: { x: 550, y: 500 }, data: { label: 'Revise', kind: 'llm_openai', category: 'LLM', color: '#10b981', config: { model: 'gpt-4o', temperature: 0.5 } } },
          { id: 'output', type: 'custom', position: { x: 800, y: 300 }, data: { label: 'Output', kind: 'output', category: 'I/O', color: '#22c55e', config: { format: 'text' } } }
        ];
        templateEdges = [
          { id: 'e1', source: 'input', target: 'draft', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e2', source: 'draft', target: 'review', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e3', source: 'review', target: 'output', animated: true, style: { stroke: '#22c55e', strokeWidth: 2 } },
          { id: 'e4', source: 'review', target: 'revise', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
          { id: 'e5', source: 'revise', target: 'review', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } }
        ];
        break;
    }

    setNodes(templateNodes);
    setEdges(templateEdges);
    setGraphName(`${templateName} Graph`);
  }, [setNodes, setEdges]);

  const exportGraph = useCallback(() => {
    const graphData: GraphSpec = {
      graph_id: `graph_${Date.now()}`,
      name: graphName,
      description: '',
      version: '1.0.0',
      nodes: Object.fromEntries(nodes.map((n): [string, NodeInstance] => [n.id, {
        node_id: n.id,
        kind: n.data.kind as NodeKind,
        display_name: n.data.label as string,
        config: n.data.config as Record<string, any>,
        position: [n.position.x, n.position.y] as [number, number],
        metadata: {},
      }])),
      edges: edges.map((e) => ({
        edge_id: e.id,
        source: { node: e.source, port: 'output' },
        target: { node: e.target, port: 'input' },
        metadata: {},
      })),
      metadata: {},
    };
    const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${graphName.replace(/\s+/g, '_').toLowerCase()}.json`;
    a.click();
  }, [nodes, edges, graphName]);

  const categories = Array.from(new Set(NODE_TYPES.map((n) => n.category)));
  const filteredNodes = NODE_TYPES.filter((n) => n.category === selectedCategory);

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Node Palette */}
      <div className="w-64 bg-[#111118] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold mb-3">Node Palette</h3>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Sparkles;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
                  }`}
                >
                  <Icon size={10} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredNodes.map((node) => {
            const NodeIcon = CATEGORY_ICONS[node.category] || Sparkles;
            return (
              <div
                key={node.kind}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/clearframe-node', JSON.stringify(node));
                  e.dataTransfer.effectAllowed = 'move';
                }}
                className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/30 cursor-move transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: node.color + '20' }}>
                    <NodeIcon size={10} style={{ color: node.color }} />
                  </div>
                  <span className="text-xs font-medium">{node.label}</span>
                </div>
                <p className="text-[10px] text-white/40 pl-7">{node.description}</p>
              </div>
            );
          })}
        </div>

        {/* Templates */}
        <div className="p-4 border-t border-white/5">
          <h3 className="text-sm font-semibold mb-2">Templates</h3>
          <div className="space-y-1.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => loadTemplate(t.name)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-indigo-500/10 transition-colors text-left"
              >
                <div>
                  <span className="text-xs font-medium">{t.name}</span>
                  <p className="text-[10px] text-white/40">{t.description}</p>
                </div>
                <ChevronRight size={12} className="text-white/30" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-[#111118] border-b border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              className="bg-transparent text-sm font-semibold outline-none border-none focus:ring-0 w-48"
            />
            <span className="text-[10px] text-white/30">{nodes.length} nodes, {edges.length} edges</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={exportGraph}>
              <Download size={12} className="mr-1" /> Export
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              <Upload size={12} className="mr-1" /> Import
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={deleteSelectedNode} disabled={!selectedNode}>
              <Trash2 size={12} className="mr-1" /> Delete
            </Button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <Button
              size="sm"
              className={`h-7 text-xs ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <><Square size={12} className="mr-1" /> Stop</> : <><Play size={12} className="mr-1" /> Run</>}
            </Button>
            <Button size="sm" className="h-7 text-xs bg-indigo-500 hover:bg-indigo-600">
              <Save size={12} className="mr-1" /> Save
            </Button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#0a0a0f]"
          >
            <Background color="#1a1a2e" gap={20} size={1} />
            <Controls className="!bg-[#111118] !border-white/10" />
            <MiniMap
              className="!bg-[#111118] !border-white/10"
              nodeColor={(node: any) => node.data?.color || '#6366f1'}
              maskColor="rgba(10, 10, 15, 0.7)"
            />
            <Panel position="top-right" className="bg-[#111118]/90 backdrop-blur border border-white/10 rounded-lg p-3 text-xs">
              <p className="text-white/40 mb-1">Drag nodes from the palette</p>
              <p className="text-white/40">Connect nodes by dragging between handles</p>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Right Panel - Node Properties */}
      {selectedNode && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="bg-[#111118] border-l border-white/5 overflow-hidden flex-shrink-0"
        >
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Node Properties</h3>
            <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-white/5">
              <X size={14} />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[10px] text-white/40 uppercase">Label</label>
              <input
                type="text"
                value={String((selectedNode.data as Record<string, any>).label || '')}
                onChange={(e) => {
                  const newLabel = e.target.value;
                  setNodes((nds: Node[]) =>
                    nds.map((n) =>
                      n.id === selectedNode.id ? { ...n, data: { ...n.data, label: newLabel } } : n
                    )
                  );
                  setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, label: newLabel } } : null);
                }}
                className="w-full mt-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase">Kind</label>
              <p className="text-xs text-white/60 mt-1">{String((selectedNode.data as Record<string, any>).kind)}</p>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase">Category</label>
              <p className="text-xs text-white/60 mt-1">{String((selectedNode.data as Record<string, any>).category)}</p>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase">Position</label>
              <p className="text-xs text-white/60 mt-1">
                x: {Math.round(selectedNode.position.x)}, y: {Math.round(selectedNode.position.y)}
              </p>
            </div>
            {(() => {
              const cfg = (selectedNode.data as Record<string, any>).config as Record<string, any> | undefined;
              if (!cfg || Object.keys(cfg).length === 0) return null;
              return (
                <div>
                  <label className="text-[10px] text-white/40 uppercase">Configuration</label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(cfg).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-[10px] text-white/30">{key}</label>
                        <input
                          type="text"
                          value={String(value)}
                          onChange={(e) => {
                            const newConfig = { ...cfg, [key]: e.target.value };
                            setNodes((nds: Node[]) =>
                              nds.map((n) =>
                                n.id === selectedNode.id ? { ...n, data: { ...n.data, config: newConfig } } : n
                              )
                            );
                            setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, config: newConfig } } : null);
                          }}
                          className="w-full mt-0.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs outline-none focus:border-indigo-500/50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function AgentBuilder() {
  return (
    <ReactFlowProvider>
      <div className="h-[calc(100vh-64px)]">
        <FlowCanvas />
      </div>
    </ReactFlowProvider>
  );
}
