import { Handle, Position } from "reactflow";
import { X } from "lucide-react";
import { useStore } from "../store";

const BaseNode = ({
  id,
  title,
  handlesConfig = [],
  children,
  nodeWidth = 200,
  nodeHeight,
  containerClassName = "",
  titleClassName = "",
  contentClassName = "",
  selected = false,
}) => {
  const { deleteNode } = useStore((state) => ({
    deleteNode: state.deleteNode,
  }));

  const getNodeBorderColor = (nodeTitle) => {
    const lowerCaseTitle = typeof nodeTitle === "string" ? nodeTitle.toLowerCase() : "";
    switch (lowerCaseTitle) {
      case "text":
        return "border-blue-400";
      case "input":
        return "border-green-400";
      case "llm":
        return "border-purple-400";
      case "output":
        return "border-red-400";
      default:
        return "border-slate-300";
    }
  };

  const handleDelete = () => {
    deleteNode(id);
  };

  return (
    <div
      className={`
        relative bg-white border-2 ${getNodeBorderColor(title)} rounded-xl shadow-sm
        flex flex-col p-4
        hover:shadow-md transform hover:-translate-y-0.5
        transition-all duration-200 ease-out
        ${selected ? "ring-2 ring-sky-400 shadow-lg" : ""}
        ${containerClassName}
      `}
      style={{
        width: nodeWidth,
        ...(nodeHeight ? { minHeight: nodeHeight } : {}),
      }}
    >
      <button
        onClick={handleDelete}
        className="absolute top-1 right-1 p-1 text-slate-500 hover:text-red-500 transition-colors duration-150"
      >
        <X size={16} />
      </button>

      <div
        className={`
          font-semibold text-slate-900 text-sm tracking-tight
          pb-2 mb-3 border-b border-slate-100
          ${titleClassName}
        `}
      >
        {title}
      </div>

      <div className={`flex-grow text-xs text-slate-600 ${contentClassName}`}>{children}</div>

      {handlesConfig.map((h, i) => {
        const dynamicTop = h.style?.top || `${40 + i * 25}px`;
        const edgeOffset =
          h.position === Position.Left ? { left: -4 } : h.position === Position.Right ? { right: -4 } : {};

        return (
          <Handle
            key={`${id}-${h.idSuffix}-${i}`}
            type={h.type}
            position={h.position}
            id={`${id}-${h.idSuffix}`}
            style={{
              ...h.style,
              top: dynamicTop,
              ...edgeOffset,
              background: h.style?.background || "#3b82f6",
              width: h.style?.width || "8px",
              height: h.style?.height || "8px",
              borderRadius: h.style?.borderRadius || "50%",
              border: h.style?.border || "1px solid #ffffff",
              transition: h.style?.transition || "transform 0.2s ease",
            }}
            className="hover:scale-125"
          />
        );
      })}
    </div>
  );
};

export default BaseNode;