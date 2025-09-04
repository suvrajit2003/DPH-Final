
import React, { useState, useEffect } from "react";
import SortModal from "./SortModal";
import SortableList from "./SortableList";

const SortMenuController = ({ 
    open, 
    onClose, 
    items = [], 
    onSave,
    title, // Make sure title is passed down too
    displayKey, // Catch the prop
    secondaryKey // Catch the prop
}) => {
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => setLocalItems(items), [items]);

  const handleChange = (newList) => setLocalItems(newList);

  const handleSave = () => {
    onSave?.(localItems);
    onClose?.();
  };

  return (
    <SortModal
      isOpen={open}
      onClose={onClose}
      title={title || "Reorder Items"} // Use the title from props
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition"
          >
            Save Order
          </button>
        </>
      }
    >
      <div className="max-h-[60vh] overflow-auto pr-2">
        <SortableList 
          items={localItems} 
          onChange={handleChange}
          displayKey={displayKey} // Pass it down
          secondaryKey={secondaryKey} // Pass it down
        />
      </div>
    </SortModal>
  );
};

export default SortMenuController;
