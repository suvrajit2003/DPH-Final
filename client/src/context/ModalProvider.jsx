
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { ModalDialog } from "../Components/Admin/Modal/MessageModal"; 

const ModalContext = createContext(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used inside ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    open: false,
    variant: "info",
    message: "",
  });


  const showModal = useCallback((variant, message) => {
    setModalConfig({ open: true, variant, message });
  }, []);


  const hideModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, open: false }));
  }, []);


  const contextValue = useMemo(() => ({
    showModal,
    hideModal,
  }), [showModal, hideModal]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <ModalDialog
        open={modalConfig.open}
        onClose={hideModal} 
        variant={modalConfig.variant}
        message={modalConfig.message}
      />
    </ModalContext.Provider>
  );
};