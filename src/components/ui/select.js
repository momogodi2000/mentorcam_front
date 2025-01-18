// components/ui/select.jsx
import React from 'react';

export const Select = ({ className = '', children, ...props }) => (
  <select 
    className={`block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
    text-gray-900 dark:text-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  >
    {children}
  </select>
);