
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../Components/Admin/Add/Header";
import FormActions from "../../../Components/Admin/Add/FormActions";
import { useNavigate, useParams } from "react-router-dom";
import {useModal}  from "../../../context/ModalProvider"


const PageForm = () => {
  const [formData, setFormData] = useState({
    pageName: "",
    shortCode: "",
    remarks: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

const {showModal} = useModal()

  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = Boolean(id); 

  useEffect(() => {
    if (isEditMode) {
      const fetchPageData = async () => {
        try {
          const res = await axios.get(  `${import.meta.env.VITE_API_BASE_URL}/pages/${id}`, {
            withCredentials: true,
          });
          setFormData({
            pageName: res.data.pageName,
            shortCode: res.data.shortCode,
            remarks: res.data.remarks,
            isActive: res.data.isActive,
          });
        } catch (error) {
         showModal("error", "Failed to fetch data")
        }
      };
      fetchPageData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await axios.put(  `${import.meta.env.VITE_API_BASE_URL}/pages/${id}`, formData, {
          withCredentials: true,
        });
          showModal("success", "Page updated successfully.")
      } else {
        await axios.post(  `${import.meta.env.VITE_API_BASE_URL}/pages`, formData, {
          withCredentials: true,
        });
          showModal("success", "Page created successfully.")
      }

      navigate("/admin/user-management/pages");
    } catch (error) {
   showModal("error", error.response?.data?.message || "Error submitting form");


    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ pageName: "", shortCode: "", remarks: "" });
  };

  const handleCancel = () => {
    navigate("/admin/user-management/pages");
  };

  const handleGoBack = () => {
    navigate("/admin/user-management/pages");
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header title={isEditMode ? "Edit Page" : "Create Page"} onGoBack={handleGoBack} />

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Page Name
            </label>
            <input
              type="text"
              name="pageName"
              value={formData.pageName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Short Code
            </label>
            <input
              type="text"
              name="shortCode"
              value={formData.shortCode}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <input
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            ></input>
          </div>

          <FormActions
            onSubmit={handleSubmit}
            onReset={handleReset}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default PageForm;