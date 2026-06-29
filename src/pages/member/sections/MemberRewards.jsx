import { SectionHeading } from '../../shared/utils';

export default function MemberRewards({ points }) {
  return (
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
  );
}
