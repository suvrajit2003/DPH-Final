// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../../../Components/Add/Header";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const PhotoGalaryForm = () => {
//   const { id } = useParams(); // get photo id from url params
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title_en: "",
//     title_od: "",
//     category: "",
//     photoSourceType: "upload", // "upload" or "link"
//     photoFile: null,
//     photoLink: "",
//   });

//   const [existingPhotoUrl, setExistingPhotoUrl] = useState(""); // To show current photo
//   const [categories, setCategories] = useState([]);
//   const [errors, setErrors] = useState({});

//   // Fetch categories once
//   useEffect(() => {
//     const fetchCategories = async () => {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/image-setup/all-categories`, {
//       withCredentials: true,
//     });
//     if (res.data && Array.isArray(res.data.data)) {
//       setCategories(res.data.data);
//     }
//   } catch (error) {
//     console.error("Failed to fetch categories:", error);
//   }
// };

//     fetchCategories();
//   }, []);

//   // Fetch existing photo data on mount (for editing)
//   useEffect(() => {
//     if (!id) return;

//     const fetchPhoto = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/image-setup/photo/${id}`, {
//           withCredentials: true,
//         });

//         if (res.data.success && res.data.photo) {
//           const photo = res.data.photo;

//           setFormData({
//             title_en: photo.title_en || "",
//             title_od: photo.title_od || "",
//             category: photo.category_id || "",
//             photoSourceType: photo.photo_url ? "link" : "upload",
//             photoFile: null,
//             photoLink: photo.photo_url || "",
//           });

//           setExistingPhotoUrl(photo.photo_url || "");
//         } else {
//           alert("Failed to load photo data");
//           navigate("/admin/image-setup/photo-galary");
//         }
//       } catch (error) {
//         console.error("Failed to fetch photo:", error);
//         alert("Error loading photo data");
//         navigate("/admin/image-setup/photo-galary");
//       }
//     };

//     fetchPhoto();
//   }, [id, navigate]);

