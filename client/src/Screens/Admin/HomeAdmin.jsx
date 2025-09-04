// import  { useState, useEffect, useCallback, memo } from 'react';
// import axios from 'axios';
// import { useModal } from '../../context/ModalProvider';
// import { ImagePlus } from 'lucide-react';

// const FormField = memo(({ label, name, value, onChange }) => (
//     <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
//         <input type="text" name={name} value={value} onChange={onChange}
//             className="w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
//         />
//     </div>
// ));

// const ImageInput = memo(({ onFileChange, previewUrl, existingImageUrl }) => {
//     const imageUrl = previewUrl || (existingImageUrl ? `${import.meta.env.VITE_API_BASE_URL}/uploads/home-admins/${existingImageUrl}` : null);
//     return (
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image *</label>
//             <p className="text-xs text-red-500 mb-2">Accepts jpg, png, jpeg, webp. Max 1024kb</p>
//             <input type="file" accept="image/*" onChange={onFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 mb-2"/>
//             <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
//                 {imageUrl ? <img src={imageUrl } alt="Preview" className="h-full w-full object-cover" /> : <div className="text-center text-gray-400"><ImagePlus size={40} className="mx-auto" /><span>No Photo</span></div>}
//             </div>
//         </div>
//     );
// });

// const HomeAdminForm = memo(({ admin, index, onDataChange, onFileChange }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h2 className="text-lg font-bold text-gray-800 mb-4">Home Admin {admin.id}</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
//             <FormField label="Name (In English)" name="en_name" value={admin.en_name} onChange={(e) => onDataChange(index, 'en_name', e.target.value)} />
//             <FormField label="Name (In Odia)" name="od_name" value={admin.od_name} onChange={(e) => onDataChange(index, 'od_name', e.target.value)} />
//             <FormField label="Designation (In English)" name="en_designation" value={admin.en_designation} onChange={(e) => onDataChange(index, 'en_designation', e.target.value)} />
//             <FormField label="Designation (In Odia)" name="od_designation" value={admin.od_designation} onChange={(e) => onDataChange(index, 'od_designation', e.target.value)} />
//             <ImageInput onFileChange={(e) => onFileChange(index, e.target.files[0])} previewUrl={admin.previewUrl} existingImageUrl={admin.image} />
//         </div>
//     </div>
// ));

// const HomeAdminPage = () => {
//     const { showModal } = useModal();
//     const [admins, setAdmins] = useState([]);
//     const [initialAdmins, setInitialAdmins] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const fetchData = useCallback(async () => {
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, {withCredentials:true});
//             const dataWithUIState = response.data.map(admin => ({ ...admin, file: null, previewUrl: null }));
//             setAdmins(dataWithUIState);
//             setInitialAdmins(JSON.parse(JSON.stringify(dataWithUIState))); 
//         } catch (error) {
//             showModal('error', error.response?.data?.message || error.message);
//         }
//     }, [showModal]);

//     useEffect(() => {
//         fetchData();
//         return () => { admins.forEach(admin => { if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl); }); };
//     }, [fetchData]);

//      const handleDataChange = useCallback((index, field, value) => {
//         setAdmins(prevAdmins => 
//             prevAdmins.map((admin, idx) => {
//                 if (idx === index) {
//                     return { ...admin, [field]: value };
//                 }
//                 return admin;
//             })
//         );
//     }, []);

//     const handleFileChange = useCallback((index, file) => {
//         setAdmins(prevAdmins => {
//             const newAdmins = [...prevAdmins];
//             if (newAdmins[index].previewUrl) URL.revokeObjectURL(newAdmins[index].previewUrl);
//             newAdmins[index].file = file;
//             newAdmins[index].previewUrl = file ? URL.createObjectURL(file) : null;
//             return newAdmins;
//         });
//     }, []);

//     const handleSubmit = async () => {
//         setIsSubmitting(true);
//         const submissionData = new FormData();
//         const dataToSubmit = admins.map(({ file, previewUrl, ...rest }) => rest);
//         submissionData.append('data', JSON.stringify(dataToSubmit));
        
//         admins.forEach(admin => {
//             if (admin.file) {
//                 const newFileName = `home_admin_${admin.id}_${admin.file.name}`;
//                 submissionData.append('images', admin.file, newFileName);
//             }
//         });

