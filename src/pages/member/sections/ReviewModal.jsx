import { LoaderCircleIcon } from 'lucide-react';

export default function ReviewModal({ show, reviewTarget, reviewRatings, setReviewRatings, reviewComment, setReviewComment, processing, onClose, onSubmit }) {
  if (!show || !reviewTarget) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={() => !processing && onClose()}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden mx-4" style={{ background: '#fff' }}
        onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #E6EFF5' }}>
          <h3 className="text-lg font-bold" style={{ color: '#343C6A' }}>⭐ Tulis Review</h3>
          <p className="text-xs" style={{ color: '#718EBF' }}>Order {reviewTarget.id}</p>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Rate each product */}
          {(reviewTarget.order_items || []).map(item => (
            <div key={item.product_id} className="rounded-xl p-4" style={{ background: '#F5F7FA' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: '#343C6A' }}>{item.product_name}</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setReviewRatings(prev => ({ ...prev, [item.product_id]: star }))}
                    className="text-2xl transition-transform hover:scale-110"
                    style={{ color: star <= (reviewRatings[item.product_id] || 0) ? '#FFBB38' : '#E6EFF5' }}>
                    ★
                  </button>
                ))}
                <span className="ml-2 text-xs font-semibold" style={{ color: '#718EBF' }}>
                  {(reviewRatings[item.product_id] || 0)}/5
                </span>
              </div>
            </div>
          ))}
          {/* Comment */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#343C6A' }}>Komentar (opsional)</label>
            <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={3}
              placeholder="Ceritakan pengalaman belanja kamu..."
              className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
              style={{ border: '1px solid #E6EFF5', background: '#F5F7FA' }} />
          </div>
          <p className="text-xs" style={{ color: '#06A77D' }}>🎁 Bonus +20 poin setelah review dikirim!</p>
        </div>
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #E6EFF5' }}>
          <button onClick={onClose} disabled={processing}
            className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: '#F5F7FA', color: '#718EBF' }}>Batal</button>
          <button onSubmit={onSubmit} disabled={processing}
            onClick={onSubmit}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            style={{ background: '#2D60FF', color: '#fff' }}>
            {processing ? <><LoaderCircleIcon className="inline animate-spin w-4 h-4 mr-2" />Mengirim...</> : 'Kirim Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
