import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../../../Components/Admin/Add/Header';
import MenuTable from '../../../Components/Admin/Menu/MenuTable';
import { useModal } from '../../../context/ModalProvider';
import CorrigendumForm from './CorrigendumForm'; 
import CorrigendumList from './CorrigendumList'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageCorrigendumsPage = () => {
    const { tenderId } = useParams(); // Get the parent tender's ID
    const navigate = useNavigate();
    const { showModal } = useModal();

    const [tender, setTender] = useState(null);
    const [corrigendums, setCorrigendums] = useState([]);
    const [editingCorrigendum, setEditingCorrigendum] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch parent tender details and its corrigendums
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [tenderRes, corrigendumsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/tenders/${tenderId}`, {withCredentials:true}),
                axios.get(`${API_BASE_URL}/corrigendums/tenders/${tenderId}/corrigendums`, {withCredentials:true})
            ]);
            setTender(tenderRes.data);
            setCorrigendums(corrigendumsRes.data);
        } catch (error) {
            showModal("error", "Failed to load tender data.");
            navigate('/admin/notifications/tenders'); // Go back if tender doesn't exist
        } finally {
            setIsLoading(false);
        }
    }, [tenderId, navigate, showModal]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // This function will be called by the form upon successful submission
    const handleFormSuccess = () => {
        setEditingCorrigendum(null); // Reset the form
        fetchData(); // Refresh the list of corrigendums
    };

    const handleEdit = (corrigendum) => {
        setEditingCorrigendum(corrigendum);
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    const handleCancelEdit = () => {
        setEditingCorrigendum(null);
    };

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 min-h-[80vh] space-y-6">
            <Header title={`Corrigendums for: ${tender?.en_title || ''}`} onGoBack={() => navigate('/admin/notifications/tenders')} />

            {/* Section 1: The Add/Edit Form */}
            <CorrigendumForm
                tenderId={tenderId}
                editingCorrigendum={editingCorrigendum}
                onSuccess={handleFormSuccess}
                onCancel={handleCancelEdit}
            />

            {/* Section 2: The List of Existing Corrigendums */}
            <CorrigendumList
                corrigendums={corrigendums}
                onEdit={handleEdit}
                onDataChange={fetchData} // Allow list to trigger a refresh
            />
        </div>
    );
};

export default ManageCorrigendumsPage;																									