//         try {
//             await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, submissionData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//                  withCredentials:true
//             });
//             showModal('success', 'Members updated successfully!');
//             fetchData();
//         } catch (error) {
//             showModal('error', 'Update failed.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleReset = useCallback(() => {
//         setAdmins(JSON.parse(JSON.stringify(initialAdmins)));
//     }, [initialAdmins]);

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="space-y-6">
//                 {admins.map((admin, index) => (
//                     <HomeAdminForm
//                         key={admin.id}
//                         admin={admin}
//                         index={index}
//                         onDataChange={handleDataChange}
//                         onFileChange={handleFileChange}
//                     />
//                 ))}
//                 <div className="flex items-center gap-4 pt-4">
//                     <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50">
//                         {isSubmitting ? 'Updating...' : 'Update Members'}
//                     </button>
//                     <button onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all">
//                         Reset
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeAdminPage;



// import React, { useState, useEffect, useCallback, memo } from 'react';
// import axios from 'axios';
// import { useModal } from '../../context/ModalProvider';
// import FormField from '../../Components/TextEditor/FormField'; // Import your reusable FormField
// import DocumentUploader from '../../Components/TextEditor/DocumentUploader'; // Import your reusable DocumentUploader

// const HomeAdminForm = memo(({ admin, index, onDataChange, onFileChange }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h2 className="text-lg font-bold text-gray-800 mb-4">Home Admin {index + 1}</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
//             <FormField 
//                 label="Name (In English)" 
//                 value={admin.en_name} 
//                 onChange={(value) => onDataChange(index, 'en_name', value)} 
//                 required 
//             />
//             <FormField 
//                 label="Name (In Odia)" 
//                 value={admin.od_name} 
//                 onChange={(value) => onDataChange(index, 'od_name', value)} 
//                 required
//             />
//             <FormField 
//                 label="Designation (In English)" 
//                 value={admin.en_designation} 
//                 onChange={(value) => onDataChange(index, 'en_designation', value)}
//                 required
//             />
//             <FormField 
//                 label="Designation (In Odia)" 
//                 value={admin.od_designation} 
//                 onChange={(value) => onDataChange(index, 'od_designation', value)}
//                 required
//             />
//                        <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
//                 {imageUrl ? <img src={imageUrl } alt="Preview" className="h-full w-full object-cover" /> : <div className="text-center text-gray-400"><ImagePlus size={40} className="mx-auto" /><span>No Photo</span></div>}
//              </div>
//             <DocumentUploader
//                 label="Upload Image"
//                 file={admin.file} // This is the NEW file object
//                 onFileChange={(file, error) => onFileChange(index, file, error)}
//                 existingFileName={admin.image} // This is the EXISTING filename
//                 existingFileUrl={admin.image ? `${import.meta.env.VITE_API_BASE_URL}/uploads/home-admins/${admin.image}` : null}
//                 allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
//                 maxSizeMB={1}
//                 error={admin.error}
//             />
//         </div>
//     </div>
// ));

// const HomeAdminPage = () => {
//     const { showModal } = useModal();
//     const [admins, setAdmins] = useState([]);
//     const [initialAdmins, setInitialAdmins] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const fetchData = useCallback(async () => {
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, { withCredentials: true });
//             const dataWithUIState = response.data.map(admin => ({ ...admin, file: null, error: null, removeImage: false }));
//             setAdmins(dataWithUIState);
//             setInitialAdmins(JSON.parse(JSON.stringify(dataWithUIState)));
//         } catch (error) {
//             showModal('error', error.response?.data?.message || 'Failed to fetch data.');
//         }
//     }, [showModal]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const handleDataChange = useCallback((index, field, value) => {
//         setAdmins(prevAdmins => 
//             prevAdmins.map((admin, idx) => 
//                 idx === index ? { ...admin, [field]: value } : admin
//             )
//         );
//     }, []);
    
//     const handleFileChange = useCallback((index, file, error) => {
//         setAdmins(prevAdmins => 
//             prevAdmins.map((admin, idx) => 
//                 idx === index ? { ...admin, file, error, removeImage: false } : admin
//             )
//         );
//     }, []);


