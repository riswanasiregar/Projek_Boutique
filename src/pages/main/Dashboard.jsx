import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import ordersData from '../../data/orders.json';
import customersData from '../../data/customers.json';
import PageHeader from '../../components/PageHeader';

function StatusBadge({ status }) {
  const map = {
    Completed: { bg: '#eef4ee', color: '#4a7c59', dot: '#6aab7a' },
    Pending:   { bg: '#f7f3e8', color: '#8a6d2f', dot: '#c9a84c' },
    Cancelled: { bg: '#f5eeec', color: '#8a4a3a', dot: '#c97060' },
  };
  const s = map[status] || { bg: '#f5f0eb', color: '#8a7060', dot: '#c9b99a' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

export function computeStats(orders, customers) {
  const totalOrders = orders.length;
  const totalDelivered = orders.filter(o => o.status === 'Completed').length;
  const totalCancelled = orders.filter(o => o.status === 'Cancelled').length;
  const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalPrice, 0);
  const totalCustomers = customers.length;
  return { totalOrders, totalDelivered, totalCancelled, totalRevenue, totalCustomers };
}

export function getRecentOrders(orders) {
  return [...orders].reverse().slice(0, 5);
}

export default function Dashboard() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const stats = computeStats(ordersData, customersData);
  const recentOrders = getRecentOrders(ordersData).filter(o => {
    const q = searchQuery.toLowerCase();
    return !q || o.customerName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
  });

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, change: '+12%', up: true,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
      iconBg: '#3d2e22', iconColor: '#c9a96e' },
    { label: 'Delivered', value: stats.totalDelivered, change: '+8%', up: true,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" /></svg>,
      iconBg: '#4a6a4a', iconColor: '#a8c9a0' },
    { label: 'Cancelled', value: stats.totalCancelled, change: '-3%', up: false,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" /></svg>,
      iconBg: '#6a4040', iconColor: '#c9a8a0' },
    { label: 'Revenue', value: `Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`, change: '+18%', up: true,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconBg: '#5a4020', iconColor: '#c9a96e' },
    { label: 'Customers', value: stats.totalCustomers, change: '+5%', up: true,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      iconBg: '#4a5040', iconColor: '#a8b8c0' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" breadcrumb={['Dashboard', 'Overview']}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs"
          style={{ background: '#ede5d8', border: '1px solid #d4c4b0', color: '#8b7355' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Jan – Mar 2026
        </div>
      </PageHeader>

      {/* Fashion quote banner */}
      <div className="rounded-2xl px-6 py-4 mb-6 flex items-center justify-between overflow-hidden relative"
        style={{ background: '#3d2e22' }}>
        <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10"
          style={{ background: 'radial-gradient(circle at right, #c9a96e, transparent)' }} />
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: '#c9a96e' }} />
        <div className="pl-4">
          <p className="text-xs font-medium mb-1" style={{ color: '#c9a96e' }}>✦ Style of the Day</p>
          <p className="text-sm font-semibold italic" style={{ color: '#f5f0eb' }}>
            "Fashion is the armor to survive the reality of everyday life."
          </p>
          <p className="text-xs mt-1" style={{ color: '#7a6a5a' }}>— Bill Cunningham</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0 ml-6">
          {['Dress', 'Top', 'Bottom', 'Outerwear'].map(cat => (
            <span key={cat} className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: '#4e3c2e', color: '#c4b5a5' }}>{cat}</span>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statCards.map(card => (
          <div key={card.label} className="rounded-2xl p-5 transition-shadow hover:shadow-md"
            style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.iconBg, color: card.iconColor }}>
                {card.icon}
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={card.up
                  ? { background: '#eef4ee', color: '#4a7c59' }
                  : { background: '#f5eeec', color: '#8a4a3a' }}>
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#3d2e22' }}>{card.value}</p>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#9a8878' }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid #f0ebe4' }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: '#3d2e22' }}>Recent Orders</h2>
              <p className="text-xs mt-0.5" style={{ color: '#9a8878' }}>
                {searchQuery ? `Filtered by "${searchQuery}"` : 'Latest 5 transactions'}
              </p>
            </div>
            <Link to="/orders"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: '#3d2e22', color: '#c9a96e' }}>
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#faf7f4' }}>
                  {['Order', 'Customer', 'Status', 'Total'].map((h, i) => (
                    <th key={h} className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider ${i === 3 ? 'text-right' : 'text-left'}`}
                      style={{ color: '#9a8878' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-xs" style={{ color: '#9a8878' }}>
                    No orders match your search
                  </td></tr>
                ) : recentOrders.map((order, i) => (
                  <tr key={order.id} style={{ borderTop: i > 0 ? '1px solid #f5f0eb' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#faf7f4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md"
                        style={{ background: '#f5f0eb', color: '#8b7355' }}>{order.id}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium" style={{ color: '#3d2e22' }}>{order.customerName}</p>
                      <p className="text-xs" style={{ color: '#9a8878' }}>{order.orderDate}</p>
                    </td>
                    <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-3.5 text-right font-bold" style={{ color: '#3d2e22' }}>
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {/* Order status */}
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#3d2e22' }}>Order Status</h3>
            {[
              { label: 'Completed', count: stats.totalDelivered, color: '#6aab7a', bg: '#eef4ee' },
              { label: 'Pending', count: stats.totalOrders - stats.totalDelivered - stats.totalCancelled, color: '#c9a84c', bg: '#f7f3e8' },
              { label: 'Cancelled', count: stats.totalCancelled, color: '#c97060', bg: '#f5eeec' },
            ].map(item => (
              <div key={item.label} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: '#5a4535' }}>{item.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: item.bg, color: item.color }}>{item.count}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f0ebe4' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${Math.round((item.count / stats.totalOrders) * 100)}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Loyalty */}
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#3d2e22' }}>Customer Loyalty</h3>
            {[
              { tier: 'Gold', bg: '#f7f3e8', color: '#8a6d2f', icon: '👑' },
              { tier: 'Silver', bg: '#f0f4f8', color: '#4a6080', icon: '⭐' },
              { tier: 'Bronze', bg: '#f5eeec', color: '#8a5a4a', icon: '🥉' },
            ].map(item => {
              const count = customersData.filter(c => c.loyalty === item.tier).length;
              return (
                <div key={item.tier} className="flex items-center justify-between py-2.5"
                  style={{ borderBottom: '1px solid #f5f0eb' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                      style={{ background: item.bg }}>{item.icon}</span>
                    <span className="text-xs font-medium" style={{ color: '#5a4535' }}>{item.tier}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#3d2e22' }}>{count} members</span>
                </div>
              );
            })}
          </div>

          {/* Top categories */}
          <div className="rounded-2xl p-5" style={{ background: '#3d2e22' }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: '#f5f0eb' }}>Top Categories</h3>
            {[
              { name: 'Dress', pct: 38 },
              { name: 'Outerwear', pct: 27 },
              { name: 'Top', pct: 20 },
              { name: 'Bottom', pct: 15 },
            ].map(cat => (
              <div key={cat.name} className="flex items-center justify-between py-1.5">
                <span className="text-xs" style={{ color: '#c4b5a5' }}>{cat.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#4e3c2e' }}>
                    <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: '#c9a96e' }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#c9a96e' }}>{cat.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
