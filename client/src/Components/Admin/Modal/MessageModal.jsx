
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const variantConfig = {
  success: {
    icon: <CheckCircle className="w-10 h-10 text-green-500" />,
    title: "Success",
    bg: "bg-green-50",
  },
  error: {
    icon: <XCircle className="w-10 h-10 text-red-500" />,
    title: "Error",
    bg: "bg-red-50",
  },
  warning: {
    icon: <AlertTriangle className="w-10 h-10 text-yellow-500" />,
    title: "Warning",
    bg: "bg-yellow-50",
  },
  info: {
    icon: <Info className="w-10 h-10 text-blue-500" />,
    title: "Information",
    bg: "bg-blue-50",
  },
};

export const ModalDialog = ({ open, onClose, variant = "info", message }) => {
  const { icon, title, bg } = variantConfig[variant];
  const [show, setShow] = useState(open);

  useEffect(() => {
    if (open) {
      setShow(true);
    } else {
      // allow exit animation before unmount
      setTimeout(() => setShow(false), 200);
    }
  }, [open]);

  if (!open && !show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        open ? "opacity-100 bg-black/50" : "opacity-0 bg-black/0"
      }`}
    >
      <div
        className={`w-full max-w-md rounded shadow-lg p-6 transform transition-all duration-200 ${bg} ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="mt-3 text-sm text-gray-700">{message}</p>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
