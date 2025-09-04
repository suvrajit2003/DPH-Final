import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { FaEdit, FaCheck, FaFilePdf } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CheckCircle, XCircle } from "lucide-react";

import MenuTable from '../../../Components/Admin/Menu/MenuTable';
import { useModal } from '../../../context/ModalProvider';
import DeleteConfirmationModal from '../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal';

// A reusable status badge component for consistency
const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const CorrigendumList = ({ corrigendums, onEdit, onDataChange }) => {
    const { showModal } = useModal();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCorrigendum, setSelectedCorrigendum] = useState(null);

    const openModal = (corrigendum) => {
        setSelectedCorrigendum(corrigendum);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCorrigendum(null);
        setIsModalOpen(false);
    };

    const handleToggleStatus = async () => {
        if (!selectedCorrigendum) return;
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/corrigendums/corrigendums/${selectedCorrigendum.id}/status`,
                {},
                { withCredentials: true }
            );
            showModal("success", `Corrigendum status has been updated.`);
            onDataChange(); 
        } catch (error) {
            showModal("error", error.response?.data?.message || "Failed to update status.");
        } finally {
            closeModal();
        }
    };

    const columns = useMemo(() => [
        {
            header: 'SL.No',
            cell: ({ index, currentPage, entriesPerPage }) => {
                return (currentPage - 1) * entriesPerPage + index + 1;
            }
        },
        { 
            header: 'Title (English)', 
            accessor: 'en_title', 
            isSearchable: true, 
            isSortable: true 
        },
           { 
            header: 'Title (Odia)', 
            accessor: 'od_title', 
            isSearchable: true, 
            isSortable: true 
        },
        { 
            header: 'Date', 
            accessor: 'date', 
            isSortable: true 
        },
        {
            header: 'Document',
            cell: ({ row }) => (
              row.original.cor_document ? 
                <a 
                  href={`${import.meta.env.VITE_API_BASE_URL}/uploads/tenders/corrigendums/${row.original.cor_document}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="View Corrigendum Document"
                  className="flex justify-center"
                >
                    <FaFilePdf className="text-red-600 h-5 w-5 hover:text-red-800" />
                </a> : "No document"
            )
        },
        { 
            header: 'Status', 
            accessor: 'is_active',
            cell: ({ row }) => <StatusBadge isActive={row.original.is_active} /> 
        },
        {
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <button 
                      onClick={() => onEdit(row.original)} 
                      className="text-blue-500 hover:text-blue-700" 
                      title="Edit Corrigendum"
                    >
                        <FaEdit />
                    </button>
                    <button 
                      onClick={() => openModal(row.original)} 
                      className={row.original.is_active ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}
                      title={row.original.is_active ? "Deactivate Corrigendum" : "Activate Corrigendum"}
                    >
                        {row.original.is_active ? <IoClose size={18} /> : <FaCheck />}
                    </button>
                </div>
            ),
        },
    ], [onEdit, onDataChange]);

    return (
        <div className="bg-white rounded-lg shadow-md">
            <MenuTable
                Ltext="Existing Corrigendums"
                // No Rtext or addPath needed as the form is on the same page
                data={corrigendums}
                columns={columns}
            />

            {isModalOpen && selectedCorrigendum && (
                <DeleteConfirmationModal
                    onClose={closeModal}
                    onConfirm={handleToggleStatus}
                    title={"Confirm Status Change"}
                    message={`Are you sure you want to ${selectedCorrigendum.is_active ? "deactivate" : "activate"} "${selectedCorrigendum.en_title}"?`}
                    icon={selectedCorrigendum.is_active ? XCircle : CheckCircle}
                    confirmText={"Yes, Change Status"}
                    cancelText="Cancel"
                />
            )}
        </div>
    );
};

export default CorrigendumList;