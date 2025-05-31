import { Position } from "reactflow";
import BaseNode from "./base-node";
import { useStore } from "../store";

export const UserInteractionNode = ({ id, data }) => {
  const { updateNodeField } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
  }));

  const handleNameChange = (e) => {
    updateNodeField(id, "name", e.target.value);
  };

  const handleTypeChange = (e) => {
    updateNodeField(id, "interactionType", e.target.value);
  };

  const handleButtonTextChange = (e) => {
    updateNodeField(id, "buttonText", e.target.value);
  };

  const handleFormFieldsChange = (e) => {
    updateNodeField(id, "formFields", e.target.value);
  };

  const handles = [
    { type: "target", position: Position.Left, idSuffix: "input" },
    { type: "source", position: Position.Right, idSuffix: "output" },
  ];

  return (
    <BaseNode id={id} title="Interact" handlesConfig={handles} nodeWidth={300}>
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
            Interaction Type:
          </label>
          <select
            id={`${id}-type`}
            value={data?.interactionType || "Button"}
            onChange={handleTypeChange}
            className="nodrag mt-1 block w-full pl-3 pr-10 py-1.5 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
          >
            <option value="Button">Button</option>
            <option value="Form">Form</option>
          </select>
        </div>
        {data?.interactionType === "Button" && (
          <div className="space-y-1">
            <label htmlFor={`${id}-button-text`} className="block text-xs font-medium text-slate-700">
              Button Text:
            </label>
            <input
              id={`${id}-button-text`}
              type="text"
              value={data?.buttonText || "Click Me"}
              onChange={handleButtonTextChange}
              className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
        )}
        {data?.interactionType === "Form" && (
          <div className="space-y-1">
            <label htmlFor={`${id}-form-fields`} className="block text-xs font-medium text-slate-700">
              Form Fields (JSON):
            </label>
            <textarea
              id={`${id}-form-fields`}
              value={data?.formFields || '[{"label": "Name", "type": "text"}]'}
              onChange={handleFormFieldsChange}
              className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              rows={5}
              placeholder='[{"label": "Name", "type": "text"}, {"label": "Age", "type": "number"}]'
            />
          </div>
        )}
      </div>
    </BaseNode>
  );
};