import React, { createContext, useContext, useId } from 'react';

// Create context for radio group
const RadioGroupContext = createContext(null);

export function RadioGroup({ value, onValueChange, className, children, ...props }) {
  const groupId = useId();
  
  return (
    <RadioGroupContext.Provider value={{ groupId, value, onValueChange }}>
      <div
        role="radiogroup"
        className={className}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, id, className, children, ...props }) {
  const { groupId, value: selectedValue, onValueChange } = useContext(RadioGroupContext);
  const radioId = id || `${groupId}-${value}`;
  const checked = selectedValue === value;

  return (
    <div className={className}>
      <input
        type="radio"
        id={radioId}
        value={value}
        checked={checked}
        onChange={() => onValueChange(value)}
        className="sr-only" // Visually hide the actual radio input
        {...props}
      />
      <label
        htmlFor={radioId}
        className={`relative flex items-center justify-center w-4 h-4 rounded-full border ${
          checked 
            ? 'border-blue-600 bg-blue-100' 
            : 'border-gray-400 bg-white'
        } cursor-pointer transition-colors`}
        onClick={() => onValueChange(value)}
      >
        {checked && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
          </span>
        )}
      </label>
    </div>
  );
}