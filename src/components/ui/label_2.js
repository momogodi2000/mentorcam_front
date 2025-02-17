// label.js
import React from 'react';

const Label = React.forwardRef(({ className = '', children, htmlFor, ...props }, ref) => {
  const baseStyles = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  
  // Combine base styles with any additional className props
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={combinedClassName}
      {...props}
    >
      {children}
    </label>
  );
});

// Add display name for better debugging
Label.displayName = 'Label';

export { Label };