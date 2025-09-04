
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

// ✅ Description fields component (with error styling)
const DescriptionFields = memo(({ formData, onInputChange, errors }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
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

// ✅ Main AddSubMenu component
const AddSubMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    menuId: "",
    titleEnglish: "",
    titleOdia: "",
    descriptionEnglish: "",
    descriptionOdia: "",
    link: "",
    image: null,
  });

  const [existingImageInfo, setExistingImageInfo] = useState({
    name: "",
    url: "",
  });

  const [parentMenus, setParentMenus] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  // ✅ Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const menusResponse = await axios.get(`${API_BASE_URL}/api/submenus/menu-list`, {
          withCredentials: true,
        });
        setParentMenus(menusResponse.data.data || []);

        if (isEditMode) {
          const res = await axios.get(`${API_BASE_URL}/api/submenus/${id}`, {
            withCredentials: true,
          });
          const subMenu = res.data;

          setFormData({
            menuId: subMenu.menuId || "",
            titleEnglish: subMenu.title_en || "",
            titleOdia: subMenu.title_od || "",
            descriptionEnglish: subMenu.description_en || "",
            descriptionOdia: subMenu.description_od || "",
            link: subMenu.link || "",
            image: null,
          });

          if (subMenu.image_url) {
            const urlParts = subMenu.image_url.split("/");
            setExistingImageInfo({
              name: urlParts[urlParts.length - 1],
              url: `${API_BASE_URL}${subMenu.image_url}`,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setModalVariant("error");
        setModalMessage("Could not load data.");
        setModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [id, isEditMode]);

  // ✅ Handlers
  const handleInputChange = useCallback((field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
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

    if (!formData.menuId) newErrors.menuId = "Parent Menu is required";
    if (!formData.titleEnglish.trim())
      newErrors.titleEnglish = "Title (In English) is required";
    if (!formData.titleOdia.trim())
      newErrors.titleOdia = "Title (In Odia) is required";
    if (!formData.image && !isEditMode)
      newErrors.image = "Image is required";
    if (!formData.descriptionEnglish.trim())
      newErrors.descriptionEnglish = "Description (In English) is required";
    if (!formData.descriptionOdia.trim())
      newErrors.descriptionOdia = "Description (In Odia) is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("menuId", formData.menuId);
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
        await axios.put(`${API_BASE_URL}/api/submenus/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setModalVariant("success");
        setModalMessage("SubMenu updated successfully!");
        setModalOpen(true);
      } else {
        await axios.post(`${API_BASE_URL}/api/submenus`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setModalVariant("success");
        setModalMessage("SubMenu added successfully!");
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalVariant("error");
      setModalMessage(error.response?.data?.message || "An error occurred.");
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      menuId: "",
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
      <Header title={isEditMode ? "Edit SubMenu" : "Add SubMenu"} onGoBack={handleGoBack} />

      {isLoading ? (
        <div className="text-center p-10 font-semibold">Loading Form Data...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Parent Menu Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Parent Menu <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.menuId}
                onChange={(e) => handleInputChange("menuId", e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.menuId ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              >
                <option value="">-- Select a Menu --</option>
                {parentMenus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.title_en}
                  </option>
                ))}
              </select>
              {errors.menuId && (
                <p className="mt-1 text-xs text-red-600">{errors.menuId}</p>
              )}
            </div>

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

          {/* Description fields */}
          <DescriptionFields
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />

          {/* Actions */}
          <FormActions
            onReset={handleReset}
            onCancel={handleGoBack}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        </form>
      )}

      {/* Modal */}
      <ModalDialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (modalVariant === "success") {
            navigate("/admin/menusetup/submenu", { state: { updated: true } });
          }
        }}
        variant={modalVariant}
        message={modalMessage}
      />
    </div>
  );
};

export default AddSubMenu;
