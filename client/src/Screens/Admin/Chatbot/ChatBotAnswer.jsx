// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaPlus, FaEdit } from "react-icons/fa";
// import { X, Check } from "lucide-react";
// import chatbotAnswerAPI from "../../../services/chatbotAnswerAPI";
// import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";

// // Truncate long text
// const truncateText = (text, limit = 80) => {
//   if (!text) return "";
//   return text.length > limit ? text.substring(0, limit) + "..." : text;
// };

// // Table Header
// const TableHeader = ({ onAdd }) => (
//   <div className="flex items-center justify-between mb-4">
//     <h2 className="text-xl font-semibold">Chatbot Answers</h2>
//     <button
//       onClick={onAdd}
//       className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
//     >
//       <FaPlus /> Add Answer
//     </button>
//   </div>
// );

// // Filter Controls
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
//       placeholder="Search answers..."
//       className="border px-2 py-1 text-sm rounded"
//       value={searchTerm}
//       onChange={(e) => {
//         setSearchTerm(e.target.value);
//         setCurrentPage(1);
//       }}
//     />
//   </div>
// );

// // Table Row
// const TableRow = ({ item, idx, currentPage, entriesPerPage, onStatusChange }) => {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   const handleStatusToggle = async () => {
//     setUpdating(true);
//     try {
//       const newStatus = item.status === "Active" ? "Inactive" : "Active";
//       await chatbotAnswerAPI.update(item.id, { status: newStatus }); // Backend handles status update
//       onStatusChange(); // Refetch data from server
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update status: " + (err.response?.data?.message || err.message));
//     } finally {
//       setUpdating(false);
//       setIsModalOpen(false);
//     }
//   };

//   return (
//     <>
//       <tr
//         className="border-b hover:bg-gray-50 transition-all"
      
//       >
//         <td className="p-2 text-center">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
//         <td className="p-2">{item.category?.en || "N/A"}</td>
//         <td className="p-2">{item.question?.en || "N/A"}</td>
//         <td className="p-2">{truncateText(item.en)}</td>
//         <td className="p-2 font-odia">{truncateText(item.od)}</td>
//         <td className="p-2 text-center">
//           <span className={`font-semibold ${item.status === "Active" ? "text-green-600" : "text-red-600"}`}>
//             {item.status}
//           </span>
//         </td>
//         <td className="p-2 flex justify-center space-x-2">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className={`p-1 rounded transition ${item.status === "Active" ? "text-red-500 hover:bg-red-100" : "text-green-500 hover:bg-green-100"}`}
//             disabled={updating}
//             title={item.status === "Active" ? "Deactivate" : "Activate"}
//           >
//             {item.status === "Active" ? <X size={14} /> : <Check size={14} />}
//           </button>

//           <button
//             onClick={() => navigate(`/admin/manage-chatbot/edit-answer/${item.id}`)}
//             className="text-blue-500 hover:text-blue-700 transition p-1"
//           >
//             <FaEdit size={14} />
//           </button>
//         </td>
//       </tr>

//       {isModalOpen && (
//         <DeleteConfirmationModal
//           onClose={() => setIsModalOpen(false)}
//           onConfirm={handleStatusToggle}
//           title={item.status === "Active" ? "Deactivate Answer" : "Activate Answer"}
//           message={`Are you sure you want to ${item.status === "Active" ? "deactivate" : "activate"} this answer?`}
//           icon={item.status === "Active" ? X : Check}
//           confirmText={item.status === "Active" ? "Deactivate" : "Activate"}
//           cancelText="Cancel"
//         />
//       )}
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
//     for (let i = startPage; i <= endPage; i++) pages.push(i);
//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   return (
//     <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
//       <div>
//         Showing {start} to {end} of {totalItems} entries
//       </div>
//       <div className="flex gap-1">
//         <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">
//           Prev
//         </button>
//         {pageNumbers.map((page) => (
//           <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded ${currentPage === page ? "bg-gray-300 font-bold" : ""}`}>
//             {page}
//           </button>
//         ))}
//         <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 border rounded disabled:opacity-50">
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const ChatBotAnswer = () => {
//   const navigate = useNavigate();
//   const [answers, setAnswers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // Fetch from server
//   const fetchAnswers = async () => {
//     setLoading(true);
//     try {
//       const response = await chatbotAnswerAPI.getAll(currentPage, entriesPerPage, debouncedSearch);
//       setAnswers(response.data.answers || []);
//       setTotalItems(response.data.totalAnswers || 0);
//       setTotalPages(response.data.totalPages || 0);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load answers: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Refetch when page, limit, or search changes
//   useEffect(() => {
//     fetchAnswers();
//   }, [currentPage, entriesPerPage, debouncedSearch]);

//   const handleStatusChange = async () => {
//     await fetchAnswers();
//     if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
//   };

//   return (
//     <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
//       <TableHeader onAdd={() => navigate("/admin/manage-chatbot/add-answer")} />
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
//             <th className="p-2">Category</th>
//             <th className="p-2">Question</th>
//             <th className="p-2">Answer (English)</th>
//             <th className="p-2">Answer (Odia)</th>
//             <th className="p-2 text-center">Status</th>
//             <th className="p-2 text-center">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr><td colSpan="7" className="text-center py-6">Loading...</td></tr>
//           ) : error ? (
//             <tr><td colSpan="7" className="text-center text-red-500 py-6">{error}</td></tr>
//           ) : answers.length > 0 ? (
//             answers.map((item, idx) => (
//               <TableRow key={item.id} item={item} idx={idx} currentPage={currentPage} entriesPerPage={entriesPerPage} onStatusChange={handleStatusChange} />
//             ))
//           ) : (
//             <tr><td colSpan="7" className="text-center py-6 text-gray-500">No answers found.</td></tr>
//           )}
//         </tbody>
//       </table>

//       <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} totalItems={totalItems} perPage={entriesPerPage} />
//     </div>
//   );
// };

// export default ChatBotAnswer;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { X, Check } from "lucide-react";
import chatbotAnswerAPI from "../../../services/chatbotAnswerAPI";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal";

// Truncate long text
const truncateText = (text, limit = 80) => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

// Table Header
const TableHeader = ({ onAdd }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold">Chatbot Answers</h2>
    <button
      onClick={onAdd}
      className="bg-yellow-400 px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
    >
      <FaPlus /> Add Answer
    </button>
  </div>
);

// Filter Controls
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
      placeholder="Search answers..."
      className="border px-2 py-1 text-sm rounded"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>
);

