// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaPlus, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
// import DeleteConfirmationModal from "../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal.jsx";
// import { ModalDialog } from "../../Components/Admin/Modal/MessageModal.jsx";
// import axios from "axios";

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
//       const newStatus = !item.is_active;
//       await axios.patch(
//         `${import.meta.env.VITE_API_BASE_URL}/important-links/${item.id}/status`,
//         { status: newStatus }
//       );
//       onStatusChange();
//       setIsConfirmModalOpen(false);
//     } catch (error) {
//       console.error("Error updating link status:", error);
//       alert("Failed to update status: " + (error.response?.data?.message || error.message));
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <>
//       <tr className="border-b hover:bg-gray-50 transition-all">
//         <td className="p-2 text-center">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
//         <td className="p-2 text-center">
//           {item.image ? (
//             <img
//               src={`${import.meta.env.VITE_API_BASE_URL}/uploads/important-links/${item.image}`}
//               alt={item.title || "Link image"}
//               className="w-12 h-12 object-cover rounded mx-auto"
//             />
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

//       {isConfirmModalOpen && (
//         <DeleteConfirmationModal
//           onClose={() => setIsConfirmModalOpen(false)}
//           onConfirm={handleStatusToggle}
//           title={item.is_active ? "Deactivate Link" : "Activate Link"}
//           message={
//             item.is_active
//               ? `Are you sure you want to deactivate "${item.title}"? It will no longer be visible to users.`
//               : `Are you sure you want to activate "${item.title}"? It will become visible to users.`
//           }
//           confirmText={updating ? "Processing..." : item.is_active ? "Deactivate" : "Activate"}
//           cancelText="Cancel"
//           icon={item.is_active ? FaTimes : FaCheck}
//         />
//       )}
//     </>
//   );
// };

// // Pagination component remains unchanged
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

// // Main Component
// const ImportantLink = () => {
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
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalVariant, setModalVariant] = useState("info");
//   const [modalMessage, setModalMessage] = useState("");

//   const fetchLinks = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/important-links`, {
//         params: {
//           page: currentPage,
//           limit: entriesPerPage,
//           search: debouncedSearch,
//         },
//       });
//       setLinks(res.data.links || []);
//       setTotalItems(res.data.totalLinks || 0);
//       setTotalPages(res.data.totalPages || 0);
//     } catch (err) {
//       console.error("Error fetching links:", err);
//       const msg = err.response?.data?.message || err.message;
//       setError("Failed to load links: " + msg);
//       showModal("error", msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLinks();
//   }, [currentPage, entriesPerPage, debouncedSearch]);

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const showModal = (variant, message) => {
//     setModalVariant(variant);
//     setModalMessage(message);
//     setModalOpen(true);
//   };

//   const handleStatusChange = async () => {
//     await fetchLinks();
//     if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
//     showModal("success", "Link status updated successfully!");
//   };

//   const SkeletonRow = () => (
//     <tr className="animate-pulse border-b">
//       <td className="p-2"><div className="w-6 h-4 bg-gray-200 rounded mx-auto"></div></td>
//       <td className="p-2"><div className="w-12 h-12 bg-gray-200 rounded mx-auto"></div></td>
//       <td className="p-2"><div className="w-48 h-4 bg-gray-200 rounded"></div></td>
//       <td className="p-2"><div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div></td>
//       <td className="p-2"><div className="flex space-x-2 justify-center"><div className="w-6 h-6 bg-gray-200 rounded-full"></div><div className="w-6 h-6 bg-gray-200 rounded-full"></div></div></td>
//     </tr>
//   );

//   return (
//     <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
//       <ModalDialog open={modalOpen} onClose={() => setModalOpen(false)} variant={modalVariant} message={modalMessage} />

//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">Important Links</h2>
//         <button
//           onClick={() => navigate("/admin/image-setup/important-links/add")}
//           className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
//         >
//           <FaPlus /> Add Link
//         </button>
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
//             <th className="p-2 text-center">SL.No</th>
//             <th className="p-2 text-center">Image</th>
//             <th className="p-2">Link</th>
//             <th className="p-2 text-center">Status</th>
//             <th className="p-2 text-center">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             Array.from({ length: entriesPerPage }).map((_, idx) => <SkeletonRow key={idx} />)
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

// export default ImportantLink;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLink } from "react-icons/fa";

const ImportantLinksPublic = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user-important-links`);
        const allLinks = response.data?.links || [];
        const activeLinks = allLinks.filter(link => link?.is_active);
        setLinks(activeLinks);
      } catch (err) {
        console.error("Error fetching important links:", err);
        setError("Failed to load important links. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading links...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (links.length === 0) {
    return <div className="text-center py-10 text-gray-500">No important links available at the moment.</div>;
  }

  return (
    <div className="px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Important Links</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => (
          <a
            key={link.id} // 👈 better than index
            href={link?.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white shadow hover:shadow-md rounded border hover:border-blue-400 transition-all"
          >
            {link?.image ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/uploads/important-links/${link.image}`}
                alt={link?.title || "Important link"}
                className="w-8 h-8 object-contain rounded"
              />
            ) : (
              <FaLink className="text-blue-500 w-6 h-6" />
            )}
            <span className="text-blue-600 font-medium hover:underline">
              {link?.title || "Untitled Link"}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ImportantLinksPublic;
