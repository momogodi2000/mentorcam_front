import React from 'react';

export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 background-animate';
  
  // Combine base classes with any additional classes passed in
  const combinedClasses = `${baseClasses} ${className}`;

  // Add custom styles for the animation
  const keyframes = `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `;

  const styles = `
    .background-animate {
      background-size: 1000px 100%;
      animation: shimmer 2s infinite linear;
    }
  `;

  if (variant === 'circular') {
    return (
      <>
        <style>{keyframes}</style>
        <style>{styles}</style>
        <div className={`${combinedClasses} rounded-full`}></div>
      </>
    );
  }

  return (
    <>
      <style>{keyframes}</style>
      <style>{styles}</style>
      <div className={`${combinedClasses} rounded`}></div>
    </>
  );
};

// Preset Skeleton components for common use cases
export const SkeletonText = ({ lines = 1, className = '' }) => {
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, index) => (
        <Skeleton 
          key={index} 
          className={`h-4 ${className}`} 
        />
      ))}
    </div>
  );
};

export const SkeletonImage = ({ className = '' }) => {
  return <Skeleton className={`rounded-lg ${className}`} />;
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <SkeletonImage className="h-48 w-full mb-4" />
      <SkeletonText lines={1} className="w-3/4 mb-2" />
      <SkeletonText lines={2} className="w-full" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

export const SkeletonAvatar = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <Skeleton 
      variant="circular" 
      className={sizeClasses[size]} 
    />
  );
};

// Loading states for the SessionsPage
export const SessionsPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <SkeletonCard key={n} />
      ))}
    </div>
  );
};

// Export Skeleton as a named export
export { Skeleton as default };