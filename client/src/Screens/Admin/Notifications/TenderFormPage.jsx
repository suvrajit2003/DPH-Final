import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "@/context/ModalProvider";
import Header from "@/Components/Admin/Add/Header";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from '@/Components/Admin/TextEditor/FormField';
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";


const TenderFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [formData, setFormData] = useState({
    en_title: "",
    od_title: "",
    date: "",
    expiry_date: "",
  });
  const [files, setFiles] = useState({ nit_doc: null, doc: null });
  const [existingFileNames, setExistingFileNames] = useState({
    nit_doc: "",
    doc: "",
  });
    const [filesToRemove, setFilesToRemove] = useState({
    nit_doc: false,
    doc: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchTenderData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/tenders/${id}`,
            { withCredentials: true }
          );
          const { en_title, od_title, date, expiry_date, nit_doc, doc } =
            response.data;
          const initial = { en_title, od_title, date: date || "", expiry_date };
          setFormData({
            en_title,
            od_title,
            date: date || "",
            expiry_date: expiry_date || "",
          });
          setInitialData(initial);
          setExistingFileNames({ nit_doc, doc });
        } catch (error) {
          showModal("error", error.response?.data?.message || error.message);
          navigate("/admin/notifictions/tenders");
        }
      };
      fetchTenderData();
    }
  }, [id, isEditMode, navigate, showModal]);

const handleChange = (name, value) => {
  setFormData((prev) => ({ ...prev, [name]: value }));
};


const handleFileChange = (fieldName, file, errorMessage) => {
  if (errorMessage) {
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    return;
  }

  setErrors((prev) => ({ ...prev, [fieldName]: null }));
  setFiles((prev) => ({ ...prev, [fieldName]: file }));

     setFilesToRemove(prev => ({ ...prev, [fieldName]: false }));
};

  const handleRemoveFile = useCallback((fieldName) => {
    setExistingFileNames(prev => ({ ...prev, [fieldName]: '' }));
    setFilesToRemove(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.en_title.trim())
      newErrors.en_title = "English title is required.";
    if (!formData.od_title.trim())
      newErrors.od_title = "Odia title is required.";
    if (!formData.date) newErrors.date = "Tender date is required.";
    if (!formData.expiry_date)
      newErrors.expiry_date = "Expiry date is required.";
    if (!isEditMode && !files.nit_doc) {
      newErrors.nit_doc = "NIT document is required.";
    }
    if (!isEditMode && !files.doc) {
      newErrors.doc = "Tender document is required.";
    }
    //   if (!isEditMode && !files.nit_doc) {
    //   newErrors.nit_doc = "NIT document is required.";
    // } else if (isEditMode && !existingFileNames.nit_doc && !files.nit_doc) {
    //   newErrors.nit_doc = "NIT document is required.";
    // }

    // if (!isEditMode && !files.doc) {
    //   newErrors.doc = "Tender document is required.";
    // } else if (isEditMode && !existingFileNames.doc && !files.doc) {
    //   newErrors.doc = "Tender document is required.";
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) =>
      submissionData.append(key, formData[key])
    );
    if (files.nit_doc) submissionData.append("nit_doc", files.nit_doc);
    if (files.doc) submissionData.append("doc", files.doc);

    if (filesToRemove.nit_doc) {
        submissionData.append("remove_nit_doc", "true");
    }
    if (filesToRemove.doc) {
        submissionData.append("remove_doc", "true");
    }

    try {
      if (isEditMode) {
        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/tenders/${id}`,
          submissionData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        showModal("success", "Tender updated successfully!");
      } else {
        // --- ADD LOGIC ---
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/tenders`,
          submissionData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        showModal("success", "Tender added successfully!");
      }
      navigate("/admin/notifications/tenders");
    } catch (error) {
      showModal(
        "error",
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} tender.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReset = () => {
    if (isEditMode && initialData) {
      setFormData(initialData);
       setFilesToRemove({ nit_doc: false, doc: false });
    } else {
      setFormData({ en_title: "", od_title: "", date: "", expiry_date: "" });
      setFiles({ nit_doc: null, doc: null });
      setErrors({});
      document.getElementById("nit_doc").value = null;
      document.getElementById("doc").value = null;
    }
  };



  return (
    <div className="p-6 min-h-[80vh]">
      <Header
        title={isEditMode ? "Edit Tender" : "Add New Tender"}
        onGoBack={() => navigate("/admin/notifications/tenders")}
      />

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Title (English)"
              name="en_title"
              value={formData.en_title}
                onChange={(value) => handleChange("en_title", value)}

              error={errors.en_title}
            />
            <FormField
              label="Title (Odia)"
              name="od_title"
              value={formData.od_title}
               onChange={(value) => handleChange("od_title", value)}
              error={errors.od_title}
            />
            <FormField
              label="Tender Date"
              name="date"
              type="date"
              value={formData.date}
                onChange={(value) => handleChange("date", value)}

              error={errors.date}
            />
            <FormField
              label="Expiry Date"
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
                onChange={(value) => handleChange("expiry_date", value)}


              error={errors.expiry_date}
            />
    

            <DocumentUploader
  label="NIT Document"
  file={files.nit_doc}
   allowedTypes={["application/pdf"]}
   maxSizeMB={1}
  existingFileName={existingFileNames.nit_doc}
  existingFileUrl={
    existingFileNames.nit_doc
      ? `${import.meta.env.VITE_API_BASE_URL}/uploads/tenders/${existingFileNames.nit_doc}`
      : null
  }
  onFileChange={(file, error) => handleFileChange("nit_doc", file, error)}

  error={errors.nit_doc}
      onRemove={() => handleRemoveFile("nit_doc")}
/>


<DocumentUploader
  label="Tender Document"
  file={files.doc}
  allowedTypes={["application/pdf"]}
   maxSizeMB={1}
  existingFileName={existingFileNames.doc}
  existingFileUrl={
    existingFileNames.doc
      ? `${import.meta.env.VITE_API_BASE_URL}/uploads/tenders/${existingFileNames.doc}`
      : null
  }
  onFileChange={(file, error) => handleFileChange("doc", file, error)}

  error={errors.doc}
       onRemove={() => handleRemoveFile("doc")}
/>
          </div>

          <FormActions
            onSubmit={handleSubmit}
            onReset={handleReset}
            onCancel={() => navigate("/admin/notifications/tenders")}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default TenderFormPage;