//   const handleCancel = () => {
//     navigate("/admin/image-setup/photo-galary");
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "photoFile") {
//       setFormData((prev) => ({ ...prev, photoFile: files[0] }));
//       setErrors((prev) => ({ ...prev, photoFile: "" }));
//     } else if (name === "photoSourceType") {
//       setFormData((prev) => ({
//         ...prev,
//         photoSourceType: value,
//         photoFile: null,
//         photoLink: "",
//       }));
//       setErrors({});
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleReset = () => {
//     if (id) {
//       // reset to loaded photo data
//       // Could refetch or reset to current formData from existing photo - simplified here:
//       setFormData((prev) => ({
//         ...prev,
//         title_en: "",
//         title_od: "",
//         category: "",
//         photoSourceType: "upload",
//         photoFile: null,
//         photoLink: "",
//       }));
//       setErrors({});
//       setExistingPhotoUrl("");
//     } else {
//       // Clear all if adding new
//       setFormData({
//         title_en: "",
//         title_od: "",
//         category: "",
//         photoSourceType: "upload",
//         photoFile: null,
//         photoLink: "",
//       });
//       setErrors({});
//       setExistingPhotoUrl("");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     const newErrors = {};
//     if (!formData.title_en.trim()) newErrors.title_en = "Title (EN) is required";
//     if (!formData.title_od.trim()) newErrors.title_od = "Title (OD) is required";
//     if (!formData.category) newErrors.category = "Category is required";

//     if (formData.photoSourceType === "upload" && !formData.photoFile && !existingPhotoUrl) {
//       newErrors.photoFile = "Please upload a photo file";
//     }
//     if (formData.photoSourceType === "link" && !formData.photoLink.trim()) {
//       newErrors.photoLink = "Please enter a photo link";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const form = new FormData();
//       form.append("title_en", formData.title_en);
//       form.append("title_od", formData.title_od);
//       form.append("category_id", formData.category);

//       // Only append photo if a new one is selected or link is provided
//       if (formData.photoSourceType === "upload" && formData.photoFile) {
//         form.append("photo", formData.photoFile);
//       } else if (formData.photoSourceType === "link") {
//         form.append("photo_url", formData.photoLink);
//       }

//       let res;
//       if (id) {
//         // Update existing photo
//         res = await axios.put(`${API_BASE_URL}/image-setup/update-photo/${id}`, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//       } else {
//         // Create new photo
//         res = await axios.post(`${API_BASE_URL}/image-setup/register-photo`, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//       }

//       if (res.data.success) {
//         alert(id ? "Photo updated successfully!" : "Photo registered successfully!");
//         navigate("/admin/image-setup/photo-galary");
//       } else {
//         alert("Something went wrong: " + res.data.message);
//       }
//     } catch (error) {
//       console.error("Error submitting photo:", error);
//       alert("An error occurred while submitting the photo.");
//     }
//   };

//   return (
//     <div className="mx-auto p-6 min-h-[80vh]">
//       <div className="bg-white p-6 rounded">
//         <Header title={id ? "Edit Photo Gallery Item" : "Add Photo Gallery Item"} onGoBack={handleCancel} />

//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           {/* Title (EN) */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Title (In English)</label>
//             <input
//               type="text"
//               name="title_en"
//               value={formData.title_en}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.title_en && <p className="text-red-600 text-sm">{errors.title_en}</p>}
//           </div>

//           {/* Title (OD) */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Title (In Odia)</label>
//             <input
//               type="text"
//               name="title_od"
//               value={formData.title_od}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.title_od && <p className="text-red-600 text-sm">{errors.title_od}</p>}
//           </div>

//           {/* Category Dropdown */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Category</label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             >
//               <option value="">-- Select Category --</option>
//               {categories
//                 .filter((cat) => cat.category_type === "photo")
//                 .map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.category_en}
//                   </option>
//                 ))}
//             </select>
//             {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
//           </div>

//           {/* Photo Source Type */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Photo Source Type</label>
//             <label className="inline-flex items-center mr-6">
//               <input
//                 type="radio"
//                 name="photoSourceType"
//                 value="upload"
//                 checked={formData.photoSourceType === "upload"}
//                 onChange={handleChange}
//               />
//               <span className="ml-2">Upload File</span>
//             </label>
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 name="photoSourceType"
//                 value="link"
//                 checked={formData.photoSourceType === "link"}
//                 onChange={handleChange}
//               />
//               <span className="ml-2">Paste Link</span>
//             </label>
//           </div>

//           {/* Show existing photo if any */}
//           {existingPhotoUrl && formData.photoSourceType === "link" && (
//             <div className="mb-4">
//               <p className="font-medium text-gray-700">Current Photo:</p>
//               <img src={existingPhotoUrl} alt="Current Photo" className="max-w-xs rounded" />
//             </div>
//           )}

//           {/* File or Link input */}
//           {formData.photoSourceType === "upload" ? (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700">Upload Photo</label>
//               <input
//                 type="file"
//                 name="photoFile"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="mt-1 block w-full"
//               />
//               {errors.photoFile && <p className="text-red-600 text-sm">{errors.photoFile}</p>}
//             </div>
//           ) : (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700">Paste Photo Link</label>
//               <input
//                 type="text"
//                 name="photoLink"
//                 value={formData.photoLink}
//                 onChange={handleChange}
//                 placeholder="https://example.com/photo.jpg"
//                 className="mt-1 block w-full border rounded px-2 py-1"
//               />
//               {errors.photoLink && <p className="text-red-600 text-sm">{errors.photoLink}</p>}
//             </div>
//           )}

//           {/* Buttons */}
//           <div className="flex space-x-2">
//             <button
//               type="submit"
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               {id ? "Update" : "Submit"}
//             </button>
//             <button
//               type="reset"
//               onClick={handleReset}
//               className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Reset
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PhotoGalaryForm;




// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../../../Components/Add/Header";
// import DocumentUploader from "../../../Components/TextEditor/DocumentUploader";
// import axios from "axios";
// import { useModal } from "../../../context/ModalProvider";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const PhotoGalaryForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { showModal } = useModal();

//   const [formData, setFormData] = useState({
//     title_en: "",
//     title_od: "",
//     category: "",
//     photoSourceType: "upload",
//     photoFile: null,
//     photoLink: "",
//   });

//   const [existingPhotoName, setExistingPhotoName] = useState("");
//   const [existingPhotoUrl, setExistingPhotoUrl] = useState("");
//   const [existingPhotoRemoved, setExistingPhotoRemoved] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/image-setup/all-categories`, {
//           withCredentials: true,
//         });
//         if (Array.isArray(res.data.data)) {
//           const filtered = res.data.data.filter(cat => cat.category_type === "photo");
//           setCategories(filtered);
//         }
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//         showModal("error", "Failed to fetch categories.");
//       }
//     };

//     fetchCategories();
//   }, [showModal]);

//   // Fetch existing photo data in edit mode
//   useEffect(() => {
//     if (!id) return;

//     const fetchPhoto = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/image-setup/photo/${id}`, {
//           withCredentials: true,
//         });

//         if (res.data.success && res.data.photo) {
//           const photo = res.data.photo;

//           const isUploaded = !!photo.photo; // Has filename, means uploaded
//           const isLinked = !photo.photo && !!photo.photo_url; // No filename, only link

//           setFormData({
//             title_en: photo.title_en || "",
//             title_od: photo.title_od || "",
//             category: photo.category_id || "",
//             photoSourceType: isUploaded ? "upload" : "link",
//             photoFile: null,
//             photoLink: isLinked ? photo.photo_url : "",
//           });

//           setExistingPhotoUrl(isUploaded ? photo.photo_url : "");
//           setExistingPhotoName(isUploaded ? photo.photo : "");
//           setExistingPhotoRemoved(false);
//         } else {
//           showModal("error", "Failed to load photo data");
//           navigate("/admin/image-setup/photo-galary");
//         }
//       } catch (error) {
//         console.error("Failed to fetch photo:", error);
//         showModal("error", "Error loading photo data");
//         navigate("/admin/image-setup/photo-galary");
//       }
//     };

//     fetchPhoto();
//   }, [id, navigate, showModal]);

//   const handleCancel = () => {
//     navigate("/admin/image-setup/photo-galary");
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "photoSourceType") {
//       setFormData((prev) => ({
//         ...prev,
//         photoSourceType: value,
//         photoFile: null,
//         photoLink: "",
//       }));
//       setErrors({});
//       setExistingPhotoName("");
//       setExistingPhotoUrl("");
//       setExistingPhotoRemoved(false);
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleFileChange = (file, validationError) => {
//     if (validationError) {
//       setFormData((prev) => ({ ...prev, photoFile: null }));
//       setErrors((prev) => ({ ...prev, photoFile: validationError }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         photoFile: file,
//         photoLink: "",
//       }));
//       setErrors((prev) => ({ ...prev, photoFile: "" }));
//       setExistingPhotoRemoved(false);
//     }
//   };

//   const handleFileRemove = () => {
//     setFormData((prev) => ({
//       ...prev,
//       photoFile: null,
//       photoLink: "",
//     }));
//     setErrors((prev) => ({ ...prev, photoFile: "" }));
//     setExistingPhotoName("");
//     setExistingPhotoUrl("");
//     setExistingPhotoRemoved(true);
//   };

//   const handleReset = () => {
//     setFormData({
//       title_en: "",
//       title_od: "",
//       category: "",
//       photoSourceType: "upload",
//       photoFile: null,
//       photoLink: "",
//     });
//     setErrors({});
//     setExistingPhotoName("");
//     setExistingPhotoUrl("");
//     setExistingPhotoRemoved(false);
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.title_en.trim()) newErrors.title_en = "Title (EN) is required";
//     if (!formData.title_od.trim()) newErrors.title_od = "Title (OD) is required";
//     if (!formData.category) newErrors.category = "Category is required";

//     if (
//       formData.photoSourceType === "upload" &&
//       !formData.photoFile &&
//       !existingPhotoUrl &&
//       !existingPhotoRemoved
//     ) {
//       newErrors.photoFile = "Please upload a photo";
//     }

//     if (formData.photoSourceType === "link" && !formData.photoLink.trim()) {
//       newErrors.photoLink = "Please provide a photo link";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setIsSubmitting(true);

//     try {
//       const form = new FormData();
//       form.append("title_en", formData.title_en);
//       form.append("title_od", formData.title_od);
//       form.append("category_id", formData.category);

//       if (formData.photoSourceType === "upload") {
//         if (formData.photoFile) {
//           form.append("photo", formData.photoFile);
//         } else if (id && existingPhotoRemoved) {
//           form.append("photo", "");
//         }
//       } else if (formData.photoSourceType === "link") {
//         form.append("photo_url", formData.photoLink);
//       }

//       const endpoint = id
//         ? `${API_BASE_URL}/image-setup/update-photo/${id}`
//         : `${API_BASE_URL}/image-setup/register-photo`;

//       const method = id ? axios.put : axios.post;

//       const res = await method(endpoint, form, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         showModal(
//           "success",
//           id ? "Photo updated successfully!" : "Photo uploaded successfully!"
//         );
//         navigate("/admin/image-setup/photo-galary");
//       } else {
//         showModal("error", res.data.message || "Something went wrong");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       showModal("error", "Failed to submit the form.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="mx-auto p-6 min-h-[80vh]">
//       <div className="bg-white p-6 rounded">
//         <Header
//           title={id ? "Edit Photo Gallery Item" : "Add Photo Gallery Item"}
//           onGoBack={handleCancel}
//         />

//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           {/* Title EN */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Title (In English)
//             </label>
//             <input
//               type="text"
//               name="title_en"
//               value={formData.title_en}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.title_en && (
//               <p className="text-red-600 text-sm">{errors.title_en}</p>
//             )}
//           </div>

//           {/* Title OD */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Title (In Odia)
//             </label>
//             <input
//               type="text"
//               name="title_od"
//               value={formData.title_od}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.title_od && (
//               <p className="text-red-600 text-sm">{errors.title_od}</p>
//             )}
//           </div>

//           {/* Category */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Category
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             >
//               <option value="">-- Select Category --</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.category_en}
//                 </option>
//               ))}
//             </select>
//             {errors.category && (
//               <p className="text-red-600 text-sm">{errors.category}</p>
//             )}
//           </div>

//           {/* Source Type */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Photo Source Type
//             </label>
//             <div className="flex space-x-6 mt-1">
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   name="photoSourceType"
//                   value="upload"
//                   checked={formData.photoSourceType === "upload"}
//                   onChange={handleChange}
//                 />
//                 <span className="ml-2">Upload File</span>
//               </label>
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   name="photoSourceType"
//                   value="link"
//                   checked={formData.photoSourceType === "link"}
//                   onChange={handleChange}
//                 />
//                 <span className="ml-2">Paste Link</span>
//               </label>
//             </div>
//           </div>

//           {/* Upload or Link */}
//           {formData.photoSourceType === "upload" ? (
//             <div className="mb-6">
//               <DocumentUploader
//                 label="Upload Photo"
//                 file={formData.photoFile}
//                 existingFileName={existingPhotoName}
//                 existingFileUrl={existingPhotoUrl}
//                 onFileChange={handleFileChange}
//                 onRemove={handleFileRemove}
//                 allowedTypes={["image/jpeg", "image/png", "image/webp"]}
//                 maxSizeMB={2}
//                 error={errors.photoFile}
//               />
//             </div>
//           ) : (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700">
//                 Paste Photo Link
//               </label>
//               <input
//                 type="text"
//                 name="photoLink"
//                 value={formData.photoLink}
//                 onChange={handleChange}
//                 placeholder="https://example.com/photo.jpg"
//                 className="mt-1 block w-full border rounded px-2 py-1"
//               />
//               {errors.photoLink && (
//                 <p className="text-red-600 text-sm">{errors.photoLink}</p>
//               )}
//             </div>
//           )}

//           {/* Buttons */}
//           <div className="flex space-x-2">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               {isSubmitting ? "Submitting..." : id ? "Update" : "Submit"}
//             </button>
//             <button
//               type="reset"
//               onClick={handleReset}
//               className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Reset
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PhotoGalaryForm;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../Components/Admin/Add/Header";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PhotoGalaryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState({
    title_en: "",
    title_od: "",
    category: "",
    photoSourceType: "upload",
    photoFile: null,
    photoLink: "",
  });

  const [existingPhotoName, setExistingPhotoName] = useState("");
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");
  const [existingPhotoRemoved, setExistingPhotoRemoved] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/image-setup/all-categories`, {
          withCredentials: true,
        });
        if (Array.isArray(res.data.data)) {
          const filtered = res.data.data.filter(cat => cat.category_type === "photo");
          setCategories(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        showModal("error", "Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, [showModal]);

  // Fetch existing photo data in edit mode
  useEffect(() => {
    if (!id) return;

    const fetchPhoto = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/image-setup/photo/${id}`, {
          withCredentials: true,
        });

        if (res.data.success && res.data.photo) {
          const photo = res.data.photo;

          const isUploaded = !!photo.photo; // Has filename, means uploaded
          const isLinked = !photo.photo && !!photo.photo_url; // No filename, only link

          setFormData({
            title_en: photo.title_en || "",
            title_od: photo.title_od || "",
            category: photo.category_id || "",
            photoSourceType: isUploaded ? "upload" : "link",
            photoFile: null,
            photoLink: isLinked ? photo.photo_url : "",
          });

          setExistingPhotoUrl(isUploaded ? photo.photo_url : "");
          setExistingPhotoName(isUploaded ? photo.photo : "");
          setExistingPhotoRemoved(false);
        } else {
          showModal("error", "Failed to load photo data");
          navigate("/admin/image-setup/photo-galary");
        }
      } catch (error) {
        console.error("Failed to fetch photo:", error);
        showModal("error", "Error loading photo data");
        navigate("/admin/image-setup/photo-galary");
      }
    };

    fetchPhoto();
  }, [id, navigate, showModal]);

  const handleCancel = () => {
    navigate("/admin/image-setup/photo-galary");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "photoSourceType") {
      setFormData((prev) => ({
        ...prev,
        photoSourceType: value,
        photoFile: null,
        photoLink: "",
      }));
      setErrors({});
      setExistingPhotoName("");
      setExistingPhotoUrl("");
      setExistingPhotoRemoved(false);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file, validationError) => {
    if (validationError) {
      setFormData((prev) => ({ ...prev, photoFile: null }));
      setErrors((prev) => ({ ...prev, photoFile: validationError }));
    } else {
      setFormData((prev) => ({
        ...prev,
        photoFile: file,
        photoLink: "",
      }));
      setErrors((prev) => ({ ...prev, photoFile: "" }));
      setExistingPhotoRemoved(false);
    }
  };

  const handleFileRemove = () => {
    setFormData((prev) => ({
      ...prev,
      photoFile: null,
      photoLink: "",
    }));
    setErrors((prev) => ({ ...prev, photoFile: "" }));
    setExistingPhotoName("");
    setExistingPhotoUrl("");
    setExistingPhotoRemoved(true);
  };

  const handleReset = () => {
    setFormData({
      title_en: "",
      title_od: "",
      category: "",
      photoSourceType: "upload",
      photoFile: null,
      photoLink: "",
    });
    setErrors({});
    setExistingPhotoName("");
    setExistingPhotoUrl("");
    setExistingPhotoRemoved(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title_en.trim()) newErrors.title_en = "Title (EN) is required";
    if (!formData.title_od.trim()) newErrors.title_od = "Title (OD) is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (
      formData.photoSourceType === "upload" &&
      !formData.photoFile &&
      !existingPhotoUrl &&
      !existingPhotoRemoved
    ) {
      newErrors.photoFile = "Please upload a photo";
    }

    if (formData.photoSourceType === "link" && !formData.photoLink.trim()) {
      newErrors.photoLink = "Please provide a photo link";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("title_en", formData.title_en);
      form.append("title_od", formData.title_od);
      form.append("category_id", formData.category);

      if (formData.photoSourceType === "upload") {
        if (formData.photoFile) {
          form.append("photo", formData.photoFile);
        } else if (id && existingPhotoRemoved) {
          form.append("photo", "");
        }
      } else if (formData.photoSourceType === "link") {
        form.append("photo_url", formData.photoLink);
      }

      const endpoint = id
        ? `${API_BASE_URL}/image-setup/update-photo/${id}`
        : `${API_BASE_URL}/image-setup/register-photo`;

      const method = id ? axios.put : axios.post;

      const res = await method(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        showModal(
          "success",
          id ? "Photo updated successfully!" : "Photo uploaded successfully!"
        );
        navigate("/admin/image-setup/photo-galary");
      } else {
        showModal("error", res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showModal("error", "Failed to submit the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header
          title={id ? "Edit Photo Gallery Item" : "Add Photo Gallery Item"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title EN */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title (In English)
            </label>
            <input
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.title_en && (
              <p className="text-red-600 text-sm">{errors.title_en}</p>
            )}
          </div>

          {/* Title OD */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title (In Odia)
            </label>
            <input
              type="text"
              name="title_od"
              value={formData.title_od}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.title_od && (
              <p className="text-red-600 text-sm">{errors.title_od}</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            >
              <option value="">-- Select Category --</option>
             {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_en}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm">{errors.category}</p>
            )}
          </div>

          {/* Source Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Photo Source Type
            </label>
            <div className="flex space-x-6 mt-1">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="photoSourceType"
                  value="upload"
                  checked={formData.photoSourceType === "upload"}
                  onChange={handleChange}
                />
                <span className="ml-2">Upload File</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="photoSourceType"
                  value="link"
                  checked={formData.photoSourceType === "link"}
                  onChange={handleChange}
                />
                <span className="ml-2">Paste Link</span>
              </label>
            </div>
          </div>

          {/* Upload or Link */}
          {formData.photoSourceType === "upload" ? (
            <div className="mb-6">
              <DocumentUploader
                label="Upload Photo"
                file={formData.photoFile}
                existingFileName={existingPhotoName}
                existingFileUrl={existingPhotoUrl}
                onFileChange={handleFileChange}
                onRemove={handleFileRemove}
                allowedTypes={["image/jpeg", "image/png", "image/webp"]}
                maxSizeMB={2}
                error={errors.photoFile}
              />
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Paste Photo Link
              </label>
              <input
                type="text"
                name="photoLink"
                value={formData.photoLink}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              {errors.photoLink && (
                <p className="text-red-600 text-sm">{errors.photoLink}</p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
            >
              {isSubmitting ? "Submitting..." : id ? "Update" : "Submit"}
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-1 rounded"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoGalaryForm;
