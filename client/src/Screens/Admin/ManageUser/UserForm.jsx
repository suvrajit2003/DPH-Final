// // src/pages/UserManagement/UserForm.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "../../../Components/Add/Header";
// import { useNavigate, useParams } from "react-router-dom";
// import { useModal } from "../../../context/ModalProvider";

// const UserForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     profilePic: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = Boolean(id);
//   const {showModal} = useModal()

//   useEffect(() => {
//     if (isEditMode) {
//       const fetchUserData = async () => {
//         try {
//           const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`, {
//             withCredentials: true,
//           });

//           const user = res.data.user;

//           setFormData({
//             name: user.name || "",
//             email: user.email || "",
//             mobile: user.mobile || "",
//             profilePic: null, // Reset image, user can upload new
//           });
//         } catch (error) {
//           console.error("Failed to fetch user data:", error);
//         }
//       };
//       fetchUserData();
//     }
//   }, [id, isEditMode]);

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Full name is required.";
//     } else if (!/^[A-Za-z\s]{2,}$/.test(formData.name)) {
//       newErrors.name = "Name must contain only letters and be at least 2 characters.";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required.";
//     } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
//       newErrors.email = "Email is invalid.";
//     }

//     if (!formData.mobile.trim()) {
//       newErrors.mobile = "Mobile number is required.";
//     } else if (!/^\d{10}$/.test(formData.mobile)) {
//       newErrors.mobile = "Mobile number must be exactly 10 digits.";
//     }

//     if (!formData.profilePic && !isEditMode) {
//       newErrors.profilePic = "Profile image is required.";
//     } else if (formData.profilePic && !formData.profilePic.type.startsWith("image/")) {
//       newErrors.profilePic = "Only image files are allowed.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "file" ? files[0] : value,
//     }));

//     // Clear the error for the field when user changes it
//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     setIsSubmitting(true);
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     data.append("mobile", formData.mobile);
//     if (formData.profilePic) data.append("profilePic", formData.profilePic);

//     try {
//       if (isEditMode) {
//         await axios.put(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`, data, {
//           withCredentials: true,
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/register`, data, {
//           withCredentials: true,
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }
//       navigate("/admin/user-management/users");
//     } catch (error) {
//       console.error("Error submitting form:", error.response?.data || error.message);
//       showModal("error", error.response?.data?.message || error.response?.data?.error )
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       name: "",
//       email: "",
//       mobile: "",
//       profilePic: null,
//     });
//     setErrors({});
//   };

//   const handleCancel = () => {
//     navigate("/admin/user-management/users");
//   };

//   return (
//     <div className="mx-auto p-6 min-h-[80vh]">
//       <div className="bg-white p-6 rounded">
//         <Header title={isEditMode ? "Edit User" : "Create User"} onGoBack={handleCancel} />

//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 required
//               />
//               {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 required
//               />
//               {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
//             </div>

//             {/* Mobile */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Mobile No</label>
//               <input
//                 type="text"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 required
//               />
//               {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>}
//             </div>

//             {/* Profile Pic */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Upload Image</label>
//               <input
//                 type="file"
//                 name="profilePic"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="mt-1 block w-full"
//               />
//               {errors.profilePic && <p className="text-red-600 text-sm mt-1">{errors.profilePic}</p>}
//             </div>
//           </div>

//           <div className="flex space-x-2">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
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

// export default UserForm;


import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../Components/Admin/Add/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../../context/ModalProvider";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: null,
    existingImageName: "",
    existingImageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { showModal } = useModal();

  useEffect(() => {
    if (isEditMode) {
      const fetchUserData = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`,
            { withCredentials: true }
          );

          const user = res.data.user;

          setFormData({
            name: user.name || "",
            email: user.email || "",
            mobile: user.mobile || "",
            profilePic: null,
            existingImageName: user.profilePic || "",
            existingImageUrl: user.profilePicUrl || "", // use profilePicUrl directly here
          });

          setExistingImageRemoved(false);
          setError(null);
          setErrors({});
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          showModal("error", "Failed to load user data.");
        }
      };

      fetchUserData();
    }
  }, [id, isEditMode, showModal]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (!/^[A-Za-z\s]{2,}$/.test(formData.name)) {
      newErrors.name = "Name must contain only letters and be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }

    if (!formData.profilePic && !formData.existingImageUrl && !isEditMode) {
      newErrors.profilePic = "Profile image is required.";
    } else if (
      formData.profilePic &&
      !formData.profilePic.type.startsWith("image/")
    ) {
      newErrors.profilePic = "Only image files are allowed.";
    }

    setErrors(newErrors);
    if (!newErrors.profilePic) setError(null);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (selectedFile, validationError) => {
    if (validationError) {
      setFormData((prev) => ({ ...prev, profilePic: null }));
      setError(validationError);
      setErrors((prev) => ({ ...prev, profilePic: validationError }));
    } else {
      setFormData((prev) => ({
        ...prev,
        profilePic: selectedFile,
        existingImageName: "",
        existingImageUrl: "",
      }));
      setExistingImageRemoved(false); // reset removed flag when new file selected
      setError(null);
      setErrors((prev) => ({ ...prev, profilePic: "" }));
    }
  };

  const handleRemoveExisting = () => {
    setFormData((prev) => ({
      ...prev,
      existingImageName: "",
      existingImageUrl: "",
    }));
    setExistingImageRemoved(true); // mark existing image as removed
    setError(null);
    setErrors((prev) => ({ ...prev, profilePic: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);

    if (formData.profilePic) {
      // New file uploaded
      data.append("profilePic", formData.profilePic);
    } else if (isEditMode && existingImageRemoved) {
      // Existing image removed, no new file uploaded, send empty string to remove image on backend
      data.append("profilePic", "");
    }
    // else: existing image kept, send nothing for profilePic (backend keeps old)

    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "User updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/admin/register`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "User created successfully.");
      }

      navigate("/admin/user-management/users");
    } catch (error) {
      console.error("Error submitting form:", error);
      showModal(
        "error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to submit the form."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      profilePic: null,
      existingImageName: "",
      existingImageUrl: "",
    });
    setErrors({});
    setError(null);
    setExistingImageRemoved(false);
  };

  const handleCancel = () => {
    navigate("/admin/user-management/users");
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header
          title={isEditMode ? "Edit User" : "Create User"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile No
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.mobile && (
                <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Profile Pic */}
            <div>
              <DocumentUploader
                label="Upload Profile Image"
                file={formData.profilePic}
                existingFileName={formData.existingImageName}
                existingFileUrl={formData.existingImageUrl}
                onFileChange={handleFileChange}
                onRemove={handleRemoveExisting}
                allowedTypes={["image/jpeg", "image/png", "image/webp"]}
                maxSizeMB={10}
                error={errors.profilePic || error}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isEditMode ? "Update" : "Submit"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
