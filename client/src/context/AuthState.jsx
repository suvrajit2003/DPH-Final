import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useModal } from "./ModalProvider";

const AuthState = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showModal } = useModal();

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/me`,
        {
          withCredentials: true,
        }
      );
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/login`,
        formData,
        { withCredentials: true }
      );

      setUser(response.data.user);
      setLoading(false);
      showModal("success", "Login successful.");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed"; // <-- Get the error message
      setError(errorMessage); // <-- Set it in state for other components
      showModal("warning", errorMessage); // <-- Use the new message directly in the modal
      setLoading(false);
      return false;
    }
  };

  
  // useEffect(() => {
  //   if (!loading && !user) {
  //     navigate('/login');
  //   }
  // }, [user, loading, navigate]);

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/logout`,
        {},
        { withCredentials: true }
      );
      showModal("success", "Logout successful.");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
