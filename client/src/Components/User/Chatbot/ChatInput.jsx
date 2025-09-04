import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const ChatInput = ({ input, setInput, onSend }) => (
  <form
    className="p-3 bg-white flex items-center gap-2 shadow-inner"
    onSubmit={(e) => {
      e.preventDefault();
      onSend();
    }}
    role="search"
    aria-label="Chat Input Section"
  >
    <label htmlFor="chatInput" className="sr-only">
      Type your message
    </label>
    <input
      id="chatInput"
      type="text"
      placeholder="Type your message"
      className="flex-1 border rounded-xl px-3 py-2 text-sm shadow-sm 
                 focus:ring-2 focus:ring-indigo-500 outline-none transition"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      aria-required="true"
    />
    <button
      type="submit"
      aria-label="Send Message"
      className="bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-xl shadow 
                 transition-transform hover:scale-110 focus:ring-2 focus:ring-indigo-500"
    >
      <FaPaperPlane className="w-4 h-4" />
    </button>
  </form>
);

export default ChatInput;
