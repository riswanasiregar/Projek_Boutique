import { SectionHeading } from '../../shared/utils';

const TIERS = [
  { tier: 'Bronze', emoji: '🥉', points: '0–749', color: '#CD7F32', shadow: '#FDF0E2',
    perks: ['1 poin setiap Rp10.000', 'Diskon ulang tahun 5%', 'Akses promo member', 'Gratis gift wrapping'] },
  { tier: 'Silver', emoji: '🥈', points: '750–1.499', color: '#718EBF', shadow: '#E7EDFF',
    perks: ['Semua benefit Bronze', 'Diskon 5% semua produk', 'Gratis ongkir min. Rp300rb', 'Voucher ultah Rp50.000'] },
  { tier: 'Gold', emoji: '🥇', points: '1.500–2.999', color: '#FFBB38', shadow: '#FFF5D9',
    perks: ['Semua benefit Silver', 'Diskon 10% semua produk', 'Early access 2 hari', 'Free styling consultation'] },
];

export { TIERS };

export default function MemberTiers({ tier }) {
  return (
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
  );
}
