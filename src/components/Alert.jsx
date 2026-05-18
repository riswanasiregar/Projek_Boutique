export default function Alert({ variant = 'error', message, className = '' }) {
  const types = {
    error:   'bg-error/20 text-neutral border border-error/40',
    loading: 'bg-neutral/15 text-neutral border border-neutral/25',
    success: 'bg-success/20 text-neutral border border-success/40',
    warning: 'bg-warning/20 text-primary-2 border border-warning/40',
  };

  return (
    <div className={`flex items-center gap-2 text-xs rounded-xl px-4 py-3 font-jakarta
      ${types[variant]} ${className}`}>
      {variant === 'loading' && (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
      {variant === 'error' && <span className="flex-shrink-0">⚠</span>}
      {variant === 'success' && <span className="flex-shrink-0">✓</span>}
      {message}
    </div>
  );
}
