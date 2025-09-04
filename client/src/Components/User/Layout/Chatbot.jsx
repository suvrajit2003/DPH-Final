// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaComments } from "react-icons/fa";
// import ChatHeader from "../Chatbot/ChatHeader";
// import MessageBubble from "../Chatbot/MessageBubble";
// import TypingIndicator from "../Chatbot/TypingIndicator";
// import ChatInput from "../Chatbot/ChatInput";

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       role: "bot",
//       text: "👋 Welcome! I’m your assistant. How can I help you today?",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   useEffect(() => {
//     const handleKeyDown = (e) =>
//       e.key === "Escape" && isOpen && setIsOpen(false);
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isOpen]);

//   const handleSend = () => {
//     if (!input.trim()) return;
//     setMessages((prev) => [...prev, { role: "user", text: input }]);
//     setInput("");
//     setIsTyping(true);

//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", text: "✅ Request received. I'll get back shortly." },
//       ]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   return (
//     <div>
//       {/* Accessibility Skip Link */}
//       <a
//         href="#chatWindow"
//         className="sr-only focus:not-sr-only bg-indigo-700 text-white px-4 py-2"
//       >
//         Skip to Chat
//       </a>

//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Open AI Assistant Chat"
//         className="fixed bottom-5 right-5 z-[9999] bg-gradient-to-r from-[#4e51e5] from-[1%] to-[#fbcf7dfa] to-[100%]  text-white p-4 rounded-full shadow-lg 
//                    transition-transform hover:scale-110 hover:shadow-2xl"
//       >
//         <FaComments className="w-6 h-6" />
//       </button>

//       {/* Chat Window */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.section
//             role="dialog"
//             aria-labelledby="chatTitle"
//             id="chatWindow"
//             aria-live="polite"
//             initial={{ opacity: 0, y: 50, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 50, scale: 0.9 }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//             className="fixed bottom-20 right-5 z-[9999] bg-white shadow-2xl flex flex-col overflow-hidden rounded-2xl"
//             style={{
//               width: "22rem",
//               height: "500px",
//             }}
//           >
//             <ChatHeader onClose={() => setIsOpen(false)} />

//             {/* Messages */}
//             <div
//               className="flex-1 overflow-y-auto p-3 space-y-3"
//               role="log"
//               aria-live="polite"
//               style={{
//                 backgroundImage:
//                   "url('https://img.freepik.com/free-vector/vintage-ornamental-flowers-background_52683-28040.jpg')",
//                 backgroundSize: "cover",
//                 backgroundRepeat: "repeat",
//               }}
//             >
//               <ul className="space-y-3">
//                 {messages.map((msg, i) => (
//                   <MessageBubble key={i} {...msg} />
//                 ))}
//                 {isTyping && <TypingIndicator />}
//                 <div ref={chatEndRef} />
//               </ul>
//             </div>

//             {/* Input */}
//             <ChatInput input={input} setInput={setInput} onSend={handleSend} />
//           </motion.section>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Chatbot;


