import { useOutletContext } from 'react-router-dom';
import ordersData from '../../data/orders.json';
import customersData from '../../data/customers.json';
import PageHeader from '../../components/PageHeader';

const B = { primary: '#3d2e22', accent: '#c9a96e', bg: '#f5f0eb', surface: '#ede5d8', border: '#d4c4b0', text: '#3d2e22', muted: '#9a8878' };

export default function Analytics() {
  const totalRevenue = ordersData.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalPrice, 0);
  const avgOrder = Math.round(totalRevenue / ordersData.filter(o => o.status === 'Completed').length);

  const monthlyData = [
    { month: 'Jan', revenue: 1250000, orders: 8 },
    { month: 'Feb', revenue: 1820000, orders: 12 },
    { month: 'Mar', revenue: 2100000, orders: 10 },
  ];
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  const topCustomers = [...customersData]
    .filter(c => c.loyalty === 'Gold')
    .slice(0, 5)
    .map(c => ({ ...c, spent: Math.floor(Math.random() * 500000) + 200000 }));

  return (
    <div>
      <PageHeader title="Analytics" breadcrumb={['Dashboard', 'Analytics']}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
          style={{ background: '#ede5d8', border: '1px solid #d4c4b0', color: '#8b7355' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Q1 2026
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: `Rp ${(totalRevenue/1000000).toFixed(1)}M`, sub: '+18% vs last quarter', icon: '💰', up: true },
          { label: 'Avg Order Value', value: `Rp ${avgOrder.toLocaleString('id-ID')}`, sub: '+5% vs last quarter', icon: '🛍️', up: true },
          { label: 'Conversion Rate', value: '68.3%', sub: '+2.1% vs last quarter', icon: '📈', up: true },
          { label: 'Return Rate', value: '3.2%', sub: '-0.8% vs last quarter', icon: '↩️', up: false },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={kpi.up ? { background: '#eef4ee', color: '#4a7c59' } : { background: '#f5eeec', color: '#8a4a3a' }}>
                {kpi.up ? '↑' : '↓'}
              </span>
            </div>
            <p className="text-xl font-bold" style={{ color: B.text }}>{kpi.value}</p>
            <p className="text-xs font-medium mt-0.5" style={{ color: B.muted }}>{kpi.label}</p>
            <p className="text-xs mt-1" style={{ color: kpi.up ? '#4a7c59' : '#8a4a3a' }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold" style={{ color: B.text }}>Monthly Revenue</h3>
              <p className="text-xs mt-0.5" style={{ color: B.muted }}>Q1 2026 performance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#c9a96e' }} />
                <span className="text-xs" style={{ color: B.muted }}>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#3d2e22' }} />
                <span className="text-xs" style={{ color: B.muted }}>Orders</span>
              </div>
            </div>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-6 h-40">
            {monthlyData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end gap-1.5 h-32">
                  <div className="flex-1 rounded-t-lg transition-all"
                    style={{ height: `${(d.revenue / maxRevenue) * 100}%`, background: '#c9a96e', minHeight: '8px' }} />
                  <div className="flex-1 rounded-t-lg transition-all"
                    style={{ height: `${(d.orders / 15) * 100}%`, background: '#3d2e22', minHeight: '8px' }} />
                </div>
                <p className="text-xs font-semibold" style={{ color: B.muted }}>{d.month}</p>
                <p className="text-xs font-bold" style={{ color: B.text }}>
                  Rp {(d.revenue/1000000).toFixed(1)}M
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top customers */}
        <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: B.text }}>Top Gold Customers</h3>
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-sm font-bold w-5 text-center" style={{ color: B.muted }}>{i + 1}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: '#f7f3e8', color: '#8a6d2f' }}>{c.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: B.text }}>{c.name}</p>
                  <p className="text-xs" style={{ color: B.muted }}>Rp {c.spent.toLocaleString('id-ID')}</p>
                </div>
                <span className="text-xs">👑</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category performance */}
      <div className="mt-4 rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: B.text }}>Category Performance</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Dress', sales: 38, revenue: 1580000, trend: '+12%', up: true },
            { name: 'Outerwear', sales: 27, revenue: 2240000, trend: '+8%', up: true },
            { name: 'Top', sales: 20, revenue: 480000, trend: '-2%', up: false },
            { name: 'Bottom', sales: 15, revenue: 720000, trend: '+5%', up: true },
          ].map(cat => (
            <div key={cat.name} className="rounded-xl p-4" style={{ background: '#faf7f4', border: '1px solid #ede5d8' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: B.text }}>{cat.name}</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={cat.up ? { background: '#eef4ee', color: '#4a7c59' } : { background: '#f5eeec', color: '#8a4a3a' }}>
                  {cat.trend}
                </span>
              </div>
              <p className="text-xs" style={{ color: B.muted }}>{cat.sales}% of sales</p>
              <p className="text-sm font-bold mt-1" style={{ color: '#c9a96e' }}>
                Rp {(cat.revenue/1000000).toFixed(1)}M
              </p>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: '#e2d9ce' }}>
                <div className="h-full rounded-full" style={{ width: `${cat.sales}%`, background: '#c9a96e' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
