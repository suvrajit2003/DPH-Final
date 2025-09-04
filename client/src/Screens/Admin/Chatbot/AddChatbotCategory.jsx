
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "../../../services/api";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal";

const AddChatbotCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    en: "",
    od: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [modal, setModal] = useState({ open: false, message: "", type: "info" });

  // Fetch category data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      chatbotCategoryAPI.get(id)
        .then(response => {
          const { en, od } = response.data.category;
          setFormData({ en, od });
        })
        .catch(err => {
          console.error("Failed to fetch category:", err);
          setModal({ 
            open: true, 
            message: "Could not load category data. Please try again.", 
            type: "error" 
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.en.trim()) {
      errors.en = "English category name is required";
    } else if (formData.en.trim().length < 2) {
      errors.en = "English category name must be at least 2 characters";
    }
    
    if (!formData.od.trim()) {
      errors.od = "Odia category name is required";
    } else if (formData.od.trim().length < 2) {
      errors.od = "Odia category name must be at least 2 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkForDuplicates = async () => {
    try {
      const response = await chatbotCategoryAPI.getAll(1, 1000, ""); 
      const categories = response.data.categories || [];

      const enValue = formData.en.trim().toLowerCase();
      const odValue = formData.od.trim();

      const englishDuplicate = categories.find(
        (cat) =>
          cat.en && cat.en.trim().toLowerCase() === enValue &&
          (!isEditMode || cat.id !== parseInt(id))
      );

      const odiaDuplicate = categories.find(
        (cat) =>
          cat.od && cat.od.trim() === odValue &&
          (!isEditMode || cat.id !== parseInt(id))
      );

      return {
        englishDuplicate: !!englishDuplicate,
        odiaDuplicate: !!odiaDuplicate
      };
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      return { englishDuplicate: false, odiaDuplicate: false };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // Check for duplicates
      const duplicates = await checkForDuplicates();
      
      if (duplicates.englishDuplicate && duplicates.odiaDuplicate) {
        setModal({ open: true, message: "A category with both this English and Odia name already exists!", type: "error" });
        return;
      }
      
      if (duplicates.englishDuplicate) {
        setModal({ open: true, message: "A category with this English name already exists!", type: "error" });
        return;
      }
      
      if (duplicates.odiaDuplicate) {
        setModal({ open: true, message: "A category with this Odia name already exists!", type: "error" });
        return;
      }
      
      // Submit the form
      if (isEditMode) {
        await chatbotCategoryAPI.update(id, formData);
        setModal({ open: true, message: "Category updated successfully!", type: "success" });
      } else {
        await chatbotCategoryAPI.create(formData);
        setModal({ open: true, message: "Category created successfully!", type: "success" });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
      
      // Handle specific backend errors
      if (errorMessage.includes("SQL syntax") && errorMessage.includes("ILIKE")) {
        setModal({ 
          open: true, 
          message: "Database error. Please contact support.", 
          type: "error" 
        });
      } else if (errorMessage.toLowerCase().includes("duplicate") || errorMessage.toLowerCase().includes("already exists")) {
        if (errorMessage.toLowerCase().includes("english")) {
          setModal({ open: true, message: "A category with this English name already exists!", type: "error" });
        } else if (errorMessage.toLowerCase().includes("odia")) {
          setModal({ open: true, message: "A category with this Odia name already exists!", type: "error" });
        } else {
          setModal({ open: true, message: "A category with this name already exists!", type: "error" });
        }
      } else {
        setModal({ open: true, message: errorMessage, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ en: "", od: "" });
    setError("");
    setFieldErrors({});
  };

  const handleModalClose = () => {
    setModal({ ...modal, open: false });
    if (modal.type === "success") {
      navigate("/admin/manage-chatbot/chatbot-category");
    }
  };

  return (
    <div className="min-h-[80vh] py-6 font-sans">
      <div className="p-6 bg-white shadow rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Chatbot Category" : "Add Chatbot Category"}
          </h2>
          <button
            onClick={() => navigate("/admin/manage-chatbot/chatbot-category")}
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
          <p>Loading category data...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category (in English)<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="en"
                  value={formData.en}
                  onChange={handleChange}
                  placeholder="Category (in English)"
                  className={`w-full border rounded px-3 py-2 ${
                    fieldErrors.en ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                {fieldErrors.en && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.en}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category (in Odia)<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="od"
                  value={formData.od}
                  onChange={handleChange}
                  placeholder="Category (in Odia)"
                  className={`w-full border rounded px-3 py-2 ${
                    fieldErrors.od ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                {fieldErrors.od && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.od}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Submit')}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/manage-chatbot/chatbot-category")}
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

      {/* ✅ ModalDialog Integration */}
      <ModalDialog
        open={modal.open}
        onClose={handleModalClose}
        variant={modal.type}
        message={modal.message}
      />
    </div>
  );
};

export default AddChatbotCategory;