import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider";


// Import your reusable components
import Header from "../../../Components/Admin/Add/Header";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/news-and-events`;

const initialState = {
  titleEnglish: "",
  titleOdia: "",
  eventDate: "",
  document: null,
};

const NewsAndEventForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [existingDocumentName, setExistingDocumentName] = useState('');
  const [isFileMarkedForDeletion, setIsFileMarkedForDeletion] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
          const { titleEnglish, titleOdia, eventDate, document } = response.data;
          setFormData({ titleEnglish, titleOdia, eventDate, document: null });
          setExistingDocumentName(document); // <-- Store only the filename
        } catch (error) {
          showModal("error", error.response?.data?.message || "Failed to load event data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // Updated handler for the new DocumentUploader
  const handleFileChange = (file, error) => {
    if (error) {
      setErrors(prev => ({ ...prev, document: error }));
      setFormData(prev => ({ ...prev, document: null }));
    } else {
      setFormData(prev => ({ ...prev, document: file }));
      if (errors.document) setErrors(prev => ({ ...prev, document: null }));
      setIsFileMarkedForDeletion(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titleEnglish.trim()) newErrors.titleEnglish = "English Title is required.";
    if (!formData.titleOdia.trim()) newErrors.titleOdia = "Odia Title is required.";
    if (!formData.eventDate) newErrors.eventDate = "Event Date is required.";
    if (!isEditMode && !formData.document) newErrors.document = "A document or image file is required.";
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
    submissionData.append("titleEnglish", formData.titleEnglish);
    submissionData.append("titleOdia", formData.titleOdia);
    submissionData.append("eventDate", formData.eventDate);

    if (formData.document) {
      submissionData.append("document", formData.document);
    }
    
    // --- THIS IS THE KEY CHANGE ---
    if (isEditMode) {
      submissionData.append("removeExistingDocument", isFileMarkedForDeletion);
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, submissionData, config);
        showModal("success", "News & Event updated successfully!");
      } else {
        await axios.post(API_URL, submissionData, config);
        showModal("success", "News & Event created successfully!");
      }
      navigate("/admin/workflow/news-and-events");
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} event.`;
      showModal("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRemoveFile = () => {
    if (window.confirm("The current document will be removed when you click 'Submit'. Are you sure?")) {
      setExistingDocumentName('');
      setIsFileMarkedForDeletion(true);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
    setIsFileMarkedForDeletion(false); // Also reset this flag
  };

  if(isLoading) return <div className="flex justify-center items-center h-96" >Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6" >
      <Header title={isEditMode ? "Edit News & Event" : "Add News & Event"} onGoBack={() => navigate("/admin/workflow/news-and-events")} />
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField label="Event Title (In English)" value={formData.titleEnglish} onChange={(val) => handleInputChange("titleEnglish", val)} required error={errors.titleEnglish}/>
            <FormField label="Event Title (In Odia)" value={formData.titleOdia} onChange={(val) => handleInputChange("titleOdia", val)} required error={errors.titleOdia}/>
            <FormField label="Event Date" type="date" value={formData.eventDate} onChange={(val) => handleInputChange("eventDate", val)} required error={errors.eventDate}/>
            
            <DocumentUploader
              label="Upload Document"
              file={formData.document}
              onFileChange={handleFileChange}
              error={errors.document}
              allowedTypes={[
                  "application/pdf", 
                  "application/msword",
                  "application/msexcel"
              ]}
              maxSizeMB={1}
              existingFileName={existingDocumentName}
              existingFileUrl={`${import.meta.env.VITE_API_BASE_URL}/uploads/events/${existingDocumentName}`}
              onRemove={isEditMode ? handleRemoveFile : null}
            />
        </div>
        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/workflow/news-and-events")}
          isSubmitting={isSubmitting}
          onReset={!isEditMode ? handleReset : null}
        />
      </form>
    </div>
  );
};

export default NewsAndEventForm;