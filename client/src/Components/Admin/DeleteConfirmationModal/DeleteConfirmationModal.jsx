
// components/DeleteConfirmationModal.jsx
import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmationModal = ({
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  icon: Icon = AlertTriangle,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  const [show, setShow] = useState(false);

  // Trigger enter animation when mounted
  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200); // wait for transition before unmounting
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-200 ${
        show ? "opacity-100 bg-black/40" : "opacity-0 bg-black/0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg p-6 w-full max-w-sm shadow-xl relative transform transition-all duration-200 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {Icon && (
          <div className="flex justify-center mb-3 text-red-500">
            <Icon size={40} />
          </div>
        )}
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              handleClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
