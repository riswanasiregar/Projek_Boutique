export default function Spinner({ size = 'md', color = 'primary', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
  };
  const types = {
    primary: 'border-primary-3 border-t-transparent',
    neutral: 'border-neutral border-t-transparent',
    muted:   'border-neutral-teks border-t-transparent',
  };
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`rounded-full animate-spin flex-shrink-0
        ${sizes[size]} ${types[color]} ${className}`}
    />
  );
}
export function SpinnerOverlay({ label }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3
      bg-neutral/70 backdrop-blur-sm rounded-2xl z-10">
      <Spinner size="lg" />
      {label && (
        <p className="text-xs text-neutral-teks font-inter">{label}</p>
      )}
    </div>
  );
}
