// use-toast.js
import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext({
  toast: () => {},
  toasts: [],
});

// Available toast variants
const VARIANTS = {
  default: {
    className: 'bg-white text-gray-900 border border-gray-200',
    icon: '✓',
  },
  destructive: {
    className: 'bg-red-600 text-white',
    icon: '✕',
  },
  success: {
    className: 'bg-green-600 text-white',
    icon: '✓',
  },
  warning: {
    className: 'bg-yellow-500 text-white',
    icon: '⚠',
  },
};

// Toast component that displays individual toast
const Toast = ({ title, description, variant = 'default', onDismiss }) => {
  const variantStyles = VARIANTS[variant] || VARIANTS.default;

  return (
    <div
      className={`${variantStyles.className} rounded-lg shadow-lg p-4 max-w-sm w-full pointer-events-auto transition-all duration-300 transform translate-y-0`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg">{variantStyles.icon}</span>
        </div>
        <div className="ml-3 w-0 flex-1">
          {title && (
            <p className="text-sm font-medium">{title}</p>
          )}
          {description && (
            <p className="mt-1 text-sm opacity-90">{description}</p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onDismiss}
          >
            <span className="sr-only">Close</span>
            <span className="text-lg">×</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, description, variant = 'default', duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, title, description, variant },
    ]);

    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ toast: addToast, toasts }}>
      {children}
      <div
        className="fixed bottom-0 right-0 p-4 space-y-4 z-50 pointer-events-none"
        aria-live="assertive"
      >
        {toasts.map((t) => (
          <Toast
            key={t.id}
            {...t}
            onDismiss={() =>
              setToasts((currentToasts) =>
                currentToasts.filter((toast) => toast.id !== t.id)
              )
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Create a global toast object
let toastFunction;

// Initialize function to set up the toast function
export const initializeToast = (toastFn) => {
  toastFunction = toastFn;
};

// Global toast method that doesn't use hooks
export const toast = ({ title, description, variant }) => {
  if (!toastFunction) {
    console.warn('Toast function not initialized. Make sure you are using ToastProvider');
    return;
  }
  toastFunction({ title, description, variant });
};

export default useToast;