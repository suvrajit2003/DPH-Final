
// components/SortModal/SortModal.jsx
import React, { useEffect, useState } from "react";

const SortModal = ({ isOpen, onClose, title, children, footer }) => {
  const [show, setShow] = useState(isOpen);

  // Manage body scroll lock
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // allow exit transition before unmount
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onMouseDown={onClose}
      />

      {/* Modal container */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-200 ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sort-modal-title"
        onMouseDown={onClose}
      >
        <div
          className="w-full max-w-2xl mx-auto rounded-xl shadow-2xl bg-white text-gray-900 border border-gray-200 overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50">
            <div>
              <h3 id="sort-modal-title" className="text-lg font-semibold">
                {title || "Reorder Items"}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SortModal;
