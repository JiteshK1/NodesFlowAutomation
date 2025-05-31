import { Position } from "reactflow";
import BaseNode from "./base-node";
import { useStore } from "../store";

export const OutputNode = ({ id, data }) => {
  const { updateNodeField } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
  }));

  const handleNameChange = (e) => {
    updateNodeField(id, 'name', e.target.value);
  };

  const handleTypeChange = (e) => {
    updateNodeField(id, 'outputType', e.target.value);
  };

  const handles = [{ type: "target", position: Position.Left, idSuffix: "value" }];

  return (
    <BaseNode id={id} title="Output" handlesConfig={handles} nodeWidth={250}>
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
          <label htmlFor={`${id}-type`} className="block text-xs font-medium text-slate-700">
            Type:
          </label>
          <select
            id={`${id}-type`}
            value={data?.outputType || "Text"}
            onChange={handleTypeChange}
            className="nodrag mt-1 block w-full pl-3 pr-10 py-1.5 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};