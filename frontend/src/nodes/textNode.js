import { Position } from "reactflow";
import BaseNode from "./base-node";
import { useStore } from "../store";
import { useEffect, useState, useRef } from "react";

export const TextNode = ({ id, data, selected }) => {
  const { updateNodeField, nodes, edges, onConnect, removeEdge } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
    nodes: state.nodes,
    edges: state.edges,
    onConnect: state.onConnect,
    removeEdge: state.removeEdge,
  }));

  const [variableHandles, setVariableHandles] = useState([]);
  const [prevVariableHandles, setPrevVariableHandles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);

  const extractVariables = (text) => {
    if (!text) return [];
    const matches = [...text.matchAll(/{{\s*([a-zA-Z_$][\w$]*)\s*}}/g)];
    return [...new Set(matches.map((match) => match[1]))];
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    updateNodeField(id, "text", newText);
    setCursorPosition(e.target.selectionStart);
  };

  const handleNameChange = (e) => {
    updateNodeField(id, "name", e.target.value);
  };

  useEffect(() => {
    if (data?.text && textareaRef.current) {
      const text = data.text;
      const cursor = cursorPosition;
      const beforeCursor = text.slice(0, cursor);

      const currentVariables = extractVariables(text);

      const removedVariables = prevVariableHandles.filter(
        (variable) => !currentVariables.includes(variable)
      );

      removedVariables.forEach((variable) => {
        const edge = edges.find(
          (e) =>
            e.source === variable &&
            e.target === id &&
            e.targetHandle === `${id}-var-${variable}`
        );
        if (edge) {
          removeEdge(edge.id);
        }
      });

      setVariableHandles(currentVariables);
      setPrevVariableHandles(currentVariables);

      if (beforeCursor.endsWith("{{")) {
        const filteredSuggestions = nodes.filter((node) => node.id !== id);
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      const edgesToRemove = edges.filter(
        (e) => e.target === id && e.targetHandle.startsWith(`${id}-var-`)
      );
      edgesToRemove.forEach((edge) => removeEdge(edge.id));
      setVariableHandles([]);
      setPrevVariableHandles([]);
      setShowSuggestions(false);
    }
  }, [data?.text, cursorPosition, nodes, id, edges, removeEdge]);

  const handleSuggestionSelect = (nodeId) => {
    const text = data.text;
    const cursor = cursorPosition;

    const existingEdge = edges.find(
      (e) =>
        e.source === nodeId &&
        e.sourceHandle === `${nodeId}-value` &&
        e.target === id &&
        e.targetHandle === `${id}-var-${nodeId}`
    );

    if (existingEdge) {
      removeEdge(existingEdge.id);

      const regex = new RegExp(`{{\\s*${nodeId}\\s*}}`, "g");
      const newText = text.replace(regex, "");
      updateNodeField(id, "text", newText.trim());
    } else {
      const newText = text.slice(0, cursor) + nodeId + "}}" + text.slice(cursor);
      updateNodeField(id, "text", newText);

      const selectedNode = nodes.find((node) => node.id === nodeId);
      if (selectedNode) {
        const variableName = nodeId;
        const connection = {
          source: nodeId,
          sourceHandle: `${nodeId}-value`,
          target: id,
          targetHandle: `${id}-var-${variableName}`,
        };
        onConnect(connection);
      }
    }

    setShowSuggestions(false);
    textareaRef.current.focus();
  };
  const handles = [
    { type: "target", position: Position.Left, idSuffix: "input", style: { top: "30px" } },
    { type: "source", position: Position.Right, idSuffix: "output" },
    
  ];

  return (
    <BaseNode id={id} title="Text" handlesConfig={handles} nodeWidth={300} selected={selected}>
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
        <div className="space-y-1 relative">
          <label htmlFor={`${id}-text`} className="block text-xs font-medium text-slate-700">
            Text:
          </label>
          <textarea
            ref={textareaRef}
            id={`${id}-text`}
            value={data?.text || ""}
            onChange={handleTextChange}
            onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
            placeholder="Enter text..."
            className="nodrag mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
          {showSuggestions && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full">
              <div className="p-2 text-sm text-gray-500">1 Select Node – 2 Select Output</div>
              {suggestions.map((node) => (
                <div
                  key={node.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSuggestionSelect(node.id)}
                >
                  <div className="flex justify-between">
                    <span>{node.id}</span>
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">
                      {node.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {node.data?.name || "No name"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
};