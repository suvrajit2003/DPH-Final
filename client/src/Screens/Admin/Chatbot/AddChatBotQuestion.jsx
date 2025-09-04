// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { chatbotCategoryAPI } from "../../../services/api";
// import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";
// import { ModalDialog } from "../../../Components/Modal/MessageModal"; // ✅ import your modal

// const AddChatBotQuestion = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = Boolean(id);

//   const [formData, setFormData] = useState({
//     category_id: "",
//     en: "",
//     od: ""
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [pageTitle, setPageTitle] = useState("Add Chatbot Question");

//   // ✅ Modal state
//   const [modal, setModal] = useState({
//     open: false,
//     variant: "info",
//     message: ""
//   });

//   // Fetch categories for the dropdown
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await chatbotCategoryAPI.getAll(1, 1000, '');
//         setCategories(response.data.categories || []);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//         setError("Failed to load categories for the dropdown.");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch question data if in edit mode
//   useEffect(() => {
//     if (isEditMode) {
//       setPageTitle("Edit Chatbot Question");
//       setLoading(true);
//       chatbotQuestionAPI.get(id)
//         .then(response => {
//           const { category_id, en, od } = response.data.question;
//           setFormData({ category_id, en, od });
//         })
//         .catch(err => {
//           console.error("Failed to fetch question:", err);
//           setError("Could not load the question data. Please go back and try again.");
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [id, isEditMode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
    
//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({ ...prev, [name]: "" }));
//     }
//     if (error) setError("");
//   };

//   const validateForm = () => {
//     const errors = {};
//     const trimmedEn = formData.en.trim();
//     const trimmedOd = formData.od.trim();
    
//     if (!formData.category_id) {
//       errors.category_id = "Please select a category";
//     }
    
//     if (!trimmedEn) {
//       errors.en = "English question is required";
//     } else if (trimmedEn.length < 2) {
//       errors.en = "English question must be at least 2 characters";
//     }
    
//     if (!trimmedOd) {
//       errors.od = "Odia question is required";
//     } else if (trimmedOd.length < 2) {
//       errors.od = "Odia question must be at least 2 characters";
//     }
    
//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const checkForDuplicates = async () => {
//     try {
//       const response = await chatbotQuestionAPI.getAll(1, 1000, '');
//       const questions = response.data.questions || [];
      
//       const englishDuplicate = questions.find(question => 
//         question.en.toLowerCase() === formData.en.trim().toLowerCase() && 
//         (!isEditMode || question.id !== parseInt(id))
//       );
      
//       const odiaDuplicate = questions.find(question => 
//         question.od === formData.od.trim() && 
//         (!isEditMode || question.id !== parseInt(id))
//       );
      
//       return { englishDuplicate: !!englishDuplicate, odiaDuplicate: !!odiaDuplicate };
//     } catch (error) {
//       console.error("Error checking for duplicates:", error);
//       return { englishDuplicate: false, odiaDuplicate: false };
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setLoading(true);
//     const duplicates = await checkForDuplicates();
    
//     if (duplicates.englishDuplicate && duplicates.odiaDuplicate) {
//       setModal({ open: true, variant: "error", message: "A question with both this English and Odia text already exists!" });
//       setLoading(false);
//       return;
//     }
//     if (duplicates.englishDuplicate) {
//       setModal({ open: true, variant: "error", message: "A question with this English text already exists!" });
//       setLoading(false);
//       return;
//     }
//     if (duplicates.odiaDuplicate) {
//       setModal({ open: true, variant: "error", message: "A question with this Odia text already exists!" });
//       setLoading(false);
//       return;
//     }
    
//     const submitData = {
//       category_id: formData.category_id,
//       en: formData.en.trim(),
//       od: formData.od.trim()
//     };

//     try {
//       if (isEditMode) {
//         await chatbotQuestionAPI.update(id, submitData);
//         setModal({ open: true, variant: "success", message: "Question updated successfully!" });
//       } else {
//         await chatbotQuestionAPI.create(submitData);
//         setModal({ open: true, variant: "success", message: "Question created successfully!" });
//       }

//       // ✅ navigate after modal closes
//       setTimeout(() => {
//         navigate("/admin/manage-chatbot/chatbot-question");
//       }, 1500);
//     } catch (error) {
//       console.error("Error submitting question:", error);
//       const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      
//       if (errorMessage.toLowerCase().includes("duplicate") || errorMessage.toLowerCase().includes("already exists")) {
//         if (errorMessage.toLowerCase().includes("english")) {
//           setModal({ open: true, variant: "error", message: "A question with this English text already exists!" });
//         } else if (errorMessage.toLowerCase().includes("odia")) {
//           setModal({ open: true, variant: "error", message: "A question with this Odia text already exists!" });
//         } else {
//           setModal({ open: true, variant: "error", message: "A question with this text already exists!" });
//         }
//       } else {
//         setModal({ open: true, variant: "error", message: errorMessage });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleReset = () => {
//     setFormData({ category_id: "", en: "", od: "" });
//     setError("");
//     setFieldErrors({});
//   };

//   return (
//     <div className="min-h-[80vh] py-4 font-sans">
//       <div className="p-6 bg-white shadow rounded-xl max-w-4xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">{pageTitle}</h2>
//           <button
//             onClick={() => navigate("/admin/manage-chatbot/chatbot-question")}
//             className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
//           >
//             ← Go Back
//           </button>
//         </div>

//         {loading && isEditMode ? (
//           <p>Loading question data...</p>
//         ) : (
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium mb-1">
//                 Category <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="category_id"
//                 value={formData.category_id}
//                 onChange={handleChange}
//                 className={`w-full border rounded px-3 py-2 bg-white ${
//                   fieldErrors.category_id ? "border-red-500" : ""
//                 }`}
//                 disabled={loading}
//               >
//                 <option value="">Select a category</option>
//                 {categories.length > 0 && categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.en}
//                   </option>
//                 ))}
//               </select>
//               {fieldErrors.category_id && (
//                 <p className="text-red-500 text-sm mt-1">{fieldErrors.category_id}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Question (English)<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="en"
//                 value={formData.en}
//                 onChange={handleChange}
//                 className={`w-full border rounded px-3 py-2 ${
//                   fieldErrors.en ? "border-red-500" : ""
//                 }`}
//                 placeholder="Enter question in English"
//                 disabled={loading}
//               />
//               {fieldErrors.en && (
//                 <p className="text-red-500 text-sm mt-1">{fieldErrors.en}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Question (Odia)<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="od"
//                 value={formData.od}
//                 onChange={handleChange}
//                 className={`w-full border rounded px-3 py-2 ${
//                   fieldErrors.od ? "border-red-500" : ""
//                 }`}
//                 placeholder="Enter question in Odia"
//                 disabled={loading}
//               />
//               {fieldErrors.od && (
//                 <p className="text-red-500 text-sm mt-1">{fieldErrors.od}</p>
//               )}
//             </div>

//             <div className="md:col-span-2 flex space-x-3 pt-4">
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
//                 disabled={loading}
//               >
//                 {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Question' : 'Submit Question')}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate("/admin/manage-chatbot/chatbot-question")}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               {!isEditMode && (
//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
//                   disabled={loading}
//                 >
//                   Reset
//                 </button>
//               )}
//             </div>
//           </form>
//         )}
//       </div>

//       {/* ✅ Modal integrated */}
//       <ModalDialog
//         open={modal.open}
//         onClose={() => setModal(prev => ({ ...prev, open: false }))}
//         variant={modal.variant}
//         message={modal.message}
//       />
//     </div>
//   );
// };

// export default AddChatBotQuestion;




import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "../../../services/api";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal"; // ✅ import your modal

const AddChatBotQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    category_id: "",
    en: "",
    od: ""
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [pageTitle, setPageTitle] = useState("Add Chatbot Question");

  // ✅ Modal state
  const [modal, setModal] = useState({
    open: false,
    variant: "info",
    message: ""
  });

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await chatbotCategoryAPI.getAll(1, 1000, '');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError("Failed to load categories for the dropdown.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch question data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setPageTitle("Edit Chatbot Question");
      setLoading(true);
      chatbotQuestionAPI.get(id)
        .then(response => {
          const { category_id, en, od } = response.data.question;
          setFormData({ category_id, en, od });
        })
        .catch(err => {
          console.error("Failed to fetch question:", err);
          setError("Could not load the question data. Please go back and try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

  const validateForm = () => {
    const errors = {};
    const trimmedEn = formData.en.trim();
    const trimmedOd = formData.od.trim();
    
    if (!formData.category_id) {
      errors.category_id = "Please select a category";
    }
    
    if (!trimmedEn) {
      errors.en = "English question is required";
    } else if (trimmedEn.length < 2) {
      errors.en = "English question must be at least 2 characters";
    }
    
    if (!trimmedOd) {
      errors.od = "Odia question is required";
    } else if (trimmedOd.length < 2) {
      errors.od = "Odia question must be at least 2 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkForDuplicates = async () => {
    try {
      const response = await chatbotQuestionAPI.getAll(1, 1000, '');
      const questions = response.data.questions || [];
      
      const englishDuplicate = questions.find(question => 
        question.en.toLowerCase() === formData.en.trim().toLowerCase() && 
        (!isEditMode || question.id !== parseInt(id))
      );
      
      const odiaDuplicate = questions.find(question => 
        question.od === formData.od.trim() && 
        (!isEditMode || question.id !== parseInt(id))
      );
      
      return { englishDuplicate: !!englishDuplicate, odiaDuplicate: !!odiaDuplicate };
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      return { englishDuplicate: false, odiaDuplicate: false };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const duplicates = await checkForDuplicates();
    
    if (duplicates.englishDuplicate && duplicates.odiaDuplicate) {
      setModal({ open: true, variant: "error", message: "A question with both this English and Odia text already exists!" });
      setLoading(false);
      return;
    }
    if (duplicates.englishDuplicate) {
      setModal({ open: true, variant: "error", message: "A question with this English text already exists!" });
      setLoading(false);
      return;
    }
    if (duplicates.odiaDuplicate) {
      setModal({ open: true, variant: "error", message: "A question with this Odia text already exists!" });
      setLoading(false);
      return;
    }
    
    const submitData = {
      category_id: formData.category_id,
      en: formData.en.trim(),
      od: formData.od.trim()
    };

    try {
      if (isEditMode) {
        await chatbotQuestionAPI.update(id, submitData);
        setModal({ open: true, variant: "success", message: "Question updated successfully!" });
      } else {
        await chatbotQuestionAPI.create(submitData);
        setModal({ open: true, variant: "success", message: "Question created successfully!" });
      }

      // ✅ navigate after modal closes
      setTimeout(() => {
        navigate("/admin/manage-chatbot/chatbot-question");
      }, 1500);
    } catch (error) {
      console.error("Error submitting question:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      
      if (errorMessage.toLowerCase().includes("duplicate") || errorMessage.toLowerCase().includes("already exists")) {
        if (errorMessage.toLowerCase().includes("english")) {
          setModal({ open: true, variant: "error", message: "A question with this English text already exists!" });
        } else if (errorMessage.toLowerCase().includes("odia")) {
          setModal({ open: true, variant: "error", message: "A question with this Odia text already exists!" });
        } else {
          setModal({ open: true, variant: "error", message: "A question with this text already exists!" });
        }
      } else {
        setModal({ open: true, variant: "error", message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setFormData({ category_id: "", en: "", od: "" });
    setError("");
    setFieldErrors({});
  };

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <div className="p-6 bg-white shadow rounded-xl container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{pageTitle}</h2>
          <button
            onClick={() => navigate("/admin/manage-chatbot/chatbot-question")}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
          >
            ← Go Back
          </button>
        </div>

        {loading && isEditMode ? (
          <p>Loading question data...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 bg-white ${
                  fieldErrors.category_id ? "border-red-500" : ""
                }`}
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.length > 0 && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.en}
                  </option>
                ))}
              </select>
              {fieldErrors.category_id && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.category_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Question (English)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="en"
                value={formData.en}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  fieldErrors.en ? "border-red-500" : ""
                }`}
                placeholder="Enter question in English"
                disabled={loading}
              />
              {fieldErrors.en && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.en}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Question (Odia)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="od"
                value={formData.od}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  fieldErrors.od ? "border-red-500" : ""
                }`}
                placeholder="Enter question in Odia"
                disabled={loading}
              />
              {fieldErrors.od && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.od}</p>
              )}
            </div>

            <div className="md:col-span-2 flex space-x-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Question' : 'Submit Question')}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/manage-chatbot/chatbot-question")}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                disabled={loading}
              >
                Cancel
              </button>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                  disabled={loading}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* ✅ Modal integrated */}
      <ModalDialog
        open={modal.open}
        onClose={() => setModal(prev => ({ ...prev, open: false }))}
        variant={modal.variant}
        message={modal.message}
      />
    </div>
  );
};

export default AddChatBotQuestion;
