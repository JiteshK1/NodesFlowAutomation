import { Position } from "reactflow";
import BaseNode from "./base-node";
import { useStore } from "../store";

export const LLMNode = ({ id, data }) => {
  const { updateNodeField } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
  }));

  const handleNameChange = (e) => {
    updateNodeField(id, "name", e.target.value);
  };

  const handles = [
    { type: "target", position: Position.Left, idSuffix: "system", style: { top: "33.33%" } },
    { type: "target", position: Position.Left, idSuffix: "prompt", style: { top: "66.66%" } },
    { type: "source", position: Position.Right, idSuffix: "response" },
  ];

  return (
    <BaseNode id={id} title="LLM" handlesConfig={handles} nodeWidth={280}>
      <div className="space-y-3">
        <div className="text-sm text-slate-700">
          Node ID: {id}
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-name`} className="block text-xs font-medium text-slate-700">
            Name:
          </label>
          <input
            id={`${id}-name`}
            type="text"
            value={data?.name || ""}
            onChange={handleNameChange}
            className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">Description:</label>
          <textarea
            value={data?.llmDescription || ""}
            onChange={(e) => updateNodeField(id, 'llmDescription', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-sky-500"
            rows={4}
          />
        </div>
      </div>
    </BaseNode>
  );
};