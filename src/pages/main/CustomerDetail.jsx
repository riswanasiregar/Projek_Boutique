import { useParams, useNavigate, Link } from 'react-router-dom';
import customersData from '../../data/customers.json';
import ordersData from '../../data/orders.json';
import { LoyaltyBadge } from './Customers';
import { StatusBadge } from './Orders';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = customersData.find(c => c.id === id);

  if (!customer) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 font-inter">
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-accent-green-shadow text-accent-green">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <p className="text-lg font-semibold text-primary-2">Customer tidak ditemukan</p>
      <button onClick={() => navigate('/customers')}
        className="px-5 py-2.5 rounded-full text-sm font-semibold bg-primary-3 text-neutral hover:opacity-90 transition-opacity font-inter">
        ← Kembali ke Customers
      </button>
    </div>
  );

  const customerOrders = ordersData.filter(o => o.customerName.toLowerCase() === customer.name.toLowerCase());
  const totalSpend     = customerOrders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalPrice, 0);

  const loyaltyIconClass = {
    Gold:   'bg-accent-yellow-shadow text-accent-yellow',
    Silver: 'bg-accent-blue-shadow text-accent-blue',
    Bronze: 'bg-accent-pink-shadow text-secondary',
  }[customer.loyalty] || 'bg-accent-blue-shadow text-accent-blue';

  const stats = [
    { label: 'Total Orders', value: customerOrders.length,                                       iconClass: 'bg-accent-blue-shadow text-accent-blue'   },
    { label: 'Completed',    value: customerOrders.filter(o => o.status === 'Completed').length,  iconClass: 'bg-accent-green-shadow text-accent-green'  },
    { label: 'Pending',      value: customerOrders.filter(o => o.status === 'Pending').length,    iconClass: 'bg-accent-yellow-shadow text-accent-yellow' },
    { label: 'Cancelled',    value: customerOrders.filter(o => o.status === 'Cancelled').length,  iconClass: 'bg-accent-pink-shadow text-secondary'       },
  ];

  return (
    <div className="space-y-5 font-inter">

      {/* Back + breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/customers')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-accent-blue-shadow text-primary-3 hover:bg-primary-3 hover:text-neutral transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-primary-2">Customer Detail</h1>
          <p className="text-xs text-neutral-teks">Dashboard / Customers / {customer.name}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3 bg-neutral border border-neutral-border">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${s.iconClass}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-neutral-teks">{s.label}</p>
              <p className="text-xl font-bold text-primary-2">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Kiri — profil */}
        <div className="space-y-4">
          <div className="rounded-2xl p-6 text-center bg-neutral border border-neutral-border">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3 ${loyaltyIconClass}`}>
              {customer.name[0]}
            </div>
            <p className="text-lg font-bold text-primary-2 mb-0.5">{customer.name}</p>
            <p className="text-xs text-neutral-teks mb-3">{customer.id}</p>
            <div className="flex justify-center mb-4">
              <LoyaltyBadge loyalty={customer.loyalty} />
            </div>
            {[
              { icon: '✉️', label: 'Email', value: customer.email },
              { icon: '📞', label: 'Phone', value: customer.phone },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 text-left bg-neutral-bg">
                <span className="text-sm">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-teks">{item.label}</p>
                  <p className="text-xs font-semibold truncate text-primary-2">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total belanja */}
          <div className="rounded-2xl p-5 bg-primary-3">
            <p className="text-xs font-medium mb-1 text-neutral/70">Total Belanja</p>
            <p className="text-2xl font-bold text-neutral">Rp {totalSpend.toLocaleString('id-ID')}</p>
            <p className="text-xs mt-1 text-neutral/60">
              dari {customerOrders.filter(o => o.status === 'Completed').length} order selesai
            </p>
          </div>
        </div>

        {/* Kanan — riwayat order */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border bg-neutral-bg">
              <div>
                <p className="text-sm font-semibold text-primary-2">Riwayat Order</p>
                <p className="text-xs text-neutral-teks">{customerOrders.length} transaksi</p>
              </div>
              <Link to="/orders" className="text-xs font-semibold text-primary-3 hover:underline">
                Lihat semua →
              </Link>
            </div>

            {customerOrders.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-neutral-teks">Belum ada order</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 px-5 py-3 bg-neutral-bg border-b border-neutral-border">
                  {['Order ID', 'Tanggal', 'Status', 'Total'].map((h, i) => (
                    <p key={h} className={`text-xs font-semibold text-neutral-teks ${i === 3 ? 'text-right' : ''}`}>{h}</p>
                  ))}
                </div>
                {customerOrders.map((order, i) => (
                  <div key={order.id}
                    className={`grid grid-cols-4 px-5 py-4 items-center hover:bg-neutral-bg transition-colors ${i > 0 ? 'border-t border-neutral-border' : ''}`}>
                    <Link to={`/orders/${order.id}`} className="text-xs font-semibold text-primary-3 hover:underline font-mono">
                      {order.id}
                    </Link>
                    <p className="text-xs text-neutral-teks">{order.orderDate}</p>
                    <StatusBadge status={order.status} />
                    <p className="text-xs font-semibold text-right text-primary-2">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-3 border-t-2 border-neutral-border bg-neutral-bg">
                  <p className="text-xs font-semibold text-neutral-teks">
                    Total dari {customerOrders.filter(o => o.status === 'Completed').length} order selesai
                  </p>
                  <p className="text-sm font-bold text-primary-3">Rp {totalSpend.toLocaleString('id-ID')}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
