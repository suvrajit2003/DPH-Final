// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import MenuTable from "../../../Components/Menu/MenuTable";
// import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
// import { FaEdit } from "react-icons/fa";
// import { Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const StatusBadge = ({ isActive }) => {
//   const text = isActive ? "Active" : "Inactive";
//   const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
//   return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
// };

// const UserList = () => {
//   const [users, setUsers] = useState([]);
//   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("createdAt");
//   const [order, setOrder] = useState("asc");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/allusers`, {
//           withCredentials: true,
//           params: { search: searchTerm, sortBy, order },
//         });
//         setUsers(res.data.users || []);
//       } catch (error) {
       
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, [searchTerm, sortBy, order]);

//   const handleToggleClick = (user) => {
//     setCurrentUser(user);
//     setIsStatusModalOpen(true);
//   };

//   const closeStatusModal = () => {
//     setCurrentUser(null);
//     setIsStatusModalOpen(false);
//   };

//   const confirmStatusToggle = async () => {
//     if (!currentUser) return;

//     try {
//       await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/users/${currentUser.id}/status`,
//         { isActive: !currentUser.isActive },
//         { withCredentials: true }
//       );

//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === currentUser.id ? { ...u, isActive: !u.isActive } : u
//         )
//       );
//     } catch (error) {
//       console.error("Error updating status:", error.response?.data || error.message);
//     } finally {
//       closeStatusModal();
//     }
//   };

//   const userColumns = useMemo(
//     () => [
//       {
//         header: "SL.No",
//         accessor: "id",
//         cell: ({ pageContext }) => {
//           const { currentPage, entriesPerPage, index } = pageContext || {};
//           return (currentPage - 1) * entriesPerPage + index + 1;
//         },
//       },
//       { header: "Name", accessor: "name", isSearchable: true },
//       { header: "Email", accessor: "email", isSearchable: true },
//       { header: "Mobile", accessor: "mobile", isSearchable: true },
//       {
//         header: "Image",
//         accessor: "profilePic",
//         cell: ({ row }) => {
//           const path = row.original.profilePic;
//           if (!path) return <div className="text-gray-500">No Image</div>;
//           const file = path.split('\\').pop().split('/').pop();
//           const src = `${import.meta.env.VITE_API_BASE_URL}/uploads/profiles/${file}`;
//           return <img src={src} alt={row.original.name} className="h-10 w-10 rounded-full object-cover" />;
//         },
//       },
//       {
//         header: "Status",
//         accessor: "isActive",
//         cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
//       },
//       {
//         header: "Actions",
//         cell: ({ row }) => (
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => navigate(`edit/${row.original.id}`)}
//               className="text-blue-500 hover:text-blue-700 transition"
//               title="Edit User"
//             >
//               <FaEdit />
//             </button>
//             <button
//               onClick={() => handleToggleClick(row.original)}
//               className={`text-xl ${
//                 row.original.isActive ? "text-green-600" : "text-red-600"
//               }`}
//               title={row.original.isActive ? "Set Inactive" : "Set Active"}
//             >
//               {row.original.isActive ? "✔" : "✖"}
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [navigate]
//   );

//   const handleSortChange = (field) => {
//     if (sortBy === field) setOrder((o) => (o === "asc" ? "desc" : "asc"));
//     else {
//       setSortBy(field);
//       setOrder("asc");
//     }
//   };




//   return (
//     <div className="p-6">
//       <MenuTable
//         Ltext="Users"
//         Rtext="Add User"
//         data={users}
//         columns={userColumns}
//         addPath="add"
//         sortBy={sortBy}
//         order={order}
//         onSortChange={handleSortChange}
//         onSearchChange={setSearchTerm}
//       />

