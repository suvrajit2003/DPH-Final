import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../context/ModalProvider';
import Header from '../../../Components/Admin/Add/Header';
import FormActions from '../../../Components/Admin/Add/FormActions';
import FormField from '../../../Components/Admin/TextEditor/FormField';
import DocumentUploader from '@/Components/Admin/TextEditor/DocumentUploader';


const NoticeFormPage = () => {
  const { id } = useParams(); 
  const isEditMode = !!id; 
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState({ en_title: '', od_title: '', date: '' });
  const [file, setFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null); 
      const [isFileRemoved, setIsFileRemoved] = useState(false)

  const fetchNoticeData = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notices/${id}`, { withCredentials: true });
      const { en_title, od_title, date, doc } = response.data;
      const initial = { en_title, od_title, date: date || '' };
      setFormData(initial);
      setInitialData(initial);
      setExistingFileName(doc || '');
    } catch (error) {
      showModal("error", error.response?.data?.message || "Failed to fetch notice data.");
      navigate('/admin/notifications/notices');
    }
  }, [id, navigate, showModal]);

  useEffect(() => {
    if (isEditMode) {
      fetchNoticeData();
    }
  }, [isEditMode, fetchNoticeData]);

const handleChange = (name, value) => {
  setFormData(prev => ({ ...prev, [name]: value }));
};


  
const handleFileChange = useCallback((selectedFile, errorMsg) => {
  if (errorMsg) {
    setErrors(prev => ({ ...prev, doc: errorMsg }));
    setFile(null);
    return;
  }


  setFile(selectedFile);
  setErrors(prev => ({ ...prev, doc: null }));
}, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.en_title.trim()) newErrors.en_title = "English title is required.";
        if (!formData.od_title.trim()) newErrors.od_title = "Odia title is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!isEditMode && !file) {
      newErrors.doc = "Notice document is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, file, isEditMode]);


    const handleRemoveFile = useCallback(() => {
        setExistingFileName('');
        setIsFileRemoved(true);
    }, []);


  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));


    if (file) {
            submissionData.append('doc', file);
        } else if (isFileRemoved) {
            submissionData.append('removeDoc', 'true'); 
        }

    const url = isEditMode ? `${import.meta.env.VITE_API_BASE_URL}/notices/${id}` : `${import.meta.env.VITE_API_BASE_URL}/notices`;
    const method = isEditMode ? 'patch' : 'post';

    try {
      await axios[method](url, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      showModal("success", `Notice ${isEditMode ? 'updated' : 'added'} successfully!`);
      navigate('/admin/notifications/notices');
    } catch (error) {
      showModal("error", error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} notice.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, file, id, isEditMode, navigate, showModal, validateForm, isFileRemoved]);

  const handleReset = useCallback(() => {
    if (isEditMode && initialData) {
        setFormData(initialData); 
    } else {
        setFormData({ en_title: '', od_title: '', date: '' });
    }
    setFile(null);
    setErrors({});
    const fileInput = document.getElementById('doc');
    if (fileInput) fileInput.value = null;
  }, [isEditMode, initialData]);


    
  return (
    <div className="p-6 min-h-[80vh]">
      <Header title={isEditMode ? "Edit Notice" : "Add New Notice"} onGoBack={() => navigate('/admin/notifications/notices')} />
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Title (English)" name="en_title" type="text" value={formData.en_title} onChange={(value)=>handleChange("en_title", value)} error={errors.en_title}/>
            <FormField label="Title (Odia)" name="od_title" type="text" value={formData.od_title}  onChange={(value)=>handleChange("od_title", value)} error={errors.od_title}/>
            <FormField label="Date" name="date" type="date" value={formData.date}  onChange={(value)=>handleChange("date", value)} error={errors.date}/>
          <DocumentUploader
          label="Notice Document" name="doc" onFileChange={handleFileChange} error={errors.doc}
          allowedTypes={["application/pdf"]}
          maxSizeMB={1}
          
          file={file}
                       existingFileName={existingFileName}
              existingFileUrl={
                existingFileName
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/notices/${existingFileName}`
                  : null
              }
              onRemove={handleRemoveFile}
          />
          
          </div>
          <FormActions
            onSubmit={handleSubmit}
            onReset={handleReset}
            onCancel={() => navigate('/admin/notifications/notices')}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default NoticeFormPage;