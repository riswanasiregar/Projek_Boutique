export default function Container({ children, className = '', spacing = 'md' }) {
  const types = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
  };
  return (
    <div className={`font-inter ${types[spacing]} ${className}`}>
      {children}
    </div>
  );
}
export function PageSection({ cols = 1, gap = 'md', children, className = '' }) {
  const cols_types = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };
  const gap_types = { sm: 'gap-4', md: 'gap-5', lg: 'gap-6' };
  return (
    <div className={`grid ${cols_types[cols]} ${gap_types[gap]} ${className}`}>
      {children}
    </div>
  );
}
export function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <p className="text-sm font-semibold text-primary-2 font-inter">{title}</p>
        {subtitle && (
          <p className="text-xs text-neutral-teks font-inter mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
