// import React, { useState, useEffect } from "react";
// import Header from "../../../Components/Add/Header";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import DocumentUploader from "../../../Components/TextEditor/DocumentUploader"; 
// import { EyeIcon } from "@heroicons/react/24/outline";



// const GenerateLinkForm = () => {
//   const [title, setTitle] = useState("");
//   const [file, setFile] = useState(null);
//   const [existingFile, setExistingFile] = useState("");
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   // ✅ Fetch existing record for edit
//   useEffect(() => {
//     if (id) {
//       axios
//         .get(`http://localhost:5000/api/generated-links/${id}`)
//         .then((res) => {
//           setTitle(res.data.title || "");
//           setExistingFile(res.data.file || "");
//         })
//         .catch((err) => console.error("Error fetching link:", err));
//     }
//   }, [id]);

//   // ✅ Handle file change from DocumentUploader
//   const handleFileChange = (selectedFile, validationError) => {
//     if (validationError) {
//       setError(validationError);
//       setFile(null);
//     } else {
//       setError(null);
//       setFile(selectedFile);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       setError("Title is required.");
//       return;
//     }
//     if (!id && !file) {
//       setError("File is required.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       if (file) formData.append("file", file);

//       if (id) {
//         await axios.put(
//           `http://localhost:5000/api/generated-links/${id}`,
//           formData
//         );
//         alert("✅ Link updated successfully!");
//       } else {
//         await axios.post(
//           "http://localhost:5000/api/generated-links",
//           formData
//         );
//         alert("✅ Link created successfully!");
//       }

//       navigate("/admin/generate-link");
//     } catch (err) {
//       console.error("Error saving link:", err.response || err);
//       alert("Something went wrong! Check backend logs.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setTitle("");
//     setFile(null);
//     setError(null);
//   };

//   return (
//     <div className="mx-auto p-6 min-h-[80vh] bg-white shadow-md rounded-md">
//       <Header
//         title={id ? "Edit File" : "Generate Link"}
//         onGoBack={() => navigate("/admin/generate-link")}
//       />

//       <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
//         {/* Title */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
//             required
//           />
//         </div>
// <div className="flex items-center gap-3">
//   <DocumentUploader
//     label="Upload Document"
//     file={file}
//     error={error}
//     existingFileName={existingFile ? existingFile.split("-").slice(1).join("-") : ""}
//     existingFileUrl={
//       existingFile
//         ? `http://localhost:5000/uploads/generated-links/${existingFile}`
//         : ""
//     }
//     onFileChange={handleFileChange}
//     onRemove={() => setExistingFile("")}
//     maxSizeMB={10}
//   />

//   {/* 👁️ Show EyeIcon only if editing (existingFile available) */}
//   {existingFile && (
//      <a
//       href={`http://localhost:5000/uploads/generated-links/${existingFile}`}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-blue-600 hover:text-blue-800"
//       title="View File"
//     >
//       <EyeIcon className="h-6 w-6" />
//     </a>
//   )}
// </div>


//         {/* Buttons */}
//         <div className="col-span-2 flex gap-3 mt-4">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
//           >
//             {id ? "Update" : "Submit"}
//           </button>

//           <button
//             type="button"
//             onClick={handleReset}
//             className="px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-500 text-white"
//           >
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/admin/generate-link")}
//             className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default GenerateLinkForm;


import React, { useState, useEffect } from "react";
import Header from "../../../Components/Admin/Add/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";
import { useModal } from "@/context/ModalProvider";

const GenerateLinkForm = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState(""); 
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const {showModal}= useModal()

  useEffect(() => {
    if (id) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/generated-links/${id}`)
        .then((res) => {
          setTitle(res.data.title || "");
          setExistingFile(res.data.filePath || ""); 
        })
        .catch((err) => console.error("Error fetching link:", err));
    }
  }, [id]);

  const handleFileChange = (selectedFile, validationError) => {
    if (validationError) {
      setError(validationError);
      setFile(null);
    } else {
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim())  setError("Title is required.");
    if (!file)  setError("File is required.");

    if(!title || !file) return

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (file) formData.append("file", file);

      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/generated-links/${id}`,
          formData
        );
        showModal("success", "Link updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/generated-links`,
          formData
        );
        showModal("success","Link created successfully!");
      }

      navigate("/admin/generate-link");
    } catch (err) {
      console.error("Error saving link:", err.response || err);
      showModal("error", "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setFile(null);
    setExistingFile("");
    setError(null);
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh] bg-white shadow-md rounded-md">
      <Header
        title={id ? "Edit File" : "Generate Link"}
        onGoBack={() => navigate("/admin/generate-link")}
      />

<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
  {/* Title */}
  <div>
    <FormField
      label="Title"
      placeholder="Enter title"
      type="text"
      value={title}
      onChange={setTitle}
      required={true}
      error={error}
    />
  </div>

  {/* File Upload */}
  <div className="flex items-center gap-3">
    <DocumentUploader
      label="Upload Document"
      file={file}
      error={error}
      existingFileName={
        existingFile ? existingFile.split("-").slice(1).join("-") : ""
      }
      existingFileUrl={
        `${import.meta.env.VITE_API_BASE_URL}/uploads/generated-links/${existingFile}`
      }
      onFileChange={handleFileChange}
      maxSizeMB={2}
    />
  </div>

  <FormActions
    disabled={isSubmitting}
    onReset={handleReset}
    onCancel={() => navigate("/admin/generate-link")}
  />
</form>

    </div>
  );
};

export default GenerateLinkForm;

