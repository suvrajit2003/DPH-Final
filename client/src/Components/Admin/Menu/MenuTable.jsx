
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

import TableHeader from "./TableHeader";
import FilterControls from "./FilterControls";
import Pagination from "./Pagination";
import MenuTableBody from "./MenuTableBody";

const highlightMatch = (text, query) => {
  if (!query || typeof text !== 'string') return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const TableHead = ({ columns, sortBy, sortOrder, onSort }) => {
  return (
    <thead>
      <tr className="bg-gray-100 text-left text-sm">
        {columns.map((column) => (
          <th key={column.accessor || column.header} className="p-2">
            {column.isSortable ? (
              <button className="flex items-center gap-1 font-bold" onClick={() => onSort(column.accessor)}>
                {column.header}
                {sortBy === column.accessor ? (
                  sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                ) : (
                  <ChevronsUpDown size={16} className="text-gray-400" />
                )}
              </button>
            ) : (
              column.header
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};


const MenuTable = ({
    Ltext,
    Rtext,
    data = [],
    columns = [],
    addPath,
    tableState ,
    onOpenSort
}) => {
    const navigate = useNavigate();

    const isControlled = !!tableState;

    const [internalCurrentPage, setInternalCurrentPage] = useState(1);
    const [internalEntriesPerPage, setInternalEntriesPerPage] = useState(10);
    const [internalSearchTerm, setInternalSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [internalSortBy, setInternalSortBy] = useState(null);
    const [internalSortOrder, setInternalSortOrder] = useState('asc');

    useEffect(() => {
        if (!isControlled) {
            const timer = setTimeout(() => setDebouncedSearch(internalSearchTerm), 400);
            return () => clearTimeout(timer);
        }
    }, [internalSearchTerm, isControlled]);

    const loading = isControlled ? tableState.loading : false;
    const currentPage = isControlled ? tableState.currentPage : internalCurrentPage;
    const entriesPerPage = isControlled ? tableState.entriesPerPage : internalEntriesPerPage;
    const searchTerm = isControlled ? tableState.searchTerm : internalSearchTerm;
    const sortBy = isControlled ? tableState.sortBy : internalSortBy;
    const sortOrder = isControlled ? tableState.sortOrder : internalSortOrder;

    const setCurrentPage = isControlled ? tableState.setCurrentPage : setInternalCurrentPage;
    const setEntriesPerPage = isControlled ? tableState.setEntriesPerPage : setInternalEntriesPerPage;
    const setSearchTerm = isControlled ? tableState.setSearchTerm : setInternalSearchTerm;
    const setSortBy = isControlled ? tableState.setSortBy : setInternalSortBy;
    const setSortOrder = isControlled ? tableState.setSortOrder : setInternalSortOrder;
    
    const handleAdd = addPath ? () => navigate(addPath) : null;

    const handleSort = (accessor) => {
        if (!accessor) return;
        if (sortBy === accessor) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(accessor);
            setSortOrder('asc');
        }
        if (!isControlled) {
            setCurrentPage(1);
        }
    };

    const processedData = useMemo(() => {
        if (isControlled) return data; 

        // 1. Filter
        let filtered = data;
        if (debouncedSearch) {
             filtered = data.filter(item =>
                columns.some(column => {
                    if (column.isSearchable) {
                        const value = item[column.accessor];
                        return value && value.toString().toLowerCase().includes(debouncedSearch.toLowerCase());
                    }
                    return false;
                })
            );
        }

        // 2. Sort
        if (sortBy) {
            const sorted = [...filtered].sort((a, b) => {
                const valA = a[sortBy];
                const valB = b[sortBy];
                if (valA === null || valA === undefined) return 1;
                if (valB === null || valB === undefined) return -1;
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return valA - valB;
                }
                return valA.toString().localeCompare(valB.toString());
            });
            if (sortOrder === 'desc') {
                sorted.reverse();
            }
            filtered = sorted;
        }
        
        return filtered;
    }, [isControlled, data, columns, debouncedSearch, sortBy, sortOrder]);


    // 3. Paginate
    const paginatedData = useMemo(() => {
        if (isControlled) return data;
        const start = (currentPage - 1) * entriesPerPage;
        return processedData.slice(start, start + entriesPerPage);
    }, [isControlled, processedData, currentPage, entriesPerPage, data]);
    
    const totalItems = isControlled ? tableState.totalItems : processedData.length;
    const totalPages = Math.ceil(totalItems / entriesPerPage);

    return (
        <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
            <TableHeader 
                Ltext={Ltext} 
                Rtext={Rtext} 
                onAdd={handleAdd}
                 onOpenSort={onOpenSort}
            />

            <FilterControls
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={(value) => {
                    setEntriesPerPage(value);
                    setCurrentPage(1);
                }}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <table className="min-w-full border border-gray-300 text-sm">
                <TableHead 
                    columns={columns} 
                    sortBy={sortBy} 
                    sortOrder={sortOrder}
                    onSort={handleSort}
                />
                <MenuTableBody
                    loading={loading}
                    columns={columns}
                    data={isControlled ? data : paginatedData}
                    entriesPerPage={entriesPerPage}
                    currentPage={currentPage}
                    highlightMatch={highlightMatch}
                    searchTerm={isControlled ? (tableState.searchTerm || '') : debouncedSearch}
                />
            </table>

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                perPage={entriesPerPage}
            />
        </div>
    );
};

export default MenuTable;