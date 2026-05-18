export default function Divider({ label, variant = 'main', className = '' }) {
  const isAuth = variant === 'auth';
  const lineClass = isAuth ? 'bg-neutral/25' : 'bg-neutral-border';
  const textClass = isAuth ? 'text-neutral/60 font-jakarta' : 'text-neutral-teks font-inter';

  if (!label) {
    return <div className={`h-px w-full ${lineClass} ${className}`} />;
  }
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 h-px ${lineClass}`} />
      <span className={`text-xs ${textClass}`}>{label}</span>
      <div className={`flex-1 h-px ${lineClass}`} />
    </div>
  );
}
