import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useModal } from '../../../context/ModalProvider';
import FormActions from '../../../Components/Admin/Add/FormActions';
import FormField from '../../../Components/Admin/TextEditor/FormField';
import DocumentUploader from '@/Components/Admin/TextEditor/DocumentUploader';



const CorrigendumForm = ({ tenderId, editingCorrigendum, onSuccess, onCancel }) => {
    const isEditMode = !!editingCorrigendum;
    const { showModal } = useModal();

    const initialFormData = {
        en_title: '',
        od_title: '',
        date: '',
        remarks: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [file, setFile] = useState(null);
    const [existingFileName, setExistingFileName] = useState('');
       const [isFileRemoved, setIsFileRemoved] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode && editingCorrigendum) {
            setFormData({
                en_title: editingCorrigendum.en_title || '',
                od_title: editingCorrigendum.od_title || '',
                date: editingCorrigendum.date || '',
                remarks: editingCorrigendum.remarks || '',
            });
            setExistingFileName(editingCorrigendum.cor_document || '');
        } else {
            setFormData(initialFormData);
            setExistingFileName('');
        }
        setFile(null);
        setErrors({});
        setIsFileRemoved(false);
        // Clear the file input visually
        const fileInput = document.getElementById('cor_document');
        if (fileInput) fileInput.value = null;
    }, [editingCorrigendum, isEditMode]);

const handleChange = (name, value) => {
  setFormData(prev => ({ ...prev, [name]: value }));
};


 const handleFileChange = (selectedFile, errorMessage) => {
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, cor_document: errorMessage }));
      setFile(null);
      return;
    }
    setErrors((prev) => ({ ...prev, cor_document: null }));
   setFile(selectedFile);
        setIsFileRemoved(false);
  };


    const handleRemoveFile = useCallback(() => {
        setExistingFileName('');
        setFile(null);
        setIsFileRemoved(true);
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.en_title.trim()) newErrors.en_title = "English title is required.";
        if (!formData.od_title.trim()) newErrors.od_title = "Odia title is required.";
        if (!formData.date) newErrors.date = "Date is required.";
        if (!isEditMode && !file) newErrors.cor_document = "Corrigendum document is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));

       if (file) {
            submissionData.append('cor_document', file);
        } else if (isFileRemoved) {
            submissionData.append('remove_cor_document', 'true');
        }

        const url = isEditMode
            ? `${import.meta.env.VITE_API_BASE_URL}/corrigendums/corrigendums/${editingCorrigendum.id}`
            : `${import.meta.env.VITE_API_BASE_URL}/corrigendums/tenders/${tenderId}/corrigendums`;
        const method = isEditMode ? 'patch' : 'post';

        try {
            await axios[method](url, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            showModal("success", `Corrigendum ${isEditMode ? 'updated' : 'added'} successfully!`);
            onSuccess(); 
        } catch (error) {
            showModal("error", error.response?.data?.message || "Operation failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        if (isEditMode) {
            setFormData({
                en_title: editingCorrigendum.en_title || '',
                od_title: editingCorrigendum.od_title || '',
                date: editingCorrigendum.date || '',
                remarks: editingCorrigendum.remarks || '',
            });
               setExistingFileName(editingCorrigendum.cor_document || '');
        } else {
            setFormData(initialFormData);
        }
        setFile(null);
        setErrors({});
          setIsFileRemoved(false);
        const fileInput = document.getElementById('cor_document');
        if (fileInput) fileInput.value = null;
    };

     
    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b">
                {isEditMode ? 'Edit Corrigendum' : 'Add New Corrigendum'}
            </h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Title (English)" placeholder="English title here" name="en_title" value={formData.en_title} onChange={(value)=> handleChange("en_title", value)} error={errors.en_title} />
                    <FormField label="Title (Odia)" placeholder="Odia title here" name="od_title" value={formData.od_title}  onChange={(value)=> handleChange("od_title", value)} error={errors.od_title} />
                    <FormField label="Date" name="date" type="date" value={formData.date}  onChange={(value)=> handleChange("date", value)} error={errors.date} />
                    <FormField label="Remarks" placeholder="Remarks here" name="remarks" type="text" value={formData.remarks}  onChange={(value)=> handleChange("remarks", value)} error={errors.remarks} />
                    <div className="md:col-span-2">
                
                      <DocumentUploader  label={isEditMode ? "" : "Corrigendum Document (Required)"} name="cor_document"
                       onFileChange={handleFileChange}
                         file={file}
                       error={errors.cor_document}
                       allowedTypes={["application/pdf"]}
                              existingFileName={existingFileName}
              existingFileUrl={
                existingFileName
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/tenders/corrigendums/${existingFileName}`
                  : null
              }
              maxSizeMB={1}
                 onRemove={handleRemoveFile}
                      />
                    </div>
                </div>
                <FormActions
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    onCancel={onCancel} 
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    );
};

export default CorrigendumForm;