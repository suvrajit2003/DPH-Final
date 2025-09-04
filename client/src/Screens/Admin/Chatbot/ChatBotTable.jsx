// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaSort, FaPlus, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
// import { chatbotCategoryAPI } from "../../../services/api";
// import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";

// // Helper: highlight search matches (optional, purely for UI)
// const highlightMatch = (text, query) => {
//   if (!query) return text;
//   const regex = new RegExp(`(${query})`, "gi");
//   return text.split(regex).map((part, i) =>
//     part.toLowerCase() === query.toLowerCase() ? (
//       <mark key={i} className="bg-yellow-200 text-black rounded px-1">
//         {part}
//       </mark>
//     ) : (
//       part
//     )
//   );
// };

// // FilterControls
// const FilterControls = ({ entriesPerPage, setEntriesPerPage, searchTerm, setSearchTerm, setCurrentPage }) => (
//   <div className="flex items-center justify-between mb-3">
//     <select
//       value={entriesPerPage}
//       onChange={(e) => {
//         setEntriesPerPage(Number(e.target.value));
//         setCurrentPage(1);
//       }}
//       className="border rounded px-2 py-1 text-sm"
//     >
//       <option value={5}>5</option>
//       <option value={10}>10</option>
//       <option value={20}>20</option>
//     </select>
//     <input
//       type="text"
//       placeholder="Search..."
//       className="border px-2 py-1 text-sm rounded"
//       value={searchTerm}
//       onChange={(e) => {
//         setSearchTerm(e.target.value);
//         setCurrentPage(1);
//       }}
//     />
//   </div>
// );

// // TableRow
// const TableRow = ({ item, idx, currentPage, entriesPerPage, searchTerm, onStatusChange }) => {
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const navigate = useNavigate();

//   const handleStatusToggle = async () => {
//     setUpdating(true);
//     try {
//       const newStatus = item.status === "Active" ? "Inactive" : "Active";
//       await chatbotCategoryAPI.update(item.id, { status: newStatus });
//       onStatusChange();
//     } catch (error) {
//       console.error("Error updating category status:", error);
//       alert("Failed to update status: " + (error.response?.data?.message || error.message));
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <>
//       <tr
//         className="border-b hover:bg-gray-50 transition-all"

