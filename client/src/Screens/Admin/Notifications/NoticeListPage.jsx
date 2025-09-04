import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaCheck, FaFilePdf } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CheckCircle, XCircle } from "lucide-react";

import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useModal } from "../../../context/ModalProvider";
import { useServerSideTable } from "../../../hooks/useServerSideTable"; 

// Helper component for status badges (can be shared)
const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const NoticeListPage = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  // 1. Use the correct API endpoint and variable names
  const { data: notices, setData, tableState } = useServerSideTable(
    `${import.meta.env.VITE_API_BASE_URL}/notices`
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const openModal = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNotice(null);
    setIsModalOpen(false);
  };

  const handleToggleStatus = async () => {
    if (!selectedNotice) return;
    try {
      // 2. Use the correct API endpoint for status toggle
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/notices/${selectedNotice.id}/status`, 
        {}, 
        { withCredentials: true }
      );
      
      const updatedNotice = res.data.data;

      // Update state locally
      setData(prevNotices =>
        prevNotices.map(notice =>
          notice.id === updatedNotice.id ? updatedNotice : notice
        )
      );
      
      showModal("success", res.data.message);
    } catch (error) {
      showModal("error", error.response?.data?.message || error.message);
    } finally {
      closeModal();
    }
  };

  // 3. Define columns that match the Notice data structure
  const noticeColumns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { header: "Title (English)", accessor: "en_title", isSearchable: true, isSortable: true },
    { header: "Title (Odia)", accessor: "od_title", isSearchable: true, isSortable: true },
    { header: "Date", accessor: "date", isSortable: true },
    {
      header: "Document",
      cell: ({ row }) => (
        <div>
          {row.original.doc ? (
             <a href={`${import.meta.env.VITE_API_BASE_URL}/uploads/notices/${row.original.doc}`} target="_blank" rel="noopener noreferrer" title="View Notice Document">
              <FaFilePdf className="text-red-600 h-5 w-5 hover:text-red-800" />
            </a>
          ) : "No document" }
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "is_active",
      cell: ({ row }) => <StatusBadge isActive={row.original.is_active} />,
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-3">
          <button onClick={() => navigate(`edit/${row.original.id}`)} className="text-blue-500" title="Edit Notice"><FaEdit /></button>
          <button onClick={() => openModal(row.original)} className={row.original.is_active ? "text-red-500" : "text-green-500"} title={row.original.is_active ? "Deactivate" : "Activate"}>
            {row.original.is_active ? <IoClose size={18} /> : <FaCheck />}
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

  return (
    <div className="p-6 min-h-[80vh]">
      {/* 4. Update UI text and props for MenuTable */}
      <MenuTable
        Ltext="Notices"
        Rtext="Add Notice"
        addPath="add"
        data={notices}
        columns={noticeColumns}
        tableState={tableState}
      />

      {isModalOpen && selectedNotice && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={"Confirm Status Change"}
          message={`Are you sure you want to ${selectedNotice.is_active ? "deactivate" : "activate"} "${selectedNotice.en_title}"?`}
          icon={selectedNotice.is_active ? XCircle : CheckCircle}
          confirmText={"Yes, Change"}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default NoticeListPage;