import { useParams, useNavigate, Link } from 'react-router-dom';
import customersData from '../../data/customers.json';
import ordersData from '../../data/orders.json';
import { LoyaltyBadge } from './Customers';
import { StatusBadge } from './Orders';

const F = { fontFamily: '"Inter", sans-serif' };
const C = {
  primary3:    '#2D60FF',
  primary2:    '#343C6A',
  teks:        '#718EBF',
  border:      '#E6EFF5',
  bg:          '#F5F7FA',
  accentGreen: '#16DBCC', accentGreenBg: '#DCFAF8',
  accentPink:  '#FF82AC', accentPinkBg:  '#FFE0EB',
  accentBlue:  '#396AFF', accentBlueBg:  '#E7EDFF',
  accentYellow:'#FFBB38', accentYellowBg:'#FFF5D9',
};

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = customersData.find(c => c.id === id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" style={F}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: C.accentGreenBg }}>
          <svg className="w-8 h-8" fill="none" stroke={C.accentGreen} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="text-lg font-semibold" style={{ color: C.primary2 }}>Customer tidak ditemukan</p>
        <p className="text-sm" style={{ color: C.teks }}>ID <span className="font-mono">{id}</span> tidak ada.</p>
        <button onClick={() => navigate('/customers')}
          className="px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: C.primary3, color: '#fff' }}>
          ← Kembali ke Customers
        </button>
      </div>
    );
  }

  const customerOrders = ordersData.filter(
    o => o.customerName.toLowerCase() === customer.name.toLowerCase()
  );
  const totalSpend = customerOrders
    .filter(o => o.status === 'Completed')
    .reduce((s, o) => s + o.totalPrice, 0);

  const loyaltyStyle = {
    Gold:   { iconBg: C.accentYellowBg, iconColor: C.accentYellow },
    Silver: { iconBg: C.accentBlueBg,   iconColor: C.accentBlue   },
    Bronze: { iconBg: C.accentPinkBg,   iconColor: C.accentPink   },
  }[customer.loyalty] || { iconBg: C.accentBlueBg, iconColor: C.accentBlue };

  const stats = [
    { label: 'Total Orders',  value: customerOrders.length,                                    iconBg: C.accentBlueBg,   iconColor: C.accentBlue   },
    { label: 'Completed',     value: customerOrders.filter(o => o.status === 'Completed').length, iconBg: C.accentGreenBg,  iconColor: C.accentGreen  },
    { label: 'Pending',       value: customerOrders.filter(o => o.status === 'Pending').length,   iconBg: C.accentYellowBg, iconColor: C.accentYellow },
    { label: 'Cancelled',     value: customerOrders.filter(o => o.status === 'Cancelled').length, iconBg: C.accentPinkBg,   iconColor: C.accentPink   },
  ];

  return (
    <div className="space-y-5" style={F}>

      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/customers')}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ background: C.accentBlueBg, color: C.primary3 }}
          onMouseEnter={e => e.currentTarget.style.background = C.primary3 + '22'}
          onMouseLeave={e => e.currentTarget.style.background = C.accentBlueBg}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: C.primary2 }}>Customer Detail</h1>
          <p className="text-xs" style={{ color: C.teks }}>Dashboard / Customers / {customer.name}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: '#fff', border: `1px solid ${C.border}` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: s.iconBg, color: s.iconColor }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs" style={{ color: C.teks }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color: C.primary2 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Kiri: profil ── */}
        <div className="space-y-4">

          {/* Profil card */}
          <div className="rounded-2xl p-6 text-center" style={{ background: '#fff', border: `1px solid ${C.border}` }}>
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3"
              style={{ background: loyaltyStyle.iconBg, color: loyaltyStyle.iconColor }}>
              {customer.name[0]}
            </div>
            <p className="text-lg font-bold mb-0.5" style={{ color: C.primary2 }}>{customer.name}</p>
            <p className="text-xs mb-3" style={{ color: C.teks }}>{customer.id}</p>
            <div className="flex justify-center mb-4">
              <LoyaltyBadge loyalty={customer.loyalty} />
            </div>
            {/* Kontak */}
            {[
              { icon: '✉️', label: 'Email', value: customer.email },
              { icon: '📞', label: 'Phone', value: customer.phone },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 text-left"
                style={{ background: C.bg }}>
                <span className="text-sm">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: C.teks }}>{item.label}</p>
                  <p className="text-xs font-semibold truncate" style={{ color: C.primary2 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total belanja */}
          <div className="rounded-2xl p-5" style={{ background: C.primary3 }}>
            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Belanja</p>
            <p className="text-2xl font-bold text-white">
              Rp {totalSpend.toLocaleString('id-ID')}
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              dari {customerOrders.filter(o => o.status === 'Completed').length} order selesai
            </p>
          </div>
        </div>

        {/* ── Kanan: riwayat order ── */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: C.primary2 }}>Riwayat Order</p>
                <p className="text-xs" style={{ color: C.teks }}>{customerOrders.length} transaksi</p>
              </div>
              <Link to="/orders" className="text-xs font-semibold hover:underline"
                style={{ color: C.primary3 }}>
                Lihat semua →
              </Link>
            </div>

            {customerOrders.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm" style={{ color: C.teks }}>Belum ada order</p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="grid grid-cols-4 px-5 py-3"
                  style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                  {['Order ID', 'Tanggal', 'Status', 'Total'].map((h, i) => (
                    <p key={h} className={`text-xs font-semibold ${i === 3 ? 'text-right' : ''}`}
                      style={{ color: C.teks }}>{h}</p>
                  ))}
                </div>
                {customerOrders.map((order, i) => (
                  <div key={order.id} className="grid grid-cols-4 px-5 py-4 items-center transition-colors"
                    style={{ borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Link to={`/orders/${order.id}`}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: C.primary3 }}>
                      {order.id}
                    </Link>
                    <p className="text-xs" style={{ color: C.teks }}>{order.orderDate}</p>
                    <StatusBadge status={order.status} />
                    <p className="text-xs font-semibold text-right" style={{ color: C.primary2 }}>
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
                {/* Footer total */}
                <div className="flex items-center justify-between px-5 py-3"
                  style={{ borderTop: `2px solid ${C.border}`, background: C.bg }}>
                  <p className="text-xs font-semibold" style={{ color: C.teks }}>
                    Total dari {customerOrders.filter(o => o.status === 'Completed').length} order selesai
                  </p>
                  <p className="text-sm font-bold" style={{ color: C.primary3 }}>
                    Rp {totalSpend.toLocaleString('id-ID')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
