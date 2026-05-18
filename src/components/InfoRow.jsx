
export default function InfoRow({ rows = [], title, action }) {
  return (
    <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <p className="text-sm font-semibold text-primary-2 font-inter">{title}</p>}
          {action && <div>{action}</div>}
        </div>
      )}
      {rows.map(row => (
        <div key={row.label}
          className="flex items-center justify-between py-2.5 border-b border-neutral-border last:border-0">
          <span className="text-xs text-neutral-teks font-inter">{row.label}</span>
          <span className={`text-xs font-semibold text-primary-2 ${row.mono ? 'font-mono' : 'font-inter'}`}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
