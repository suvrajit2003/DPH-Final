import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider"; // Using the modal for notifications

// Import your reusable components
import Header from "../../../Components/Admin/Add/Header";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField";
import DescriptionFields from "../../../Components/Admin/Add/DescriptionFields";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/act-and-rules`;

const initialState = {
  titleEnglish: "",
  titleOdia: "",
  descriptionEnglish: "",
  descriptionOdia: "",
};

// Helper function to check if rich text is effectively empty
const isRichTextEmpty = (text) => {
    if (!text) return true;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    return tempDiv.textContent.trim().length === 0;
};

// Composite Component for Title Fields (now accepts errors)
const FormFieldsGroup = ({ formData, onInputChange, errors }) => (
  <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    <FormField 
      label="Title (In English)" 
      value={formData.titleEnglish} 
      onChange={(val) => onInputChange("titleEnglish", val)} 
      required 
      error={errors.titleEnglish}
    />
    <FormField 
      label="Title (In Odia)" 
      value={formData.titleOdia} 
      onChange={(val) => onInputChange("titleOdia", val)} 
      required 
      error={errors.titleOdia}
    />
  </div>
);


const ActAndRuleForm = () => {
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
      const fetchActAndRule = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`, {withCredentials:true});
          setFormData(response.data);
        } catch (error) {
          showModal("error", "Failed to load data for editing.");
          console.error("Error fetching data for edit:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchActAndRule();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear the error for the field being edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validation function to check all fields and return an errors object
  const validateForm = () => {
    const newErrors = {};
    if (!formData.titleEnglish.trim()) {
      newErrors.titleEnglish = "English Title is required.";
    }
    if (!formData.titleOdia.trim()) {
      newErrors.titleOdia = "Odia Title is required.";
    }
    if (isRichTextEmpty(formData.descriptionEnglish)) {
      newErrors.descriptionEnglish = "English Description is required.";
    }
    if (isRichTextEmpty(formData.descriptionOdia)) {
      newErrors.descriptionOdia = "Odia Description is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop submission if there are errors
    }
    
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, formData, {withCredentials:true});
        showModal("success", "Act & Rule updated successfully!");
      } else {
        await axios.post(API_URL, formData, {withCredentials:true});
        showModal("success", "Act & Rule created successfully!");
      }
      navigate("/admin/workflow/act-and-rules");
    } catch (error) {
      const action = isEditMode ? "updating" : "creating";
      const errorMessage = error.response?.data?.message || `Failed to ${action} Act & Rule.`;
      showModal("error", errorMessage); 
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setFormData(initialState);
    setErrors({}); // Clear all errors on reset
  };

  const handleGoBack = () => {
    navigate("/admin/workflow/act-and-rules");
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading form data...</div>;
  }

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
    >
      <Header title={isEditMode ? "Edit Act & Rule" : "Add Act & Rule"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <FormFieldsGroup 
            formData={formData} 
            onInputChange={handleInputChange} 
            errors={errors} 
          />
          <DescriptionFields 
            formData={formData} 
            onInputChange={handleInputChange} 
            errors={errors} 
          />
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

export default ActAndRuleForm;