export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  variant = 'main',
  required = false,
  error,
}) {
  const isAuth = variant === 'auth';
  const baseClass = isAuth
    ? `w-full px-4 py-3 rounded-xl text-sm outline-none font-jakarta
       bg-neutral/15 border text-neutral
       ${error ? 'border-error/60' : 'border-neutral/35'}
       focus:border-neutral`
    : `w-full px-4 py-2.5 rounded-xl text-sm outline-none font-inter
       bg-neutral-bg border text-primary-2
       ${error ? 'border-error' : 'border-neutral-border'}
       focus:border-primary-3`;

  const labelClass = isAuth
    ? 'block text-xs font-semibold mb-1.5 text-neutral/90 font-jakarta'
    : 'block text-xs font-semibold mb-1.5 text-primary-2 font-inter';

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={baseClass}>
        {options.map(opt => {
          const val   = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          return <option key={val} value={val}>{label}</option>;
        })}
      </select>
      {error && (
        <p className={`text-xs mt-1 ${isAuth ? 'text-error/80 font-jakarta' : 'text-error font-inter'}`}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
