
import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useModal } from "../../../context/ModalProvider";

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {text}
    </span>
  );
};

const ManageGallaryList = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const {
    data: galleryItems,
    setData,
    tableState
  } = useServerSideTable(`${import.meta.env.VITE_API_BASE_URL}/image-setup/all-categories`);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemSlNo, setSelectedItemSlNo] = useState(null);

  const openStatusModal = (item) => {
    const index = galleryItems.findIndex((i) => i.id === item.id);
    setSelectedItemSlNo(index + 1);
    setSelectedItem(item);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setSelectedItem(null);
    setSelectedItemSlNo(null);
    setIsStatusModalOpen(false);
  };

  const confirmStatusToggle = useCallback(async () => {
    if (!selectedItem) return;

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/image-setup/toggle-category-status/${selectedItem.id}`,
        {},
        { withCredentials: true }
      );

      const updatedItem = res.data.category;

      setData((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id ? { ...item, status: updatedItem.status } : item
        )
      );

      showModal("success", res.data.message);
    } catch (error) {
      showModal("error", "Failed to toggle category status.");
    } finally {
      closeStatusModal();
    }
  }, [selectedItem, setData, showModal]);

  const galleryColumns = useMemo(
    () => [
      {
        header: "SL.No",
        cell: ({ index }) =>
          (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      { header: "Category (English)", accessor: "category_en", isSearchable: true, isSortable: true },
      { header: "Category (Odia)", accessor: "category_od", isSearchable: true, isSortable: true },
      { header: "Category Type", accessor: "category_type", isSearchable: true, isSortable: true },
      {
        header: "Thumbnail",
        accessor: "thumbnail_url",
        cell: ({ row }) => {
          const imageUrl = row.original.thumbnail_url;
          if (!imageUrl) return <div className="text-gray-500 text-xs">No Image</div>;
          return <img src={imageUrl} alt="Thumbnail" className="h-12 w-24 rounded object-cover" />;
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
              onClick={() => openStatusModal(row.original)}
              title={row.original.status ? "Deactivate" : "Activate"}
            >
              {row.original.status ? (
                <FaTimes className="text-red-600" />
              ) : (
                <FaCheck className="text-green-600" />
              )}
            </button>
            <button
              onClick={() => navigate(`/admin/image-setup/manage-galary/edit/${row.original.id}`)}
              className="text-blue-500 hover:text-blue-700 transition"
              title="Edit Category"
            >
              <FaEdit />
            </button>
      
          </div>
        ),
      },
    ],
    [tableState.currentPage, tableState.entriesPerPage, navigate, galleryItems]
  );

  return (
    <div className="p-6">
      <MenuTable
        Ltext="Gallery Categories"
        Rtext="Add Category"
        data={galleryItems}
        columns={galleryColumns}
        addPath="add"
        tableState={tableState}
      />

      {isStatusModalOpen && selectedItem && (
        <DeleteConfirmationModal
          onClose={closeStatusModal}
          onConfirm={confirmStatusToggle}
          title={`${selectedItem.status ? "Deactivate" : "Activate"} Category`}
          message={`Are you sure you want to ${selectedItem.status ? "deactivate" : "activate"} category with SL.No ${selectedItemSlNo}?`}
          icon={selectedItem.status ? X : Check}
          confirmText="Confirm"
          cancelText="Cancel"
          confirmButtonClassName={
            selectedItem.status
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }
          iconColorClass={
            selectedItem.status ? "text-red-500" : "text-green-500"
          }
        />
      )}
    </div>
  );
};

export default ManageGallaryList;
