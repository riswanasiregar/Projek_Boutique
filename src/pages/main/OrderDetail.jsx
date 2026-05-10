import { useParams, useNavigate, Link } from 'react-router-dom';
import ordersData from '../../data/orders.json';
import customersData from '../../data/customers.json';
import { StatusBadge } from './Orders';
import { LoyaltyBadge } from './Customers';

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

const orderItemsMap = {
  'ORD-001': [{ name: 'Floral Midi Dress', qty: 1, price: 89000 }, { name: 'Pastel Cardigan', qty: 1, price: 61000 }],
  'ORD-002': [{ name: 'Linen Blouse', qty: 1, price: 75000 }],
  'ORD-003': [{ name: 'Summer Shorts', qty: 2, price: 20000 }],
  'ORD-004': [{ name: 'Evening Gown', qty: 1, price: 150000 }, { name: 'Silk Scarf', qty: 1, price: 50000 }],
};

function getItems(id) {
  if (orderItemsMap[id]) return orderItemsMap[id];
  return [
    { name: 'Boutique Item A', qty: 1, price: 85000 },
    { name: 'Boutique Item B', qty: 1, price: 65000 },
  ];
}

const timelineMap = {
  Completed: [
    { label: 'Order Diterima', done: true, time: 'Hari ke-1' },
    { label: 'Diproses',       done: true, time: 'Hari ke-1' },
    { label: 'Dikirim',        done: true, time: 'Hari ke-2' },
    { label: 'Selesai',        done: true, time: 'Hari ke-3' },
  ],
  Pending: [
    { label: 'Order Diterima', done: true,  time: 'Hari ke-1' },
    { label: 'Diproses',       done: true,  time: 'Hari ke-1' },
    { label: 'Dikirim',        done: false, time: 'Menunggu'  },
    { label: 'Selesai',        done: false, time: '-'         },
  ],
  Cancelled: [
    { label: 'Order Diterima', done: true,  time: 'Hari ke-1'              },
    { label: 'Dibatalkan',     done: true,  time: 'Hari ke-1', cancelled: true },
  ],
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = ordersData.find(o => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" style={F}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: C.accentBlueBg }}>
          <svg className="w-8 h-8" fill="none" stroke={C.primary3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-lg font-semibold" style={{ color: C.primary2 }}>Order tidak ditemukan</p>
        <p className="text-sm" style={{ color: C.teks }}>ID <span className="font-mono">{id}</span> tidak ada.</p>
        <button onClick={() => navigate('/orders')}
          className="px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: C.primary3, color: '#fff' }}>
          ← Kembali ke Orders
        </button>
      </div>
    );
  }

  const customer = customersData.find(c => c.name.toLowerCase() === order.customerName.toLowerCase());
  const items    = getItems(order.id);
  const timeline = timelineMap[order.status] || timelineMap.Pending;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="space-y-5" style={F}>

      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/orders')}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ background: C.accentBlueBg, color: C.primary3 }}
          onMouseEnter={e => e.currentTarget.style.background = C.primary3 + '22'}
          onMouseLeave={e => e.currentTarget.style.background = C.accentBlueBg}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: C.primary2 }}>Order Detail</h1>
          <p className="text-xs" style={{ color: C.teks }}>Dashboard / Orders / {order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Kiri: info order + timeline ── */}
        <div className="space-y-4">

          {/* Info order */}
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: C.primary2 }}>Informasi Order</p>
              <StatusBadge status={order.status} />
            </div>
            {[
              { label: 'Order ID',   value: order.id,        mono: true },
              { label: 'Tanggal',    value: order.orderDate              },
              { label: 'Customer',   value: order.customerName           },
              { label: 'Metode',     value: 'Transfer Bank'              },
              { label: 'Pengiriman', value: 'JNE Regular'                },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: `1px solid ${C.border}` }}>
                <span className="text-xs" style={{ color: C.teks }}>{row.label}</span>
                <span className={`text-xs font-semibold ${row.mono ? 'font-mono' : ''}`}
                  style={{ color: C.primary2 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: `1px solid ${C.border}` }}>
            <p className="text-sm font-semibold mb-4" style={{ color: C.primary2 }}>Status Timeline</p>
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: step.cancelled ? C.accentPinkBg : step.done ? C.primary3 : C.bg,
                      color:      step.cancelled ? C.accentPink   : step.done ? '#fff'      : C.teks,
                    }}>
                    {step.cancelled ? '✕' : step.done ? '✓' : i + 1}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 my-1"
                      style={{ background: step.done ? C.primary3 : C.border, minHeight: '16px' }} />
                  )}
                </div>
                <div className="pb-3">
                  <p className="text-xs font-semibold" style={{ color: step.done ? C.primary2 : C.teks }}>
                    {step.label}
                  </p>
                  <p className="text-xs" style={{ color: C.teks }}>{step.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Customer info */}
          {customer && (
            <div className="rounded-2xl p-5" style={{ background: '#fff', border: `1px solid ${C.border}` }}>
              <p className="text-sm font-semibold mb-3" style={{ color: C.primary2 }}>Customer</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: C.accentGreenBg, color: C.accentGreen }}>
                  {customer.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.primary2 }}>{customer.name}</p>
                  <p className="text-xs" style={{ color: C.teks }}>{customer.id}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <LoyaltyBadge loyalty={customer.loyalty} />
                <Link to={`/customers/${customer.id}`}
                  className="text-xs font-semibold hover:underline"
                  style={{ color: C.primary3 }}>
                  Lihat profil →
                </Link>
              </div>
              <p className="text-xs" style={{ color: C.teks }}>{customer.email}</p>
              <p className="text-xs mt-0.5" style={{ color: C.teks }}>{customer.phone}</p>
            </div>
          )}
        </div>

        {/* ── Kanan: item + alamat ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Item pesanan */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${C.border}` }}>
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
              <p className="text-sm font-semibold" style={{ color: C.primary2 }}>Item Pesanan</p>
              <p className="text-xs" style={{ color: C.teks }}>{items.length} produk</p>
            </div>
            {/* Header */}
            <div className="grid grid-cols-4 px-5 py-3" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {['Produk', 'Qty', 'Harga', 'Subtotal'].map((h, i) => (
                <p key={h} className={`text-xs font-semibold ${i > 0 ? 'text-right' : ''}`}
                  style={{ color: C.teks }}>{h}</p>
              ))}
            </div>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-4 px-5 py-4 items-center"
                style={{ borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: C.accentBlueBg }}>
                    <svg className="w-4 h-4" fill="none" stroke={C.primary3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: C.primary2 }}>{item.name}</p>
                </div>
                <p className="text-sm text-right" style={{ color: C.teks }}>{item.qty}</p>
                <p className="text-sm text-right" style={{ color: C.teks }}>
                  Rp {item.price.toLocaleString('id-ID')}
                </p>
                <p className="text-sm font-semibold text-right" style={{ color: C.primary2 }}>
                  Rp {(item.price * item.qty).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
            {/* Ringkasan */}
            <div className="px-5 py-4 space-y-2" style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
              {[
                { label: 'Subtotal',      value: subtotal },
                { label: 'Ongkos Kirim',  value: 15000    },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: C.teks }}>{row.label}</span>
                  <span className="text-xs font-semibold" style={{ color: C.primary2 }}>
                    Rp {row.value.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2"
                style={{ borderTop: `1px solid ${C.border}` }}>
                <span className="text-sm font-semibold" style={{ color: C.primary2 }}>Total</span>
                <span className="text-base font-bold" style={{ color: C.primary3 }}>
                  Rp {order.totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Alamat pengiriman */}
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: `1px solid ${C.border}` }}>
            <p className="text-sm font-semibold mb-3" style={{ color: C.primary2 }}>Alamat Pengiriman</p>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: C.accentPinkBg }}>
                <svg className="w-4 h-4" fill="none" stroke={C.accentPink} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: C.primary2 }}>{order.customerName}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: C.teks }}>
                  {order.address || `Jl. Boutique No. ${order.id.replace('ORD-', '')}, Jakarta Pusat 10310`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
