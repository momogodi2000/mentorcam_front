import React from 'react';

const Separator = ({ className = '', orientation = 'horizontal', ...props }) => {
  const baseStyles = 'bg-gray-200 dark:bg-gray-700';

  if (orientation === 'vertical') {
    return (
      <div
        className={`${baseStyles} w-px h-full ${className}`}
        {...props}
      />
    );
  }

  return (
    <div
      className={`${baseStyles} h-px w-full ${className}`}
      {...props}
    />
  );
};

export default Separator;