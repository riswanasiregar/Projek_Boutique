export default function Button({variant = 'primary',size = 'md',disabled = false,loading = false,
  onClick,type = 'button',className = '', style, children,}) 
  {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base',};
  const types = {
    primary:  'bg-primary-3 text-neutral hover:opacity-90',
    gradient: 'bg-gradient-primary text-neutral hover:opacity-90',
    outline:  'border border-primary-3 text-primary-3 hover:bg-primary-3 hover:text-neutral',
    ghost:    'bg-neutral-bg text-neutral-teks hover:bg-neutral-border',
    danger:   'bg-secondary/10 text-secondary hover:bg-secondary/20',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      className={`rounded-xl font-semibold transition-all disabled:opacity-50
        flex items-center justify-center gap-2 font-inter
        ${sizes[size]} ${types[variant]} ${className}`}>
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  );
}
export function PillButton({ active, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all font-inter
        ${active ? 'bg-primary-3 text-neutral' : 'bg-neutral-bg text-neutral-teks'}
        ${className}`}>
      {children}
    </button>
  );
}
