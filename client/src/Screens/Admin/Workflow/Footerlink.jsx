import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import {  Check, X } from "lucide-react";
import { VscVmActive } from "react-icons/vsc";
import axios from 'axios';

// --- Import your components AND the hook ---
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from '../../../hooks/useServerSideTable';
import { useModal } from '../../../context/ModalProvider';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/footerlinks`;

const Footerlink = () => {
  // --- USE THE HOOK: All data logic is now handled here ---
  const { data, refreshData, tableState } = useServerSideTable(API_URL);
  
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const [modalState, setModalState] = useState({ isOpen: false, itemToToggle: null, nextStatus: '' });

  const handleToggleConfirm = async () => {
    if (modalState.itemToToggle) {
      try {
        await axios.patch(`${API_URL}/status/${modalState.itemToToggle.id}`,{},{withCredentials:true});
        showModal("success", "Status updated successfully!");
        refreshData(); // Tell the hook to refetch its data
      } catch (error) {
        showModal("error", "Failed to update status.");
      } finally {
        closeToggleModal();
      }
    }
  };
  
  const openToggleModal = (item) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    setModalState({ isOpen: true, itemToToggle: item, nextStatus });
  };
  const closeToggleModal = () => setModalState({ isOpen: false, itemToToggle: null, nextStatus: '' });

  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { header: "English Link", accessor: "englishLinkText", isSearchable: true, isSortable: true },
    { header: "Odia Link", accessor: "odiaLinkText", isSearchable: true, isSortable: true },
    { header: "Link Type", accessor: "linkType", isSortable: true },
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
        <div className="flex space-x-2">
          <button onClick={() => openToggleModal(row.original)} title="Toggle Status">
            {row.original.status === 'Active' ? <FaTimes className="text-red-500" /> : <FaCheck className="text-green-500" />}
          </button>
          <button onClick={() => navigate(`/admin/workflow/footerlink/edit/${row.original.id}`)} title="Edit">
            <FaEdit className="text-blue-500" />
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable 
        Ltext="Footer Link List" 
        Rtext="Add New Link" 
        data={data}
        columns={columns}
        addPath="/admin/workflow/footerlink/add"
        tableState={tableState} // <-- Pass the entire tableState object
      />

      {/* The SortMenuController is no longer needed here */}

      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeToggleModal}
          onConfirm={handleToggleConfirm}
          title="Confirm Status Change"
          message={`Change status of "${modalState.itemToToggle?.englishLinkText}" to "${modalState.nextStatus}"?`}
          icon={VscVmActive}
          confirmText={`Set to ${modalState.nextStatus}`}
        />
      )}
    </div>
  );
};

export default Footerlink;