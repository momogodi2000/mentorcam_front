import React from 'react';

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative overflow-auto ${className || ''}`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent'
      }}
      {...props}
    >
      {children}
    </div>
  );
});

ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => {
  return null; // Custom scrollbar removed since we're using native scrolling
});

ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };