
import React from "react";
import RichTextEditor from "@/Components/Admin/TextEditor/RichTextEditor";

// --- THE FIX IS HERE ---
// We provide a default empty object for the 'errors' prop.
const DescriptionFields = ({ formData, onInputChange, errors = {} }) => (
  <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In English) *
      </label>
      <RichTextEditor
        value={formData.descriptionEnglish}
        onChange={(val) => onInputChange("descriptionEnglish", val)}
        placeholder="Enter description in English..."
        // If 'errors' is not passed, `errors.descriptionEnglish` will be undefined, which is safe.
        error={errors.descriptionEnglish}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In Odia) *
      </label>
      <RichTextEditor
        value={formData.descriptionOdia}
        onChange={(val) => onInputChange("descriptionOdia", val)}
        placeholder="Enter description in Odia..."
        error={errors.descriptionOdia}
      />
    </div>
  </div>
);

export default DescriptionFields;