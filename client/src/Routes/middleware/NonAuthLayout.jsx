import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';

import Header from '@/Components/User/Layout/Header';
import Navbar from '@/Components/User/Layout/Navbar';
import Footer from '@/Components/User/Layout/Footer';
import Chatbot from "@/Components/User/Layout/Chatbot"; 
import Accessibility from "@/Components/User/Layout/Accessibility";

const NonAuthLayout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!loading && user) {
  //     navigate("/admin/dashboard");
  //   }
  // }, [user, loading, navigate]);

  // Show nothing or a loader while checking auth
if (loading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}


  // If not logged in, allow access to login/register/etc.
  return <>
  <Header/>
  <Navbar/>
  {children}
      <Footer />
      <Accessibility />
      <Chatbot />
  </>;
};

export default NonAuthLayout;
