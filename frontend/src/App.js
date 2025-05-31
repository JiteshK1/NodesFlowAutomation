import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";
import PropertiesPanel from "./PropertiesPanel";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <PipelineToolbar />
      </div>
      <div className="flex flex-grow">
        <div className="flex-grow flex flex-col">
          <PipelineUI />
          <SubmitButton />
        </div>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="w-64 bg-slate-50">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
