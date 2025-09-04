// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaPlus, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
// import importantLinksAPI from "../../../services/importantLinksAPI.jsx";
// import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal.jsx";

// // Helper: highlight search matches
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
//       placeholder="Search links..."
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
//       const newStatus = !item.is_active; // Toggle boolean value
//       await importantLinksAPI.updateStatus(item.id, newStatus);
//       onStatusChange();
//     } catch (error) {
//       console.error("Error updating link status:", error);
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
//         <td className="p-2 text-center">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
//         <td className="p-2 text-center">
//           {item.image ? (
//          <img
//   src={`${import.meta.env.VITE_API_BASE_URL}/uploads/important-links/${item.image}`}
//   alt={item.title || "Link image"}
//   className="w-12 h-12 object-cover rounded mx-auto"
// />

//           ) : (
//             <div className="w-12 h-12 bg-gray-200 rounded mx-auto flex items-center justify-center">
//               <span className="text-gray-500 text-xs">No Image</span>
//             </div>
//           )}
//         </td>
//         <td className="p-2">
//           <a 
//             href={item.url} 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="text-blue-500 hover:underline"
//           >
//             {highlightMatch(item.title, searchTerm)}
//           </a>
//         </td>
//         <td className="p-2 text-center">
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-semibold ${
//               item.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//             }`}
//           >
//             {item.is_active ? "Active" : "Inactive"}
//           </span>
//         </td>
//         <td className="p-2 flex justify-center space-x-2">
//           <button
//             onClick={() => setIsConfirmModalOpen(true)}
//             className={`p-1 rounded transition ${
//               item.is_active
//                 ? "text-red-500 hover:bg-red-100 hover:text-red-700"
//                 : "text-green-500 hover:bg-green-100 hover:text-green-700"
//             }`}
//             disabled={updating}
//             title={item.is_active ? "Deactivate" : "Activate"}
//           >
//             {item.is_active ? <FaTimes size={14} /> : <FaCheck size={14} />}
//           </button>
//           <button
//             onClick={() => navigate(`/admin/image-setup/important-links/edit/${item.id}`)}
//             className="p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition rounded"
//             title="Edit"
//           >
//             <FaEdit size={14} />
//           </button>
//         </td>
//       </tr>

//         {isConfirmModalOpen && (
//           <DeleteConfirmationModal
//             onClose={() => setIsConfirmModalOpen(false)}
//             onConfirm={handleStatusToggle}
//             title={item.is_active ? "Deactivate Link" : "Activate Link"}
//             message={
//               item.is_active
//                 ? `Are you sure you want to deactivate "${item.title}"? It will no longer be visible to users.`
//                 : `Are you sure you want to activate "${item.title}"? It will become visible to users.`
//             }
//             confirmText={updating ? "Processing..." : (item.is_active ? "Deactivate" : "Activate")}
//             cancelText="Cancel"
//             icon={item.is_active ? FaTimes : FaCheck}
//           />
//         )}
//     </>
//   );
// };

// // Pagination
// const Pagination = ({ currentPage, setCurrentPage, totalPages, totalItems, perPage }) => {
//   const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
//   const end = Math.min(currentPage * perPage, totalItems);

//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//     let endPage = startPage + maxVisible - 1;

//     if (endPage > totalPages) {
//       endPage = totalPages;
//       startPage = Math.max(1, endPage - maxVisible + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   return (
//     <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
//       <div>
//         Showing {start} to {end} of {totalItems} entries
//       </div>
//       <div className="flex gap-1">
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Prev
//         </button>

//         {pageNumbers.map((page) => (
//           <button
//             key={page}
//             onClick={() => setCurrentPage(page)}
//             className={`px-3 py-1 border rounded ${
//               currentPage === page ? "bg-gray-300 font-bold" : ""
//             }`}
//           >
//             {page}
//           </button>
//         ))}

//         <button
//           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           disabled={currentPage === totalPages || totalPages === 0}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main ImportantLinks Component
// const ImportantLinks = () => {
//   const navigate = useNavigate();
//   const [links, setLinks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // Fetch links from server
//   const fetchLinks = async () => {
//     setLoading(true);
//     try {
//       const response = await importantLinksAPI.getAll(currentPage, entriesPerPage, debouncedSearch);
//       setLinks(response.data.links || []);
//       setTotalItems(response.data.totalLinks || 0);
//       setTotalPages(response.data.totalPages || 0);
//     } catch (err) {
//       console.error("Error fetching links:", err);
//       setError("Failed to load links: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLinks();
//   }, [currentPage, entriesPerPage, debouncedSearch]);

//   // Debounce search input
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const handleStatusChange = async () => {
//     await fetchLinks();
//     if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
//   };

//   // Skeleton loading rows
//   const SkeletonRow = () => (
//     <tr className="animate-pulse border-b">
//       <td className="p-2">
//         <div className="w-6 h-4 bg-gray-200 rounded mx-auto"></div>
//       </td>
//       <td className="p-2">
//         <div className="w-12 h-12 bg-gray-200 rounded mx-auto"></div>
//       </td>
//       <td className="p-2">
//         <div className="w-48 h-4 bg-gray-200 rounded"></div>
//       </td>
//       <td className="p-2">
//         <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
//       </td>
//       <td className="p-2">
//         <div className="flex space-x-2 justify-center">
//           <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
//           <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">Important Links</h2>
//         <button
//           onClick={() => navigate("/admin/image-setup/important-links/add")}
//           className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
//         >
//           <FaPlus /> Add Link
//         </button>
//       </div>

//       {/* Filter */}
//       <FilterControls
//         entriesPerPage={entriesPerPage}
//         setEntriesPerPage={setEntriesPerPage}
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         setCurrentPage={setCurrentPage}
//       />

//       {/* Table */}
//       <table className="min-w-full border text-sm">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2 text-center">SL.No</th>
//             <th className="p-2 text-center">Image</th>
//             <th className="p-2">Link</th>
//             <th className="p-2 text-center">Status</th>
//             <th className="p-2 text-center">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             Array.from({ length: entriesPerPage }).map((_, idx) => (
//               <SkeletonRow key={idx} />
//             ))
//           ) : error ? (
//             <tr>
//               <td colSpan="5" className="text-center text-red-500 py-6">{error}</td>
//             </tr>
//           ) : links.length > 0 ? (
//             links.map((item, idx) => (
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
//                 No links found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <Pagination
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         totalPages={totalPages}
//         totalItems={totalItems}
//         perPage={entriesPerPage}
//       />
//     </div>
//   );
// };

// export default ImportantLinks;






import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import importantLinksAPI from "../../../services/importantLinksAPI.jsx";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal.jsx";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal.jsx"; 

// Helper: highlight search matches
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
      className="border rounded px-2 py-1 text-sm"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
    </select>
    <input
      type="text"
      placeholder="Search links..."
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
const TableRow = ({ item, idx, currentPage, entriesPerPage, searchTerm, onStatusChange }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const handleStatusToggle = async () => {
    setUpdating(true);
    try {
      const newStatus = !item.is_active; // Toggle boolean value
      await importantLinksAPI.updateStatus(item.id, newStatus);
      onStatusChange();
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Error updating link status:", error);
      alert("Failed to update status: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50 transition-all">
        <td className="p-2 text-center">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
        <td className="p-2 text-center">
          {item.image ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/uploads/important-links/${item.image}`}
              alt={item.title || "Link image"}
              className="w-12 h-12 object-cover rounded mx-auto"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded mx-auto flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}
        </td>
        <td className="p-2">
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {highlightMatch(item.title, searchTerm)}
          </a>
        </td>
        <td className="p-2 text-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {item.is_active ? "Active" : "Inactive"}
          </span>
        </td>
        <td className="p-2 flex justify-center space-x-2">
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className={`p-1 rounded transition ${
              item.is_active
                ? "text-red-500 hover:bg-red-100 hover:text-red-700"
                : "text-green-500 hover:bg-green-100 hover:text-green-700"
            }`}
            disabled={updating}
            title={item.is_active ? "Deactivate" : "Activate"}
          >
            {item.is_active ? <FaTimes size={14} /> : <FaCheck size={14} />}
          </button>
          <button
            onClick={() => navigate(`/admin/image-setup/important-links/edit/${item.id}`)}
            className="p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition rounded"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
        </td>
      </tr>

      {isConfirmModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleStatusToggle}
          title={item.is_active ? "Deactivate Link" : "Activate Link"}
          message={
            item.is_active
              ? `Are you sure you want to deactivate "${item.title}"? It will no longer be visible to users.`
              : `Are you sure you want to activate "${item.title}"? It will become visible to users.`
          }
          confirmText={updating ? "Processing..." : (item.is_active ? "Deactivate" : "Activate")}
          cancelText="Cancel"
          icon={item.is_active ? FaTimes : FaCheck}
        />
      )}
    </>
  );
};

// Pagination
const Pagination = ({ currentPage, setCurrentPage, totalPages, totalItems, perPage }) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <div>
        Showing {start} to {end} of {totalItems} entries
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-gray-300 font-bold" : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Main ImportantLinks Component
const ImportantLinks = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  // Fetch links from server
  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await importantLinksAPI.getAll(currentPage, entriesPerPage, debouncedSearch);
      setLinks(response.data.links || []);
      setTotalItems(response.data.totalLinks || 0);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching links:", err);
      setError("Failed to load links: " + (err.response?.data?.message || err.message));
      showModal("error", "Failed to load links: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [currentPage, entriesPerPage, debouncedSearch]);

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

  const handleStatusChange = async () => {
    await fetchLinks();
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    showModal("success", "Link status updated successfully!");
  };

  // Skeleton loading rows
  const SkeletonRow = () => (
    <tr className="animate-pulse border-b">
      <td className="p-2">
        <div className="w-6 h-4 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="p-2">
        <div className="w-12 h-12 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="p-2">
        <div className="w-48 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="p-2">
        <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="p-2">
        <div className="flex space-x-2 justify-center">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      {/* Modal Dialog */}
      <ModalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        message={modalMessage}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Important Links</h2>
        <button
          onClick={() => navigate("/admin/image-setup/important-links/add")}
          className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
        >
          <FaPlus /> Add Link
        </button>
      </div>

      {/* Filter */}
      <FilterControls
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
      />

      {/* Table */}
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 text-center">SL.No</th>
            <th className="p-2 text-center">Image</th>
            <th className="p-2">Link</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: entriesPerPage }).map((_, idx) => (
              <SkeletonRow key={idx} />
            ))
          ) : error ? (
            <tr>
              <td colSpan="5" className="text-center text-red-500 py-6">{error}</td>
            </tr>
          ) : links.length > 0 ? (
            links.map((item, idx) => (
              <TableRow
                key={item.id}
                item={item}
                idx={idx}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                searchTerm={debouncedSearch}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No links found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={entriesPerPage}
      />
    </div>
  );
};

export default ImportantLinks;