//     const handleSubmit = async () => {
//         setIsSubmitting(true);
//         const submissionData = new FormData();
//         const dataToSubmit = admins.map(({ file, error, removeImage, ...rest }) => ({ ...rest, removeImage }));
//         submissionData.append('data', JSON.stringify(dataToSubmit));
        
//         admins.forEach(admin => {
//             if (admin.file) {
//                 const newFileName = `home_admin_${admin.id}_${admin.file.name}`;
//                 submissionData.append('images', admin.file, newFileName);
//             }
//         });

//         try {
//             await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, submissionData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//                 withCredentials: true
//             });
//             showModal('success', 'Members updated successfully!');
//             fetchData();
//         } catch (error) {
//             showModal('error', 'Update failed.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleReset = useCallback(() => {
//         setAdmins(JSON.parse(JSON.stringify(initialAdmins)));
//     }, [initialAdmins]);

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="space-y-6">
//                 {admins.map((admin, index) => (
//                     <HomeAdminForm
//                         key={admin.id}
//                         admin={admin}
//                         index={index}
//                         onDataChange={handleDataChange}
//                         onFileChange={handleFileChange}
//                     />
//                 ))}
//                 <div className="flex items-center gap-4 pt-4">
//                     <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50">
//                         {isSubmitting ? 'Updating...' : 'Update Members'}
//                     </button>
//                     <button onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all">
//                         Reset
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeAdminPage;


// import React, { useState, useEffect, useCallback, memo } from 'react';
// import axios from 'axios';
// import { useModal } from '../../context/ModalProvider';
// import FormField from '../../Components/TextEditor/FormField';
// import DocumentUploader from '../../Components/TextEditor/DocumentUploader';
// import { ImagePlus } from 'lucide-react';

// // NEW: A dedicated component for displaying the image preview
// const ImagePreview = memo(({ previewUrl, existingImageUrl }) => {
//     const imageUrl = previewUrl || (existingImageUrl ? `${import.meta.env.VITE_API_BASE_URL}/uploads/home-admins/${existingImageUrl}` : null);

//     return (
//         <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
//             {imageUrl ? (
//                 <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
//             ) : (
//                 <div className="text-center text-gray-400">
//                     <ImagePlus size={40} className="mx-auto" />
//                     <span>No Photo</span>
//                 </div>
//             )}
//         </div>
//     );
// });

// const HomeAdminForm = memo(({ admin, index, onDataChange, onFileChange, onFileRemove }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h2 className="text-lg font-bold text-gray-800 mb-4">Home Admin {index + 1}</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
//             <FormField 
//                 label="Name (In English)" 
//                 value={admin.en_name} 
//                 onChange={(value) => onDataChange(index, 'en_name', value)} 
//                 required 
//             />
//             <FormField 
//                 label="Name (In Odia)" 
//                 value={admin.od_name} 
//                 onChange={(value) => onDataChange(index, 'od_name', value)} 
//                 required
//             />
//             <FormField 
//                 label="Designation (In English)" 
//                 value={admin.en_designation} 
//                 onChange={(value) => onDataChange(index, 'en_designation', value)}
//                 required
//             />
//             <FormField 
//                 label="Designation (In Odia)" 
//                 value={admin.od_designation} 
//                 onChange={(value) => onDataChange(index, 'od_designation', value)}
//                 required
//             />
            
//             {/* The DocumentUploader and ImagePreview are now in their own column */}
//             <div className="flex flex-col gap-4">
//                 <DocumentUploader
//                     label="Upload Image"
//                     file={admin.file}
//                     onFileChange={(file, error) => onFileChange(index, file, error)}
//                     existingFileName={admin.image}
//                     allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
//                     maxSizeMB={1}
//                     error={admin.error}
//                 />
//                 <ImagePreview 
//                     previewUrl={admin.previewUrl} 
//                     existingImageUrl={admin.image} 
//                 />
//             </div>
//         </div>
//     </div>
// ));

// const HomeAdminPage = () => {
//     const { showModal } = useModal();
//     const [admins, setAdmins] = useState([]);
//     const [initialAdmins, setInitialAdmins] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const fetchData = useCallback(async () => {
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, { withCredentials: true });
//             const dataWithUIState = response.data.map(admin => ({ ...admin, file: null, previewUrl: null, error: null, removeImage: false }));
//             setAdmins(dataWithUIState);
//             setInitialAdmins(JSON.parse(JSON.stringify(dataWithUIState)));
//         } catch (error) {
//             showModal('error', error.response?.data?.message || 'Failed to fetch data.');
//         }
//     }, [showModal]);

//     useEffect(() => {
//         fetchData();
//         return () => { admins.forEach(admin => { if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl); }); };
//     }, [fetchData]);

//     const handleDataChange = useCallback((index, field, value) => {
//         setAdmins(prevAdmins => 
//             prevAdmins.map((admin, idx) => 
//                 idx === index ? { ...admin, [field]: value } : admin
//             )
//         );
//     }, []);
    
//     const handleFileChange = useCallback((index, file, error) => {
//         setAdmins(prevAdmins => {
//             return prevAdmins.map((admin, idx) => {
//                 if (idx === index) {
//                     if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl);
//                     return {
//                         ...admin,
//                         file: file,
//                         previewUrl: file ? URL.createObjectURL(file) : null,
//                         error: error,
//                         removeImage: false
//                     };
//                 }
//                 return admin;
//             });
//         });
//     }, []);



//     const handleSubmit = async () => {
//         setIsSubmitting(true);
//         const submissionData = new FormData();
//         const dataToSubmit = admins.map(({ file, previewUrl, error, ...rest }) => ({ ...rest }));
//         submissionData.append('data', JSON.stringify(dataToSubmit));
        
//         admins.forEach(admin => {
//             if (admin.file) {
//                 const newFileName = `home_admin_${admin.id}_${admin.file.name}`;
//                 submissionData.append('images', admin.file, newFileName);
//             }
//         });

//         try {
//             await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, submissionData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//                 withCredentials: true
//             });
//             showModal('success', 'Members updated successfully!');
//             fetchData();
//         } catch (error) {
//             showModal('error', error.response?.data?.message);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleReset = useCallback(() => {
//         admins.forEach(admin => { if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl); });
//         setAdmins(JSON.parse(JSON.stringify(initialAdmins)));
//     }, [initialAdmins, admins]);

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="space-y-6">
//                 {admins.map((admin, index) => (
//                     <HomeAdminForm
//                         key={admin.id}
//                         admin={admin}
//                         index={index}
//                         onDataChange={handleDataChange}
//                         onFileChange={handleFileChange}
//                     />
//                 ))}
//                 <div className="flex items-center gap-4 pt-4">
//                     <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50">
//                         {isSubmitting ? 'Updating...' : 'Update Members'}
//                     </button>
//                     <button onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all">
//                         Reset
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeAdminPage;

import React, { useState, useEffect, useCallback, memo } from 'react';
import axios from 'axios';
import { useModal } from '../../context/ModalProvider';
import FormField from '../../Components/Admin/TextEditor/FormField';
import DocumentUploader from '../../Components/Admin/TextEditor/DocumentUploader';
import { ImagePlus } from 'lucide-react';

const ImagePreview = memo(({ imageUrl }) => {
    return (
        <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
            {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : (
                <div className="text-center text-gray-400">
                    <ImagePlus size={40} className="mx-auto" />
                    <span>No Photo</span>
                </div>
            )}
        </div>
    );
});

const HomeAdminForm = memo(({ admin, index, onDataChange, onFileChange }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Home Admin {index + 1}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
            <FormField 
                label="Name (In English)" 
                value={admin.en_name} 
                onChange={(value) => onDataChange(index, 'en_name', value)} 
                required 
                error={admin.errors?.en_name}
            />
            <FormField 
                label="Name (In Odia)" 
                value={admin.od_name} 
                onChange={(value) => onDataChange(index, 'od_name', value)} 
                required
                error={admin.errors?.od_name}
            />
            <FormField 
                label="Designation (In English)" 
                value={admin.en_designation} 
                onChange={(value) => onDataChange(index, 'en_designation', value)}
                required
                error={admin.errors?.en_designation}
            />
            <FormField 
                label="Designation (In Odia)" 
                value={admin.od_designation} 
                onChange={(value) => onDataChange(index, 'od_designation', value)}
                required
                error={admin.errors?.od_designation}
            />
            
            <div className="flex flex-col gap-4">
                <DocumentUploader
                    label="Upload Image"
                    file={admin.file}
                    onFileChange={(file, error) => onFileChange(index, file, error)}
                    existingFileName={admin.image}
                    allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    maxSizeMB={1}
                    error={admin.errors?.image}
                />
                <ImagePreview 
                    imageUrl={admin.previewUrl || (admin.image ? `${import.meta.env.VITE_API_BASE_URL}/uploads/home-admins/${admin.image}` : null)} 
                />
            </div>
        </div>
    </div>
));

