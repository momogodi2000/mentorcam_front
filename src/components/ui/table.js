import React from 'react';

// Table component
export const Table = ({ children, className, ...props }) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className || ''}`} {...props}>
        {children}
      </table>
    </div>
  );
};

// Table Header component
export const TableHeader = ({ children, className, ...props }) => {
  return (
    <thead className={`[&_tr]:border-b ${className || ''}`} {...props}>
      {children}
    </thead>
  );
};

// Table Body component
export const TableBody = ({ children, className, ...props }) => {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props}>
      {children}
    </tbody>
  );
};

// Table Footer component
export const TableFooter = ({ children, className, ...props }) => {
  return (
    <tfoot className={`border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 ${className || ''}`} {...props}>
      {children}
    </tfoot>
  );
};

// Table Row component
export const TableRow = ({ children, className, ...props }) => {
  return (
    <tr 
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className || ''}`} 
      {...props}
    >
      {children}
    </tr>
  );
};

// Table Head component
export const TableHead = ({ children, className, ...props }) => {
  return (
    <th 
      className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ''}`} 
      {...props}
    >
      {children}
    </th>
  );
};

// Table Cell component
export const TableCell = ({ children, className, ...props }) => {
  return (
    <td 
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`} 
      {...props}
    >
      {children}
    </td>
  );
};

// Table Caption component
export const TableCaption = ({ children, className, ...props }) => {
  return (
    <caption 
      className={`mt-4 text-sm text-muted-foreground ${className || ''}`} 
      {...props}
    >
      {children}
    </caption>
  );
};

