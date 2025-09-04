import React from "react";
import { FaRobot, FaTimes, FaExpand, FaCompress } from "react-icons/fa";

const ChatHeader = ({ isMaximized, onToggleMax, onClose }) => (
  <header
    className="bg-gradient-to-r from-[#4e51e5] from-[1%] to-[#fbcf7dfa] to-[100%]  text-white p-4 flex items-center justify-between shadow-md"
    role="banner"
  >
    <div className="flex items-center gap-2">
      <FaRobot className="w-5 h-5" aria-hidden="true" />
      <h1 className="font-semibold text-sm" id="chatTitle">
        AI Assistant
      </h1>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleMax}
        aria-label={isMaximized ? "Minimize Chat Window" : "Maximize Chat Window"}
        className="p-1 rounded-full  transition focus:outline-none focus:ring-2 focus:ring-white"
      >
        {isMaximized ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
      </button>
      <button
        onClick={onClose}
        aria-label="Close Chat Window"
        className="p-1 rounded-full  transition focus:outline-none focus:ring-2 focus:ring-white"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  </header>
);

export default ChatHeader;