//       {isStatusModalOpen && currentUser && (
//         <DeleteConfirmationModal
//           onClose={closeStatusModal}
//           onConfirm={confirmStatusToggle}
//           title={`${currentUser.isActive ? "Deactivate" : "Activate"} User`}
//           message={`Are you sure you want to ${
//             currentUser.isActive ? "deactivate" : "activate"
//           } "${currentUser.name}"?`}
//           icon={Trash2}
//           confirmText="Confirm"
//           cancelText="Cancel"
//           confirmButtonClassName={
//             currentUser.isActive
//               ? "bg-red-600 hover:bg-red-700"
//               : "bg-green-600 hover:bg-green-700"
//           }
//           iconColorClass={
//             currentUser.isActive
//               ? "text-red-500"
//               : "text-green-500"
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default UserList;



import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaCheck } from "react-icons/fa"; // Using FaCheck to match PageList
import { X } from "lucide-react"; // Use X for deactivation
import { useNavigate } from "react-router-dom";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/Admin/DeleteConfirmationModal/DeleteConfirmationModal";
import { useServerSideTable } from "../../../hooks/useServerSideTable";
import { useModal } from "../../../context/ModalProvider";

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {text}
    </span>
  );
};

const UserList = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const {
    data: users,
    setData,
    tableState,
    refreshData,
  } = useServerSideTable(`${import.meta.env.VITE_API_BASE_URL}/admin/allusers`);

  const [modalState, setModalState] = useState({ isOpen: false, user: null });

  const handleToggleClick = (user) => {
    setModalState({ isOpen: true, user });
  };

  const closeStatusModal = () => {
    setModalState({ isOpen: false, user: null });
  };

  const confirmStatusToggle = useCallback(async () => {
    const { user } = modalState;
    if (!user) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/users/${user.id}/status`,
        {},
        { withCredentials: true }
      );

      const updatedUser = response.data.user;

      setData((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      refreshData();
      showModal("success", response.data.message);
    } catch (error) {
      showModal("error", error.response?.data?.message || "Error updating status.");
    } finally {
      closeStatusModal();
    }
  }, [modalState, setData, showModal]);

  const userColumns = useMemo(
    () => [
      {
        header: "SL.No",
        cell: ({ index }) =>
          (tableState.currentPage - 1) * tableState.entriesPerPage + index + 1,
      },
      { header: "Name", accessor: "name", isSearchable: true, isSortable: true },
      { header: "Email", accessor: "email", isSearchable: true, isSortable: true },
      { header: "Mobile", accessor: "mobile", isSearchable: true, isSortable: true },
    {
  header: "Image",
  accessor: "profilePic_url", // <-- use profilePic_url accessor
  cell: ({ row }) => {
    const src = row.original.profilePic_url;
    if (!src) return <div className="text-gray-500 text-xs">No Image</div>;
    return (
      <img
        src={src}
        alt={row.original.name}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  },
},

      {
        header: "Status",
        accessor: "isActive",
        isSortable: true,
        cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => navigate(`edit/${row.original.id}`)}
              className="text-blue-500 hover:text-blue-700 transition"
              title="Edit User"
            >
              <FaEdit />
            </button>

            <button
              onClick={() => handleToggleClick(row.original)}
              title={row.original.isActive ? "Deactivate User" : "Activate User"}
            >
              {row.original.isActive ? (
                <X className="text-red-600" size={16} />
              ) : (
                <FaCheck className="text-green-600" />
              )}
            </button>
          </div>
        ),
      },
    ],
    [navigate, tableState.currentPage, tableState.entriesPerPage]
  );

  return (
    <div className="p-6">
      <MenuTable
        Ltext="Users"
        Rtext="Add User"
        data={users}
        columns={userColumns}
        addPath="add"
        tableState={tableState}
      />

      {modalState.isOpen && modalState.user && (
        <DeleteConfirmationModal
          onClose={closeStatusModal}
          onConfirm={confirmStatusToggle}
          title={modalState.user.isActive ? "Deactivate User" : "Activate User"}
          message={`Are you sure you want to ${
            modalState.user.isActive ? "deactivate" : "activate"
          } "${modalState.user.name}"?`}
          icon={modalState.user.isActive ? X : FaCheck}
          confirmText="Confirm"
          cancelText="Cancel"
          confirmButtonClassName={
            modalState.user.isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }
        />
      )}
    </div>
  );
};

export default UserList;
