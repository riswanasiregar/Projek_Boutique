export default function PageHeader({ title, breadcrumb, children }) {
  const crumbs = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb];
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <nav className="flex items-center gap-1.5 mb-1">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="w-3 h-3" style={{ color: '#c9b99a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              <span className="text-xs font-medium"
                style={{ color: i === crumbs.length - 1 ? '#c9a96e' : '#9a8878' }}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
        <h1 className="text-xl font-bold" style={{ color: '#3d2e22' }}>{title}</h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
