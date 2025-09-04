// import React, { useState, useEffect, useCallback, memo } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useModal } from '../../../../context/ModalProvider'; // Adjust path
// import Header from '../../../../Components/Add/Header'; // Adjust path
// import FormActions from '../../../../Components/Add/FormActions'; // Adjust path
// import { ImagePlus, X } from 'lucide-react';
// import FormField from '../../../../Components/TextEditor/FormField';
// import DocumentUploader from '@/Components/TextEditor/DocumentUploader';



// // A specialized component for handling image previews and existing images
// const ImageInput = memo(({ label, name, onFileChange, error, previewUrl, existingImageUrl }) => {
//     const imageUrl = previewUrl || (existingImageUrl ? `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${existingImageUrl}` : null);

//     return (
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//             <div className={`relative w-full h-48 border-2 rounded-lg flex items-center justify-center ${error ? 'border-red-500' : 'border-dashed border-gray-300'}`}>
//                 {imageUrl ? (
//                     <>
//                         <img src={imageUrl} alt="Advertisement Preview" className="h-full w-full object-contain rounded-md" />
//                         <label htmlFor={name} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
//                             Change Image
//                         </label>
//                     </>
//                 ) : (
//                     <label htmlFor={name} className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
//                         <ImagePlus size={40} />
//                         <span>Select Image</span>
//                     </label>
//                 )}
//                 <input type="file" id={name} name={name} accept="image/*" onChange={onFileChange} className="sr-only" />
//             </div>
//             {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
//         </div>
//     );
// });


// // --- Main Page Component ---

// const AdvertisementFormPage = () => {
//     const { id } = useParams();
//     const isEditMode = !!id;
//     const navigate = useNavigate();
//     const { showModal } = useModal();

//     const [formData, setFormData] = useState({ ad_link: '' });
//     const [files, setFiles] = useState({ en_adphoto: null, od_adphoto: null });
//     const [previews, setPreviews] = useState({ en_adphoto: null, od_adphoto: null });
//     const [existingImages, setExistingImages] = useState({ en_adphoto: '', od_adphoto: '' });
//     const [errors, setErrors] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);
//         const [initialData, setInitialData] = useState(null);


//     // Fetch data in edit mode
//     useEffect(() => {
//         if (isEditMode) {
//             axios.get(`${import.meta.env.VITE_API_BASE_URL}/advertisements/${id}`, {withCredentials:true})
//                 .then(response => {
//                     const { ad_link, en_adphoto, od_adphoto } = response.data;
//                         const initial = { ad_link: ad_link || '' };
//                     setFormData(initial);
//                        setInitialData(initial);
//                     setExistingImages({ en_adphoto, od_adphoto });
//                 })
//                 .catch(err => {
//                     showModal('error', 'Failed to fetch advertisement data.');
//                     navigate('/admin/notifications/advertisements');
//                 });
//         }
//     }, [id, isEditMode, navigate, showModal]);

//     // Cleanup object URLs to prevent memory leaks
//     useEffect(() => {
//         return () => {
//             Object.values(previews).forEach(url => {
//                 if (url) URL.revokeObjectURL(url);
//             });
//         };
//     }, [previews]);

//     const handleFileChange = useCallback((e) => {
//         const { name, files: selectedFiles } = e.target;
//         const file = selectedFiles[0];

//         // Revoke the old preview URL to free up memory
//         if (previews[name]) {
//             URL.revokeObjectURL(previews[name]);
//         }
        
//         if (!file) {
//             setFiles(prev => ({ ...prev, [name]: null }));
//             setPreviews(prev => ({ ...prev, [name]: null }));
//             return;
//         }

//         if (!file.type.startsWith('image/')) {
//             setErrors(prev => ({ ...prev, [name]: 'Invalid file type. Please select an image.' }));
//             return;
//         }

//         setErrors(prev => ({ ...prev, [name]: null }));
//         setFiles(prev => ({ ...prev, [name]: file }));
//         setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
//     }, [previews]);

//     const handleChange = useCallback((e) => {
//         setFormData({ ad_link: e.target.value });
//     }, []);

//     const validateForm = () => {
//         const newErrors = {};
//         if (!isEditMode) { // In add mode, both images are required
//             if (!files.en_adphoto) newErrors.en_adphoto = 'English advertisement photo is required.';
//             if (!files.od_adphoto) newErrors.od_adphoto = 'Odia advertisement photo is required.';
//         }
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;
//         setIsSubmitting(true);

//         const submissionData = new FormData();
//         submissionData.append('ad_link', formData.ad_link);
//         if (files.en_adphoto) submissionData.append('en_adphoto', files.en_adphoto);
//         if (files.od_adphoto) submissionData.append('od_adphoto', files.od_adphoto);

//         const url = isEditMode ? `${import.meta.env.VITE_API_BASE_URL}/advertisements/${id}` : `${import.meta.env.VITE_API_BASE_URL}/advertisements`;
//         const method = isEditMode ? 'patch' : 'post';

