

import React, {  useState, useMemo } from "react";
import axios from "axios";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal"; 
import { FaEdit, FaCheck} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import {  CheckCircle, XCircle } from "lucide-react";
import {useNavigate} from "react-router-dom"
import {useModal}  from "../../../context/ModalProvider"
import { useServerSideTable } from "../../../hooks/useServerSideTable";

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

const PageList = () => {
const { data: pages, setData, tableState } = useServerSideTable(
        `${import.meta.env.VITE_API_BASE_URL}/pages`
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
const {showModal} = useModal()

  const navigate = useNavigate()


  const openModal = (page, type) => {
    setSelectedPage(page);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPage(null);
    setIsModalOpen(false);
  };


const handleToggleStatus = async () => {
    if (!selectedPage) return;
    try {
        const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/pages/${selectedPage.id}/status`, {}, {
            withCredentials: true,
        });
        
        const updatedPage = res.data.data;


        setData(prevPages => 
          prevPages.map(page => 
            page.id === updatedPage.id ? updatedPage : page
          )
        );
           
        showModal("success", `Page has been ${updatedPage.isActive ? "activated" : "deactivated"} successfully`);
    } catch (error) {
        showModal("error", error.response?.data?.message || error.message);
    } finally {
        closeModal();
    }
  };





  const pageColumns = useMemo(
        () => [
            {
                header: "SL.No",
                cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1
            },
            { header: "Page Name", accessor: "pageName", isSearchable: true,    isSortable: true },
            { header: "Short Code", accessor: "shortCode", isSearchable: true,    isSortable: true },
            { header: "Remarks", accessor: "remarks", isSearchable: true },
            {
                header: "Status",
                accessor: "isActive",
                cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
            },
            {
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center space-x-3">
                        <button  className="text-blue-600" onClick={() => navigate(`edit/${row.original.id}`)}><FaEdit /></button>
                        <button   onClick={() => openModal(row.original)}>
                            {row.original.isActive ? <IoClose className="text-red-600" /> : <FaCheck className="text-green-600" />}
                        </button>
                    </div>
                ),
            },
        ],
        [tableState.currentPage, tableState.entriesPerPage, navigate] 
    );

  return (
    <div className="p-6 min-h-[80vh]">

    
      <MenuTable
        Ltext="Pages"
        Rtext="Add Page"
        data={pages}
        columns={pageColumns}
        addPath="add"
        tableState={tableState}
      />

        {isModalOpen && selectedPage && (
        <DeleteConfirmationModal
          onClose={closeModal}
          onConfirm={handleToggleStatus}
          title={"Change Status"}
          message={
           `Are you sure you want to ${selectedPage.isActive ? "deactivate" : "activate"} "${selectedPage.pageName}"?`
          }
          icon={ selectedPage.isActive ? XCircle : CheckCircle}
          confirmText={"Yes"}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default PageList;