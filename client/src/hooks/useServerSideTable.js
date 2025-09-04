

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalProvider';

export const useServerSideTable = (apiUrl, initialEntries = 10) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(initialEntries);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const { showModal } = useModal();

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]); 

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: entriesPerPage,
            };
            if (debouncedSearchTerm) {
                params.search = debouncedSearchTerm;
            }
                 if (sortBy) {
                params.sort = sortBy;
                params.order = sortOrder;
            }

            const res = await axios.get(apiUrl, {
                params,
                withCredentials: true,
            });

            setData(res.data.data);
            setTotalItems(res.data.total);
        } catch (error) {
            console.error("Error fetching table data:", error);
            showModal("error", error.response?.data?.message || "Could not fetch data.");
        } finally {
            setLoading(false);
        }
    }, [apiUrl, currentPage, entriesPerPage, debouncedSearchTerm, sortBy, sortOrder, showModal]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        setData,
        refreshData: fetchData,
        tableState: {
            loading,
            totalItems,
            currentPage,
            setCurrentPage,
            entriesPerPage,
            setEntriesPerPage,
            searchTerm,
            setSearchTerm,
             sortBy,
            setSortBy,
            sortOrder,
            setSortOrder,
        },
    };
};