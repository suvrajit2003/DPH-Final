import React from "react";
import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";

const TypingIndicator = () => (
  <div className="flex items-center gap-2" role="status" aria-label="Assistant is typing">
    <div className="p-2 bg-indigo-100 rounded-full shadow" aria-hidden="true">
      <FaRobot className="w-4 h-4 text-indigo-700" />
    </div>
    <div className="px-3 py-2 rounded-2xl shadow-md text-sm bg-white rounded-bl-none flex gap-1">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="w-2 h-2 bg-indigo-600 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
