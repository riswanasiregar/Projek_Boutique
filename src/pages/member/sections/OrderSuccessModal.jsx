import { fmtRp } from '../../shared/utils';

export default function OrderSuccessModal({ orderSuccess, onViewOrders }) {
  if (!orderSuccess) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-sm rounded-3xl mx-4 p-8 text-center" style={{ background: '#fff' }}>
        <span style={{ fontSize: '64px' }}>🎉</span>
        <h3 className="text-xl font-bold mt-4 mb-2" style={{ color: '#343C6A' }}>Pesanan Berhasil!</h3>
        <p className="text-sm mb-4" style={{ color: '#718EBF' }}>Order ID: <strong>{orderSuccess.id}</strong></p>
        <div className="rounded-xl p-4 mb-4" style={{ background: '#F5F7FA' }}>
          <p className="text-sm" style={{ color: '#343C6A' }}>Total: <strong style={{ color: '#2D60FF' }}>{fmtRp(orderSuccess.total)}</strong></p>
          <p className="text-sm mt-1" style={{ color: '#06A77D' }}>+{orderSuccess.points} poin ditambahkan!</p>
        </div>
        <button onClick={onViewOrders}
          className="w-full py-3 rounded-xl text-sm font-bold" style={{ background: '#2D60FF', color: '#fff' }}>
          Lihat Pesanan
        </button>
      </div>
    </div>
  );
}
