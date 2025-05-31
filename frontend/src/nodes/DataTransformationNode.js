import { Position } from "reactflow";
import BaseNode from "./base-node";
import { useStore } from "../store";

export const DataTransformationNode = ({ id, data }) => {
  const { updateNodeField } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
  }));

  const handleNameChange = (e) => {
    updateNodeField(id, "name", e.target.value);
  };

  const handleFunctionChange = (e) => {
    updateNodeField(id, "transformFunction", e.target.value);
  };

  const handles = [
    { type: "target", position: Position.Left, idSuffix: "input" },
    { type: "source", position: Position.Right, idSuffix: "output" },
  ];

  return (
    <BaseNode id={id} title="Transform" handlesConfig={handles} nodeWidth={300}>
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
          <label htmlFor={`${id}-function`} className="block text-xs font-medium text-slate-700">
            Transformation Function:
          </label>
          <textarea
            id={`${id}-function`}
            value={data?.transformFunction || "// Example: return input.toUpperCase();"}
            onChange={handleFunctionChange}
            className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            rows={10}
            placeholder="// Write your transformation function here"
          />
        </div>
      </div>
    </BaseNode>
  );
};