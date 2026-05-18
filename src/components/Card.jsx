export default function Card({ children, className = '', padding = true }) {
  return (
    <div className={`rounded-2xl bg-neutral border border-neutral-border
      ${padding ? 'p-5' : 'overflow-hidden'}
      ${className}`}>
      {children}
    </div>
  );
}
export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border">
      <div>
        <p className="text-base font-semibold text-primary-2 font-inter">{title}</p>
        {subtitle && <p className="text-xs text-neutral-teks font-inter mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
export function StatCard({ label, value, sub, iconBg, iconColor, icon }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 bg-neutral border border-neutral-border
      transition-shadow hover:shadow-md">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
        ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium mb-0.5 text-neutral-teks font-inter">{label}</p>
        <p className="text-xl font-bold text-primary-2 font-inter">{value}</p>
        {sub && <p className="text-xs text-neutral-gray font-inter mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
