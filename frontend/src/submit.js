// submit.js
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { toast } from 'react-toastify';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    try {
      const pipeline = { nodes, edges };
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pipeline),
      });

      if (!response.ok) {
        throw new Error('Failed to parse pipeline');
      }

      const data = await response.json();
      toast.success(
        `Pipeline Analysis:\n` +
        `Number of Nodes: ${data.num_nodes}\n` +
        `Number of Edges: ${data.num_edges}\n` +
        `Is DAG: ${data.is_dag ? 'Yes' : 'No'}`,
        { position: "top-center" }
      );
    } catch (error) {
      toast.error(`Error: ${error.message}`, { position: "top-center" });
    }
  };

  return (
    <div className="flex justify-center p-4">
      <button
        onClick={handleSubmit}
      className="px-4 py-2 bg-neutral-900 text-white rounded-md shadow-sm hover:bg-neutral-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500"

      >
        Submit Pipeline
      </button>
    </div>
  );
};