import { Position } from "reactflow";
import BaseNode from "./base-node";
import { useStore } from "../store";

export const DataStorageNode = ({ id, data }) => {
  const { updateNodeField } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
  }));

  const handleNameChange = (e) => {
    updateNodeField(id, "name", e.target.value);
  };

  const handleOperationChange = (e) => {
    updateNodeField(id, "operation", e.target.value);
  };

  const handleKeyChange = (e) => {
    updateNodeField(id, "storageKey", e.target.value);
  };

  const handles = [
    { type: "target", position: Position.Left, idSuffix: "input" },
    { type: "source", position: Position.Right, idSuffix: "output" },
  ];

  return (
    <BaseNode id={id} title="Storage" handlesConfig={handles} nodeWidth={300}>
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
          <label htmlFor={`${id}-operation`} className="block text-xs font-medium text-slate-700">
            Operation:
          </label>
          <select
            id={`${id}-operation`}
            value={data?.operation || "Save"}
            onChange={handleOperationChange}
            className="nodrag mt-1 block w-full pl-3 pr-10 py-1.5 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
          >
            <option value="Save">Save</option>
            <option value="Retrieve">Retrieve</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-key`} className="block text-xs font-medium text-slate-700">
            Storage Key:
          </label>
          <input
            id={`${id}-key`}
            type="text"
            value={data?.storageKey || ""}
            onChange={handleKeyChange}
            className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
      </div>
    </BaseNode>
  );
};