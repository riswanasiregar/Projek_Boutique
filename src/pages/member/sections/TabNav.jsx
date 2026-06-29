export default function TabNav({ activeTab, setActiveTab, orderCount, cartCount, onCartClick }) {
  return (
    <section className="sticky top-16 z-40" style={{ background: '#fff', borderBottom: '1px solid #E6EFF5' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
        {[
          { key: 'shop', label: '🛍️ Belanja', count: null },
          { key: 'orders', label: '📦 Pesanan Saya', count: orderCount },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="relative py-4 px-2 text-sm font-semibold transition-colors"
            style={{
              color: activeTab === t.key ? '#2D60FF' : '#718EBF',
              borderBottom: activeTab === t.key ? '2px solid #2D60FF' : '2px solid transparent',
            }}>
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full" style={{ background: '#E7EDFF', color: '#2D60FF' }}>{t.count}</span>
            )}
          </button>
        ))}
        <button onClick={onCartClick}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{ background: '#2D60FF', color: '#fff' }}>
          🛒 Keranjang
          {cartCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#FFBB38', color: '#343C6A' }}>{cartCount}</span>
          )}
        </button>
      </div>
    </section>
  );
}
