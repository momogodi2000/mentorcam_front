import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext({});

export const Tabs = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ${className}`}
    {...props}
  >
    {children}
  </div>
));

TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef(({ className = '', value, children, ...props }, ref) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
      ${isActive ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50' : ''} 
      ${className}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef(({ className = '', value, children, ...props }, ref) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;

  return (
    <div
      ref={ref}
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

TabsContent.displayName = 'TabsContent';