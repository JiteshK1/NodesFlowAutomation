import { Position } from "reactflow";
import BaseNode from "./base-node";
import { useStore } from "../store";

export const ApiCallNode = ({ id, data }) => {
  const { updateNodeField } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
  }));

  const handleNameChange = (e) => {
    updateNodeField(id, "name", e.target.value);
  };

  const handleUrlChange = (e) => {
    updateNodeField(id, "apiUrl", e.target.value);
  };

  const handleMethodChange = (e) => {
    updateNodeField(id, "apiMethod", e.target.value);
  };

  const handleHeadersChange = (e) => {
    updateNodeField(id, "headers", e.target.value);
  };

  const handleBodyChange = (e) => {
    updateNodeField(id, "body", e.target.value);
  };

  const handles = [
    { type: "target", position: Position.Left, idSuffix: "input" },
    { type: "source", position: Position.Right, idSuffix: "output" },
  ];

  return (
    <BaseNode id={id} title="API" handlesConfig={handles} nodeWidth={300}>
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
          <label htmlFor={`${id}-url`} className="block text-xs font-medium text-slate-700">
            URL:
          </label>
          <input
            id={`${id}-url`}
            type="text"
            value={data?.apiUrl || ""}
            onChange={handleUrlChange}
            className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-method`} className="block text-xs font-medium text-slate-700">
            Method:
          </label>
          <select
            id={`${id}-method`}
            value={data?.apiMethod || "GET"}
            onChange={handleMethodChange}
            className="nodrag mt-1 block w-full pl-3 pr-10 py-1.5 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-headers`} className="block text-xs font-medium text-slate-700">
            Headers (JSON):
          </label>
          <textarea
            id={`${id}-headers`}
            value={data?.headers || ""}
            onChange={handleHeadersChange}
            className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            rows={3}
            placeholder='{"Content-Type": "application/json"}'
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-body`} className="block text-xs font-medium text-slate-700">
            Body (JSON):
          </label>
          <textarea
            id={`${id}-body`}
            value={data?.body || ""}
            onChange={handleBodyChange}
            className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            rows={3}
            placeholder='{"key": "value"}'
          />
        </div>
      </div>
    </BaseNode>
  );
};