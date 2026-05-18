/**
 * SearchBar — input pencarian standalone
 *
 * Props:
 * - value: string
 * - onChange: function(value: string)
 * - placeholder: string (default: 'Search...')
 * - variant: 'pill' | 'rounded' (default: 'pill')
 * - width: string (Tailwind class, default: 'w-64')
 * - className: string
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  variant = 'pill',
  width = 'w-64',
  className = '',
}) {
  const shapeClass = variant === 'pill' ? 'rounded-full' : 'rounded-xl';

  return (
    <div className={`relative ${width} ${className}`}>
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-teks pointer-events-none"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2.5 text-sm outline-none transition-all font-inter
          bg-neutral-bg border border-neutral-border text-primary-2
          placeholder:text-neutral-teks
          focus:border-primary-3 focus:bg-neutral
          ${shapeClass}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-teks
            hover:text-primary-2 transition-colors text-base leading-none">
          ✕
        </button>
      )}
    </div>
  );
}
