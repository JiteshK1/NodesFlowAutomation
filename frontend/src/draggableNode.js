export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType }
    event.target.style.cursor = "grabbing"
    event.dataTransfer.setData("application/reactflow", JSON.stringify(appData))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      className={`
        flex items-center p-3 space-x-3 
        bg-white hover:bg-sky-50 
        border border-slate-200 hover:border-sky-300 
        rounded-lg shadow-xs hover:shadow-md 
        text-slate-700 hover:text-sky-700
        transition-all duration-150 ease-in-out
      `}
      style={{
        cursor: "grab",
      }}
      draggable
    >
      {icon && <span className="flex-shrink-0 text-slate-500 group-hover:text-sky-600">{icon}</span>}
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
