import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuTable from "../../../Components/Admin/Menu/MenuTable";
import { EyeIcon, ClipboardIcon} from "@heroicons/react/24/outline";
import { FaEdit } from "react-icons/fa";

const GenerateLinkPage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/generated-links`, { withCredentials: true });
      setLinks(res.data || []);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLinks = links.filter((link) =>
    link.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
  {
    header: "Sl. No",
    accessor: "slno",
    // cell: ({ row}) =>
    //   (currentPage - 1) * perPage + (row.index + 1), // ✅ correct numbering
  },
  {
    header: "Title",
    accessor: "title",
    isSearchable: true,
    isSortable: true,
  },
 {
  header: "View",
  accessor: "filePath_view",
  cell: ({ row }) =>
    row.original.filePath ? (
      <a
        href={`http://localhost:5000/uploads/generated-links/${row.original.filePath}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        <EyeIcon className="h-6 w-6" />
      </a>
    ) : (
      "—"
    ),
},
{
  header: "Copy Link",
  accessor: "filePath_copy",
  cell: ({ row }) =>
  row.original.filePath ? (
    <button
      onClick={() => {
        const fileLink = `${import.meta.env.VITE_API_BASE_URL}/uploads/generated-links/${row.original.filePath}`;
        console.log("Copied link:", fileLink); 
        navigator.clipboard.writeText(fileLink);
        alert("✅ File link copied to clipboard!");
      }}
      className="text-green-600 hover:text-green-800"
    >
      <ClipboardIcon className="h-6 w-6" />
    </button>
  ) : (
    "—"
  ),
},
    {
      header: "Action",
      accessor: "actions",
      cell: ({ row }) => (
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/generate-link/edit/${row.original.id}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit  />
          </button>
          
        </div>
      ),
    },
  ];
  // After all your state and functions, but before `return`
const numberedLinks = filteredLinks.map((item, idx) => ({
  ...item,
  slno: (currentPage - 1) * perPage + (idx + 1)
}));


  return (
    <div className="p-6">
      {/* The external search bar is not present here, as per your request. */}
      {/* MenuTable will handle its own search input using the passed tableState props. */}
      <MenuTable
        Ltext="Generate Links"
        Rtext="Add Link"
        data={numberedLinks} 
  //       data={numberedLinks.filter(link =>
  //   link.title?.toLowerCase().includes(searchTerm.toLowerCase())
  // )}
        columns={columns}
        addPath="/admin/generate-link/add"
        tableState={{
          loading,
          currentPage,
          setCurrentPage,
          entriesPerPage: perPage,
          setEntriesPerPage: setPerPage,
          searchTerm,      // This searchTerm state will be updated by MenuTable's internal search input
          setSearchTerm,   // This setter allows MenuTable to update the searchTerm state
          sortBy,
          setSortBy,
          sortOrder,
          setSortOrder,
          totalItems: filteredLinks.length,
        }}
      />
    </div>
  );
};

export default GenerateLinkPage;
