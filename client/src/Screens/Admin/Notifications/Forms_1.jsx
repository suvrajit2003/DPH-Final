import React, { useState, useMemo ,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit,  FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaFileExcel } from 'react-icons/fa';
import {  Check, X } from "lucide-react";
import { VscVmActive } from "react-icons/vsc";
import axios from 'axios';

// --- Import your components AND the hook ---
import MenuTable from "@/Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from '@/hooks/useServerSideTable';
import { useModal } from '@/context/ModalProvider';

const API_URL = "http://localhost:5000/api/forms";

const Forms = () => {
  const { data, refreshData, tableState } = useServerSideTable(API_URL);
  
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const [modalState, setModalState] = useState({ isOpen: false, itemToToggle: null, nextStatus: '' });

  const handleToggleConfirm = async () => {
    if (modalState.itemToToggle) {
      try {
        await axios.patch(`${API_URL}/status/${modalState.itemToToggle.id}`,{},{withCredentials:true});
        showModal("success", "Status updated successfully!");
        refreshData();
      } catch (error) {
        showModal("error", "Failed to update status.");
      } finally {
        closeToggleModal();
      }
    }
  };
  
  const openToggleModal = useCallback((item) => {
    const nextStatus = !item.is_active ? 'Active' : 'Inactive';
    setModalState({ isOpen: true, itemToToggle: item, nextStatus });
  }, []); // Empty dependency array means this function is created only once

  const closeToggleModal = useCallback(() => {
    setModalState({ isOpen: false, itemToToggle: null, nextStatus: '' });
  }, []);

  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { header: "Title (English)", accessor: "en_title", isSearchable: true, isSortable: true },
    { header: "Title (Odia)", accessor: "od_title", isSearchable: true, isSortable: true },
    {
          header: "Document",
          accessor: "document",
          cell: ({ row }) => {
            const filename = row.original.document; // No need for '|| ""' here
    
            // --- 1. HANDLE THE "NO DOCUMENT" CASE FIRST ---
            if (!filename) {
              return (
                <span className="text-gray-400 italic text-xs">No document</span>
              );
            }
    
            // --- If a document exists, proceed with the original logic ---
            const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/forms/${filename}`;
            const extension = filename.split('.').pop().toLowerCase();
            
            const getIcon = () => {
              if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" size={22} />;
              if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-500" size={22} />;
              if (['xls', 'xlsx'].includes(extension)) return <FaFileExcel className="text-green-700" size={22} />;
              if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return <FaFileImage className="text-green-500" size={22} />;
              return <FaFileAlt className="text-gray-500" size={22} />; // Fallback icon
            };
    
            return (
              // The link is only rendered if a filename exists
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                title={filename}
                className="cursor-pointer" // Ensures the pointer cursor is shown
              >
                {getIcon()}
              </a>
            );
          },
        },
    {
      header: "Status",
      accessor: "is_active",
      isSortable: true,
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
        )
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button onClick={() => openToggleModal(row.original)} title="Toggle Status">
          {row.original.is_active ? <X size={20} className="text-red-500" /> : <Check size={20} className="text-green-500" />}
          </button>
          <button onClick={() => navigate(`/admin/notifications/forms/edit/${row.original.id}`)} title="Edit">
            <FaEdit className="text-blue-500" />
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate,openToggleModal]);

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable 
        Ltext="Forms List" 
        Rtext="Add Form" 
        data={data}
        columns={columns}
        addPath="/admin/notifications/forms/add"
        tableState={tableState}
      />

      {/* The SortMenuController is not needed as sorting is handled on table headers */}

      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeToggleModal}
          onConfirm={handleToggleConfirm}
          title="Confirm Status Change"
          message={`Change status of "${modalState.itemToToggle?.en_title}" to "${modalState.nextStatus}"?`}
          icon={VscVmActive}
          confirmText={`Set to ${modalState.nextStatus}`}
        />
      )}
    </div>
  );
};

export default Forms;