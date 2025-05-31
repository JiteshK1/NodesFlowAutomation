import { useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";
import { ConditionalNode } from "./nodes/conditional-node";
import { DataTransformationNode } from "./nodes/DataTransformationNode";
import { ApiCallNode } from "./nodes/ApiCallNode";
import { DataStorageNode } from "./nodes/DataStorage";
import { UserInteractionNode } from "./nodes/UserInteraction";
import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  conditionalNode: ConditionalNode,
  transform: DataTransformationNode,
  api: ApiCallNode,
  storage: DataStorageNode,
  interact: UserInteractionNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteNode: state.deleteNode,
  removeEdge: state.removeEdge,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
    removeEdge,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: type, name: `${type}-${nodeID.split('-')[1]}` };

    switch (type) {
      case "text":
        nodeData.text = "{{input}}";
        break;
      case "conditionalNode":
        nodeData.variablePath = "data.value";
        nodeData.operator = "equals";
        nodeData.comparisonValue = "";
        break;
      case "transform":
        nodeData.transformFunction = "// Write your transformation function here\nreturn input;";
        break;
      case "api":
        nodeData.apiUrl = "";
        nodeData.apiMethod = "GET";
        nodeData.headers = "";
        nodeData.body = "";
        break;
      case "storage":
        nodeData.operation = "Save";
        nodeData.storageKey = "";
        break;
      case "interact":
        nodeData.interactionType = "Button";
        nodeData.buttonText = "Click Me";
        nodeData.formFields = "";
        break;
    }

    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      removeEdge(selectedEdge.id);
    }
    setIsDialogOpen(false);
    setSelectedEdge(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEdge(null);
  };

  return (
    <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        deleteKeyCode={null}
        connectionLineType="smoothstep"
        onEdgeClick={onEdgeClick}
      >
        <Background color="#aaa" gap={gridSize} />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Delete Edge
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this edge? This action will remove the connection between the nodes.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEdge}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};