import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments } from "react-icons/fa";
import ChatHeader from "../Chatbot/ChatHeader";
import MessageBubble from "../Chatbot/MessageBubble";
import TypingIndicator from "../Chatbot/TypingIndicator";
import ChatInput from "../Chatbot/ChatInput";
import axios from "axios";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Welcome! I'm your assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const chatEndRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleKeyDown = (e) =>
      e.key === "Escape" && isOpen && setIsOpen(false);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Fetch active categories when chatbot opens
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chatbot/categories?status=Active`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Sorry, I'm having trouble loading categories. Please try again later."
      }]);
    }
  };

  const fetchQuestions = async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chatbot/questions?category_id=${categoryId}&status=Active`);
      setQuestions(response.data.questions || []);
      return response.data.questions;
    } catch (error) {
      console.error("Error fetching questions:", error);
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Sorry, I'm having trouble loading questions. Please try again later."
      }]);
      return [];
    }
  };

  const fetchAnswer = async (questionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chatbot/answers?question_id=${questionId}&status=Active`);
      return response.data.answers[0] || null;
    } catch (error) {
      console.error("Error fetching answer:", error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Process user input
      if (!currentCategory) {
        // User is selecting a category
        const matchedCategory = categories.find(cat => 
          cat.en.toLowerCase().includes(input.toLowerCase()) || 
          cat.od.toLowerCase().includes(input.toLowerCase())
        );

        if (matchedCategory) {
          setCurrentCategory(matchedCategory);
          const categoryQuestions = await fetchQuestions(matchedCategory.id);
          
          if (categoryQuestions.length > 0) {
            const questionList = categoryQuestions.map((q, index) => 
              `${index + 1}. ${q.en}`
            ).join('\n');
            
            setMessages(prev => [...prev, {
              role: "bot",
              text: `Great! Here are questions about ${matchedCategory.en}:\n\n${questionList}\n\nPlease type the question number or the question text.`
            }]);
          } else {
            setMessages(prev => [...prev, {
              role: "bot",
              text: `Sorry, there are no questions available for ${matchedCategory.en} right now.`
            }]);
          }
        } else {
          setMessages(prev => [...prev, {
            role: "bot",
            text: "I didn't understand that. Please choose from the available categories above or type a category name."
          }]);
        }
      } else {
        // User is selecting a question
        const questionNumber = parseInt(input);
        let selectedQuestion = null;

        if (!isNaN(questionNumber) && questionNumber > 0 && questionNumber <= questions.length) {
          selectedQuestion = questions[questionNumber - 1];
        } else {
          // Try to match by text
          selectedQuestion = questions.find(q => 
            q.en.toLowerCase().includes(input.toLowerCase()) || 
            q.od.toLowerCase().includes(input.toLowerCase())
          );
        }

        if (selectedQuestion) {
          const answer = await fetchAnswer(selectedQuestion.id);
          if (answer) {
            setMessages(prev => [...prev, {
              role: "bot",
              text: `${answer.en}\n\n${answer.od ? answer.od : ''}`
            }]);
          } else {
            setMessages(prev => [...prev, {
              role: "bot",
              text: "Sorry, I don't have an answer for that question yet."
            }]);
          }
        } else {
          setMessages(prev => [...prev, {
            role: "bot",
            text: "I didn't understand that. Please type the question number or the question text."
          }]);
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Sorry, I'm having trouble processing your request. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCategorySelect = async (category) => {
    setCurrentCategory(category);
    setMessages(prev => [...prev, {
      role: "user",
      text: category.en
    }]);
    setIsTyping(true);

    try {
      const categoryQuestions = await fetchQuestions(category.id);
      
      if (categoryQuestions.length > 0) {
        const questionList = categoryQuestions.map((q, index) => 
          `${index + 1}. ${q.en}`
        ).join('\n');
        
        setMessages(prev => [...prev, {
          role: "bot",
          text: `Here are questions about ${category.en}:\n\n${questionList}\n\nPlease type the question number or the question text.`
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: "bot",
          text: `Sorry, there are no questions available for ${category.en} right now.`
        }]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Sorry, I'm having trouble loading questions. Please try again later."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setCurrentCategory(null);
    setQuestions([]);
    setMessages([{
      role: "bot",
      text: "👋 Welcome! I'm your assistant. How can I help you today?",
    }]);
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
        className="fixed bottom-5 right-5 z-[9999] bg-gradient-to-r from-[#4e51e5] from-[1%] to-[#fbcf7dfa] to-[100%] text-white p-4 rounded-full shadow-lg 
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
            <ChatHeader onClose={() => setIsOpen(false)} onReset={resetChat} />

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
              {/* Category buttons (show when no category is selected) */}
              {!currentCategory && categories.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2">Choose a category:</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {category.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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