import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// External components
import RichTextEditor from "@/Components/Admin/TextEditor/RichTextEditor";
import FormField from "@/Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";
import { ModalDialog } from "@/Components/Admin/Modal/MessageModal.jsx";
import Header from "@/Components/Admin/Add/Header.jsx";
import FormActions from "@/Components/Admin/Add/FormActions";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DescriptionFields = memo(({ formData, onInputChange, errors }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
    {/* English Description */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In English) <span className="text-red-500">*</span>
      </label>
      <div
        className={`rounded-md border ${
          errors?.descriptionEnglish ? "border-red-500" : "border-gray-300"
        }`}
      >
        <RichTextEditor
          value={formData.descriptionEnglish}
          onChange={(val) => onInputChange("descriptionEnglish", val)}
          placeholder="Enter description..."
        />
      </div>
      {errors?.descriptionEnglish && (
        <p className="mt-1 text-xs text-red-600">{errors.descriptionEnglish}</p>
      )}
    </div>

    {/* Odia Description */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In Odia) <span className="text-red-500">*</span>
      </label>
      <div
        className={`rounded-md border ${
          errors?.descriptionOdia ? "border-red-500" : "border-gray-300"
        }`}
      >
        <RichTextEditor
          value={formData.descriptionOdia}
          onChange={(val) => onInputChange("descriptionOdia", val)}
          placeholder="Enter description..."
        />
      </div>
      {errors?.descriptionOdia && (
        <p className="mt-1 text-xs text-red-600">{errors.descriptionOdia}</p>
      )}
    </div>
  </div>
));

const AddMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    titleEnglish: "",
    titleOdia: "",
    descriptionEnglish: "",
    descriptionOdia: "",
    link: "",
    image: null, // File or null
  });

  const [existingImageInfo, setExistingImageInfo] = useState({
    name: "",
    url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const fetchMenuData = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/menus/${id}`, {
            withCredentials: true,
          });
          const menu = res.data;
          setFormData({
            titleEnglish: menu.title_en || "",
            titleOdia: menu.title_od || "",
            descriptionEnglish: menu.description_en || "",
            descriptionOdia: menu.description_od || "",
            link: menu.link || "",
            image: null,
          });

          if (menu.image_url) {
            const urlParts = menu.image_url.split("/");
            setExistingImageInfo({
              name: urlParts[urlParts.length - 1],
              url: `${API_BASE_URL}${menu.image_url}`,
            });
          }
        } catch (error) {
          console.error("Failed to fetch menu data:", error);
          setModalVariant("error");
          setModalMessage("Could not load menu data for editing.");
          setModalOpen(true);
          navigate("/admin/menusetup/menu");
        } finally {
          setIsLoading(false);
        }
      };
      fetchMenuData();
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageChange = useCallback((file, error) => {
    if (error) {
      setErrors((prev) => ({ ...prev, image: error }));
      return;
    }
    setErrors((prev) => ({ ...prev, image: "" }));
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setExistingImageInfo({ name: "", url: "" });
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, image: null }));
    setExistingImageInfo({ name: "", url: "" });
    setErrors((prev) => ({ ...prev, image: "" }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let newErrors = {};

    if (!formData.titleEnglish.trim())
      newErrors.titleEnglish = "Title (In English) is required";
    if (!formData.titleOdia.trim())
      newErrors.titleOdia = "Title (In Odia) is required";
    if (!formData.descriptionEnglish.trim())
      newErrors.descriptionEnglish = "Description (In English) is required";
    if (!formData.descriptionOdia.trim())
      newErrors.descriptionOdia = "Description (In Odia) is required";
    if (!formData.image && !isEditMode)
      newErrors.image = "Image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("title_en", formData.titleEnglish);
    data.append("title_od", formData.titleOdia);
    data.append("description_en", formData.descriptionEnglish);
    data.append("description_od", formData.descriptionOdia);
    data.append("link", formData.link || "");

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    if (isEditMode && !formData.image && !existingImageInfo.url) {
      data.append("remove_image", "true");
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/api/menus/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setModalVariant("success");
        setModalMessage("Menu updated successfully!");
        setModalOpen(true);
      } else {
        await axios.post(`${API_BASE_URL}/api/menus`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setModalVariant("success");
        setModalMessage("Menu added successfully!");
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      setModalVariant("error");
      setModalMessage(errorMessage);
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      titleEnglish: "",
      titleOdia: "",
      descriptionEnglish: "",
      descriptionOdia: "",
      link: "",
      image: null,
    });
    setExistingImageInfo({ name: "", url: "" });
    setErrors({});
  };

  const handleGoBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header
        title={isEditMode ? "Edit Menu" : "Add Menu"}
        onGoBack={handleGoBack}
      />

      {isLoading ? (
        <div className="text-center p-10 font-semibold">Loading Form Data...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              label="Title (In English)"
              placeholder="Enter title in English"
              value={formData.titleEnglish}
              onChange={(val) => handleInputChange("titleEnglish", val)}
              required
              error={errors?.titleEnglish}
            />
            <FormField
              label="Title (In Odia)"
              placeholder="Enter title in Odia"
              value={formData.titleOdia}
              onChange={(val) => handleInputChange("titleOdia", val)}
              required
              error={errors?.titleOdia}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:col-span-2">
              <DocumentUploader
                label="Upload Image"
                file={formData.image}
                existingFileName={existingImageInfo.name}
                existingFileUrl={existingImageInfo.url}
                onFileChange={handleImageChange}
                onRemove={handleRemoveImage}
                error={errors.image}
                allowedTypes={[
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/webp",
                  "image/gif",
                ]}
                maxSizeMB={5}
              />

              <FormField
                label="Link (Optional)"
                placeholder="https://example.com"
                value={formData.link}
                onChange={(val) => handleInputChange("link", val)}
                type="url"
              />
            </div>
          </div>

          <DescriptionFields
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />

          <FormActions
            onReset={handleReset}
            onCancel={handleGoBack}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        </form>
      )}

      <ModalDialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (modalVariant === "success") {
            navigate("/admin/menusetup/menu", { state: { updated: true } });
          }
        }}
        variant={modalVariant}
        message={modalMessage}
      />
    </div>
  );
};

export default AddMenu;
