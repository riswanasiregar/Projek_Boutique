export default function LineChart({
  data = [],
  color = '#2D60FF',
  height = 120,
  yLabels = [],
  xLabels = [],
  title,
  badge,
  badgeBg = 'bg-accent-blue-shadow',
  badgeText = 'text-primary-3',
}) {
  const max   = Math.max(...data) || 1;
  const min   = Math.min(...data);
  const range = max - min || 1;
  const w     = 300;
  const h     = height;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 20) + 10;
    const y = h - 10 - ((v - min) / range) * (h - 20);
    return `${x},${y}`;
  }).join(' ');

  const gradId = `grad-${color.replace('#', '')}`;

  return (
    <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
      {/* Header */}
      {(title || badge) && (
        <div className="flex items-center justify-between mb-4">
          {title && <p className="text-base font-semibold text-primary-2 font-inter">{title}</p>}
          {badge && (
            <span className={`text-xs px-3 py-1 rounded-full font-medium font-inter ${badgeBg} ${badgeText}`}>
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Chart area */}
      <div className="flex gap-2">
        {/* Y axis */}
        {yLabels.length > 0 && (
          <div className="flex flex-col justify-between text-right pr-2" style={{ minWidth: '40px' }}>
            {yLabels.map(v => (
              <span key={v} className="text-xs text-neutral-teks font-inter">{v}</span>
            ))}
          </div>
        )}

        {/* SVG */}
        <div className="flex-1">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0"   />
              </linearGradient>
            </defs>
            <polygon
              points={`10,${h} ${pts} ${(data.length - 1) / (data.length - 1) * (w - 20) + 10},${h}`}
              fill={`url(#${gradId})`}
            />
            <polyline
              points={pts}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* X axis */}
          {xLabels.length > 0 && (
            <div className="flex justify-between mt-1">
              {xLabels.map(m => (
                <span key={m} className="text-neutral-teks font-inter" style={{ fontSize: '9px' }}>{m}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
