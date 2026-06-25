import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LoaderCircleIcon } from 'lucide-react';

function SectionHeading({ badge, title, subtitle }) {
  return (
    <div className="text-center mb-12">
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-3"
          style={{ background: '#E7EDFF', color: '#2D60FF' }}>
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#343C6A' }}>{title}</h2>
      {subtitle && <p className="text-base max-w-xl mx-auto" style={{ color: '#718EBF' }}>{subtitle}</p>}
    </div>
  );
}

function formatRp(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

/* ── Product image mapping ── */
const PRODUCT_IMAGES = [
  { keywords: ['blouse', 'white'],              src: '/img/Classic Blouse white.png' },
  { keywords: ['cami', 'crop'],                 src: '/img/crop cami top.png' },
  { keywords: ['waist', 'weist', 'high'],       src: '/img/high-weist.png' },
  { keywords: ['cardigan', 'knit'],             src: '/img/knit cardigan.png' },
  { keywords: ['blazer', 'linen'],              src: '/img/linen blazer.png' },
  { keywords: ['skirt', 'silk', 'midi'],        src: '/img/silk midi skirt.png' },
  { keywords: ['summer', 'dress'],              src: '/img/summer dress.png' },
  { keywords: ['trench', 'tren', 'coat'],       src: '/img/tren coatch.png' },
  { keywords: ['jeans', 'wide', 'widi', 'leg'], src: '/img/widi lig jeans.png' },
  { keywords: ['wrap', 'maxi'],                 src: '/img/wrap maxi dress.png' },
];
function getProductImage(product) {
  const name = (product?.name || '').toLowerCase();
  const match = PRODUCT_IMAGES.find(img => img.keywords.some(kw => name.includes(kw)));
  return match?.src || '/img/summer dress.png';
}

export default function MemberHome() {
  const { user } = useOutletContext();

  /* ── State ── */
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);           // [{ product, qty }]
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'orders'
  const [loadingProducts, setLoadingProducts] = useState(true);

  /* ── Derived ── */
  const points = user?.points ?? 0;
  const tier = user?.tier ?? 'Bronze';
  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const earnedPoints = Math.floor(cartTotal / 10000);

  /* ── Fetch products ── */
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('products').select('*').order('name');
      if (data) setProducts(data);
      setLoadingProducts(false);
    })();
  }, []);

  /* ── Fetch my orders ── */
  useEffect(() => {
    if (!user?.email) return;
    (async () => {
      // Find customer_id for this member
      const { data: cust } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();
      if (!cust) return;
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('customer_id', cust.id)
        .order('order_date', { ascending: false });
      if (data) setMyOrders(data);
    })();
  }, [user?.email]);

  /* ── Cart functions ── */
  function addToCart(product) {
    setCart(prev => {
      const exist = prev.find(c => c.product.id === product.id);
      if (exist) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { product, qty: 1 }];
    });
  }
  function removeFromCart(productId) {
    setCart(prev => prev.filter(c => c.product.id !== productId));
  }
  function updateQty(productId, qty) {
    if (qty <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(c => c.product.id === productId ? { ...c, qty } : c));
  }

  /* ── Checkout ── */
  async function handleCheckout() {
    if (!address.trim()) { alert('Masukkan alamat pengiriman'); return; }
    if (cart.length === 0) return;
    setProcessing(true);

    try {
      // Find or create customer record (orders.customer_id references customers table)
      let customerId = null;
      const { data: existingCust } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (existingCust) {
        customerId = existingCust.id;
      } else {
        // Create new customer record
        const { data: lastCust } = await supabase.from('customers').select('id').order('id', { ascending: false }).limit(1).maybeSingle();
        const lastNum = lastCust ? parseInt(lastCust.id.replace('CUST-', ''), 10) : 0;
        customerId = `CUST-${String(lastNum + 1).padStart(3, '0')}`;
        const { error: custErr } = await supabase.from('customers').insert({
          id: customerId,
          name: user.name || user.email?.split('@')[0],
          email: user.email,
          phone: null,
          loyalty: 'Bronze',
        });
        if (custErr) { alert('Gagal membuat data pelanggan: ' + custErr.message); return; }
      }

      // Generate order ID
      const { data: last } = await supabase.from('orders').select('id').order('id', { ascending: false }).limit(1).maybeSingle();
      const lastNum = last ? parseInt(last.id.replace('ORD-', ''), 10) : 0;
      const newOrderId = `ORD-${String(lastNum + 1).padStart(3, '0')}`;

      // Insert order
      const { error: orderErr } = await supabase.from('orders').insert({
        id: newOrderId,
        customer_id: customerId,
        total_price: cartTotal,
        status: 'Pending',
        order_date: new Date().toISOString().split('T')[0],
        address: address.trim(),
      });
      if (orderErr) { alert('Gagal membuat pesanan: ' + orderErr.message); return; }

      // Insert order items
      const itemsPayload = cart.map(c => ({
        order_id: newOrderId,
        product_id: c.product.id,
        product_name: c.product.name,
        qty: c.qty,
        price: c.product.price,
      }));
      await supabase.from('order_items').insert(itemsPayload);

      // Reduce stock
      for (const c of cart) {
        await supabase.from('products').update({ stock: Math.max(0, c.product.stock - c.qty) }).eq('id', c.product.id);
      }

      // Add points to profile
      const newPoints = points + earnedPoints;
      let newTier = tier;
      if (newPoints >= 1500) newTier = 'Gold';
      else if (newPoints >= 750) newTier = 'Silver';
      await supabase.from('profiles').update({ points: newPoints, tier: newTier }).eq('id', user.id);

      // Refresh products (stock updated)
      const { data: refreshed } = await supabase.from('products').select('*').order('name');
      if (refreshed) setProducts(refreshed);

      // Refresh orders
      const { data: orders } = await supabase.from('orders').select('*, order_items(*)').eq('customer_id', customerId).order('order_date', { ascending: false });
      if (orders) setMyOrders(orders);

      setOrderSuccess({ id: newOrderId, total: cartTotal, points: earnedPoints });
      setCart([]);
      setShowCheckout(false);
      setAddress('');
    } catch (err) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setProcessing(false);
    }
  }

  /* ═══════════════ TIER CONFIG ═══════════════ */
  const TIERS = [
    { tier: 'Bronze', emoji: '🥉', points: '0–749', color: '#CD7F32', shadow: '#FDF0E2',
      perks: ['1 poin setiap Rp10.000', 'Diskon ulang tahun 5%', 'Akses promo member', 'Gratis gift wrapping'] },
    { tier: 'Silver', emoji: '🥈', points: '750–1.499', color: '#718EBF', shadow: '#E7EDFF',
      perks: ['Semua benefit Bronze', 'Diskon 5% semua produk', 'Gratis ongkir min. Rp300rb', 'Voucher ultah Rp50.000'] },
    { tier: 'Gold', emoji: '🥇', points: '1.500–2.999', color: '#FFBB38', shadow: '#FFF5D9',
      perks: ['Semua benefit Silver', 'Diskon 10% semua produk', 'Early access 2 hari', 'Free styling consultation'] },
  ];

  const tierColor = TIERS.find(t => t.tier === tier)?.color || '#CD7F32';

  return (
    <>
      {/* ════════ HERO ════════ */}
      <section id="home" className="relative overflow-hidden" style={{ minHeight: '380px', background: 'linear-gradient(135deg, #123288 0%, #2D60FF 100%)' }}>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: '#fff' }} />
        <div className="absolute bottom-0 -left-16 w-60 h-60 rounded-full opacity-10" style={{ background: '#fff' }} />
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: '380px' }}>
          <span className="inline-block px-5 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
            Selamat Datang, {user?.name || 'Member'}! 👋
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Member Dashboard</h1>
          <div className="grid grid-cols-3 gap-5 max-w-md">
            <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <p className="text-2xl font-bold text-white" style={{ color: tierColor === '#CD7F32' ? '#FFBB38' : tierColor }}>{tier}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Tier Saat Ini</p>
            </div>
            <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <p className="text-2xl font-bold text-white">{points}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Poin Saya</p>
            </div>
            <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <p className="text-2xl font-bold text-white">{myOrders.length}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Transaksi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TAB NAVIGATION ════════ */}
      <section className="sticky top-16 z-40" style={{ background: '#fff', borderBottom: '1px solid #E6EFF5' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          {[
            { key: 'shop', label: '🛍️ Belanja', count: null },
            { key: 'orders', label: '📦 Pesanan Saya', count: myOrders.length },
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
          {/* Cart button */}
          <button onClick={() => setShowCart(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{ background: '#2D60FF', color: '#fff' }}>
            🛒 Keranjang
            {cartCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#FFBB38', color: '#343C6A' }}>{cartCount}</span>
            )}
          </button>
        </div>
      </section>

      {/* ════════ SHOP TAB ════════ */}
      {activeTab === 'shop' && (
        <section id="products" className="py-16" style={{ background: '#F5F7FA' }}>
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeading badge="Katalog Produk" title="Belanja Koleksi Terbaru" subtitle="Pilih produk favorit kamu dan dapatkan poin setiap pembelian" />

            {loadingProducts ? (
              <div className="flex justify-center py-20">
                <LoaderCircleIcon className="animate-spin w-8 h-8" style={{ color: '#2D60FF' }} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.filter(p => p.stock > 0).map(product => {
                  const inCart = cart.find(c => c.product.id === product.id);
                  return (
                    <div key={product.id} className="group rounded-2xl overflow-hidden transition-all"
                      style={{ background: '#fff', border: '1px solid #E6EFF5' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <div className="aspect-[3/4] overflow-hidden" style={{ background: '#F5F7FA' }}>
                        <img src={getProductImage(product)} alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                          style={{ background: '#E7EDFF', color: '#2D60FF' }}>{product.category}</span>
                        <p className="text-sm font-bold mb-1" style={{ color: '#343C6A' }}>{product.name}</p>
                        <p className="text-lg font-bold mb-3" style={{ color: '#2D60FF' }}>{formatRp(product.price)}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => addToCart(product)}
                            className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                            style={{ background: inCart ? '#E7EDFF' : '#2D60FF', color: inCart ? '#2D60FF' : '#fff' }}>
                            {inCart ? `✓ ${inCart.qty} di keranjang` : '+ Keranjang'}
                          </button>
                        </div>
                        <p className="text-[10px] mt-2" style={{ color: '#B1B1B1' }}>Stok: {product.stock} · +{Math.floor(product.price / 10000)} poin</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════ ORDERS TAB ════════ */}
      {activeTab === 'orders' && (
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
                        <span className="ml-auto text-xs font-semibold" style={{ color: '#343C6A' }}>{formatRp(item.price * item.qty)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #E6EFF5' }}>
                      <span className="text-xs" style={{ color: '#718EBF' }}>Total</span>
                      <span className="text-sm font-bold" style={{ color: '#2D60FF' }}>{formatRp(order.total_price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════ MEMBERSHIP TIERS ════════ */}
      <section id="membership" className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading badge="Membership Tiers" title="Tingkatan Member" subtitle="Naik tingkat untuk benefit yang lebih besar" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TIERS.map(t => (
              <div key={t.tier} className="rounded-2xl p-6 flex flex-col relative"
                style={{ background: '#fff', border: t.tier === tier ? `2px solid ${t.color}` : '1px solid #E6EFF5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                {t.tier === tier && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: t.color, color: '#fff' }}>TIER KAMU</span>
                )}
                <div className="rounded-xl p-5 mb-5 text-center" style={{ background: t.shadow }}>
                  <span style={{ fontSize: '40px' }}>{t.emoji}</span>
                  <p className="text-xl font-bold mt-2" style={{ color: t.color }}>{t.tier} Member</p>
                  <p className="text-xs font-semibold" style={{ color: '#718EBF' }}>{t.points} POIN</p>
                </div>
                <ul className="space-y-2 flex-1">
                  {t.perks.map(p => (
                    <li key={p} className="flex items-start gap-2 text-xs" style={{ color: '#718EBF' }}>
                      <span style={{ color: t.color }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ POINT SYSTEM ════════ */}
      <section id="points" className="py-20" style={{ background: '#F5F7FA' }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading badge="Sistem Poin" title="Cara Mendapatkan Poin" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
              <h3 className="text-lg font-bold mb-5" style={{ color: '#343C6A' }}>Sumber Poin</h3>
              <div className="space-y-3">
                {[
                  { action: 'Belanja Rp10.000', reward: '1 poin', icon: '🛒' },
                  { action: 'Membuat akun member', reward: '50 poin', icon: '🎉' },
                  { action: 'Review produk', reward: '20 poin', icon: '⭐' },
                  { action: 'Mengajak teman', reward: '150 poin', icon: '👥' },
                ].map(r => (
                  <div key={r.action} className="flex items-center gap-3 py-3 px-4 rounded-xl" style={{ background: '#F5F7FA' }}>
                    <span style={{ fontSize: '20px' }}>{r.icon}</span>
                    <span className="flex-1 text-sm" style={{ color: '#718EBF' }}>{r.action}</span>
                    <span className="text-sm font-bold" style={{ color: '#2D60FF' }}>{r.reward}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
              <h3 className="text-lg font-bold mb-5" style={{ color: '#343C6A' }}>Contoh Perhitungan</h3>
              <div className="overflow-hidden rounded-xl" style={{ border: '1px solid #E6EFF5' }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: '#F5F7FA' }}>
                    <th className="text-left px-4 py-3 font-semibold" style={{ color: '#343C6A' }}>Total Belanja</th>
                    <th className="text-right px-4 py-3 font-semibold" style={{ color: '#343C6A' }}>Poin Didapat</th>
                  </tr></thead>
                  <tbody style={{ color: '#718EBF' }}>
                    {[['Rp100.000', '10 poin'], ['Rp250.000', '25 poin'], ['Rp500.000', '50 poin'], ['Rp1.000.000', '100 poin']].map(([a, b]) => (
                      <tr key={a} style={{ borderTop: '1px solid #E6EFF5' }}>
                        <td className="px-4 py-3">{a}</td>
                        <td className="text-right font-semibold px-4 py-3" style={{ color: '#2D60FF' }}>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ REWARDS ════════ */}
      <section id="rewards" className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading badge="Reward" title="Penukaran Poin" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { poin: 100, reward: 'Voucher Rp20.000', icon: '🎟️', desc: 'Voucher belanja berikutnya' },
              { poin: 250, reward: 'Voucher Rp50.000', icon: '🎟️', desc: 'Voucher belanja lebih besar' },
              { poin: 500, reward: 'Gratis ongkir 5x', icon: '📦', desc: 'Free shipping 5 pesanan' },
              { poin: 750, reward: 'Diskon tambahan 10%', icon: '🏷️', desc: 'Stackable diskon member' },
              { poin: 1000, reward: 'Gift box eksklusif', icon: '🎁', desc: 'Paket hadiah spesial' },
              { poin: 1500, reward: 'Voucher Rp250.000', icon: '💳', desc: 'Voucher bernilai tinggi' },
            ].map(r => (
              <div key={r.poin} className="rounded-2xl p-5 flex items-start gap-4 transition-all"
                style={{ background: '#F5F7FA', border: '1px solid #E6EFF5' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <span style={{ fontSize: '28px' }}>{r.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1" style={{ color: '#343C6A' }}>{r.reward}</p>
                  <p className="text-xs mb-2" style={{ color: '#718EBF' }}>{r.desc}</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: points >= r.poin ? '#E7FFF3' : '#E7EDFF', color: points >= r.poin ? '#06A77D' : '#2D60FF' }}>
                    {r.poin} poin {points >= r.poin && '✓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CART MODAL ════════ */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowCart(false)}>
          <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden"
            style={{ background: '#fff' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E6EFF5' }}>
              <h3 className="text-lg font-bold" style={{ color: '#343C6A' }}>🛒 Keranjang ({cartCount})</h3>
              <button onClick={() => setShowCart(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#F5F7FA' }}>✕</button>
            </div>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <span style={{ fontSize: '48px' }}>🛒</span>
                  <p className="text-sm mt-3" style={{ color: '#718EBF' }}>Keranjang masih kosong</p>
                </div>
              ) : cart.map(c => (
                <div key={c.product.id} className="flex items-center gap-3 py-3 px-4 rounded-xl" style={{ background: '#F5F7FA' }}>
                  <img src={getProductImage(c.product)} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#343C6A' }}>{c.product.name}</p>
                    <p className="text-xs" style={{ color: '#2D60FF' }}>{formatRp(c.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(c.product.id, c.qty - 1)}
                      className="w-7 h-7 rounded-full text-sm font-bold" style={{ background: '#E6EFF5', color: '#343C6A' }}>−</button>
                    <span className="text-sm font-bold w-5 text-center" style={{ color: '#343C6A' }}>{c.qty}</span>
                    <button onClick={() => updateQty(c.product.id, c.qty + 1)}
                      className="w-7 h-7 rounded-full text-sm font-bold" style={{ background: '#E7EDFF', color: '#2D60FF' }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(c.product.id)} className="text-xs" style={{ color: '#FE5C73' }}>✕</button>
                </div>
              ))}
            </div>
            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-4" style={{ borderTop: '1px solid #E6EFF5' }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm" style={{ color: '#718EBF' }}>Total</span>
                  <span className="text-lg font-bold" style={{ color: '#343C6A' }}>{formatRp(cartTotal)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-xs" style={{ color: '#718EBF' }}>Poin didapat</span>
                  <span className="text-sm font-bold" style={{ color: '#2D60FF' }}>+{earnedPoints} poin</span>
                </div>
                <button onClick={() => { setShowCart(false); setShowCheckout(true); }}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: '#2D60FF', color: '#fff' }}>
                  Lanjut Bayar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════ CHECKOUT MODAL ════════ */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => !processing && setShowCheckout(false)}>
          <div className="w-full max-w-md rounded-3xl overflow-hidden mx-4" style={{ background: '#fff' }}
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #E6EFF5' }}>
              <h3 className="text-lg font-bold" style={{ color: '#343C6A' }}>💳 Pembayaran</h3>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Order summary */}
              <div className="rounded-xl p-4" style={{ background: '#F5F7FA' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#718EBF' }}>Ringkasan ({cartCount} item)</p>
                {cart.map(c => (
                  <div key={c.product.id} className="flex justify-between text-xs py-1" style={{ color: '#343C6A' }}>
                    <span>{c.product.name} ×{c.qty}</span>
                    <span className="font-semibold">{formatRp(c.product.price * c.qty)}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-2 pt-2 text-sm font-bold" style={{ borderTop: '1px solid #E6EFF5', color: '#2D60FF' }}>
                  <span>Total</span><span>{formatRp(cartTotal)}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: '#06A77D' }}>+{earnedPoints} poin akan ditambahkan</p>
              </div>
              {/* Address */}
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#343C6A' }}>Alamat Pengiriman</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3}
                  placeholder="Masukkan alamat lengkap..."
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
                  style={{ border: '1px solid #E6EFF5', background: '#F5F7FA' }} />
              </div>
              {/* Payment method */}
              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: '#343C6A' }}>Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Transfer Bank', 'E-Wallet', 'COD', 'Kartu Kredit'].map(m => (
                    <button key={m} onClick={() => setPaymentMethod(m)}
                      className="py-3 px-3 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: paymentMethod === m ? '#E7EDFF' : '#F5F7FA',
                        color: paymentMethod === m ? '#2D60FF' : '#718EBF',
                        border: paymentMethod === m ? '1px solid #2D60FF' : '1px solid #E6EFF5',
                      }}>{m}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4" style={{ borderTop: '1px solid #E6EFF5' }}>
              <button onClick={handleCheckout} disabled={processing}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                style={{ background: '#2D60FF', color: '#fff' }}>
                {processing ? <><LoaderCircleIcon className="inline animate-spin w-4 h-4 mr-2" /> Memproses...</> : `Bayar ${formatRp(cartTotal)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ ORDER SUCCESS MODAL ════════ */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-sm rounded-3xl mx-4 p-8 text-center" style={{ background: '#fff' }}>
            <span style={{ fontSize: '64px' }}>🎉</span>
            <h3 className="text-xl font-bold mt-4 mb-2" style={{ color: '#343C6A' }}>Pesanan Berhasil!</h3>
            <p className="text-sm mb-4" style={{ color: '#718EBF' }}>Order ID: <strong>{orderSuccess.id}</strong></p>
            <div className="rounded-xl p-4 mb-4" style={{ background: '#F5F7FA' }}>
              <p className="text-sm" style={{ color: '#343C6A' }}>Total: <strong style={{ color: '#2D60FF' }}>{formatRp(orderSuccess.total)}</strong></p>
              <p className="text-sm mt-1" style={{ color: '#06A77D' }}>+{orderSuccess.points} poin ditambahkan!</p>
            </div>
            <button onClick={() => { setOrderSuccess(null); setActiveTab('orders'); }}
              className="w-full py-3 rounded-xl text-sm font-bold" style={{ background: '#2D60FF', color: '#fff' }}>
              Lihat Pesanan
            </button>
          </div>
        </div>
      )}
    </>
  );
}
