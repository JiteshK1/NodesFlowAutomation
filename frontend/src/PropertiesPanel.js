import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
const selector = (state) => ({
  nodes: state.nodes,
  updateNodeField: state.updateNodeField,
  deleteNode: state.deleteNode,
});

// Node configuration
const nodeConfig = {
  text: {
    title: 'Text Node',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'Text',
        name: 'text',
        type: 'textarea',
        defaultValue: '',
        rows: 4,
      },
    ],
  },
  customInput: {
    title: 'Input Node',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'Type',
        name: 'inputType',
        type: 'select',
        defaultValue: 'Text',
        options: ['Text', 'File'],
      },
    ],
  },
  llm: {
    title: 'LLM Node',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'Description',
        name: 'llmDescription',
        type: 'textarea',
        defaultValue: '',
        rows: 4,
      },
    ],
  },
  customOutput: {
    title: 'Output Node',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'Type',
        name: 'outputType',
        type: 'select',
        defaultValue: 'Text',
        options: ['Text', 'Image'],
      },
    ],
  },
  conditionalNode: {
    title: 'Conditional Logic Node',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'Variable Path',
        name: 'variablePath',
        type: 'text',
        defaultValue: 'data.value',
      },
      {
        label: 'Operator',
        name: 'operator',
        type: 'select',
        defaultValue: 'equals',
        options: ['equals', 'notEquals', 'contains', 'startsWith', 'endsWith', 'greaterThan', 'lessThan'],
      },
      {
        label: 'Comparison Value',
        name: 'comparisonValue',
        type: 'text',
        defaultValue: '',
      },
    ],
  },
  api: {
    title: 'API Call Node',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'API URL',
        name: 'apiUrl',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'Method',
        name: 'apiMethod',
        type: 'select',
        defaultValue: 'GET',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      {
        label: 'Headers (JSON)',
        name: 'headers',
        type: 'textarea',
        defaultValue: '{"Content-Type": "application/json"}',
        rows: 3,
      },
      {
        label: 'Body (JSON)',
        name: 'body',
        type: 'textarea',
        defaultValue: '',
        rows: 3,
      },
    ],
  },
  transform: {
    title: 'Data Transformation Node',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'JavaScript Function Body',
        name: 'transformFunction',
        type: 'textarea',
        defaultValue: '// Access input data via the \'input\' variable\n// Example: return input.text.toUpperCase();\n// Ensure you return a value.\nreturn input;',
        rows: 8,
      },
    ],
  },
  storage: {
    title: 'Storage Node',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'Operation',
        name: 'operation',
        type: 'select',
        defaultValue: 'Save',
        options: ['Save', 'Retrieve'],
      },
      {
        label: 'Storage Key',
        name: 'storageKey',
        type: 'text',
        defaultValue: '',
      },
    ],
  },
  interact: {
    title: 'User Interaction Node',
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        defaultValue: '',
      },
      {
        label: 'Interaction Type',
        name: 'interactionType',
        type: 'select',
        defaultValue: 'Button',
        options: ['Button', 'Form'],
      },
      {
        label: 'Button Text',
        name: 'buttonText',
        type: 'text',
        defaultValue: 'Click Me',
        condition: (data) => data.interactionType === 'Button',
      },
      {
        label: 'Form Fields (JSON)',
        name: 'formFields',
        type: 'textarea',
        defaultValue: '[{"label": "Name", "type": "text"}]',
        rows: 5,
        condition: (data) => data.interactionType === 'Form',
      },
    ],
  },
};

const Field = ({ field, nodeId, data, updateNodeField }) => {
  if (field.condition && !field.condition(data)) {
    return null;
  }

  const value = data[field.name] ?? (typeof field.defaultValue === 'function' ? field.defaultValue(nodeId) : field.defaultValue);

  const handleChange = (e) => {
    updateNodeField(nodeId, field.name, e.target.value);
  };

  const commonClasses = 'w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-sky-500';

  switch (field.type) {
    case 'textarea':
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">{field.label}:</label>
          <textarea
            value={value}
            onChange={handleChange}
            className={commonClasses}
            rows={field.rows || 4}
          />
        </div>
      );
    case 'text':
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">{field.label}:</label>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className={commonClasses}
          />
        </div>
      );
    case 'number':
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">{field.label}:</label>
          <input
            type="number"
            value={value}
            onChange={handleChange}
            className={commonClasses}
          />
        </div>
      );
    case 'select':
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">{field.label}:</label>
          <select
            value={value}
            onChange={handleChange}
            className={commonClasses}
          >
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    default:
      return null;
  }
};

const PanelWrapper = ({ title, children, isCollapsed, setIsCollapsed }) => (
  <div className={`bg-slate-50 p-4 border-l border-slate-200 shadow-sm fixed top-0 right-0 h-full transition-all duration-300 ease-in-out ${
    isCollapsed ? "w-12" : "w-64"
  }`}>
    <div className={`flex justify-between items-center mb-4 transition-opacity duration-300 ${
      isCollapsed ? "opacity-0" : "opacity-100"
    }`}>
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <button onClick={() => setIsCollapsed(true)} className="text-slate-700">
        <ChevronRight size={20} />
      </button>
    </div>
    <div className={`transition-opacity duration-300 ${
      isCollapsed ? "opacity-0" : "opacity-100"
    }`}>
      {children}
    </div>
    
    <div className={`absolute top-4 left-3 transition-opacity duration-300 ${
      isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}>
      <button onClick={() => setIsCollapsed(false)} className="text-slate-700">
        <ChevronLeft size={20} />
      </button>
    </div>
  </div>
);

// Main PropertiesPanel component
const PropertiesPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { nodes, updateNodeField, deleteNode } = useStore(selector, shallow);
  const selectedNode = nodes.find((node) => node.selected);

 

  if (!selectedNode) {
    return (
      <PanelWrapper title="Properties" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}>
        <p className="text-sm text-slate-500">Select a node to edit its properties</p>
      </PanelWrapper>
    );
  }

const handleDelete = () => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this node?</p>
        <div className="flex justify-end space-x-2 mt-2">
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => {
              deleteNode(selectedNode.id);
              toast.success('Node deleted successfully');
              closeToast();
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-2 py-1 rounded"
            onClick={closeToast}
          >
            No
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
};


  const config = nodeConfig[selectedNode.type] || {
    title: 'Properties',
    fields: [],
  };

  return (
    <PanelWrapper title={config.title} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}>
      <div className="space-y-3">
        <div className="text-sm text-slate-700">
          Node ID: {selectedNode.id}
        </div>
        {config.fields.map((field, index) => (
          <Field
            key={`${selectedNode.id}-${field.name}-${index}`}
            field={field}
            nodeId={selectedNode.id}
            data={selectedNode.data}
            updateNodeField={updateNodeField}
          />
        ))}
        <button
          onClick={handleDelete}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Delete Node
        </button>
      </div>
    </PanelWrapper>
  );
};

export default PropertiesPanel;