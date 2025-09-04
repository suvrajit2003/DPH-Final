import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useModal } from "../../../context/ModalProvider";
import { useServerSideTable } from "../../../hooks/useServerSideTable";

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const TypeBadge = ({ type }) => {
    const typeClasses = {
        Gazetted: "bg-blue-100 text-blue-800",
        Restricted: "bg-yellow-100 text-yellow-800",
        Optional: "bg-purple-100 text-purple-800",
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeClasses[type] || 'bg-gray-100 text-gray-800'}`}>{type}</span>;
}

const HolidayListPage = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const { data: holidays, setData, tableState, refreshData } = useServerSideTable(
    `${import.meta.env.VITE_API_BASE_URL}/holidays`
  );
  
  const [modalState, setModalState] = useState({ isOpen: false, holiday: null, action: null });

  const openModal = (holiday, action) => {
    setModalState({ isOpen: true, holiday, action });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, holiday: null, action: null });
  };

  const handleToggleStatus = useCallback(async () => {
    if (!modalState.holiday) return;
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/holidays/${modalState.holiday.id}/status`, 
        {}, { withCredentials: true }
      );
      const updatedHoliday = res.data.data;
      setData(prevHolidays =>
        prevHolidays.map(h => h.id === updatedHoliday.id ? updatedHoliday : h)
      );
      showModal("success", res.data.message);
    } catch (error) {
      showModal("error", error.response?.data?.message || "Failed to update status.");
    } finally {
      closeModal();
    }
  }, [modalState.holiday, setData, showModal]);

  const handleDelete = useCallback(async () => {
    if (!modalState.holiday) return;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/holidays/${modalState.holiday.id}`, 
        { withCredentials: true }
      );
      showModal("success", res.data.message);
      refreshData(); // Perform a full refetch as an item is removed
    } catch (error) {
      showModal("error", error.response?.data?.message || "Failed to delete holiday.");
    } finally {
      closeModal();
    }
  }, [modalState.holiday, refreshData, showModal]);

  const holidayColumns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { header: "Holiday Name", accessor: "name", isSearchable: true, isSortable: true },
    { header: "Date", accessor: "holiday_date", isSortable: true },
    { header: "Type", accessor: "type", isSortable: true, cell: ({ row }) => <TypeBadge type={row.original.type} /> },
    {
      header: "Status",
      accessor: "is_active",
      cell: ({ row }) => <StatusBadge isActive={row.original.is_active} />,
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-3">
          <button onClick={() => navigate(`edit/${row.original.id}`)} className="text-blue-500" title="Edit Holiday"><FaEdit /></button>
          <button onClick={() => openModal(row.original, 'toggle')} className={row.original.is_active ? "text-red-500" : "text-green-500"} title={row.original.is_active ? "Deactivate" : "Activate"}>
            {row.original.is_active ? <IoClose size={18} /> : <FaCheck />}
          </button>
          <button onClick={() => openModal(row.original, 'delete')} className="text-gray-600" title="Delete Holiday">
            <FaTrash />
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

  const getModalConfig = () => {
    if (!modalState.holiday) return {};
    const { holiday, action } = modalState;

    if (action === 'toggle') {
      return {
        onConfirm: handleToggleStatus,
        title: "Confirm Status Change",
        message: `Are you sure you want to ${holiday.is_active ? "deactivate" : "activate"} "${holiday.name}"?`,
        icon: holiday.is_active ? XCircle : CheckCircle,
        confirmText: "Yes, Change"
      };
    }
    if (action === 'delete') {
      return {
        onConfirm: handleDelete,
        title: "Confirm Deletion",
        message: `Are you sure you want to delete the holiday "${holiday.name}"? This action cannot be undone.`,
        icon: AlertTriangle,
        confirmText: "Yes, Delete"
      };
    }
    return {};
  };

  const modalConfig = getModalConfig();

  return (
    <div className="p-6 min-h-[80vh]">
      <MenuTable
        Ltext="Holidays"
        Rtext="Add Holiday"
        addPath="add"
        data={holidays}
        columns={holidayColumns}
        tableState={tableState}
      />

      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          icon={modalConfig.icon}
          confirmText={modalConfig.confirmText}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default HolidayListPage;