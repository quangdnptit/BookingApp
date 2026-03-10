import { type SelectHTMLAttributes, forwardRef } from 'react';

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }
>(({ className = '', options, ...props }, ref) => (
  <select
    ref={ref}
    className={`
      w-full px-3 py-2 rounded-lg bg-cinema-dark border border-cinema-border
      text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cinema-gold/50 focus:border-cinema-gold
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
    {...props}
  >
    <option value="">Select...</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
));
Select.displayName = 'Select';
