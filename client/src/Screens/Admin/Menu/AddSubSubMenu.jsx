
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Shared components
import Header from "@/Components/Admin/Add/Header";
import FormActions from "@/Components/Admin/Add/FormActions";
import RichTextEditor from "@/Components/Admin/TextEditor/RichTextEditor";
import FormField from "@/Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";
import { ModalDialog } from "@/Components/Admin/Modal/MessageModal.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddSubSubMenuForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

const [isImageRemoved, setIsImageRemoved] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    menu: "",
    subMenuId: "",
    titleEnglish: "",
    titleOdia: "",
    link: "",
    image: null,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    descriptionEnglish: "",
    descriptionOdia: "",
  });

  const [existingImageInfo, setExistingImageInfo] = useState({
    name: "",
    url: "",
  });

  const [errors, setErrors] = useState({});
  const [menus, setMenus] = useState([]);
  const [subMenus, setSubMenus] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [menusRes, subMenusRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/menus`,{withCredentials:true}),
          axios.get(`${API_BASE_URL}/api/submenus`,{withCredentials:true}),
        ]);

        setMenus(menusRes.data.data || []);
        setSubMenus(subMenusRes.data.data || []);

        if (isEditMode) {
          const res = await axios.get(`${API_BASE_URL}/api/subsubmenus/${id}`,{withCredentials:true});
          const data = res.data;

          const parentSubMenu = (subMenusRes.data.data || []).find(
            (sm) => sm.id === data.subMenuId
          );

          setFormData({
            menu: parentSubMenu ? parentSubMenu.menuId : "",
            subMenuId: data.subMenuId,
            titleEnglish: data.title_en || "",
            titleOdia: data.title_od || "",
            descriptionEnglish: data.description_en || "",
            descriptionOdia: data.description_od || "",
            link: data.link || "",
            metaTitle: data.meta_title || "",
            metaKeyword: data.meta_keyword || "",
            metaDescription: data.meta_description || "",
            image: null,
          });

          if (data.image_url) {
            const parts = data.image_url.split("/");
            const fileName = parts[parts.length - 1];

            
            setExistingImageInfo({
              name: fileName,
              url: `${API_BASE_URL}${data.image_url}`,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching:", err);
        setModalVariant("error");
        setModalMessage("Could not load data.");
        setModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditMode]);

  // Handle change
  const handleInputChange = useCallback((field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "menu") {
      setFormData((prev) => ({ ...prev, [field]: value, subMenuId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleImageChange = useCallback((file, error) => {
    if (error) {
      setErrors((prev) => ({ ...prev, image: error }));
      return;
    }
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) setExistingImageInfo({ name: "", url: "" });
    setIsImageRemoved(false); 
  }, []);
  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, image: null }));
    setExistingImageInfo({ name: "", url: "" });
      setIsImageRemoved(true);   
  }, []);

  const filteredSubMenus = useMemo(() => {
    if (!formData.menu) return [];
    return subMenus.filter((sm) => sm.menuId === parseInt(formData.menu, 10));
  }, [formData.menu, subMenus]);

  // Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.menu) errs.menu = "Menu is required";
    if (!formData.subMenuId) errs.subMenuId = "SubMenu is required";
    if (!formData.titleEnglish.trim())
      errs.titleEnglish = "Title (English) is required";
    if (!formData.titleOdia.trim())
      errs.titleOdia = "Title (Odia) is required";
     if (!formData.image && !isEditMode )
      errs.image = "Image is required";
    if (!formData.descriptionEnglish.trim())
      errs.descriptionEnglish = "Description (English) is required";
    if (!formData.descriptionOdia.trim())
      errs.descriptionOdia = "Description (Odia) is required";
    return errs;
  };

  // Reset
  const handleReset = () => {
    setFormData({
      menu: "",
      subMenuId: "",
      titleEnglish: "",
      titleOdia: "",
      link: "",
      image: null,
      metaTitle: "",
      metaKeyword: "",
      metaDescription: "",
      descriptionEnglish: "",
      descriptionOdia: "",
    });
    setExistingImageInfo({ name: "", url: "" });
    setErrors({});
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const dataToSubmit = new FormData();
    dataToSubmit.append("subMenuId", formData.subMenuId);
    dataToSubmit.append("title_en", formData.titleEnglish);
    dataToSubmit.append("title_od", formData.titleOdia);
    dataToSubmit.append("description_en", formData.descriptionEnglish);
    dataToSubmit.append("description_od", formData.descriptionOdia);
    dataToSubmit.append("link", formData.link);
    dataToSubmit.append("meta_title", formData.metaTitle);
    dataToSubmit.append("meta_keyword", formData.metaKeyword);
    dataToSubmit.append("meta_description", formData.metaDescription);

    if (formData.image instanceof File) {
      dataToSubmit.append("image", formData.image);
    }
    // if (isEditMode && !formData.image && !existingImageInfo.url) {
    //   dataToSubmit.append("remove_image", "true");
    // }
    if (isEditMode && isImageRemoved) {
  dataToSubmit.append("remove_image", "true");   // ✅ send explicit flag
}

    try {
      const url = isEditMode
        ? `${API_BASE_URL}/api/subsubmenus/${id}`
        : `${API_BASE_URL}/api/subsubmenus`;
      const method = isEditMode ? "put" : "post";

      await axios[method](url, dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },withCredentials:true
      });

      setModalVariant("success");
      setModalMessage(
        `Sub-SubMenu ${isEditMode ? "updated" : "added"} successfully!`
      );
      setModalOpen(true);
      setTimeout(() => navigate("/admin/menusetup/subsubmenu"), 1000);
    } catch (err) {
      console.error("Error submitting:", err);
      setModalVariant("error");
      setModalMessage(err.response?.data?.message || "An error occurred.");
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header
        title={isEditMode ? "Edit Sub-SubMenu" : "Add Sub-SubMenu"}
        onGoBack={handleGoBack}
      />

      {isLoading ? (
        <div className="text-center p-10 font-semibold">Loading Form...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">

   
            {/* Menu & SubMenu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Menu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.menu}
                  onChange={(e) => handleInputChange("menu", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.menu ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Select a Menu --</option>
                  {menus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.title_en}
                    </option>
                  ))}
                </select>
                {errors.menu && (
                  <p className="text-xs text-red-600 mt-1">{errors.menu}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select SubMenu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subMenuId}
                  onChange={(e) =>
                    handleInputChange("subMenuId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.subMenuId ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={!formData.menu}
                >
                  <option value="">-- Select a SubMenu --</option>
                  {filteredSubMenus.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.title_en}
                    </option>
                  ))}
                </select>
                {errors.subMenuId && (
                  <p className="text-xs text-red-600 mt-1">{errors.subMenuId}</p>
                )}
              </div>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Title (In English)"
                required
                value={formData.titleEnglish}
                onChange={(val) => handleInputChange("titleEnglish", val)}
                error={errors.titleEnglish}
              />
              <FormField
                label="Title (In Odia)"
                required
                value={formData.titleOdia}
                onChange={(val) => handleInputChange("titleOdia", val)}
                error={errors.titleOdia}
              />
            </div>

         <div className="grid grid-cols-2 gap-6" >

          
            {/* Image */}
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
                "image/gif",
                "image/webp",
              ]}
              maxSizeMB={5}
            />
             {/* Link */}
            <FormField
              label="Link (Optional)"
              value={formData.link}
              onChange={(val) => handleInputChange("link", val)}
            />

         </div>

            {/* Descriptions */}
{/* Descriptions */}
<div>
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
      onChange={(val) => handleInputChange("descriptionEnglish", val)}
      placeholder="Enter description..."
    />
  </div>
  {errors.descriptionEnglish && (
    <p className="mt-1 text-xs text-red-600">{errors.descriptionEnglish}</p>
  )}
</div>

<div>
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
      onChange={(val) => handleInputChange("descriptionOdia", val)}
      placeholder="Enter description..."
    />
  </div>
  {errors.descriptionOdia && (
    <p className="mt-1 text-xs text-red-600">{errors.descriptionOdia}</p>
  )}
</div>


            {/* Meta info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Meta Title"
                value={formData.metaTitle}
                onChange={(val) => handleInputChange("metaTitle", val)}
              />
              <FormField
                label="Meta Keywords"
                value={formData.metaKeyword}
                onChange={(val) => handleInputChange("metaKeyword", val)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  handleInputChange("metaDescription", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
              />
            </div>
          {/* </div> */}

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
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        message={modalMessage}
      />
    </div>
  );
};

export default AddSubSubMenuForm;
