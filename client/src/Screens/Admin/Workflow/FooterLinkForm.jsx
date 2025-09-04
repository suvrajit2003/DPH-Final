import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider";

// Import your reusable components
import Header from "../../../Components/Admin/Add/Header";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/footerlinks`;

const initialState = {
  englishLinkText: "",
  odiaLinkText: "",
  url: "",
  linkType: "Internal",
};

const FooterlinkForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchLink = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`, {
            withCredentials: true,
          });
          setFormData(response.data);
        } catch (error) {
          showModal("error", "Failed to load link data for editing.");
          console.error("Error fetching link data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLink();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validation function to check all fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.englishLinkText.trim()) {
      newErrors.englishLinkText = "English Link Text is required.";
    }
    if (!formData.odiaLinkText.trim()) {
      newErrors.odiaLinkText = "Odia Link Text is required.";
    }
    if (!formData.url.trim()) {
      newErrors.url = "URL is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop submission
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, formData, {
            withCredentials: true,
          });
        showModal("success", "Footer Link updated successfully!");
      } else {
        await axios.post(API_URL, formData, {withCredentials:true});
        showModal("success", "Footer Link created successfully!");
      }
      navigate("/admin/workflow/footerlink");
    } catch (error) {
      const action = isEditMode ? "updating" : "creating";
      const errorMessage = error.response?.data?.message || `Failed to ${action} Act & Rule.`;
      showModal("error", errorMessage); 
      console.error(`Error ${action} Footer Link:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
  };

  const handleGoBack = () => {
    navigate("/admin/workflow/footerlink");
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
    >
      <Header title={isEditMode ? "Edit Footer Link" : "Add Footer Link"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField 
            label="Link Text (In English)" 
            value={formData.englishLinkText} 
            onChange={(val) => handleInputChange("englishLinkText", val)} 
            required 
            error={errors.englishLinkText}
          />
          <FormField 
            label="Link Text (In Odia)" 
            value={formData.odiaLinkText} 
            onChange={(val) => handleInputChange("odiaLinkText", val)} 
            required 
            error={errors.odiaLinkText}
          />
          <FormField 
            label="URL" 
            type="url"
            value={formData.url} 
            onChange={(val) => handleInputChange("url", val)} 
            required 
            error={errors.url}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Type *</label>
            <select 
              value={formData.linkType} 
              onChange={(e) => handleInputChange("linkType", e.target.value)} 
              className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Internal">Internal</option>
              <option value="External">External</option>
            </select>
          </div>
        </div>

        <FormActions
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
          isSubmitting={isSubmitting}
          onReset={!isEditMode ? handleReset : null}
        />
      </form>
    </div>
  );
};

export default FooterlinkForm;