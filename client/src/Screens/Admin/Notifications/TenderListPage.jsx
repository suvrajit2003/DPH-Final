import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaCheck, FaFilePdf, FaListAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CheckCircle, XCircle } from "lucide-react";

import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useModal } from "../../../context/ModalProvider";
import { useServerSideTable } from "../../../hooks/useServerSideTable"; 

// Helper component for status badges
const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const TenderListPage = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const { data: tenders, setData, tableState } = useServerSideTable(
    `${import.meta.env.VITE_API_BASE_URL}/tenders`
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);

  const openModal = (tender) => {
    setSelectedTender(tender);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTender(null);
    setIsModalOpen(false);
  };

  const handleToggleStatus = async () => {
    if (!selectedTender) return;
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/tenders/${selectedTender.id}/status`, 
        {}, 
        { withCredentials: true }
      );
      
      const updatedTender = res.data.data;

      // Efficiently update the state locally without a full refetch
      setData(prevTenders =>
        prevTenders.map(tender =>
          tender.id === updatedTender.id ? updatedTender : tender
        )
      );
      
      showModal("success", res.data.message);
    } catch (error) {
      showModal("error", error.response?.data?.message || error.message);
    } finally {
      closeModal();
    }
  };

  const tenderColumns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { header: "Title (English)", accessor: "en_title", isSearchable: true, isSortable: true },
    { header: "Title (Odia)", accessor: "od_title", isSearchable: true, isSortable: true },
    { header: "Date", accessor: "date", isSortable: true },
    { header: "Expiry Date", accessor: "expiry_date", isSortable: true },
    {
      header: "NIT Document",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          {row.original.nit_doc ? (
            <a href={`${import.meta.env.VITE_API_BASE_URL}/uploads/tenders/${row.original.nit_doc}`} target="_blank" rel="noopener noreferrer" title="View NIT Document">
              <FaFilePdf className="text-red-600 h-5 w-5" />
            </a>
          ) : "No document" }
         
        </div>
      ),
    },
     {
      header: "Tender Document",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
     
          {row.original.doc ? (
             <a href={`${import.meta.env.VITE_API_BASE_URL}/uploads/tenders/${row.original.doc}`} target="_blank" rel="noopener noreferrer" title="View Other Document">
              <FaFilePdf className="text-blue-600 h-5 w-5" />
            </a>
          )  :  "No document"}
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
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(`edit/${row.original.id}`)} className="text-blue-500" title="Edit Tender"><FaEdit /></button>
          <button onClick={() => openModal(row.original)} className={row.original.is_active ? "text-red-500" : "text-green-500"} title={row.original.is_active ? "Deactivate" : "Activate"}>
            {row.original.is_active ? <IoClose /> : <FaCheck />}
          </button>
          <button onClick={() => navigate(`/admin/notifications/tenders/${row.original.id}/corrigendums`)} className="text-purple-500" title="Manage Corrigendums">
    <FaListAlt />
</button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

  return (
    <div className="p-6 min-h-[80vh]">
      <MenuTable
        Ltext="Tenders"
        Rtext="Add Tender"
        addPath="add"
        data={tenders}
        columns={tenderColumns}
        tableState={tableState}
      />

      {isModalOpen && selectedTender && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={"Confirm Status Change"}
          message={`Are you sure you want to ${selectedTender.is_active ? "deactivate" : "activate"} "${selectedTender.en_title}"?`}
          icon={selectedTender.is_active ? XCircle : CheckCircle}
          confirmText={"Yes, Change"}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default TenderListPage;