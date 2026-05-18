export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon,
  rightIcon,
  onRightIconClick,
  variant = 'main',
  min,
}) {
  const isAuth = variant === 'auth';

  const baseClass = isAuth
    ? `w-full py-3 rounded-xl text-sm outline-none transition-all font-jakarta
       bg-neutral/15 border text-neutral placeholder:text-neutral/50
       ${error ? 'border-error/60' : 'border-neutral/35'}
       focus:border-neutral focus:bg-neutral/25
       ${icon ? 'pl-10' : 'pl-4'}
       ${rightIcon ? 'pr-11' : 'pr-4'}`
    : `w-full py-2.5 rounded-xl text-sm outline-none transition-all font-inter
       bg-neutral-bg border text-primary-2
       ${error ? 'border-error' : 'border-neutral-border'}
       focus:border-primary-3
       ${icon ? 'pl-10' : 'pl-4'}
       ${rightIcon ? 'pr-11' : 'pr-4'}`;

  const labelClass = isAuth
    ? 'block text-xs font-semibold mb-1.5 text-neutral/90 font-jakarta'
    : 'block text-xs font-semibold mb-1.5 text-primary-2 font-inter';

  const errorClass = isAuth
    ? 'text-xs mt-1 text-error/80 font-jakarta'
    : 'text-xs mt-1 text-error font-inter';

  const iconColor = isAuth ? 'text-neutral/60' : 'text-neutral-teks';
  const rightIconColor = isAuth
    ? 'text-neutral/70 hover:text-neutral'
    : 'text-neutral-teks hover:text-primary-3';

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      <div className="relative">
        {icon && (
          <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${iconColor}`}>
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          className={baseClass}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${rightIconColor}`}>
            {rightIcon}
          </button>
        )}
      </div>
      {error && <p className={errorClass}>⚠ {error}</p>}
    </div>
  );
}
