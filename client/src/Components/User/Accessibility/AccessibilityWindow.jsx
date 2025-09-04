import React, { useState } from "react";
import {
  X,
  Type,
  Contrast,
  Moon,
  Sun,
  Volume2,
  Keyboard,
  Eye,
  Undo2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AccessibilitySlider from "./AccessibilitySlider";

export default function AccessibilityWindow({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("text");
  const [fontSize, setFontSize] = useState(16);
  const [brightness, setBrightness] = useState(100);
  const [openSlider, setOpenSlider] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const textOptions = [
    { id: "font", label: "Font Size", icon: <Type />, type: "slider" },
    { id: "spacing", label: "Text Spacing", icon: <Type /> },
    { id: "readable", label: "Readable Font", icon: <Type /> },
  ];

  const visionOptions = [
    { id: "contrast", label: "High Contrast", icon: <Contrast /> },
    { id: "dark", label: "Dark Mode", icon: <Moon /> },
    { id: "invert", label: "Invert Colors", icon: <Sun /> },
    {
      id: "brightness",
      label: "Brightness",
      icon: <Contrast />,
      type: "slider",
    },
  ];

  const assistiveOptions = [
    { id: "screenreader", label: "Screen Reader", icon: <Eye /> },
    { id: "focus", label: "Focus Highlight", icon: <Eye /> },
    { id: "voice", label: "Voice Control", icon: <Volume2 /> },
    { id: "keyboard", label: "Keyboard Nav", icon: <Keyboard /> },
  ];

  const renderOptions = (options) =>
    options.map((opt) => (
      <motion.div key={opt.id} className="flex flex-col">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpenSlider(openSlider === opt.id ? null : opt.id)}
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-blue-50 
                    border border-gray-200 hover:border-blue-300 transition-all duration-200"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full text-blue-600 bg-blue-100 mb-2">
            {opt.icon}
          </div>
          <span className="text-sm font-medium text-gray-700">{opt.label}</span>
        </motion.button>

        {/* Slider Section */}
        {opt.type === "slider" && openSlider === opt.id && (
          <div className="p-3 border-t bg-white">
            {opt.id === "font" && (
              <AccessibilitySlider
                value={fontSize}
                setValue={setFontSize}
                min={12}
                max={32}
                step={1}
                unit="px"
              />
            )}
            {opt.id === "brightness" && (
              <AccessibilitySlider
                value={brightness}
                setValue={setBrightness}
                min={50}
                max={150}
                step={5}
                unit="%"
              />
            )}
          </div>
        )}
      </motion.div>
    ));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isMaximized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={onClose}
            />
          )}

          <motion.section
            role="dialog"
            aria-label="Accessibility Options"
            layout // <-- enables smooth size/position animation
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              layout: { type: "spring", stiffness: 200, damping: 25 },
            }}
            className={`fixed z-50 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden`}
            style={{
              bottom: isMaximized ? "auto" : "6rem", // smooth positioning
              right: "1.5rem",
              top: isMaximized ? "6%" : "auto",
              width: isMaximized ? "53vw" : "380px",
              height: isMaximized ? "85vh" : "520px",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 text-white bg-gradient-to-r from-indigo-600 to-amber-300">
              <div>
                <h2 className="text-xl font-semibold">
                  Accessibility Settings
                </h2>
                <p className="text-sm opacity-90">
                  Customize your browsing experience
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label={
                    isMaximized ? "Restore window" : "Maximize window"
                  }
                >
                  {isMaximized ? <Minimize2 /> : <Maximize2 />}
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close accessibility menu"
                  className="p-2 rounded-full hover:bg-white/20 text-white 
                             focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-4 bg-gray-50">
              {["text", "vision", "assistive"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeTab === "text" && (
                <>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Text Adjustments
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {renderOptions(textOptions)}
                  </div>
                </>
              )}
              {activeTab === "vision" && (
                <>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Visual Adjustments
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {renderOptions(visionOptions)}
                  </div>
                </>
              )}
              {activeTab === "assistive" && (
                <>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Assistive Tools
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {renderOptions(assistiveOptions)}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
                <Undo2 className="mr-2" size={16} /> Reset All
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                Apply Settings
              </button>
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
