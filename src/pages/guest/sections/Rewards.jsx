import { SectionHeading } from '../../shared/utils';

export default function Rewards() {
  return (
    <section id="rewards" className="py-20" style={{ background: '#F5F7FA' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading badge="Reward Program" title="Exclusive Rewards"
          subtitle="Redeem your points for exclusive benefits and special offers" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '🎟️', title: 'Shopping Vouchers', desc: 'Get Rp20.000 – Rp250.000 vouchers for your next purchase', points: '100 – 1,500 pts', color: '#2D60FF' },
            { icon: '📦', title: 'Free Shipping', desc: 'Enjoy free shipping on your orders, no minimum purchase', points: '500 pts', color: '#10B981' },
            { icon: '🏷️', title: 'Extra Discount', desc: 'Additional 10% discount on top of member pricing', points: '750 pts', color: '#FFBB38' },
            { icon: '🎁', title: 'Exclusive Gift Box', desc: 'Premium curated gift box with Ris.Style merchandise', points: '1,000 pts', color: '#FE5C73' },
            { icon: '💳', title: 'Premium Voucher', desc: 'High-value voucher Rp250.000 for luxury collections', points: '1,500 pts', color: '#8B5CF6' },
            { icon: '⭐', title: 'Double Points Day', desc: 'Earn 2x points on special event days throughout the year', points: 'Event Only', color: '#F59E0B' },
          ].map(r => (
            <div key={r.title} className="rounded-2xl p-6 transition-all" style={{ background: '#fff', border: '1px solid #E6EFF5' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: '#F5F7FA' }}>
                <span style={{ fontSize: '24px' }}>{r.icon}</span>
              </div>
              <p className="text-sm font-bold mb-1" style={{ color: '#343C6A' }}>{r.title}</p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#718EBF' }}>{r.desc}</p>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: '#E7EDFF', color: r.color }}>{r.points}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
          <h3 className="text-lg font-bold text-center mb-8" style={{ color: '#343C6A' }}>How It Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Shop', desc: 'Purchase your favorite fashion items' },
              { step: '2', title: 'Earn Points', desc: 'Get 1 point for every Rp10.000 spent' },
              { step: '3', title: 'Level Up', desc: 'Upgrade tier for more exclusive perks' },
              { step: '4', title: 'Redeem', desc: 'Exchange points for amazing rewards' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-base font-bold text-white" style={{ background: '#2D60FF' }}>{s.step}</div>
                <p className="text-sm font-bold mb-1" style={{ color: '#343C6A' }}>{s.title}</p>
                <p className="text-xs" style={{ color: '#718EBF' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
