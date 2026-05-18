/**
 * TextArea — textarea reusable
 *
 * Props:
 * - label, name, value, onChange, placeholder
 * - rows: number (default: 3)
 * - required, error
 * - variant: 'main' | 'auth' (default: 'main')
 */
export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  error,
  variant = 'main',
}) {
  const isAuth = variant === 'auth';

  const baseClass = isAuth
    ? `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all font-jakarta
       bg-neutral/15 border text-neutral placeholder:text-neutral/50 resize-none
       ${error ? 'border-error/60' : 'border-neutral/35'}
       focus:border-neutral focus:bg-neutral/25`
    : `w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all font-inter
       bg-neutral-bg border text-primary-2 resize-none
       ${error ? 'border-error' : 'border-neutral-border'}
       focus:border-primary-3`;

  const labelClass = isAuth
    ? 'block text-xs font-semibold mb-1.5 text-neutral/90 font-jakarta'
    : 'block text-xs font-semibold mb-1.5 text-primary-2 font-inter';

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={baseClass}
      />
      {error && (
        <p className={`text-xs mt-1 ${isAuth ? 'text-error/80 font-jakarta' : 'text-error font-inter'}`}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
