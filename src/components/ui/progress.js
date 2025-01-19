import * as React from "react";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(Math.max(value || 0, 0), 100);
  
  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-blue-600 transition-all duration-300"
        style={{ 
          transform: `translateX(-${100 - clampedValue}%)`
        }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };