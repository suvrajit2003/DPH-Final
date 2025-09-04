import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../Components/Admin/Add/Header";
import DocumentUploader from '../../../Components/Admin/TextEditor/DocumentUploader';
import { useModal } from "../../../context/ModalProvider";

const HomePageBannerForm = () => {
  const [formData, setFormData] = useState({
    image: null,
    existingImageName: "",
    existingImageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track if existing image was removed
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { showModal } = useModal();

  const handleCancel = () => {
    navigate("/admin/image-setup/homepage-banner");
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchBanner = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/image-setup/homepage/banner/${id}`,
            { withCredentials: true }
          );
          const banner = res.data.banner;

          setFormData({
            image: null,
            existingImageName: banner.banner || "",
            existingImageUrl: banner.image_url || "",
          });
          setErrors({});
          setExistingImageRemoved(false);
        } catch (error) {
          console.error("Failed to fetch banner:", error);
          showModal("error", "Failed to fetch banner data.");
        }
      };
      fetchBanner();
    }
  }, [id, isEditMode, showModal]);

  const validate = () => {
    const newErrors = {};
    if (!formData.image && !formData.existingImageUrl && !isEditMode) {
      newErrors.image = "Banner image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (selectedFile, validationError) => {
    if (validationError) {
      setFormData(prev => ({ ...prev, image: null }));
      setErrors({ image: validationError });
    } else {
      setFormData(prev => ({
        ...prev,
        image: selectedFile,
        existingImageName: "",
        existingImageUrl: "",
      }));
      setErrors({});
      setExistingImageRemoved(false); // Since new file selected, existing image removal irrelevant
    }
  };

  const handleRemoveExisting = () => {
    setFormData(prev => ({
      ...prev,
      existingImageName: "",
      existingImageUrl: "",
    }));
    setErrors({});
    setExistingImageRemoved(true); // Mark existing image as removed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    const data = new FormData();

    if (formData.image) {
      // New image uploaded
      data.append("banner", formData.image);
    } else if (isEditMode && existingImageRemoved) {
      // In edit mode and existing image removed without new upload
      // Append empty string or null (empty string usually accepted in FormData)
      data.append("banner", "");
    }
    // If in edit mode and existing image is still there, no need to send banner field (backend keeps old)

    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/image-setup/update/homepage/banner/${id}`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Homepage banner updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/image-setup/upload/homepage/banner`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Homepage banner added successfully.");
      }

      navigate("/admin/image-setup/homepage-banner");
    } catch (error) {
      console.error("Error submitting banner:", error.response?.data || error.message);
      setErrors({ image: "Failed to submit the form. Please try again." });
      showModal("error", error.response?.data?.message || "Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      image: null,
      existingImageName: "",
      existingImageUrl: "",
    });
    setErrors({});
    setExistingImageRemoved(false);
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header
          title={isEditMode ? "Edit Homepage Banner" : "Add Homepage Banner"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <DocumentUploader
              label="Upload Banner Image"
              file={formData.image}
              existingFileName={formData.existingImageName}
              existingFileUrl={formData.existingImageUrl}
              onFileChange={handleFileChange}
              onRemove={handleRemoveExisting}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={10}
              error={errors.image}
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
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

export default HomePageBannerForm;