const HomeAdminPage = () => {
    const { showModal } = useModal();
    const [admins, setAdmins] = useState([]);
    const [initialAdmins, setInitialAdmins] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, { withCredentials: true });
            const dataWithUIState = response.data.map(admin => ({ 
                ...admin, 
                file: null, 
                previewUrl: null, 
                removeImage: false,
                errors: {} // Initialize errors object for each admin
            }));
            setAdmins(dataWithUIState);
            setInitialAdmins(JSON.parse(JSON.stringify(dataWithUIState)));
        } catch (error) {
            showModal('error', error.response?.data?.message || 'Failed to fetch data.');
        }
    }, [showModal]);

    useEffect(() => {
        fetchData();
        return () => { admins.forEach(admin => { if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl); }); };
    }, [fetchData]);

    const handleDataChange = useCallback((index, field, value) => {
        setAdmins(prevAdmins => 
            prevAdmins.map((admin, idx) => 
                idx === index ? { ...admin, [field]: value, errors: { ...admin.errors, [field]: null } } : admin
            )
        );
    }, []);
    
    const handleFileChange = useCallback((index, file, error) => {
        setAdmins(prevAdmins => 
            prevAdmins.map((admin, idx) => {
                if (idx === index) {
                    if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl);
                    return {
                        ...admin,
                        file: file,
                        previewUrl: file ? URL.createObjectURL(file) : null,
                        removeImage: false,
                        errors: { ...admin.errors, image: error }
                    };
                }
                return admin;
            })
        );
    }, []);



    const validateForms = () => {
        let isValid = true;
        const newAdminsState = admins.map(admin => {
            const newErrors = {};
            if (!admin.en_name?.trim()) newErrors.en_name = "English name is required.";
            if (!admin.od_name?.trim()) newErrors.od_name = "Odia name is required.";
            if (!admin.en_designation?.trim()) newErrors.en_designation = "English designation is required.";
            if (!admin.od_designation?.trim()) newErrors.od_designation = "Odia designation is required.";
            if (!admin.image && !admin.file) newErrors.image = "An image is required.";
            
            if (Object.keys(newErrors).length > 0) {
                isValid = false;
            }
            return { ...admin, errors: newErrors };
        });
        setAdmins(newAdminsState);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForms()) {
            showModal('error', 'Please fill all required fields for each member.');
            return;
        }

        setIsSubmitting(true);
        const submissionData = new FormData();
        const dataToSubmit = admins.map(({ file, previewUrl, errors, ...rest }) => ({ ...rest }));
        submissionData.append('data', JSON.stringify(dataToSubmit));
        
        admins.forEach(admin => {
            if (admin.file) {
                const newFileName = `home_admin_${admin.id}_${admin.file.name}`;
                submissionData.append('images', admin.file, newFileName);
            }
        });

        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            showModal('success', 'Members updated successfully!');
            fetchData();
        } catch (error) {
            showModal('error', error.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = useCallback(() => {
        admins.forEach(admin => { if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl); });
        setAdmins(JSON.parse(JSON.stringify(initialAdmins)));
    }, [initialAdmins, admins]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="space-y-6">
                {admins.map((admin, index) => (
                    <HomeAdminForm
                        key={admin.id}
                        admin={admin}
                        index={index}
                        onDataChange={handleDataChange}
                        onFileChange={handleFileChange}
                    />
                ))}
                <div className="flex items-center gap-4 pt-4">
                    <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50">
                        {isSubmitting ? 'Updating...' : 'Update Members'}
                    </button>
                    <button onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeAdminPage;