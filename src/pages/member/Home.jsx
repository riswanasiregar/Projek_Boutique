import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/* ── Section components ── */
import MemberHero from './sections/MemberHero';
import TabNav from './sections/TabNav';
import Shop from './sections/Shop';
import Orders from './sections/Orders';
import MemberTiers, { TIERS } from './sections/MemberTiers';
import PointSystem from './sections/PointSystem';
import MemberRewards from './sections/MemberRewards';
import CartModal from './sections/CartModal';
import CheckoutModal from './sections/CheckoutModal';
import OrderSuccessModal from './sections/OrderSuccessModal';
import ReviewModal from './sections/ReviewModal';

export default function Home() {
  const { user } = useOutletContext();

  /* ── State ── */
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('shop');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewRatings, setReviewRatings] = useState({});
  const [reviewComment, setReviewComment] = useState('');
  const [reviewedOrders, setReviewedOrders] = useState([]);

  /* ── Derived ── */
  const points = user?.points ?? 0;
  const tier = user?.tier ?? 'Bronze';
  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const earnedPoints = Math.floor(cartTotal / 10000);
  const tierColor = TIERS.find(t => t.tier === tier)?.color || '#CD7F32';

  /* ── Listen for nav events to switch tab ── */
  useEffect(() => {
    function handleNav(e) {
      if (e.detail === '#products') setActiveTab('shop');
    }
    window.addEventListener('memberNav', handleNav);
    return () => window.removeEventListener('memberNav', handleNav);
  }, []);

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
      const { data: cust } = await supabase
        .from('customers').select('id').eq('email', user.email).maybeSingle();
      if (!cust) return;
      const { data } = await supabase
        .from('orders').select('*, order_items(*)')
        .eq('customer_id', cust.id).order('order_date', { ascending: false });
      if (data) setMyOrders(data);
    })();
  }, [user?.email]);

  /* ── Fetch reviewed order IDs ── */
  useEffect(() => {
    if (!user?.email) return;
    (async () => {
      const { data: cust } = await supabase.from('customers').select('id').eq('email', user.email).maybeSingle();
      if (!cust) return;
      const { data } = await supabase.from('feedbacks').select('comment').eq('customer_id', cust.id);
      if (data) {
        const orderIds = data
          .filter(f => f.comment && f.comment.startsWith('[Order:'))
          .map(f => f.comment.match(/\[Order:(ORD-\d+)\]/)?.[1])
          .filter(Boolean);
        setReviewedOrders([...new Set(orderIds)]);
      }
    })();
  }, [user?.email]);

  /* ── Review functions ── */
  function openReview(order) {
    setReviewTarget(order);
    const ratings = {};
    (order.order_items || []).forEach(item => { ratings[item.product_id] = 5; });
    setReviewRatings(ratings);
    setReviewComment('');
    setShowReview(true);
  }

  async function submitReview() {
    if (!reviewTarget) return;
    const items = reviewTarget.order_items || [];
    const allRated = items.every(it => reviewRatings[it.product_id]);
    if (!allRated) { alert('Berikan rating untuk semua produk'); return; }
    setProcessing(true);
    try {
      const { data: cust } = await supabase.from('customers').select('id, name').eq('email', user.email).maybeSingle();
      if (!cust) { alert('Data pelanggan tidak ditemukan'); return; }

      const ratings = items.map(it => reviewRatings[it.product_id] || 5);
      const avgRating = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);

      const productReviews = items.map(it => `${it.product_name}: ${'★'.repeat(reviewRatings[it.product_id] || 5)}${'☆'.repeat(5 - (reviewRatings[it.product_id] || 5))}`).join('\n');
      const fullComment = `[Order:${reviewTarget.id}]\n${productReviews}${reviewComment.trim() ? '\n\nKomentar: ' + reviewComment.trim() : ''}`;

      // Generate unique UUID for feedback ID
      const newFbId = `FB-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const { error } = await supabase.from('feedbacks').insert({
        id: newFbId,
        customer_id: cust.id,
        customer_name: cust.name || user.name || user.email?.split('@')[0],
        rating: avgRating, comment: fullComment, status: 'Pending',
      });
      if (error) { alert('Gagal mengirim review: ' + error.message); return; }

      const newPoints = points + 20;
      let newTier = tier;
      if (newPoints >= 1500) newTier = 'Gold';
      else if (newPoints >= 750) newTier = 'Silver';
      await supabase.from('profiles').update({ points: newPoints, tier: newTier }).eq('id', user.id);

      setReviewedOrders(prev => [...prev, reviewTarget.id]);
      setShowReview(false);
      alert('Review berhasil dikirim! +20 poin');
    } catch (err) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setProcessing(false);
    }
  }

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
      let customerId = null;
      const { data: existingCust } = await supabase.from('customers').select('id').eq('email', user.email).maybeSingle();

      if (existingCust) {
        customerId = existingCust.id;
      } else {
        const { data: lastCust } = await supabase.from('customers').select('id').order('id', { ascending: false }).limit(1).maybeSingle();
        const lastNum = lastCust ? parseInt(lastCust.id.replace('CUST-', ''), 10) : 0;
        customerId = `CUST-${String(lastNum + 1).padStart(3, '0')}`;
        const { error: custErr } = await supabase.from('customers').insert({
          id: customerId, name: user.name || user.email?.split('@')[0],
          email: user.email, phone: null, loyalty: 'Bronze',
        });
        if (custErr) { alert('Gagal membuat data pelanggan: ' + custErr.message); return; }
      }

      const { data: last } = await supabase.from('orders').select('id').order('id', { ascending: false }).limit(1).maybeSingle();
      const lastNum = last ? parseInt(last.id.replace('ORD-', ''), 10) : 0;
      const newOrderId = `ORD-${String(lastNum + 1).padStart(3, '0')}`;

      const { error: orderErr } = await supabase.from('orders').insert({
        id: newOrderId, customer_id: customerId, total_price: cartTotal,
        status: 'Pending', order_date: new Date().toISOString().split('T')[0], address: address.trim(),
      });
      if (orderErr) { alert('Gagal membuat pesanan: ' + orderErr.message); return; }

      const itemsPayload = cart.map(c => ({
        order_id: newOrderId, product_id: c.product.id,
        product_name: c.product.name, qty: c.qty, price: c.product.price,
      }));
      await supabase.from('order_items').insert(itemsPayload);

      for (const c of cart) {
        await supabase.from('products').update({ stock: Math.max(0, c.product.stock - c.qty) }).eq('id', c.product.id);
      }

      const newPoints = points + earnedPoints;
      let newTier = tier;
      if (newPoints >= 1500) newTier = 'Gold';
      else if (newPoints >= 750) newTier = 'Silver';
      await supabase.from('profiles').update({ points: newPoints, tier: newTier }).eq('id', user.id);

      const { data: refreshed } = await supabase.from('products').select('*').order('name');
      if (refreshed) setProducts(refreshed);

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

  return (
    <>
      <MemberHero user={user} tier={tier} points={points} orderCount={myOrders.length} tierColor={tierColor} />
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} orderCount={myOrders.length} cartCount={cartCount} onCartClick={() => setShowCart(true)} />

      {activeTab === 'shop' && (
        <Shop products={products} loadingProducts={loadingProducts} cart={cart} addToCart={addToCart} />
      )}

      {activeTab === 'orders' && (
        <Orders myOrders={myOrders} setActiveTab={setActiveTab} reviewedOrders={reviewedOrders} openReview={openReview} />
      )}

      <MemberTiers tier={tier} />
      <PointSystem />
      <MemberRewards points={points} />

      <CartModal
        show={showCart} onClose={() => setShowCart(false)}
        cart={cart} cartCount={cartCount} cartTotal={cartTotal} earnedPoints={earnedPoints}
        updateQty={updateQty} removeFromCart={removeFromCart}
        onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
      />

      <CheckoutModal
        show={showCheckout} onClose={() => !processing && setShowCheckout(false)}
        cart={cart} cartCount={cartCount} cartTotal={cartTotal} earnedPoints={earnedPoints}
        address={address} setAddress={setAddress}
        paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
        processing={processing} onCheckout={handleCheckout}
      />

      <OrderSuccessModal
        orderSuccess={orderSuccess}
        onViewOrders={() => { setOrderSuccess(null); setActiveTab('orders'); }}
      />

      <ReviewModal
        show={showReview} reviewTarget={reviewTarget}
        reviewRatings={reviewRatings} setReviewRatings={setReviewRatings}
        reviewComment={reviewComment} setReviewComment={setReviewComment}
        processing={processing} onClose={() => setShowReview(false)} onSubmit={submitReview}
      />
    </>
  );
}
