import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import ordersData from '../../data/orders.json';
import customersData from '../../data/customers.json';

/* ── Font Inter ── */
const F = { fontFamily: '"Inter", sans-serif' };

/* ── Palette dari tailwind.css ── */
const C = {
  primary3:      '#2D60FF',
  primary2:      '#343C6A',
  primary1:      '#FEAA09',
  secondary:     '#FE5C73',
  accentGreen:   '#16DBCC',
  accentGreenBg: '#DCFAF8',
  accentPink:    '#FF82AC',
  accentPinkBg:  '#FFE0EB',
  accentBlue:    '#396AFF',
  accentBlueBg:  '#E7EDFF',
  teks:          '#718EBF',
  neutral:       '#FFFFFF',
  gray:          '#B1B1B1',
  bg:            '#F5F7FA',
  border:        '#E6EFF5',
  cardBg:        '#FFFFFF',
  text:          '#232323',
};

/* ── Line Chart SVG ── */
function LineChart({ data, color, height = 100 }) {
  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 300; const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 20) + 10;
    const y = h - 10 - ((v - min) / range) * (h - 20);
    return `${x},${y}`;
  }).join(' ');
  const areaClose = `${(data.length - 1) / (data.length - 1) * (w - 20) + 10},${h} 10,${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`10,${h} ${pts} ${areaClose}`}
        fill={`url(#grad-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const map = {
    Completed: { bg: '#DCFAF8', color: '#16DBCC' },
    Pending:   { bg: '#FFF5D9', color: '#FFBB38' },
    Cancelled: { bg: '#FFE0EB', color: '#FE5C73' },
  };
  const s = map[status] || { bg: '#E7EDFF', color: '#396AFF' };
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color, ...F }}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { searchQuery = '' } = useOutletContext?.() || {};

  const totalOrders  = ordersData.length;
  const completed    = ordersData.filter(o => o.status === 'Completed').length;
  const pending      = ordersData.filter(o => o.status === 'Pending').length;
  const cancelled    = ordersData.filter(o => o.status === 'Cancelled').length;
  const totalRevenue = ordersData.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalPrice, 0);
  const totalCust    = customersData.length;

  const recentOrders = [...ordersData].reverse().slice(0, 5).filter(o => {
    const q = searchQuery.toLowerCase();
    return !q || o.customerName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
  });

  /* Stat cards — persis seperti referensi */
  const statCards = [
    {
      label: 'Total Orders',
      value: totalOrders,
      sub: `${completed} completed`,
      iconBg: C.accentGreenBg,
      iconColor: C.accentGreen,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Total Customers',
      value: totalCust,
      sub: `${customersData.filter(c => c.loyalty === 'Gold').length} gold members`,
      iconBg: C.accentPinkBg,
      iconColor: C.accentPink,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Revenue',
      value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`,
      sub: 'from completed orders',
      iconBg: C.accentBlueBg,
      iconColor: C.accentBlue,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  /* Chart data */
  const orderChartData  = [8, 12, 7, 15, 10, 18, 14, 20, 16, 22, 18, completed];
  const revenueChartData = [320, 480, 290, 610, 520, 740, 680, 800, 720, 900, 850, Math.round(totalRevenue / 50000)];

  return (
    <div className="space-y-6" style={{ ...F, background: C.bg, minHeight: '100%' }}>

      {/* ── Row 1: Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map(card => (
          <div key={card.label}
            className="rounded-2xl p-5 flex items-center gap-4 transition-shadow hover:shadow-md"
            style={{ background: C.cardBg, border: `1px solid ${C.border}` }}>
            {/* Icon bulat */}
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: card.iconBg, color: card.iconColor }}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: C.teks }}>{card.label}</p>
              <p className="text-2xl font-bold" style={{ color: C.text, ...F }}>{card.value}</p>
              <p className="text-xs mt-0.5" style={{ color: C.gray }}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Orders Chart */}
        <div className="rounded-2xl p-5" style={{ background: C.cardBg, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold" style={{ color: C.text, ...F }}>Yearly Total Orders</p>
            <span className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: C.accentBlueBg, color: C.primary3 }}>2026</span>
          </div>
          {/* Y axis labels */}
          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-right pr-2" style={{ minWidth: '40px' }}>
              {['20', '15', '10', '5', '0'].map(v => (
                <span key={v} className="text-xs" style={{ color: C.teks }}>{v}</span>
              ))}
            </div>
            <div className="flex-1">
              <LineChart data={orderChartData} color={C.primary1} height={120} />
              <div className="flex justify-between mt-1">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                  <span key={m} className="text-xs" style={{ color: C.teks, fontSize: '9px' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="rounded-2xl p-5" style={{ background: C.cardBg, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold" style={{ color: C.text, ...F }}>Monthly Revenue</p>
            <span className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: C.accentGreenBg, color: C.accentGreen }}>2026</span>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-right pr-2" style={{ minWidth: '40px' }}>
              {['900', '600', '300', '100', '0'].map(v => (
                <span key={v} className="text-xs" style={{ color: C.teks }}>{v}K</span>
              ))}
            </div>
            <div className="flex-1">
              <LineChart data={revenueChartData} color={C.accentGreen} height={120} />
              <div className="flex justify-between mt-1">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                  <span key={m} className="text-xs" style={{ color: C.teks, fontSize: '9px' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent Orders + Customers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Orders */}
        <div className="rounded-2xl overflow-hidden" style={{ background: C.cardBg, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${C.border}` }}>
            <p className="text-base font-semibold" style={{ color: C.text, ...F }}>Recent Orders</p>
            <Link to="/orders" className="text-xs font-semibold hover:underline"
              style={{ color: C.primary3 }}>
              View All
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['Order ID', 'Customer', 'Date', 'Status', 'Total'].map((h, i) => (
                  <th key={h}
                    className={`px-4 py-3 text-xs font-semibold ${i === 4 ? 'text-right' : 'text-left'}`}
                    style={{ color: C.teks, ...F }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={order.id}
                  style={{ borderTop: `1px solid ${C.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-4 py-3">
                    <Link to={`/orders/${order.id}`}
                      className="text-xs font-mono hover:underline"
                      style={{ color: C.primary3 }}>
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: C.accentBlueBg, color: C.primary3 }}>
                        {order.customerName[0]}
                      </div>
                      <span className="text-xs font-medium" style={{ color: C.text, ...F }}>
                        {order.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.teks }}>{order.orderDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-right text-xs font-bold" style={{ color: C.text, ...F }}>
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customers Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: C.cardBg, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${C.border}` }}>
            <p className="text-base font-semibold" style={{ color: C.text, ...F }}>Top Customers</p>
            <Link to="/customers" className="text-xs font-semibold hover:underline"
              style={{ color: C.primary3 }}>
              View All
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['No', 'Name', 'Email', 'Loyalty'].map((h, i) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-left"
                    style={{ color: C.teks, ...F }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customersData.slice(0, 5).map((c, i) => {
                const loyaltyColor = {
                  Gold:   { bg: '#FFF5D9', color: '#FFBB38' },
                  Silver: { bg: '#E7EDFF', color: '#396AFF' },
                  Bronze: { bg: '#FFE0EB', color: '#FE5C73' },
                }[c.loyalty] || { bg: '#E7EDFF', color: '#396AFF' };
                return (
                  <tr key={c.id}
                    style={{ borderTop: `1px solid ${C.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: C.teks }}>
                      {String(i + 1).padStart(2, '0')}.
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/customers/${c.id}`}
                        className="flex items-center gap-2 hover:underline">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: C.accentGreenBg, color: C.accentGreen }}>
                          {c.name[0]}
                        </div>
                        <span className="text-xs font-medium" style={{ color: C.text, ...F }}>{c.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: C.teks }}>{c.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: loyaltyColor.bg, color: loyaltyColor.color, ...F }}>
                        {c.loyalty}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
