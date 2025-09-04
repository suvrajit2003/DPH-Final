import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaFileExcel, FaTimes, FaCheck } from 'react-icons/fa';
import { VscVmActive } from "react-icons/vsc";
import axios from 'axios';

// --- Import your components AND the hook ---
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from '../../../hooks/useServerSideTable';
import { useModal } from '../../../context/ModalProvider';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/news-and-events`;

const NewsAndEvents = () => {
  const { data, refreshData, tableState } = useServerSideTable(API_URL);
  
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const [modalState, setModalState] = useState({ isOpen: false, itemToToggle: null, nextStatus: '' });

  const handleToggleConfirm = async () => {
    if (modalState.itemToToggle) {
      try {
        // The empty {} is the data payload, which is correct for this PATCH request
        await axios.patch(`${API_URL}/status/${modalState.itemToToggle.id}`, {}, { withCredentials: true });
        showModal("success", "Status updated successfully!");
        refreshData();
      } catch (error) {
        showModal("error",  error.response?.data?.message || "Failed to update status."  );
      } finally {
        closeToggleModal();
      }
    }
  };
  
  // Use useCallback for stable function references
  const openToggleModal = useCallback((item) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    setModalState({ isOpen: true, itemToToggle: item, nextStatus });
  }, []);

  const closeToggleModal = useCallback(() => {
    setModalState({ isOpen: false, itemToToggle: null, nextStatus: '' });
  }, []);

  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { header: "Title (English)", accessor: "titleEnglish", isSearchable: true, isSortable: true },
    { header: "Title (Odia)", accessor: "titleOdia", isSearchable: true, isSortable: true },
    { header: "Event Date", accessor: "eventDate", isSortable: true },
    {
      header: "Document",
      accessor: "document",
      cell: ({ row }) => {
        const filename = row.original.document;

        // Handle no document case
        if (!filename) {
          return (
            <span className="text-gray-400 italic text-xs">No document</span>
          );
        }

        const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/events/${filename}`;
        const extension = filename.split('.').pop().toLowerCase();
        
        const getIcon = () => {
          if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" size={22} />;
          if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-500" size={22} />;
          if (['xls', 'xlsx'].includes(extension)) return <FaFileExcel className="text-green-700" size={22} />;
          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return <FaFileImage className="text-green-500" size={22} />;
          return <FaFileAlt className="text-gray-500" size={22} />; // fallback icon
        };

        return (
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            title={filename}
            className="cursor-pointer"
          >
            {getIcon()}
          </a>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      isSortable: true,
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.original.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <button onClick={() => openToggleModal(row.original)} title={`Set to ${row.original.status === 'Active' ? 'Inactive' : 'Active'}`}>
            {row.original.status === 'Active' ? <FaTimes className="text-red-600" /> : <FaCheck className="text-green-600" />}
          </button>
          <button onClick={() => navigate(`/admin/workflow/news-and-events/edit/${row.original.id}`)} title="Edit">
            <FaEdit className="text-blue-500" />
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate, openToggleModal]);

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable 
        Ltext="News & Events List" 
        Rtext="Add New Event" 
        data={data}
        columns={columns}
        addPath="/admin/workflow/news-and-events/add"
        tableState={tableState}
      />

      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeToggleModal}
          onConfirm={handleToggleConfirm}
          title="Confirm Status Change"
          message={`Change status of "${modalState.itemToToggle?.titleEnglish}" to "${modalState.nextStatus}"?`}
          icon={VscVmActive}
          confirmText={`Set to ${modalState.nextStatus}`}
        />
      )}
    </div>
  );
};

export default NewsAndEvents;
