import React, { useState, useEffect } from "react";
import axios from "axios";

const HomeAdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [originalAdmins, setOriginalAdmins] = useState([]);

  // Fetch admins on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/alladmins`,
          { withCredentials: true }
        );
        setAdmins(res.data.admins || []); 
        setOriginalAdmins(res.data.admins || []);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleInputChange = (id, field, value) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === id ? { ...admin, [field]: value } : admin
      )
    );
  };

  const handleImageChange = (id, file) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === id ? { ...admin, image: file } : admin
      )
    );
  };

  const handleUpdate = () => {
    console.log("Updated Members:", admins);
    alert("Members updated successfully (see console for data)");
  };

  const handleReset = () => {
    setAdmins(originalAdmins);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Homepage Admin Info</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">SL.No</th>
              <th className="px-4 py-2 border">Name (English)</th>
              <th className="px-4 py-2 border">Name (Odia)</th>
              <th className="px-4 py-2 border">Designation (English)</th>
              <th className="px-4 py-2 border">Designation (Odia)</th>
              <th className="px-4 py-2 border">Image</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin.id} className="border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    value={admin.nameEn || ""}
                    onChange={(e) =>
                      handleInputChange(admin.id, "nameEn", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    value={admin.nameOd || ""}
                    onChange={(e) =>
                      handleInputChange(admin.id, "nameOd", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    value={admin.designationEn || ""}
                    onChange={(e) =>
                      handleInputChange(admin.id, "designationEn", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    value={admin.designationOd || ""}
                    onChange={(e) =>
                      handleInputChange(admin.id, "designationOd", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(admin.id, e.target.files[0])
                    }
                    className="block w-full text-sm"
                  />
                  {typeof admin.image === "string" && admin.image && (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${admin.image}`}
                      alt="Admin"
                      className="mt-2 h-12 w-20 object-cover rounded"
                    />
                  )}
                  {admin.image instanceof File && (
                    <p className="text-xs text-green-600 mt-1">
                      {admin.image.name}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleUpdate}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
        >
          Update Members
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default HomeAdminList;
