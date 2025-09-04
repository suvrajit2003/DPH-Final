import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments } from "react-icons/fa";
import ChatHeader from "../Chatbot/ChatHeader";
import MessageBubble from "../Chatbot/MessageBubble";
import TypingIndicator from "../Chatbot/TypingIndicator";
import ChatInput from "../Chatbot/ChatInput";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Welcome! I’m your assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleKeyDown = (e) =>
      e.key === "Escape" && isOpen && setIsOpen(false);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "✅ Request received. I'll get back shortly." },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div>
      {/* Accessibility Skip Link */}
      <a
        href="#chatWindow"
        className="sr-only focus:not-sr-only bg-indigo-700 text-white px-4 py-2"
      >
        Skip to Chat
      </a>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Assistant Chat"
        className="fixed bottom-5 right-5 z-[9999] bg-gradient-to-r from-[#4e51e5] from-[1%] to-[#fbcf7dfa] to-[100%]  text-white p-4 rounded-full shadow-lg 
                   transition-transform hover:scale-110 hover:shadow-2xl"
      >
        <FaComments className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-labelledby="chatTitle"
            id="chatWindow"
            aria-live="polite"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-20 right-5 z-[9999] bg-white shadow-2xl flex flex-col overflow-hidden rounded-2xl"
            style={{
              width: "22rem",
              height: "500px",
            }}
          >
            <ChatHeader onClose={() => setIsOpen(false)} />

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-3 space-y-3"
              role="log"
              aria-live="polite"
              style={{
                backgroundImage:
                  "url('https://img.freepik.com/free-vector/vintage-ornamental-flowers-background_52683-28040.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "repeat",
              }}
            >
              <ul className="space-y-3">
                {messages.map((msg, i) => (
                  <MessageBubble key={i} {...msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={chatEndRef} />
              </ul>
            </div>

            {/* Input */}
            <ChatInput input={input} setInput={setInput} onSend={handleSend} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
