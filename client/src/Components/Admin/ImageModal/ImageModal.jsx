
// components/ImageModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";

const ImageModal = ({ imageUrl, onClose }) => {
  const modalRef = useRef();
  const [show, setShow] = useState(false);

  // Mount animation trigger
  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  // ESC key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200); // wait for transition
  };

  // Click outside closes modal
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        show ? "opacity-100 bg-black/70" : "opacity-0 bg-black/0"
      }`}
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl p-4 max-w-2xl w-full transform transition-all duration-200 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          className="absolute -top-2 -right-4 text-gray-500 hover:text-black"
          onClick={handleClose}
        >
          <FaTimes size={20} />
        </button>
        <img
          src={imageUrl}
          alt="Full Preview"
          className="w-full rounded-lg transition-transform duration-300 hover:scale-105 cursor-zoom-in"
        />
      </div>
    </div>
  );
};

export default ImageModal;