//         try {
//             await axios[method](url, submissionData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//                 withCredentials: true,
//             });
//             showModal('success', `Advertisement ${isEditMode ? 'updated' : 'added'} successfully!`);
//             navigate('/admin/notifications/advertisements'); // Adjust to your list page route
//         } catch (error) {
//             showModal('error', error.response?.data?.message || 'Operation failed.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//        const handleReset = useCallback(() => {
//         if (isEditMode && initialData) {
//             // In edit mode, reset to the initially fetched data
//             setFormData(initialData);
//         } else {
//             // In add mode, reset to a blank slate
//             setFormData({ ad_link: '' });
//         }
        
//         // Clear any validation errors
//         setErrors({});

//         // Clear any newly selected files and revoke their preview URLs
//         setFiles({ en_adphoto: null, od_adphoto: null });
//         Object.values(previews).forEach(url => { if (url) URL.revokeObjectURL(url); });
//         setPreviews({ en_adphoto: null, od_adphoto: null });

//         // Visually clear the file input elements in the DOM
//         const enInput = document.getElementById('en_adphoto');
//         const odInput = document.getElementById('od_adphoto');
//         if (enInput) enInput.value = null;
//         if (odInput) odInput.value = null;

//     }, [isEditMode, initialData, previews]);
    
//     return (
//         <div className="p-6 min-h-[80vh]">
//             <Header title={isEditMode ? 'Edit Advertisement' : 'Add New Advertisement'} onGoBack={() => navigate('/admin/notifications/advertisements')} />
//             <div className="bg-white p-8 rounded-lg shadow-md">
//                 <form onSubmit={handleSubmit} noValidate>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <ImageInput label="English Advertisement" name="en_adphoto" onFileChange={handleFileChange} error={errors.en_adphoto} previewUrl={previews.en_adphoto} existingImageUrl={existingImages.en_adphoto} />
//                         <ImageInput label="Odia Advertisement" name="od_adphoto" onFileChange={handleFileChange} error={errors.od_adphoto} previewUrl={previews.od_adphoto} existingImageUrl={existingImages.od_adphoto} />
                   
//                    <DocumentUploader label="English Advertisement" name="en_adphoto" onFileChange={handleFileChange} error={errors.en_adphoto} 
//                    existingFileUrl={
//     existingImages.en_adphoto 
//       ? `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${existingImages.en_adphoto}`
//       : null
//   }
//                    />
//                    <DocumentUploader  label="Odia Advertisement" name="od_adphoto" onFileChange={handleFileChange} error={errors.od_adphoto}
//                       existingFileUrl={
//     existingImages.od_adphoto 
//       ? `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${existingImages.od_adphoto}`
//       : null
//   }
//                     />
                   
                   
//                     </div>
//                     <div className="mt-6">
//                         <FormField type='url' label="Advertisement Link (Optional)" name="ad_link" value={formData.ad_link} onChange={handleChange} error={errors.ad_link} placeholder="https://example.com" />
//                     </div>
//                     <FormActions
//                         onSubmit={handleSubmit}
//                         onReset={handleReset}
//                         onCancel={() => navigate('/admin/notifications/advertisements')}
//                         isSubmitting={isSubmitting}
//                     />
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AdvertisementFormPage;



import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../context/ModalProvider';
import Header from '../../../Components/Admin/Add/Header';
import FormActions from '../../../Components/Admin/Add/FormActions';
import FormField from '../../../Components/Admin/TextEditor/FormField';
import DocumentUploader from '../../../Components/Admin/TextEditor/DocumentUploader';

const AdvertisementFormPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { showModal } = useModal();

    const [formData, setFormData] = useState({ ad_link: '' });
    const [files, setFiles] = useState({ en_adphoto: null, od_adphoto: null });
    const [errors, setErrors] = useState({});
    const [existingFileNames, setExistingFileNames] = useState({ en_adphoto: '', od_adphoto: '' });
    const [filesToRemove, setFilesToRemove] = useState({ en_adphoto: false, od_adphoto: false });
    const [initialData, setInitialData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/advertisements/${id}`, { withCredentials: true })
                .then(response => {
                    const { ad_link, en_adphoto, od_adphoto } = response.data;
                    const initial = { ad_link: ad_link || '' };
                    setFormData(initial);
                    setInitialData(initial);
                    setExistingFileNames({ en_adphoto, od_adphoto });
                })
                .catch(err => {
                    showModal('error', err.response?.data?.message || 'Failed to fetch advertisement data.');
                    navigate('/admin/notifications/advertisements');
                });
        }
    }, [id, isEditMode, navigate, showModal]);

    // const handleFileChange = useCallback((file, error, fieldName) => {
    //     setFiles(prev => ({ ...prev, [fieldName]: file }));
    //     setErrors(prev => ({ ...prev, [fieldName]: error }));
    //     if (file) {
    //         setFilesToRemove(prev => ({ ...prev, [fieldName]: false }));
    //     }
    // }, []);

    const handleFileChange = useCallback((file, error, fieldName) => {
        setErrors(prev => ({ ...prev, [fieldName]: error }));
        if (error) {
            setFiles(prev => ({ ...prev, [fieldName]: null }));
            return;
        }
        setFiles(prev => ({ ...prev, [fieldName]: file }));
        setFilesToRemove(prev => ({ ...prev, [fieldName]: false }));
        setExistingFileNames(prev => ({...prev, [fieldName]: ''}));
    }, []);

    const handleChange = useCallback((e) => {
        setFormData({ ad_link: e.target.value });
    }, []);

       const handleRemoveFile = useCallback((fieldName) => {
        setFilesToRemove(prev => ({ ...prev, [fieldName]: true }));
        setExistingFileNames(prev => ({ ...prev, [fieldName]: null }));
        setFiles(prev => ({ ...prev, [fieldName]: null })); // Also clear any staged file
    }, []);



    const validateForm = () => {
        const newErrors = {};
        if (!isEditMode) {
            if (!files.en_adphoto && !existingFileNames.en_adphoto) newErrors.en_adphoto = 'English advertisement photo is required.';
        }
        if (!isEditMode) {
            if (!files.od_adphoto && !existingFileNames.od_adphoto) newErrors.od_adphoto = 'Odia advertisement photo is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const submissionData = new FormData();
        submissionData.append('ad_link', formData.ad_link);
        if (files.en_adphoto) submissionData.append('en_adphoto', files.en_adphoto);
        if (files.od_adphoto) submissionData.append('od_adphoto', files.od_adphoto);
        if (filesToRemove.en_adphoto) submissionData.append('remove_en_adphoto', 'true');
        if (filesToRemove.od_adphoto) submissionData.append('remove_od_adphoto', 'true');

        const url = isEditMode ? `${import.meta.env.VITE_API_BASE_URL}/advertisements/${id}` : `${import.meta.env.VITE_API_BASE_URL}/advertisements`;
        const method = isEditMode ? 'patch' : 'post';

        try {
            await axios[method](url, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            showModal('success', `Advertisement ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate('/admin/notifications/advertisements');
        } catch (error) {
            showModal('error', error.response?.data?.message || 'Operation failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = useCallback(() => {
        if (isEditMode && initialData) {
            setFormData(initialData);
        } else {
            setFormData({ ad_link: '' });
        }
        setErrors({});
        setFiles({ en_adphoto: null, od_adphoto: null });
        setFilesToRemove({ en_adphoto: false, od_adphoto: false });
        const enInput = document.getElementById('en_adphoto');
        const odInput = document.getElementById('od_adphoto');
        if (enInput) enInput.value = null;
        if (odInput) odInput.value = null;
    }, [isEditMode, initialData]);
    
    return (
        <div className="p-6 min-h-[80vh]">
            <Header title={isEditMode ? 'Edit Advertisement' : 'Add New Advertisement'} onGoBack={() => navigate('/admin/notifications/advertisements')} />
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DocumentUploader
                            label="English Advertisement"
                            file={files.en_adphoto}
                            onFileChange={(file, error) => handleFileChange(file, error, 'en_adphoto')}
                            error={errors.en_adphoto}
                            existingFileName={filesToRemove.en_adphoto ? null : existingFileNames.en_adphoto}
                            existingFileUrl={filesToRemove.en_adphoto ? null : (existingFileNames.en_adphoto ? `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${existingFileNames.en_adphoto}` : null)}
                            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                            maxSizeMB={1}
                            onRemove={() => handleRemoveFile('en_adphoto')}
                        />
                        <DocumentUploader
                            label="Odia Advertisement"
                            file={files.od_adphoto}
                            onFileChange={(file, error) => handleFileChange(file, error, 'od_adphoto')}
                            error={errors.od_adphoto}
                            existingFileName={filesToRemove.od_adphoto ? null : existingFileNames.od_adphoto}
                            existingFileUrl={filesToRemove.od_adphoto ? null : (existingFileNames.od_adphoto ? `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${existingFileNames.od_adphoto}` : null)}
                            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                            maxSizeMB={1}
                            onRemove={() => handleRemoveFile('od_adphoto')}
                        />
                    </div>
                    <div className="mt-6">
                        <FormField type='url' label="Advertisement Link (Optional)" name="ad_link" value={formData.ad_link} onChange={handleChange} error={errors.ad_link} placeholder="https://example.com" />
                    </div>
                    <FormActions
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                        onCancel={() => navigate('/admin/notifications/advertisements')}
                        isSubmitting={isSubmitting}
                    />
                </form>
            </div>
        </div>
    );
};

export default AdvertisementFormPage;