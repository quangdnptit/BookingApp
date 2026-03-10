import { type InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`
        w-full px-3 py-2 rounded-lg bg-cinema-dark border border-cinema-border
        text-zinc-100 placeholder:text-cinema-muted
        focus:outline-none focus:ring-2 focus:ring-cinema-gold/50 focus:border-cinema-gold
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  )
);
Input.displayName = 'Input';
