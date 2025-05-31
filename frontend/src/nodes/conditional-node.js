import { Position } from "reactflow";
import BaseNode from "./base-node";
import { useStore } from "../store";
import { useState } from "react";

// Operator descriptions for better user understanding
const operatorDescriptions = {
  equals: "Checks if the input value is exactly equal to the comparison value.",
  notEquals: "Checks if the input value is not equal to the comparison value.",
  contains: "Checks if the input value (string) contains the comparison value.",
  startsWith: "Checks if the input value (string) starts with the comparison value.",
  endsWith: "Checks if the input value (string) ends with the comparison value.",
  greaterThan: "Checks if the input value (number) is greater than the comparison value.",
  lessThan: "Checks if the input value (number) is less than the comparison value.",
};

export const ConditionalNode = ({ id, data, selected }) => {
  const { updateNodeField } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
  }));

  const [variablePathError, setVariablePathError] = useState("");
  const [comparisonValueError, setComparisonValueError] = useState("");

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    // Validate fields
    if (field === "variablePath") {
      if (!value.trim()) {
        setVariablePathError("Variable path cannot be empty.");
      } else {
        setVariablePathError("");
      }
    }

    if (field === "comparisonValue" && (data?.operator === "greaterThan" || data?.operator === "lessThan")) {
      if (value && isNaN(value)) {
        setComparisonValueError("Comparison value must be a number for this operator.");
      } else {
        setComparisonValueError("");
      }
    } else if (field === "comparisonValue") {
      setComparisonValueError("");
    }

    updateNodeField(id, field, value);
  };

  const handleOperatorChange = (e) => {
    const value = e.target.value;
    updateNodeField(id, "operator", value);

    // Revalidate comparison value when operator changes
    if ((value === "greaterThan" || value === "lessThan") && data?.comparisonValue && isNaN(data.comparisonValue)) {
      setComparisonValueError("Comparison value must be a number for this operator.");
    } else {
      setComparisonValueError("");
    }
  };

  const handles = [
    { type: "target", position: Position.Left, idSuffix: "input", style: { top: "50%" } },
    { type: "source", position: Position.Right, idSuffix: "true-output", style: { top: "35%" } },
    { type: "source", position: Position.Right, idSuffix: "false-output", style: { top: "65%" } },
  ];

  return (
    <BaseNode id={id} title="Conditional Logic" handlesConfig={handles} nodeWidth={300} selected={selected}>
      <div className="space-y-3">
        <div className="text-sm text-slate-700">
          Node ID: {id}
        </div>
        <div>
          <label htmlFor={`${id}-name`} className="block text-xs font-medium text-slate-700">
            Name:
          </label>
          <input
            id={`${id}-name`}
            type="text"
            value={data?.name || ""}
            onChange={handleChange("name")}
            className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
        <p className="text-xs text-slate-500 mb-2">Route based on input value.</p>
        <div>
          <label htmlFor={`${id}-variablePath`} className="block text-xs font-medium text-slate-700">
            Input Variable Path (e.g., `data.value`):
          </label>
          <input
            id={`${id}-variablePath`}
            type="text"
            placeholder="data.value"
            value={data?.variablePath || ""}
            onChange={handleChange("variablePath")}
            className={`nodrag mt-1 block w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm ${variablePathError ? "border-red-500" : "border-slate-300"}`}
          />
          {variablePathError && (
            <p className="text-xs text-red-500 mt-1">{variablePathError}</p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-operator`} className="block text-xs font-medium text-slate-700">
            Operator:
          </label>
          <select
            id={`${id}-operator`}
            value={data?.operator || "equals"}
            onChange={handleOperatorChange}
            className="nodrag mt-1 block w-full pl-3 pr-10 py-1.5 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
          >
            {Object.keys(operatorDescriptions).map((op) => (
              <option key={op} value={op}>
                {op.charAt(0).toUpperCase() + op.slice(1).replace(/([A-Z])/g, ' $1')}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            {operatorDescriptions[data?.operator || "equals"]}
          </p>
        </div>
        <div>
          <label htmlFor={`${id}-comparisonValue`} className="block text-xs font-medium text-slate-700">
            Comparison Value:
          </label>
          <input
            id={`${id}-comparisonValue`}
            type="text"
            value={data?.comparisonValue || ""}
            onChange={handleChange("comparisonValue")}
            className={`nodrag mt-1 block w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm ${comparisonValueError ? "border-red-500" : "border-slate-300"}`}
          />
          {comparisonValueError && (
            <p className="text-xs text-red-500 mt-1">{comparisonValueError}</p>
          )}
        </div>
        <div className="text-xs text-slate-500">
          <p><span className="font-medium text-green-600">True Output:</span> Top Right Handle</p>
          <p><span className="font-medium text-red-600">False Output:</span> Bottom Right Handle</p>
        </div>
      </div>
    </BaseNode>
  );
};