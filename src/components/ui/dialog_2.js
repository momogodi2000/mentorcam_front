import React from 'react';

const Dialog = ({ open, children }) => {
  if (!open) return null;
  return <div className="dialog-root">{children}</div>;
};

const DialogContent = ({ className, children, ...props }) => (
  <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg border bg-white p-6 shadow-lg rounded-lg ${className || ''}`} {...props}>
    <div className="relative">
      {children}
    </div>
  </div>
);

const DialogOverlay = ({ className, ...props }) => (
  <div 
    className={`fixed inset-0 z-40 bg-black bg-opacity-50 ${className || ''}`}
    {...props}
  />
);

const DialogHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 ${className || ''}`}
    {...props}
  />
);

const DialogTitle = ({ className, ...props }) => (
  <h2
    className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}
    {...props}
  />
);

const DialogDescription = ({ className, ...props }) => (
  <p
    className={`text-sm text-gray-500 ${className || ''}`}
    {...props}
  />
);

const DialogClose = ({ children, onClose, className, ...props }) => (
  <button
    onClick={onClose}
    className={`absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

export {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
};