import { type HTMLAttributes } from 'react';

export function Table({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-cinema-border">
      <table className={`w-full text-sm text-left ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-cinema-panel text-cinema-muted uppercase text-xs">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-cinema-border">{children}</tbody>;
}

export function TableRow({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`bg-cinema-dark hover:bg-cinema-panel/80 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function Th({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-4 py-3 font-medium ${className}`} {...props} />
  );
}

export function Td({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-4 py-3 ${className}`} {...props} />;
}
