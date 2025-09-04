
import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useModal } from "../../../context/ModalProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const PhotoGalaryList = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const {
    data: photoItems,
    setData,
    tableState,
  } = useServerSideTable(`${API_BASE_URL}/image-setup/all-photos`);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleToggleStatus = useCallback(async () => {
    if (!selectedItem) return;

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/image-setup/toggle-photo-status/${selectedItem.id}`,
        null,
        { withCredentials: true }
      );

      const updatedItem = res.data.photo;
      setData((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id ? { ...item, status: updatedItem.status } : item
        )
      );
      showModal("success", res.data.message);
    } catch (error) {
      showModal("error", "Failed to toggle status.");
    } finally {
      closeModal();
    }
  }, [selectedItem, setData, showModal]);

  const photoColumns = useMemo(
    () => [
      {
        header: "SL.No",
        cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      {
        header: "Category",
        accessor: "category_name",
        isSearchable: true,
        isSortable: true,
      },
      {
        header: "Title (English)",
        accessor: "title_en",
        isSearchable: true,
        isSortable: true,
      },
      {
        header: "Title (Odia)",
        accessor: "title_od",
        isSearchable: true,
        isSortable: true,
      },
      {
        header: "Photo",
        accessor: "photo",
        cell: ({ row }) => {
          const imgSrc = row.original.photo_url;
          return imgSrc ? (
            <img src={imgSrc} alt="Photo" className="h-12 w-24 object-cover rounded" />
          ) : (
            <div className="text-gray-500 text-xs">No Image</div>
          );
        },
      },
      {
        header: "Status",
        accessor: "status",
        isSortable: true,
        cell: ({ row }) => <StatusBadge isActive={row.original.status} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
              <button
              onClick={() => openModal(row.original)}
              className={row.original.status ? "text-red-600" : "text-green-600"}
              title={row.original.status ? "Deactivate Photo" : "Activate Photo"}>
              {row.original.status ? <FaTimes /> : <FaCheck />}
            </button>
            <button
              onClick={() => navigate(`/admin/image-setup/photo-galary/edit/${row.original.id}`)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Edit Photo">
              <FaEdit />
            </button>
          
          </div>
        ),
      },
    ],
    [navigate, tableState.currentPage, tableState.entriesPerPage]
  );

  return (
    <div className="p-6 min-h-[80vh] font-sans">
      <MenuTable
        Ltext="Photo Gallery"
        Rtext="Add Photo"
        data={photoItems}
        columns={photoColumns}
        addPath="add"
        tableState={tableState}
      />

      {isModalOpen && selectedItem && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={"Change Status"}
          message={`Are you sure you want to ${
            selectedItem.status ? "deactivate" : "activate"
          } "${selectedItem.title_en}"?`}
          icon={selectedItem.status ? XCircle : CheckCircle}
          confirmText={"Yes"}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default PhotoGalaryList;