// Sort Arrow Component
const SortArrow = ({ column, currentSort, onSortChange }) => {
  const getSortIcon = () => {
    if (!currentSort) return <FaSort className="ml-1" size={12} />;
    
    const [currentColumn, currentDirection] = currentSort.split(':');
    if (currentColumn === column) {
      return currentDirection === "asc" 
        ? <FaSortUp className="ml-1" size={12} /> 
        : <FaSortDown className="ml-1" size={12} />;
    }
    return <FaSort className="ml-1" size={12} />;
  };

  const handleClick = () => {
    if (!currentSort || !currentSort.startsWith(column)) {
      // First click - set to ascending
      onSortChange(`${column}:asc`);
    } else {
      const [_, currentDirection] = currentSort.split(':');
      // Toggle direction
      onSortChange(`${column}:${currentDirection === "asc" ? "desc" : "asc"}`);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="text-gray-500 hover:text-gray-700 focus:outline-none ml-1"
    >
      {getSortIcon()}
    </button>
  );
};

// Table Row
const TableRow = ({ item, idx, onStatusChange, showModal }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatusToggle = async () => {
    setUpdating(true);
    try {
      const newStatus = item.status === "Active" ? "Inactive" : "Active";
      await chatbotAnswerAPI.update(item.id, { status: newStatus });
      onStatusChange();
      setIsModalOpen(false);
      showModal("success", `Answer has been ${newStatus === "Active" ? "activated" : "deactivated"} successfully!`);
    } catch (err) {
      console.error(err);
      showModal("error", "Failed to update status: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <tr className="border-b border-gray-300 hover:bg-gray-50 transition-all">
        <td className="p-2 text-center">{idx + 1}</td>
        <td className="p-2">{item.category?.en || "N/A"}</td>
        <td className="p-2">{item.question?.en || "N/A"}</td>
        <td className="p-2">{truncateText(item.en)}</td>
        <td className="p-2 font-odia">{truncateText(item.od)}</td>
        <td className="p-2 text-center">
          <span className={`font-semibold px-2 py-1 rounded-full text-xs ${item.status === "Active" ? "text-green-600 bg-green-100" : "text-red-600"}`}>
            {item.status}
          </span>
        </td>
        <td className="p-2 flex justify-center space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`p-1 rounded transition ${item.status === "Active" ? "text-red-500 hover:bg-red-100" : "text-green-500 hover:bg-green-100"}`}
            disabled={updating}
            title={item.status === "Active" ? "Deactivate" : "Activate"}
          >
            {item.status === "Active" ? <X size={14} /> : <Check size={14} />}
          </button>

          <button
            onClick={() => navigate(`/admin/manage-chatbot/edit-answer/${item.id}`)}
            className="text-blue-500 hover:text-blue-700 transition p-1"
          >
            <FaEdit size={14} />
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleStatusToggle}
          title={item.status === "Active" ? "Deactivate Answer" : "Activate Answer"}
          message={`Are you sure you want to ${item.status === "Active" ? "deactivate" : "activate"} this answer?`}
          icon={item.status === "Active" ? X : Check}
          confirmText={updating ? "Processing..." : (item.status === "Active" ? "Deactivate" : "Activate")}
          cancelText="Cancel"
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
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <div>
        Showing {start} to {end} of {totalItems} entries
      </div>
      <div className="flex gap-1">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">
          Prev
        </button>
        {pageNumbers.map((page) => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded ${currentPage === page ? "bg-gray-300 font-bold" : ""}`}>
            {page}
          </button>
        ))}
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 border rounded disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
};

// Client-side sorting function
const sortAnswers = (answers, sortConfig) => {
  if (!sortConfig || !answers.length) return answers;
  
  const [sortField, sortDirection] = sortConfig.split(':');
  const sortedAnswers = [...answers];
  
  sortedAnswers.sort((a, b) => {
    // Handle nested fields like category.en
    const getNestedValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
    
    let valueA = getNestedValue(a, sortField) || '';
    let valueB = getNestedValue(b, sortField) || '';
    
    // Convert to string for consistent comparison
    valueA = String(valueA).toLowerCase();
    valueB = String(valueB).toLowerCase();
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sortedAnswers;
};

// Client-side search function
const filterAnswers = (answers, searchTerm) => {
  if (!searchTerm) return answers;
  
  const searchLower = searchTerm.toLowerCase();
  return answers.filter(item => 
    (item.category?.en && item.category.en.toLowerCase().includes(searchLower)) ||
    (item.question?.en && item.question.en.toLowerCase().includes(searchLower)) ||
    (item.en && item.en.toLowerCase().includes(searchLower)) ||
    (item.od && item.od.toLowerCase().includes(searchLower)) ||
    (item.status && item.status.toLowerCase().includes(searchLower))
  );
};

// Main Component
const ChatBotAnswer = () => {
  const navigate = useNavigate();
  const [allAnswers, setAllAnswers] = useState([]);
  const [filteredAnswers, setFilteredAnswers] = useState([]);
  const [displayedAnswers, setDisplayedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  // Fetch all answers from server on component mount
  useEffect(() => {
    const fetchAllAnswers = async () => {
      setLoading(true);
      try {
        const response = await chatbotAnswerAPI.getAll();
        setAllAnswers(response.data.answers || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load answers: " + (err.response?.data?.message || err.message));
        showModal("error", "Failed to load answers: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnswers();
  }, []);

  // Filter, sort and paginate answers client-side
  useEffect(() => {
    // Step 1: Filter answers based on search term
    const filtered = filterAnswers(allAnswers, searchTerm);
    setFilteredAnswers(filtered);
    
    // Step 2: Sort answers
    const sorted = sortAnswers(filtered, sort);
    
    // Step 3: Paginate results
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const paginated = sorted.slice(startIndex, endIndex);
    
    setDisplayedAnswers(paginated);
  }, [allAnswers, searchTerm, sort, currentPage, entriesPerPage]);

  const totalItems = filteredAnswers.length;
  const totalPages = Math.ceil(totalItems / entriesPerPage);

  const showModal = (variant, message) => {
    setModalVariant(variant);
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleStatusChange = async () => {
    // Refetch all answers when status changes
    setLoading(true);
    try {
      const response = await chatbotAnswerAPI.getAll();
      setAllAnswers(response.data.answers || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load answers: " + (err.response?.data?.message || err.message));
      showModal("error", "Failed to load answers: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortValue) => {
    setSort(sortValue);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      <ModalDialog open={modalOpen} onClose={() => setModalOpen(false)} variant={modalVariant} message={modalMessage} />
      
      <TableHeader onAdd={() => navigate("/admin/manage-chatbot/add-answer")} />
      <FilterControls
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
      />

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 text-center">SL.No</th>
            <th className="p-2">
              <div className="flex items-center">
                Category
                <SortArrow column="category.en" currentSort={sort} onSortChange={handleSortChange} />
              </div>
            </th>
            <th className="p-2">
              <div className="flex items-center">
                Question
                <SortArrow column="question.en" currentSort={sort} onSortChange={handleSortChange} />
              </div>
            </th>
            <th className="p-2">
              <div className="flex items-center">
                Answer (English)
                <SortArrow column="en" currentSort={sort} onSortChange={handleSortChange} />
              </div>
            </th>
            <th className="p-2">
              <div className="flex items-center">
                Answer (Odia)
                <SortArrow column="od" currentSort={sort} onSortChange={handleSortChange} />
              </div>
            </th>
            <th className="p-2 text-center">
              <div className="flex items-center justify-center">
                Status
                <SortArrow column="status" currentSort={sort} onSortChange={handleSortChange} />
              </div>
            </th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" className="text-center py-6">Loading...</td></tr>
          ) : error ? (
            <tr><td colSpan="7" className="text-center text-red-500 py-6">{error}</td></tr>
          ) : displayedAnswers.length > 0 ? (
            displayedAnswers.map((item, idx) => (
              <TableRow 
                key={item.id} 
                item={item} 
                idx={(currentPage - 1) * entriesPerPage + idx} 
                onStatusChange={handleStatusChange}
                showModal={showModal}
              />
            ))
          ) : (
            <tr><td colSpan="7" className="text-center py-6 text-gray-500">No answers found.</td></tr>
          )}
        </tbody>
      </table>

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

export default ChatBotAnswer;