//       >
//         <td className="p-2">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
//         <td className="p-2">{highlightMatch(item.en, searchTerm)}</td>
//         <td className="p-2 font-odia">{highlightMatch(item.od, searchTerm)}</td>
//         <td className="p-2">
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-semibold ${
//               item.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//             }`}
//           >
//             {item.status}
//           </span>
//         </td>
//         <td className="p-2 flex space-x-2">
//           <button
//             onClick={() => setIsConfirmModalOpen(true)}
//             className={`p-1 rounded transition ${
//               item.status === "Active"
//                 ? "text-red-500 hover:bg-red-100 hover:text-red-700"
//                 : "text-green-500 hover:bg-green-100 hover:text-green-700"
//             }`}
//             disabled={updating}
//             title={item.status === "Active" ? "Deactivate" : "Activate"}
//           >
//             {item.status === "Active" ? <FaTimes /> : <FaCheck />}
//           </button>
//           <button
//             onClick={() => navigate(`/admin/manage-chatbot/edit-category/${item.id}`)}
//             className="p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition rounded"
//             title="Edit"
//           >
//             <FaEdit />
//           </button>
//         </td>
//       </tr>

//       {isConfirmModalOpen && (
//         <DeleteConfirmationModal
//           onClose={() => setIsConfirmModalOpen(false)}
//           onConfirm={handleStatusToggle}
//           title={item.status === "Active" ? "Deactivate Category" : "Activate Category"}
//           message={
//             item.status === "Active"
//               ? `Are you sure you want to deactivate "${item.en}"? It will no longer be visible to users.`
//               : `Are you sure you want to activate "${item.en}"? It will become visible to users.`
//           }
//           confirmText={item.status === "Active" ? "Deactivate" : "Activate"}
//           cancelText="Cancel"
//           icon={item.status === "Active" ? FaTimes : FaCheck}
//         />
//       )}
//     </>
//   );
// };

// // Main ChatBotTable
// const ChatBotTable = ({ Ltext, Rtext }) => {
//   const [loading, setLoading] = useState(true);
//   const [menus, setMenus] = useState([]);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [sortField, setSortField] = useState("en"); // default sort field
//   const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
//   const navigate = useNavigate();

//   // Fetch categories from server
//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const response = await chatbotCategoryAPI.getAll(currentPage, entriesPerPage, debouncedSearch, sortField, sortOrder);
//       setMenus(response.data.categories || []);
//       setTotalItems(response.data.totalCategories || 0);
//       setTotalPages(response.data.totalPages || 0);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setMenus([]);
//       setTotalItems(0);
//       setTotalPages(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, [currentPage, entriesPerPage, debouncedSearch, sortField, sortOrder]);

//   // Debounce search input
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const handleStatusChange = () => fetchCategories();

//   // Handle sort toggle
//   const handleSortToggle = (field) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//   };

//   return (
//     <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">{Ltext}</h2>
//         <div className="flex space-x-2">
//           {Ltext === "Menu List" && (
//             <button
//               onClick={() => handleSortToggle("en")}
//               className="bg-gray-700 text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition"
//             >
//               <FaSort />
//               Sort by English
//             </button>
//           )}
//           <button
//             onClick={() => navigate("/admin/manage-chatbot/add-category")}
//             className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
//           >
//             <FaPlus /> Add Category
//           </button>
//         </div>
//       </div>

//       <FilterControls
//         entriesPerPage={entriesPerPage}
//         setEntriesPerPage={setEntriesPerPage}
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         setCurrentPage={setCurrentPage}
//       />

//       <table className="min-w-full border text-sm">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2">SL.No</th>
//             <th className="p-2 cursor-pointer" onClick={() => handleSortToggle("en")}>
//               Category (English)
//             </th>
//             <th className="p-2 cursor-pointer" onClick={() => handleSortToggle("od")}>
//               Category (Odia)
//             </th>
//             <th className="p-2">Status</th>
//             <th className="p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             Array.from({ length: entriesPerPage }).map((_, idx) => (
//               <tr key={idx} className="animate-pulse border-b">
//                 <td className="p-2 bg-gray-200 h-4 rounded"></td>
//                 <td className="p-2 bg-gray-200 h-4 rounded"></td>
//                 <td className="p-2 bg-gray-200 h-4 rounded"></td>
//                 <td className="p-2 bg-gray-200 h-4 rounded"></td>
//                 <td className="p-2 bg-gray-200 h-4 rounded"></td>
//               </tr>
//             ))
//           ) : menus.length > 0 ? (
//             menus.map((item, idx) => (
//               <TableRow
//                 key={item.id}
//                 item={item}
//                 idx={idx}
//                 currentPage={currentPage}
//                 entriesPerPage={entriesPerPage}
//                 searchTerm={debouncedSearch}
//                 onStatusChange={handleStatusChange}
//               />
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center py-6 text-gray-500">
//                 No categories found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
//         <div>
//           Showing {totalItems === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to{" "}
//           {Math.min(currentPage * entriesPerPage, totalItems)} of {totalItems} entries
//         </div>
//         <div className="flex gap-1">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-3 py-1 border rounded ${currentPage === page ? "bg-gray-300 font-bold" : ""}`}
//             >
//               {page}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBotTable;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown, FaPlus, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { chatbotCategoryAPI } from "../../../services/api";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal"; 

// Helper: highlight search matches (optional, purely for UI)
const highlightMatch = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

// FilterControls
const FilterControls = ({ entriesPerPage, setEntriesPerPage, searchTerm, setSearchTerm, setCurrentPage }) => (
  <div className="flex items-center justify-between mb-3">
    <select
      value={entriesPerPage}
      onChange={(e) => {
        setEntriesPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="border border-gray-300 rounded px-2 py-1 text-sm"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
    </select>
    <input
      type="text"
      placeholder="Search categories..."
      className="border px-2 py-1 text-sm rounded"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>
);

// TableRow
const TableRow = ({ item, idx, currentPage, entriesPerPage, searchTerm, onStatusChange, showModal }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const handleStatusToggle = async () => {
    setUpdating(true);
    try {
      const newStatus = item.status === "Active" ? "Inactive" : "Active";
      await chatbotCategoryAPI.update(item.id, { status: newStatus });
      onStatusChange();
      setIsConfirmModalOpen(false);
      showModal("success", `Category "${item.en}" has been ${newStatus === "Active" ? "activated" : "deactivated"} successfully!`);
    } catch (error) {
      console.error("Error updating category status:", error);
      showModal("error", "Failed to update status: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <tr className="border-b border-gray-300 hover:bg-gray-50 transition-all">
        <td className="p-2">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
        <td className="p-2">{highlightMatch(item.en, searchTerm)}</td>
        <td className="p-2 font-odia">{highlightMatch(item.od, searchTerm)}</td>
        <td className="p-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {item.status}
          </span>
        </td>
        <td className="p-2 flex space-x-2">
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className={`p-1 rounded transition ${
              item.status === "Active"
                ? "text-red-500 hover:bg-red-100 hover:text-red-700"
                : "text-green-500 hover:bg-green-100 hover:text-green-700"
            }`}
            disabled={updating}
            title={item.status === "Active" ? "Deactivate" : "Activate"}
          >
            {item.status === "Active" ? <FaTimes /> : <FaCheck />}
          </button>
          <button
            onClick={() => navigate(`/admin/manage-chatbot/edit-category/${item.id}`)}
            className="p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition rounded"
            title="Edit"
          >
            <FaEdit />
          </button>
        </td>
      </tr>

      {isConfirmModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleStatusToggle}
          title={item.status === "Active" ? "Deactivate Category" : "Activate Category"}
          message={
            item.status === "Active"
              ? `Are you sure you want to deactivate "${item.en}"? It will no longer be visible to users.`
              : `Are you sure you want to activate "${item.en}"? It will become visible to users.`
          }
          confirmText={updating ? "Processing..." : (item.status === "Active" ? "Deactivate" : "Activate")}
          cancelText="Cancel"
          icon={item.status === "Active" ? FaTimes : FaCheck}
        />
      )}
    </>
  );
};

// Main ChatBotTable
const ChatBotTable = () => {
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState("en"); // default sort field
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  // Fetch categories from server
  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Ensure the API call includes sort parameters
      const response = await chatbotCategoryAPI.getAll(
        currentPage, 
        entriesPerPage, 
        debouncedSearch, 
        sortField, 
        sortOrder
      );
      
      // Check if response structure is correct
      if (response.data && Array.isArray(response.data.categories)) {
        setMenus(response.data.categories);
        setTotalItems(response.data.totalCategories || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        console.error("Invalid response structure:", response);
        setMenus([]);
        setTotalItems(0);
        setTotalPages(0);
        showModal("error", "Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMenus([]);
      setTotalItems(0);
      setTotalPages(0);
      
      // Check if backend supports sorting parameters
      if (error.response?.status === 400 || error.response?.status === 500) {
        showModal("error", "Server error: Sorting may not be supported. Please check backend implementation.");
      } else {
        showModal("error", "Failed to load categories: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, entriesPerPage, debouncedSearch, sortField, sortOrder]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Show modal function
  const showModal = (variant, message) => {
    setModalVariant(variant);
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleStatusChange = () => fetchCategories();

  // Handle sort toggle - fixed to properly update state
  const handleSortToggle = (field) => {
    setSortField(field);
    setSortOrder(prevOrder => {
      if (sortField === field) {
        // Toggle order if same field
        return prevOrder === "asc" ? "desc" : "asc";
      } else {
        // Default to ascending when changing field
        return "asc";
      }
    });
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Render sorting icon based on field and order
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="inline ml-1 text-gray-400" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="inline ml-1 text-gray-700" />
    ) : (
      <FaSortDown className="inline ml-1 text-gray-700" />
    );
  };

  // Client-side sorting fallback (if backend doesn't support sorting)
  const getSortedData = (data) => {
    if (!data || data.length === 0) return data;
    
    return [...data].sort((a, b) => {
      let valueA = a[sortField] || "";
      let valueB = b[sortField] || "";
      
      // Convert to string for consistent comparison
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();
      
      if (sortOrder === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  };

  // Use client-side sorted data if needed
  const sortedMenus = getSortedData(menus);

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      {/* Modal Dialog */}
      <ModalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        message={modalMessage}
      />
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Chatbot Category</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate("/admin/manage-chatbot/add-category")}
            className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      <FilterControls
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
      />

      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">SL.No</th>
            <th
              className="p-2 cursor-pointer select-none"
              onClick={() => handleSortToggle("en")}
            >
              Category (English) {renderSortIcon("en")}
            </th>
            <th
              className="p-2 cursor-pointer select-none"
              onClick={() => handleSortToggle("od")}
            >
              Category (Odia) {renderSortIcon("od")}
            </th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: entriesPerPage }).map((_, idx) => (
              <tr key={idx} className="animate-pulse border-b">
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
                <td className="p-2 bg-gray-200 h-4 rounded"></td>
              </tr>
            ))
          ) : sortedMenus.length > 0 ? (
            sortedMenus.map((item, idx) => (
              <TableRow
                key={item.id}
                item={item}
                idx={idx}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                searchTerm={debouncedSearch}
                onStatusChange={handleStatusChange}
                showModal={showModal}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {totalItems === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to{" "}
          {Math.min(currentPage * entriesPerPage, totalItems)} of {totalItems} entries
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${currentPage === page ? "bg-gray-300 font-bold" : ""}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotTable;