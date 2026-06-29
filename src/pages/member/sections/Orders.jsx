import { SectionHeading, fmtRp } from '../../shared/utils';

export default function Orders({ myOrders, setActiveTab, reviewedOrders, openReview }) {
  return (
    <section className="py-16" style={{ background: '#F5F7FA' }}>
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading badge="Riwayat" title="Pesanan Saya" />
        {myOrders.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
            <span style={{ fontSize: '48px' }}>📦</span>
            <p className="text-sm mt-4" style={{ color: '#718EBF' }}>Belum ada pesanan. Mulai belanja sekarang!</p>
            <button onClick={() => setActiveTab('shop')} className="mt-4 px-6 py-2 rounded-full text-sm font-semibold"
              style={{ background: '#2D60FF', color: '#fff' }}>Mulai Belanja</button>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map(order => (
              <div key={order.id} className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#343C6A' }}>{order.id}</p>
                    <p className="text-xs" style={{ color: '#718EBF' }}>{order.order_date}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: order.status === 'Completed' ? '#E7FFF3' : order.status === 'Cancelled' ? '#FFE7E7' : '#FFF5D9',
                      color: order.status === 'Completed' ? '#06A77D' : order.status === 'Cancelled' ? '#FE5C73' : '#FFBB38',
                    }}>{order.status}</span>
                </div>
                {order.order_items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2" style={{ borderTop: '1px solid #F5F7FA' }}>
                    <span className="text-xs" style={{ color: '#718EBF' }}>{item.product_name}</span>
                    <span className="text-xs" style={{ color: '#B1B1B1' }}>×{item.qty}</span>
                    <span className="ml-auto text-xs font-semibold" style={{ color: '#343C6A' }}>{fmtRp(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #E6EFF5' }}>
                  <span className="text-xs" style={{ color: '#718EBF' }}>Total</span>
                  <span className="text-sm font-bold" style={{ color: '#2D60FF' }}>{fmtRp(order.total_price)}</span>
                </div>
                {/* Review button for completed orders */}
                {order.status === 'Completed' && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid #E6EFF5' }}>
                    {reviewedOrders.includes(order.id) ? (
                      <p className="text-xs font-semibold" style={{ color: '#06A77D' }}>✅ Sudah direview (+20 poin)</p>
                    ) : (
                      <button onClick={() => openReview(order)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: '#E7EDFF', color: '#2D60FF' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#2D60FF'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#E7EDFF'; e.currentTarget.style.color = '#2D60FF'; }}>
                        ⭐ Tulis Review (+20 poin)
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
