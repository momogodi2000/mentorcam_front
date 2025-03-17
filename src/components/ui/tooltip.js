import React, { useState } from 'react';

/**
 * Tooltip component.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The element that triggers the tooltip.
 * @param {string} props.content - The content to display inside the tooltip.
 * @param {string} [props.position='top'] - The position of the tooltip (top, bottom, left, right).
 * @param {number} [props.delay=200] - The delay (in milliseconds) before the tooltip appears.
 * @returns {JSX.Element} - The Tooltip component.
 */
export const Tooltip = ({ children, content, position = 'top', delay = 200 }) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId;

  const showTooltip = () => {
    timeoutId = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  // Tooltip position styles
  const positionStyles = {
    top: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 transform -translate-y-1/2',
  };

  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg ${positionStyles[position]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
              position === 'top'
                ? 'bottom-[-4px] left-1/2 -translate-x-1/2'
                : position === 'bottom'
                ? 'top-[-4px] left-1/2 -translate-x-1/2'
                : position === 'left'
                ? 'right-[-4px] top-1/2 -translate-y-1/2'
                : 'left-[-4px] top-1/2 -translate-y-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
};

/**
 * TooltipProvider component.
 * Wraps the application or a part of it to provide tooltip functionality.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child elements.
 * @returns {JSX.Element} - The TooltipProvider component.
 */
export const TooltipProvider = ({ children }) => {
  return <div>{children}</div>;
};

/**
 * TooltipTrigger component.
 * The element that triggers the tooltip.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child elements.
 * @returns {JSX.Element} - The TooltipTrigger component.
 */
export const TooltipTrigger = ({ children }) => {
  return <div>{children}</div>;
};

/**
 * TooltipContent component.
 * The content to display inside the tooltip.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child elements.
 * @returns {JSX.Element} - The TooltipContent component.
 */
export const TooltipContent = ({ children }) => {
  return <div>{children}</div>;
};