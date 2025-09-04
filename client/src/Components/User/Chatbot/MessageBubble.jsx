import React from "react";
import { motion } from "framer-motion";
import { FaRobot, FaUser } from "react-icons/fa";

const MessageBubble = ({ role, text }) => {
  const isUser = role === "user";
  const Icon = isUser ? FaUser : FaRobot;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      role="listitem"
      aria-live="polite"
      className={`flex items-start gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="p-2 bg-indigo-100 rounded-full shadow" aria-hidden="true">
          <Icon className="w-4 h-4 text-indigo-700" />
        </div>
      )}
      <div
        className={`px-3 py-2 rounded-2xl text-sm max-w-[70%] leading-relaxed shadow-md 
        ${isUser ? "bg-indigo-700 text-white rounded-br-none" : "bg-white text-black rounded-bl-none"}`}
      >
        {text}
      </div>
      {isUser && (
        <div className="p-2 bg-indigo-100 rounded-full shadow" aria-hidden="true">
          <Icon className="w-4 h-4 text-indigo-700" />
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;
