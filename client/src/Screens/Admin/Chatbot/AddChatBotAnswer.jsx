// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { chatbotCategoryAPI } from "../../../services/api";
// import chatbotAnswerAPI from "../../../services/chatbotAnswerAPI";
// import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";
// import { ModalDialog } from "../../../Components/Modal/MessageModal"; 

// const AddChatbotAnswer = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = Boolean(id);

//   const [formData, setFormData] = useState({
//     category_id: "",
//     question_id: "",
//     en: "",
//     od: "",
//     status: "Active",
//   });
//   const [categories, setCategories] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});

//   // ✅ Modal state
//   const [modal, setModal] = useState({ open: false, variant: "info", message: "" });

//   // Fetch all categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await chatbotCategoryAPI.getAll(1, 1000, "");
//         setCategories(response.data.categories || []);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setError("Failed to load categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch questions when category changes
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       if (formData.category_id) {
//         setLoading(true);
//         try {
//           const response = await chatbotQuestionAPI.getByCategory(formData.category_id);
//           setQuestions(response.data.questions || []);
//         } catch (error) {
//           console.error("Error fetching questions:", error);
//           setError("Failed to load questions for the selected category");
//           setQuestions([]);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setQuestions([]);
//       }
//     };
//     fetchQuestions();
//   }, [formData.category_id]);

//   // If edit mode, fetch existing answer
//   useEffect(() => {
//     if (isEditMode) {
//       const fetchAnswerData = async () => {
//         setLoading(true);
//         try {
//           const response = await chatbotAnswerAPI.get(id);
//           const answer = response.data.answer;

//           setFormData({
//             category_id: answer.category_id || "",
//             question_id: answer.question_id || "",
//             en: answer.en || "",
//             od: answer.od || "",
//             status: answer.status || "Active",
//           });
//         } catch (err) {
//           console.error("Error fetching answer:", err);
//           setError("Failed to load answer data: " + (err.response?.data?.message || err.message));
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchAnswerData();
//     }
//   }, [id, isEditMode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "category_id" && { question_id: "" }),
//     }));

//     if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
//     if (error) setError("");
//   };

//   // Validation
//   const validateForm = () => {
//     const errors = {};
//     const trimmedEn = formData.en.trim();
//     const trimmedOd = formData.od.trim();

//     if (!formData.category_id) errors.category_id = "Please select a category";
//     if (!formData.question_id) errors.question_id = "Please select a question";
//     if (!trimmedEn) errors.en = "English answer is required";
//     else if (trimmedEn.length < 3) errors.en = "English answer must be at least 3 characters";
//     if (!trimmedOd) errors.od = "Odia answer is required";
//     else if (trimmedOd.length < 3) errors.od = "Odia answer must be at least 2 characters";

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const checkForDuplicates = async () => {
//     try {
//       const response = await chatbotAnswerAPI.getAll(1, 1000, "");
//       const answers = response.data.answers || [];
//       const duplicateAnswer = answers.find(
//         (answer) =>
//           answer.question_id === parseInt(formData.question_id) &&
//           (!isEditMode || answer.id !== parseInt(id))
//       );
//       return !!duplicateAnswer;
//     } catch (error) {
//       console.error("Error checking for duplicates:", error);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);
//     const hasDuplicate = await checkForDuplicates();

//     if (hasDuplicate) {
//       setModal({ open: true, variant: "warning", message: "An answer already exists for this question!" });
//       setLoading(false);
//       return;
//     }

//     const submitData = {
//       category_id: formData.category_id,
//       question_id: formData.question_id,
//       en: formData.en.trim(),
//       od: formData.od.trim(),
//       status: formData.status,
//     };

//     try {
//       if (isEditMode) {
//         await chatbotAnswerAPI.update(id, submitData);
//         setModal({ open: true, variant: "success", message: "Answer updated successfully!" });
//       } else {
//         await chatbotAnswerAPI.create(submitData);
//         setModal({ open: true, variant: "success", message: "Answer created successfully!" });
//       }
//     } catch (error) {
//       console.error("Error submitting answer:", error);
//       const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
//       setModal({ open: true, variant: "error", message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       category_id: "",
//       question_id: "",
//       en: "",
//       od: "",
//       status: "Active",
//     });
//     setError("");
//     setFieldErrors({});
//   };

//   return (
//     <div className="min-h-[80vh] py-6 font-sans">
//       <div className="p-6 bg-white shadow rounded-xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">
//             {isEditMode ? "Edit Chatbot Answer" : "Add Chatbot Answer"}
//           </h2>
//           <button
//             onClick={() => navigate("/admin/manage-chatbot/chatbot-answer")}
//             className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
//           >
//             ← Go Back
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         {loading && isEditMode ? (
//           <p>Loading answer data...</p>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Category + Question */}
//             <div className="grid grid-cols-2 gap-6">
//               {/* Category */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Select Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="category_id"
//                   value={formData.category_id}
//                   onChange={handleChange}
//                   className={`w-full border rounded px-3 py-2 ${fieldErrors.category_id ? "border-red-500" : ""}`}
//                   disabled={loading}
//                 >
//                   <option value="">-- Select Category --</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>{cat.en}</option>
//                   ))}
//                 </select>
//                 {fieldErrors.category_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.category_id}</p>}
//               </div>

//               {/* Question */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Select Question <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="question_id"
//                   value={formData.question_id}
//                   onChange={handleChange}
//                   className={`w-full border rounded px-3 py-2 ${fieldErrors.question_id ? "border-red-500" : ""}`}
//                   disabled={loading || !formData.category_id || questions.length === 0}
//                 >
//                   <option value="">-- Select Question --</option>
//                   {questions.map((q) => (
//                     <option key={q.id} value={q.id}>{q.en}</option>
//                   ))}
//                 </select>
//                 {fieldErrors.question_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.question_id}</p>}
//               </div>
//             </div>

//             {/* Answer Fields */}
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Answer (English) <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="en"
//                   value={formData.en}
//                   onChange={handleChange}
//                   className={`w-full border rounded px-3 py-2 h-40 ${fieldErrors.en ? "border-red-500" : ""}`}
//                   disabled={loading}
//                 />
//                 {fieldErrors.en && <p className="text-red-500 text-sm mt-1">{fieldErrors.en}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Answer (Odia) <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="od"
//                   value={formData.od}
//                   onChange={handleChange}
//                   className={`w-full border rounded px-3 py-2 h-40 font-odia ${fieldErrors.od ? "border-red-500" : ""}`}
//                   disabled={loading}
//                 />
//                 {fieldErrors.od && <p className="text-red-500 text-sm mt-1">{fieldErrors.od}</p>}
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div className="flex space-x-3">
//               <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50" disabled={loading}>
//                 {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update" : "Submit"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate("/admin/manage-chatbot/chatbot-answer")}
//                 className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               {!isEditMode && (
//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
//                   disabled={loading}
//                 >
//                   Reset
//                 </button>
//               )}
//             </div>
//           </form>
//         )}
//       </div>

//       {/* ✅ ModalDialog added */}
//       <ModalDialog
//         open={modal.open}
//         onClose={() => {
//           setModal({ ...modal, open: false });
//           if (modal.variant === "success") {
//             navigate("/admin/manage-chatbot/chatbot-answer");
//           }
//         }}
//         variant={modal.variant}
//         message={modal.message}
//       />
//     </div>
//   );
// };

// export default AddChatbotAnswer;




import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "../../../services/api";
import chatbotAnswerAPI from "../../../services/chatbotAnswerAPI";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal"; 

const AddChatbotAnswer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    category_id: "",
    question_id: "",
    en: "",
    od: "",
    status: "Active",
  });
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // ✅ Modal state
  const [modal, setModal] = useState({ open: false, variant: "info", message: "" });

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await chatbotCategoryAPI.getAll(1, 1000, "");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch questions when category changes
  useEffect(() => {
    const fetchQuestions = async () => {
      if (formData.category_id) {
        setLoading(true);
        try {
          const response = await chatbotQuestionAPI.getByCategory(formData.category_id);
          setQuestions(response.data.questions || []);
        } catch (error) {
          console.error("Error fetching questions:", error);
          setError("Failed to load questions for the selected category");
          setQuestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [formData.category_id]);

  // If edit mode, fetch existing answer
  useEffect(() => {
    if (isEditMode) {
      const fetchAnswerData = async () => {
        setLoading(true);
        try {
          const response = await chatbotAnswerAPI.get(id);
          const answer = response.data.answer;

          setFormData({
            category_id: answer.category_id || "",
            question_id: answer.question_id || "",
            en: answer.en || "",
            od: answer.od || "",
            status: answer.status || "Active",
          });
        } catch (err) {
          console.error("Error fetching answer:", err);
          setError("Failed to load answer data: " + (err.response?.data?.message || err.message));
        } finally {
          setLoading(false);
        }
      };
      fetchAnswerData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category_id" && { question_id: "" }),
    }));

    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    const trimmedEn = formData.en.trim();
    const trimmedOd = formData.od.trim();

    if (!formData.category_id) errors.category_id = "Please select a category";
    if (!formData.question_id) errors.question_id = "Please select a question";
    if (!trimmedEn) errors.en = "English answer is required";
    else if (trimmedEn.length < 3) errors.en = "English answer must be at least 3 characters";
    if (!trimmedOd) errors.od = "Odia answer is required";
    else if (trimmedOd.length < 3) errors.od = "Odia answer must be at least 2 characters";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkForDuplicates = async () => {
    try {
      const response = await chatbotAnswerAPI.getAll(1, 1000, "");
      const answers = response.data.answers || [];
      const duplicateAnswer = answers.find(
        (answer) =>
          answer.question_id === parseInt(formData.question_id) &&
          (!isEditMode || answer.id !== parseInt(id))
      );
      return !!duplicateAnswer;
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const hasDuplicate = await checkForDuplicates();

    if (hasDuplicate) {
      setModal({ open: true, variant: "warning", message: "An answer already exists for this question!" });
      setLoading(false);
      return;
    }

    const submitData = {
      category_id: formData.category_id,
      question_id: formData.question_id,
      en: formData.en.trim(),
      od: formData.od.trim(),
      status: formData.status,
    };

    try {
      if (isEditMode) {
        await chatbotAnswerAPI.update(id, submitData);
        setModal({ open: true, variant: "success", message: "Answer updated successfully!" });
      } else {
        await chatbotAnswerAPI.create(submitData);
        setModal({ open: true, variant: "success", message: "Answer created successfully!" });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      setModal({ open: true, variant: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      category_id: "",
      question_id: "",
      en: "",
      od: "",
      status: "Active",
    });
    setError("");
    setFieldErrors({});
  };

  return (
    <div className="min-h-[80vh] py-6 font-sans">
      <div className="p-6 bg-white shadow rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Chatbot Answer" : "Add Chatbot Answer"}
          </h2>
          <button
            onClick={() => navigate("/admin/manage-chatbot/chatbot-answer")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
          >
            ← Go Back
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && isEditMode ? (
          <p>Loading answer data...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category + Question */}
            <div className="grid grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${fieldErrors.category_id ? "border-red-500" : ""}`}
                  disabled={loading}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.en}</option>
                  ))}
                </select>
                {fieldErrors.category_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.category_id}</p>}
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Question <span className="text-red-500">*</span>
                </label>
                <select
                  name="question_id"
                  value={formData.question_id}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${fieldErrors.question_id ? "border-red-500" : ""}`}
                  disabled={loading || !formData.category_id || questions.length === 0}
                >
                  <option value="">-- Select Question --</option>
                  {questions.map((q) => (
                    <option key={q.id} value={q.id}>{q.en}</option>
                  ))}
                </select>
                {fieldErrors.question_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.question_id}</p>}
              </div>
            </div>

            {/* Answer Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Answer (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="en"
                  value={formData.en}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 h-40 ${fieldErrors.en ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {fieldErrors.en && <p className="text-red-500 text-sm mt-1">{fieldErrors.en}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Answer (Odia) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="od"
                  value={formData.od}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 h-40 font-odia ${fieldErrors.od ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {fieldErrors.od && <p className="text-red-500 text-sm mt-1">{fieldErrors.od}</p>}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50" disabled={loading}>
                {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/manage-chatbot/chatbot-answer")}
                className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
                  disabled={loading}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* ✅ ModalDialog added */}
      <ModalDialog
        open={modal.open}
        onClose={() => {
          setModal({ ...modal, open: false });
          if (modal.variant === "success") {
            navigate("/admin/manage-chatbot/chatbot-answer");
          }
        }}
        variant={modal.variant}
        message={modal.message}
      />
    </div>
  );
};

export default AddChatbotAnswer;
