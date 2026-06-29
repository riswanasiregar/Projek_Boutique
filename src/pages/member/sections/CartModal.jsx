import { getProductImage, fmtRp } from '../../shared/utils';

export default function CartModal({ show, onClose, cart, cartCount, cartTotal, earnedPoints, updateQty, removeFromCart, onCheckout }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: '#fff' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E6EFF5' }}>
          <h3 className="text-lg font-bold" style={{ color: '#343C6A' }}>🛒 Keranjang ({cartCount})</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#F5F7FA' }}>✕</button>
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
                <p className="text-xs" style={{ color: '#2D60FF' }}>{fmtRp(c.product.price)}</p>
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
              <span className="text-lg font-bold" style={{ color: '#343C6A' }}>{fmtRp(cartTotal)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-xs" style={{ color: '#718EBF' }}>Poin didapat</span>
              <span className="text-sm font-bold" style={{ color: '#2D60FF' }}>+{earnedPoints} poin</span>
            </div>
            <button onClick={onCheckout}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: '#2D60FF', color: '#fff' }}>
              Lanjut Bayar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
