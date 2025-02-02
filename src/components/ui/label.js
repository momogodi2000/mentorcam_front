import React from 'react';

/**
 * Label Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.htmlFor - The ID of the input element the label is associated with
 * @param {React.ReactNode} props.children - The content of the label
 * @param {string} [props.className] - Additional CSS classes for the label
 * @returns {JSX.Element} - A label element
 */
const Label = ({ htmlFor, children, className = '' }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;