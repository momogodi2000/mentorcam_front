// slider.tsx
import * as React from "react"
// Slider Component
export const Slider = React.forwardRef(({ className, defaultValue, max = 100, step = 1, onValueChange, ...props }, ref) => {
    const [value, setValue] = React.useState(defaultValue || [0, max]);
  
    const handleChange = (newValue) => {
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };
  
    return (
      <div
        ref={ref}
        className={`relative flex w-full touch-none select-none items-center ${className}`}
        {...props}
      >
        <div className="relative w-full h-2 bg-secondary rounded-full">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${(value[0] / max) * 100}%`,
              right: `${100 - (value[1] / max) * 100}%`
            }}
          />
          {value.map((val, index) => (
            <div
              key={index}
              className="absolute w-5 h-5 bg-background border-2 border-primary rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              style={{
                left: `calc(${(val / max) * 100}% - 10px)`,
                top: '-6px'
              }}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={max}
              aria-valuenow={val}
              tabIndex={0}
              onKeyDown={(e) => {
                const newValue = [...value];
                if (e.key === 'ArrowLeft') {
                  newValue[index] = Math.max(0, val - step);
                  handleChange(newValue);
                } else if (e.key === 'ArrowRight') {
                  newValue[index] = Math.min(max, val + step);
                  handleChange(newValue);
                }
              }}
            />
          ))}
        </div>
      </div>
    );
  });
  
  Slider.displayName = "Slider";