import React from "react";
import { Accessibility } from "lucide-react";
import { motion } from "framer-motion";

export default function AccessibilityButton({ onClick }) {
  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className="relative group flex items-center justify-end">
        {/* Tooltip */}
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute right-14 px-3 py-1 rounded-lg bg-gray-900 text-white text-sm 
                     pointer-events-none whitespace-nowrap shadow-lg"
        >
          Accessibility
        </motion.span>

        {/* Floating Gradient Button */}
        <motion.button
          aria-label="Accessibility options"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={onClick}
          className="p-4 rounded-full text-white shadow-xl 
                     bg-gradient-to-r from-indigo-600 to-amber-300 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Accessibility size={22} />
        </motion.button>
      </div>
    </div>
  );
}
