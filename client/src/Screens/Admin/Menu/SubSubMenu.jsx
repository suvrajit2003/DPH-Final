
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

import MenuTable from "@/Components/Admin/Menu/MenuTable"; 
import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal"; 
import SortMenuController from '@/Components/Admin/SortModal/SortMenuController';
import { useServerSideTable } from '@/hooks/useServerSideTable';
import { useModal } from '@/context/ModalProvider';

// const API_BASE_URL = "http://localhost:5000";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const SubSubMenu = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  const {
    data: paginatedSubSubMenus,
    setData: setPaginatedSubSubMenus,
    tableState,
    refreshData
  } = useServerSideTable(`${API_BASE_URL}/api/subsubmenus`);
  
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortableItems, setSortableItems] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, itemToUpdate: null });

  const fetchAllForSorting = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/subsubmenus/all`, { withCredentials: true });
      setSortableItems(response.data);
      setShowSortModal(true);
    } catch (error) {
      showModal("error", "Failed to load items for reordering.");
    }
  };

  const openConfirmationModal = (item) => setModalState({ isOpen: true, itemToUpdate: item });
  const closeConfirmationModal = () => setModalState({ isOpen: false, itemToUpdate: null });

  const handleStatusUpdateConfirm = async () => {
    const item = modalState.itemToUpdate;
    if (!item) return;
    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const response = await axios.put(`${API_BASE_URL}/api/subsubmenus/status/${item.id}`, { status: newStatus }, { withCredentials: true });
      const updatedItem = response.data;
      setPaginatedSubSubMenus(prevData => 
        prevData.map(ssm => 
          ssm.id === updatedItem.id ? updatedItem : ssm
        )
      );
      showModal("success", `Sub-SubMenu status set to "${newStatus}" successfully!`);
      refreshData()
    } catch (error) {
      showModal("error", "Failed to update status.");
    } finally {
      closeConfirmationModal();
    }
  };

  const handleSaveOrder = async (newOrder) => {
    const orderIds = newOrder.map(item => item.id);
    try {
      await axios.put(`${API_BASE_URL}/api/subsubmenus/order`, { order: orderIds }, { withCredentials: true });
      setShowSortModal(false);
      showModal("success", "Sub-SubMenu order updated successfully!");
      refreshData();
    } catch (error) {
      showModal("error", "Failed to update order.");
    }
  };
  
  const columns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { header: "Parent Menu", accessor: "parent_menu", isSearchable: true, isSortable: true },
    { header: "Parent SubMenu", accessor: "parent_submenu", isSearchable: true, isSortable: true },
    { header: "Sub-SubMenu (in English)", accessor: "title_en", isSearchable: true, isSortable: true },
    { header: "Sub-SubMenu (in Odia)", accessor: "title_od", isSearchable: true, isSortable: true },
    {
        header: "Image",
        accessor: "image_url",
        cell: ({ row }) => (
          row.original.image_url ? 
          <img 
            src={`${API_BASE_URL}/uploads/subsubmenus/${row.original.image_url.split('/').pop()}`} 
            alt={row.original.title_en} 
            className="h-12 w-16 object-cover rounded"
          /> 
          : "No Image"
        ),
    },
    {
      header: "Status",
      accessor: "status",
      isSortable: true,
      cell: ({ row }) => (<span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.original.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.original.status}</span>),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => openConfirmationModal(row.original)} 
            className={row.original.status === 'Active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} 
            title={row.original.status === 'Active' ? 'Set to Inactive' : 'Set to Active'}>
            {row.original.status === 'Active' ? <FaTimes /> : <FaCheck />}
          </button>
          <button 
            onClick={() => navigate(`/admin/menusetup/subsubmenu/edit/${row.original.id}`)} 
            className="text-blue-500 hover:text-blue-700" 
            title="Edit">
            <FaEdit />
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable 
        Ltext="Sub-SubMenu List" 
        Rtext="Add Sub-SubMenu" 
        data={paginatedSubSubMenus}
        columns={columns}
        addPath="/admin/menusetup/subsubmenu/create"
        tableState={tableState}
        onOpenSort={fetchAllForSorting} 
      />
      <SortMenuController
        open={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={sortableItems}
        onSave={handleSaveOrder}
        title="Reorder Sub-SubMenus"
        displayKey="title_en"
        secondaryKey="title_od"
      />
      {modalState.isOpen && (
        <DeleteConfirmationModal
          onClose={closeConfirmationModal}
          onConfirm={handleStatusUpdateConfirm}
          title="Confirm Status Change"
          message={`Are you sure you want to set "${modalState.itemToUpdate?.title_en}" to ${modalState.itemToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}?`}
          icon={AlertTriangle}
          confirmText={modalState.itemToUpdate?.status === 'Active' ? 'Set to Inactive' : 'Set to Active'}
          confirmButtonVariant={modalState.itemToUpdate?.status === 'Active' ? 'danger' : 'success'}
        />
      )}
    </div>
  );
};

export default SubSubMenu;