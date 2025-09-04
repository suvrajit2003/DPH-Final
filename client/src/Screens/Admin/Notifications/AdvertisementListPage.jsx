import { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { CheckCircle, XCircle } from "lucide-react";

import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import ImageModal from "../../../Components/Admin/ImageModal/ImageModal"; 
import { useModal } from "../../../context/ModalProvider";
import { useServerSideTable } from "../../../hooks/useServerSideTable";

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

// 2. Modify the AdImage component to be clickable
const AdImage = ({ filename, onClick }) => (
    <img
        src={`${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${filename}`}
        alt="Advertisement Thumbnail"
        className="h-16 w-32 object-contain rounded-md bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClick}
    />
);

const AdvertisementListPage = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const { data: advertisements, setData, tableState } = useServerSideTable(
    `${import.meta.env.VITE_API_BASE_URL}/advertisements`
  );
  
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);
  const [modalImageUrl, setModalImageUrl] = useState(null); 

  const openStatusModal = (ad) => {
    setSelectedAdvertisement(ad);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setSelectedAdvertisement(null);
    setIsStatusModalOpen(false);
  };

  const handleToggleStatus = async () => {
    if (!selectedAdvertisement) return;
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/advertisements/${selectedAdvertisement.id}/status`, 
        {}, 
        { withCredentials: true }
      );
      const updatedAd = res.data.data;
      setData(prevAds => prevAds.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
      showModal("success", res.data.message);
    } catch (error) {
      showModal("error", error.response?.data?.message || error.message);
    } finally {
      closeStatusModal();
    }
  };

  const advertisementColumns = useMemo(() => [
    {
      header: "SL.No",
      cell: ({ index }) => (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
    },
    { 
        header: "English Ad", 
        accessor: "en_adphoto",
        // 4. Update the cell to handle the click event
        cell: ({ row }) => (
            <AdImage 
                filename={row.original.en_adphoto} 
                onClick={() => setModalImageUrl(`${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${row.original.en_adphoto}`)}
            />
        )
    },
    { 
        header: "Odia Ad", 
        accessor: "od_adphoto",
        cell: ({ row }) => (
            <AdImage 
                filename={row.original.od_adphoto} 
                onClick={() => setModalImageUrl(`${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${row.original.od_adphoto}`)}
            />
        )
    },
    { 
        header: "Link", 
        accessor: "ad_link", 
        isSearchable: true, 
        isSortable: true,
        cell: ({ row }) => row.original.ad_link ? <a href={row.original.ad_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Link</a> : 'N/A'
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
          <button onClick={() => navigate(`edit/${row.original.id}`)} className="text-blue-500" title="Edit Advertisement"><FaEdit /></button>
          <button onClick={() => openStatusModal(row.original)} className={row.original.is_active ? "text-red-500" : "text-green-500"} title={row.original.is_active ? "Deactivate" : "Activate"}>
            {row.original.is_active ? <IoClose size={18} /> : <FaCheck />}
          </button>
        </div>
      ),
    },
  ], [tableState.currentPage, tableState.entriesPerPage, navigate]);

  return (
    <div className="p-6 min-h-[80vh]">
      <MenuTable
        Ltext="Advertisements"
        Rtext="Add Advertisement"
        addPath="add"
        data={advertisements}
        columns={advertisementColumns}
        tableState={tableState}
      />

      {isStatusModalOpen && selectedAdvertisement && (
        <DeleteConfirmationModal
          onClose={closeStatusModal}
          onConfirm={handleToggleStatus}
          title={"Confirm Status Change"}
          message={`Are you sure you want to ${selectedAdvertisement.is_active ? "deactivate" : "activate"} this advertisement?`}
          icon={selectedAdvertisement.is_active ? XCircle : CheckCircle}
          confirmText={"Yes, Change"}
          cancelText="Cancel"
        />
      )}

      {modalImageUrl && (
        <ImageModal 
          imageUrl={modalImageUrl} 
          onClose={() => setModalImageUrl(null)} 
        />
      )}
    </div>
  );
};

export default AdvertisementListPage;