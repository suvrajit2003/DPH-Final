import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "@/context/ModalProvider";

// Import your reusable components
import Header from "@/Components/Admin/Add/Header";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/bed-strengths`;

const initialState = {
  en_title: "",
  od_title: "",
  document: null,
};

const BedStrengthForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [existingDocument, setExistingDocument] = useState(''); 
    const [isFileMarkedForDeletion, setIsFileMarkedForDeletion] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`,{withCredentials:true});
          const { en_title, od_title, document } = response.data;
          setFormData({ en_title, od_title, document: null });
          setExistingDocument(document);
        } catch (error) {
          showModal("error", error.response?.data?.message || "Failed to load record for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (file, error) => {
    if (error) {
      setErrors(prev => ({ ...prev, document: error }));
      setFormData(prev => ({ ...prev, document: null }));
    } else {
      setFormData(prev => ({ ...prev, document: file }));
      if (errors.document) setErrors(prev => ({ ...prev, document: null }));
      if (isFileMarkedForDeletion) setIsFileMarkedForDeletion(false);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.en_title.trim()) {
      newErrors.en_title = "English Title is required.";
    }
    if (!formData.od_title.trim()) {
      newErrors.od_title = "Odia Title is required.";
    }
    if (!isEditMode && !formData.document) {
      newErrors.document = "A document file is required.";
    }
    return newErrors;
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    const submissionData = new FormData();
    submissionData.append("en_title", formData.en_title);
    submissionData.append("od_title", formData.od_title);

    // --- THIS IS THE CORRECTED LOGIC ---

    // 1. Append the new file if it exists.
    if (formData.document) {
      submissionData.append("document", formData.document);
    }
    
    // 2. In edit mode, always send the flag indicating if the user
    //    clicked the "Remove" button.
    if (isEditMode) {
        submissionData.append("removeExistingDocument", isFileMarkedForDeletion);
    }
    // The `oldFilePath` is no longer needed because the new backend logic
    // gets the old filename directly from the database record.

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, submissionData, config);
        showModal("success", "Record updated successfully!");
      } else {
        await axios.post(API_URL, submissionData, config);
        showModal("success", "Record created successfully!");
      }
      navigate("/admin/notifications/bed-strength");
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} record.`;
      showModal("error", errorMessage); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
    setIsFileMarkedForDeletion(false); // Also reset this flag
  };

  const handleGoBack = () => {
    navigate("/admin/notifications/bed-strength");
  };
   const handleRemoveFile = () => {
    if (window.confirm("The current document will be removed when you click 'Submit'. Are you sure?")) {
      setExistingDocument(''); // <-- CORRECTED
      setIsFileMarkedForDeletion(true);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div>
      <Header title={isEditMode ? "Edit Bed Strength" : "Add Bed Strength"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField 
              label="Title (In English)" 
              value={formData.en_title} 
              onChange={(val) => handleInputChange("en_title", val)} 
              required
              error={errors.en_title}
            />
            <FormField 
              label="Title (In Odia)" 
              value={formData.od_title} 
              onChange={(val) => handleInputChange("od_title", val)} 
              required
              error={errors.od_title}
            />
            <div>
                <DocumentUploader 
                  label="Upload Form Document"
                  file={formData.document}
                  onFileChange={handleFileChange}
                  error={errors.document}
                  
                  // Add Configuration
                  allowedTypes={["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
                  maxSizeMB={5}
                  
                  // Add props for handling existing files
                  existingFileName={existingDocument}
                  existingFileUrl={`${import.meta.env.VITE_API_BASE_URL}/uploads/forms/${existingDocument}`}
                  onRemove={isEditMode ? handleRemoveFile : null}
                />
                {isEditMode && !formData.document && existingDocument && (
                    <div className="mt-2 text-sm text-gray-600">
                        Current file: <a href={`${import.meta.env.VITE_API_BASE_URL}${existingDocument}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{existingDocument.split('/').pop()}</a>
                    </div>
                )}
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

export default BedStrengthForm;