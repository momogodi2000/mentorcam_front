import React from 'react';

const Switch = ({ checked, onCheckedChange, darkMode = false }) => {
    const handleToggle = () => {
        onCheckedChange(!checked);
    };

    return (
        <div 
            onClick={handleToggle} 
            className={`
                relative inline-flex items-center cursor-pointer
                w-12 h-6 rounded-full 
                ${checked ? 
                    (darkMode ? 'bg-blue-600' : 'bg-blue-500') : 
                    (darkMode ? 'bg-gray-700' : 'bg-gray-300')
                }
                transition-colors duration-300
            `}
        >
            <div 
                className={`
                    absolute top-1/2 -translate-y-1/2 
                    w-4 h-4 rounded-full 
                    bg-white 
                    transition-transform duration-300
                    ${checked ? 'translate-x-6' : 'translate-x-1'}
                    shadow-md
                `}
            />
        </div>
    );
};

export { Switch };
export default Switch;