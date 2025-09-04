const ToolbarButton = ({ title, icon: Icon, onClick, active }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${active ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
  >
    <Icon size={16} />
  </button>
);

export default ToolbarButton;
