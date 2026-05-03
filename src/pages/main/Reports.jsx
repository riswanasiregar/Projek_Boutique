import PageHeader from '../../components/PageHeader';

const B = { primary: '#3d2e22', accent: '#c9a96e', text: '#3d2e22', muted: '#9a8878' };

const reports = [
  { id: 1, name: 'Monthly Sales Report', desc: 'Complete sales breakdown by product and category', date: '2026-03-31', size: '2.4 MB', type: 'PDF', icon: '📊' },
  { id: 2, name: 'Customer Loyalty Report', desc: 'Gold, Silver, Bronze tier analysis and trends', date: '2026-03-31', size: '1.8 MB', type: 'PDF', icon: '👑' },
  { id: 3, name: 'Inventory Status Report', desc: 'Current stock levels and low stock alerts', date: '2026-03-28', size: '0.9 MB', type: 'XLSX', icon: '📦' },
  { id: 4, name: 'Revenue Analytics Q1', desc: 'Quarterly revenue performance and forecasts', date: '2026-03-25', size: '3.1 MB', type: 'PDF', icon: '💰' },
  { id: 5, name: 'Order Fulfillment Report', desc: 'Delivery rates, cancellations, and pending orders', date: '2026-03-20', size: '1.2 MB', type: 'PDF', icon: '🚚' },
  { id: 6, name: 'Promotions Effectiveness', desc: 'Promo code usage and ROI analysis', date: '2026-03-15', size: '0.7 MB', type: 'XLSX', icon: '🏷️' },
];

export default function Reports() {
  return (
    <div>
      <PageHeader title="Reports" breadcrumb={['Dashboard', 'Reports']}>
        <button className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: '#3d2e22', color: '#c9a96e' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generate Report
        </button>
      </PageHeader>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Reports Generated', value: '24', icon: '📋' },
          { label: 'This Month', value: '6', icon: '📅' },
          { label: 'Scheduled', value: '3', icon: '⏰' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold" style={{ color: B.text }}>{s.value}</p>
              <p className="text-xs" style={{ color: B.muted }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reports list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #f0ebe4', background: '#faf7f4' }}>
          <h3 className="text-sm font-bold" style={{ color: B.text }}>Recent Reports</h3>
        </div>
        <div className="divide-y" style={{ borderColor: '#f5f0eb' }}>
          {reports.map(r => (
            <div key={r.id} className="px-6 py-4 flex items-center gap-4 transition-colors"
              onMouseEnter={e => e.currentTarget.style.background = '#faf7f4'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: '#f7f3e8' }}>
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: B.text }}>{r.name}</p>
                <p className="text-xs mt-0.5" style={{ color: B.muted }}>{r.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-medium" style={{ color: B.muted }}>{r.date}</p>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  <span className="text-xs px-2 py-0.5 rounded-md font-semibold"
                    style={{ background: r.type === 'PDF' ? '#f5eeec' : '#eef4ee', color: r.type === 'PDF' ? '#8a4a3a' : '#4a7c59' }}>
                    {r.type}
                  </span>
                  <span className="text-xs" style={{ color: B.muted }}>{r.size}</span>
                </div>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ color: '#c9a96e' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f7f3e8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
