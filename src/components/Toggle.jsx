/**
 * Toggle — switch on/off reusable
 *
 * Props:
 * - checked: boolean
 * - onChange: function(checked: boolean)
 * - label: string (teks di samping toggle, opsional)
 * - description: string (teks kecil di bawah label, opsional)
 * - disabled: boolean
 * - size: 'sm' | 'md' (default: 'md')
 */
export default function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}) {
  const track_types = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
  };

  const thumb_types = {
    sm: 'w-3 h-3 top-0.5',
    md: 'w-4 h-4 top-0.5',
  };

  const offset_types = {
    sm: { on: '18px', off: '2px' },
    md: { on: '22px', off: '2px' },
  };

  return (
    <label className={`flex items-center justify-between gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <p className="text-xs font-semibold text-primary-2 font-inter">{label}</p>
          )}
          {description && (
            <p className="text-xs text-neutral-teks font-inter mt-0.5">{description}</p>
          )}
        </div>
      )}

      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`${track_types[size]} rounded-full transition-colors duration-200`}
          style={{ background: checked ? 'var(--color-primary-3, #2D60FF)' : 'var(--color-neutral-border, #E6EFF5)' }}
        />
        <div
          className={`absolute ${thumb_types[size]} rounded-full bg-white shadow transition-all duration-200`}
          style={{ left: checked ? offset_types[size].on : offset_types[size].off }}
        />
      </div>
    </label>
  );
}

/**
 * ToggleGroup — kumpulan toggle dalam satu card
 *
 * Props:
 * - title: string
 * - items: Array<{ key, label, description }>
 * - values: object (key → boolean)
 * - onChange: function(key, checked)
 */
export function ToggleGroup({ title, items = [], values = {}, onChange }) {
  return (
    <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
      {title && (
        <p className="text-sm font-semibold text-primary-2 font-inter mb-4">{title}</p>
      )}
      <div className="space-y-4">
        {items.map(item => (
          <Toggle
            key={item.key}
            checked={!!values[item.key]}
            onChange={checked => onChange?.(item.key, checked)}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}
