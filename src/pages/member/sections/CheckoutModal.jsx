import { LoaderCircleIcon } from 'lucide-react';
import { fmtRp } from '../../shared/utils';

export default function CheckoutModal({ show, onClose, cart, cartCount, cartTotal, earnedPoints, address, setAddress, paymentMethod, setPaymentMethod, processing, onCheckout }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={() => !processing && onClose()}>
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
                <span className="font-semibold">{fmtRp(c.product.price * c.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between mt-2 pt-2 text-sm font-bold" style={{ borderTop: '1px solid #E6EFF5', color: '#2D60FF' }}>
              <span>Total</span><span>{fmtRp(cartTotal)}</span>
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
          <button onClick={onCheckout} disabled={processing}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            style={{ background: '#2D60FF', color: '#fff' }}>
            {processing ? <><LoaderCircleIcon className="inline animate-spin w-4 h-4 mr-2" /> Memproses...</> : `Bayar ${fmtRp(cartTotal)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
