import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext({
  toast: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = {
      id,
      title,
      description,
      variant,
    };

    setToasts((prevToasts) => [...prevToasts, toast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  const contextValue = {
    toast: addToast,
    toasts,
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg p-4 shadow-lg transition-all transform translate-y-0 
              ${
                toast.variant === "destructive"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
              }`}
            role="alert"
          >
            {toast.title && (
              <div className="font-semibold mb-1">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export default useToast;