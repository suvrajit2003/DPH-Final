import React from "react";
import { ArrowLeft } from "lucide-react";

const Header = ({ title, onGoBack }) => (
  <div className="mb-6 flex items-center justify-between">
    <h1 className="text-xl font-semibold text-black">{title}</h1>
    <button
      onClick={onGoBack}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition"
    >
      <ArrowLeft size={16} />
      Go Back
    </button>
  </div>
);

export default Header;
