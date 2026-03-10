import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-cinema-gold text-cinema-dark hover:bg-cinema-gold/90 focus:ring-cinema-gold/50',
  secondary:
    'bg-cinema-panel border border-cinema-border text-zinc-200 hover:bg-cinema-border',
  danger:
    'bg-red-600/90 text-white hover:bg-red-600 focus:ring-red-500/50',
  ghost:
    'text-zinc-400 hover:bg-cinema-border hover:text-zinc-200',
};

export function Button({
  variant = 'primary',
  type = 'button',
  loading,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cinema-dark
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
