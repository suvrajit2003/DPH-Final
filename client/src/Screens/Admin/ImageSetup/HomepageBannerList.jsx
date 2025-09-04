
import React, { useEffect, useState, useMemo, useCallback } from "react";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider"; // <-- Modal context to show success/error messages

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

const HomepageBannerList = () => {
  const [banners, setBanners] = useState([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedBannerSlNo, setSelectedBannerSlNo] = useState(null);

  const navigate = useNavigate();
  const { showModal } = useModal(); // <-- Use modal context

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/image-setup/allhomepagebanners`,
          { withCredentials: true }
        );
        setBanners(res.data.banners || []);
      } catch (error) {
        console.error("Error fetching banners:", error);
        showModal("error", "Failed to load homepage banners.");
      }
    };

    fetchBanners();
  }, [showModal]);

  const openStatusModal = (banner) => {
    const index = banners.findIndex((item) => item.id === banner.id);
    setSelectedBannerSlNo(index + 1);
    setSelectedBanner(banner);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setSelectedBanner(null);
    setSelectedBannerSlNo(null);
    setIsStatusModalOpen(false);
  };

  const confirmStatusToggle = useCallback(async () => {
    if (!selectedBanner) return;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/image-setup/homepage/banner/toggle-status/${selectedBanner.id}`,
        {},
        { withCredentials: true }
      );

      const updatedBanner = res.data.banner;

      setBanners((prev) =>
        prev.map((b) =>
          b.id === updatedBanner.id
            ? { ...b, is_active: updatedBanner.is_active }
            : b
        )
      );

      showModal("success", `Banner with SL.No ${selectedBannerSlNo} is now ${updatedBanner.is_active ? "Active" : "Inactive"}.`);
    } catch (error) {
      console.error("Error updating banner status:", error.response?.data || error.message);
      showModal("error", "Failed to update banner status.");
    } finally {
      closeStatusModal();
    }
  }, [selectedBanner, selectedBannerSlNo, setBanners, showModal]);

  const bannerColumns = useMemo(
    () => [
      {
        header: "SL.No",
        accessor: "slno",
        cell: ({ row }) => {
          const index = banners.findIndex((item) => item.id === row.original.id);
          return index + 1;
        },
      },
      {
        header: "Image",
        accessor: "image_url",
        cell: ({ row }) => {
          const imgSrc = row.original.image_url;
          if (!imgSrc)
            return <div className="text-gray-500 italic text-xs">No Image</div>;

          return (
            <img
              src={imgSrc}
              alt={`Banner ${row.original.id}`}
              className="h-12 w-24 rounded object-cover"
            />
          );
        },
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
                  <button
              onClick={() => openStatusModal(row.original)}
              title={row.original.is_active ? "Deactivate" : "Activate"}
            >
              {row.original.is_active ? (
                <FaTimes className="text-red-600" />
              ) : (
                <FaCheck className="text-green-600" />
              )}
            </button>
            <button
              onClick={() => navigate(`edit/${row.original.id}`)}
              className="text-blue-500 hover:text-blue-700 transition"
              title="Edit Banner"
            >
              <FaEdit />
            </button>
      
          </div>
        ),
      },
    ],
    [navigate, banners]
  );

  return (
    <div className="p-6">
      <MenuTable
        Ltext="Homepage Banners"
        Rtext="Add Banner"
        data={banners}
        columns={bannerColumns}
        addPath="add"
      />

      {isStatusModalOpen && selectedBanner && (
        <DeleteConfirmationModal
          onClose={closeStatusModal}
          onConfirm={confirmStatusToggle}
          title={`${selectedBanner.is_active ? "Deactivate" : "Activate"} Banner`}
          message={`Are you sure you want to ${
            selectedBanner.is_active ? "deactivate" : "activate"
          } banner with SL.No ${selectedBannerSlNo}?`}
          icon={selectedBanner.is_active ? X : Check}
          confirmText="Confirm"
          cancelText="Cancel"
          confirmButtonClassName={
            selectedBanner.is_active
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }
          iconColorClass={
            selectedBanner.is_active ? "text-red-500" : "text-green-500"
          }
        />
      )}
    </div>
  );
};

export default HomepageBannerList;
