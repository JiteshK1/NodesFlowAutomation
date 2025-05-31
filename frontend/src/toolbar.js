import { DraggableNode } from "./draggableNode";
import { LogIn, LogOut, Brain, FileText, GitBranch, Wrench, Globe, Database, MousePointer } from "lucide-react";
const nodeItems = [
  { type: "customInput", label: "Input", icon: <LogIn size={20} /> },
  { type: "llm", label: "LLM", icon: <Brain size={20} /> },
  { type: "customOutput", label: "Output", icon: <LogOut size={20} /> },
  { type: "text", label: "Text", icon: <FileText size={20} /> },
  { type: "conditionalNode", label: "Conditional", icon: <GitBranch size={20} /> },
  { type: "transform", label: "Transform", icon: <Wrench size={20} /> },
  { type: "api", label: "API", icon: <Globe size={20} /> },
  { type: "storage", label: "Storage", icon: <Database size={20} /> },
  { type: "interact", label: "Interact", icon: <MousePointer size={20} /> },
];

export const PipelineToolbar = () => {
  return (
    <div className="w-full bg-slate-50 p-3 border-b border-slate-200 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-700 mb-3">Nodes</h2>
      <div className="flex space-x-3">
        {nodeItems.map((item) => (
          <DraggableNode
            key={item.type}
            type={item.type}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
};