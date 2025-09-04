import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../context/ModalProvider';
import Header from '../../../Components/Admin/Add/Header';
import FormActions from '../../../Components/Admin/Add/FormActions';

const FormField = memo(({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type} id={name} name={name} value={value} onChange={onChange}
      className={`w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
));

const SelectField = memo(({ label, name, value, onChange, error, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            id={name} name={name} value={value} onChange={onChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
));


const HolidayFormPage = () => {
  const { id } = useParams(); 
  const isEditMode = !!id; 
  const navigate = useNavigate();
  const { showModal } = useModal();

  const holidayTypes = [  'National', 'Gazetted', 'Restricted', 'State-Specific'];
  const initialFormState = { holiday_date: '', name: '', type: holidayTypes[0] };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const fetchHolidayData = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/holidays/${id}`, { withCredentials: true });
      const { holiday_date, name, type } = response.data;
      const initial = { holiday_date, name, type };
      setFormData(initial);
      setInitialData(initial);
    } catch (error) {
      showModal("error", "Failed to fetch holiday data.");
      navigate('/admin/notifications/holidays');
    }
  }, [id, navigate, showModal]);

  useEffect(() => {
    if (isEditMode) {
      fetchHolidayData();
    }
  }, [isEditMode, fetchHolidayData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Holiday name is required.";
    if (!formData.holiday_date) newErrors.holiday_date = "Holiday date is required.";
    if (!formData.type) newErrors.type = "Holiday type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const url = isEditMode 
        ? `${import.meta.env.VITE_API_BASE_URL}/holidays/${id}` 
        : `${import.meta.env.VITE_API_BASE_URL}/holidays`;
    const method = isEditMode ? 'patch' : 'post';

    try {
      await axios[method](url, formData, { withCredentials: true });
      showModal("success", `Holiday ${isEditMode ? 'updated' : 'added'} successfully!`);
      navigate('/admin/notifications/holidays');
    } catch (error) {
      showModal("error", error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} holiday.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, id, isEditMode, navigate, showModal, validateForm]);

  const handleReset = useCallback(() => {
    if (isEditMode && initialData) {
        setFormData(initialData);
    } else {
        setFormData(initialFormState);
    }
    setErrors({});
  }, [isEditMode, initialData, initialFormState]);

  return (
    <div className="p-6 min-h-[80vh]">
      <Header title={isEditMode ? "Edit Holiday" : "Add New Holiday"} onGoBack={() => navigate('/admin/notifications/holidays')} />
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Holiday Name" name="name" value={formData.name} onChange={handleChange} error={errors.name}/>
            <FormField label="Date" name="holiday_date" type="date" value={formData.holiday_date} onChange={handleChange} error={errors.holiday_date}/>
            <SelectField label="Type" name="type" value={formData.type} onChange={handleChange} error={errors.type} options={holidayTypes} />
          </div>
          <FormActions
            onSubmit={handleSubmit}
            onReset={handleReset}
            onCancel={() => navigate('/admin/notifications/holidays')}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default HolidayFormPage;