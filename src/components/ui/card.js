import React from 'react';

export function Card({ className, ...props }) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div
      className={`p-6 ${className}`}
      {...props}
    />
  );
}