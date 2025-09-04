
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import importantLinksAPI from "../../../services/importantLinksAPI";
import FormField from "../../../Components/Admin/TextEditor/FormField";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";

const AddImportantLink = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({ title: "", url: "", image: null });
  const [preview, setPreview] = useState("");
  const [existingImageName, setExistingImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  // ✅ Extract filename from URL/path
  const extractFileName = (url) => {
    if (!url) return "";
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  // ✅ Image URL helper
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    return `${base}/uploads/important-links/${img.replace(/^\/+/, "")}`;
  };

  // ✅ Edit mode data fetch
  useEffect(() => {
    if (!isEdit) return;
    importantLinksAPI.get(id).then((res) => {
      const link = res.data?.link || res.data;
      setFormData({ title: link.title, url: link.url, image: null });
      if (link.image) {
        const imageUrl = getImageUrl(link.image);
        setPreview(imageUrl);
        setExistingImageName(extractFileName(link.image));
      }
    });
  }, [id, isEdit]);

  // ✅ Show modal function
  const showModal = (variant, message) => {
    setModalVariant(variant);
    setModalMessage(message);
    setModalOpen(true);
  };

  // ✅ Dynamic fields config
  const fields = [
    {
      name: "title",
      label: "Title",
      placeholder: "Enter link title",
      required: true,
      type: "text",
    },
    {
      name: "url",
      label: "URL",
      placeholder: "https://example.com",
      required: true,
      type: "url",
    },
  ];

  // ✅ Validation
  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.url.trim()) {
      errs.url = "URL is required";
    } else if (!/^https?:\/\/.+/i.test(formData.url)) {
      errs.url = "Enter a valid URL";
    }

    if (!isEdit && !formData.image) {
      errs.image = "File not uploaded";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ✅ Handle file upload through DocumentUploader
  const handleFileUpload = (file, error) => {
    if (error) {
      setErrors(prev => ({ ...prev, image: error }));
      setFormData(prev => ({ ...prev, image: null }));
      setPreview("");
      return;
    }
    
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      setShouldDeleteImage(false); // Reset delete flag if new file is uploaded
      
      // Clear image error if any
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }));
      }
    } else {
      setFormData(prev => ({ ...prev, image: null }));
      setPreview("");
    }
  };

  // ✅ Image Remove
  const removeImage = () => {
    setFormData((p) => ({ ...p, image: null }));
    setPreview("");
    setExistingImageName("");
    setShouldDeleteImage(true); // Set flag to delete image from server
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("url", formData.url);
      
      // For edit mode, include flag to delete existing image if needed
      if (isEdit) {
        fd.append("shouldDeleteImage", shouldDeleteImage);
      }
      
      if (formData.image) fd.append("image", formData.image);

      if (isEdit) {
        await importantLinksAPI.update(id, fd);
        showModal("success", "Link updated successfully!");
      } else {
        await importantLinksAPI.create(fd);
        showModal("success", "Link created successfully!");
      }

      // Navigate after success
      setTimeout(() => {
        navigate("/admin/image-setup/important-links");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      
      if (errorMsg.includes("duplicate") || errorMsg.includes("already exists")) {
        showModal("error", "A link with this URL already exists!");
      } else {
        showModal("error", "Failed: " + errorMsg);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-6 font-sans bg-gray-100">
      {/* Modal Dialog */}
      <ModalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        message={modalMessage}
      />

      <div className="container mx-auto bg-white shadow-lg p-8 rounded-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Important Link" : "Add Important Link"}
          </h2>
          <button
            onClick={() => navigate("/admin/image-setup/important-links")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-lg transition-colors"
          >
            ← Go Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* ✅ Render Dynamic Fields */}
          {fields.map((f) => (
            <FormField
              key={f.name}
              label={f.label}
              placeholder={f.placeholder}
              type={f.type}
              required={f.required}
              value={formData[f.name]}
              onChange={(val) => setFormData((p) => ({ ...p, [f.name]: val }))}
              error={errors[f.name]}
              disabled={loading}
            />
          ))}

          {/* ✅ Replaced Image Upload with DocumentUploader */}
          <DocumentUploader
            label="Upload Image"
            file={formData.image}
            existingFileName={existingImageName}
            existingFileUrl={preview}
            onFileChange={handleFileUpload}
            onRemove={removeImage}
            allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
            maxSizeMB={5}
            error={errors.image}
          />

          {/* ✅ Buttons */}
          <div className="flex gap-4 pt-6 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/image-setup/important-links")}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            {!isEdit && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ title: "", url: "", image: null });
                  setPreview("");
                  setErrors({});
                }}
                className="px-5 py-2.5 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                disabled={loading}
                >
                Reset
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddImportantLink;

