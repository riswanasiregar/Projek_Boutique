import { SectionHeading } from '../../shared/utils';

const TIERS = [
  { tier: 'Bronze', emoji: '\uD83E\uDD49', points: '0\u2013749 POIN', benefit: 'Welcome Member & Promo Eksklusif', color: '#CD7F32', shadow: '#FDF0E2',
    perks: ['1 poin setiap transaksi Rp10.000', 'Diskon ulang tahun 5%', 'Akses promo member setiap bulan', 'Notifikasi koleksi terbaru lebih awal', 'Gratis gift wrapping', 'Giveaway khusus member'] },
  { tier: 'Silver', emoji: '\uD83E\uDD48', points: '750\u20131.499 POIN', benefit: 'Diskon Belanja 5%', color: '#718EBF', shadow: '#E7EDFF',
    perks: ['Semua benefit Bronze', 'Diskon 5% seluruh produk reguler', 'Gratis ongkir min. Rp300.000', 'Prioritas pre-order koleksi baru', 'Voucher ulang tahun Rp50.000', 'Bonus 50 poin (belanja >Rp1jt)'] },
  { tier: 'Gold', emoji: '\uD83E\uDD47', points: '1.500\u20132.999 POIN', benefit: 'Diskon Belanja 10%', color: '#FFBB38', shadow: '#FFF5D9',
    perks: ['Semua benefit Silver', 'Diskon 10% seluruh produk reguler', 'Early access 2 hari lebih awal', 'Free personal styling consultation', 'Gratis gift eksklusif tiap semester', 'Bonus poin 2x saat event tertentu', 'Prioritas stok limited edition'] },
];

export default function Membership() {
  return (
    <section id="membership" className="py-20" style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading badge="Membership" title="Program Loyalitas Ris.Style"
          subtitle="Dapatkan poin dari setiap transaksi dan nikmati benefit eksklusif di setiap tier membership" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {TIERS.map(t => (
            <div key={t.tier} className="rounded-2xl p-6 flex flex-col" style={{ background: '#fff', border: '1px solid #E6EFF5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div className="rounded-xl p-4 mb-4 text-center" style={{ background: t.shadow }}>
                <span style={{ fontSize: '36px' }}>{t.emoji}</span>
                <p className="text-lg font-bold mt-1" style={{ color: t.color }}>{t.tier} Member</p>
                <p className="text-xs font-semibold" style={{ color: '#718EBF' }}>{t.points}</p>
              </div>
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#B1B1B1' }}>Benefit Utama</p>
                <p className="text-sm font-bold" style={{ color: '#343C6A' }}>{t.benefit}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {t.perks.map(p => (
                  <li key={p} className="flex items-start gap-2 text-xs" style={{ color: '#718EBF' }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: t.color }}>✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl p-6" style={{ background: '#F5F7FA', border: '1px solid #E6EFF5' }}>
            <h3 className="text-lg font-bold mb-5" style={{ color: '#343C6A' }}>Cara Mendapatkan Poin</h3>
            <div className="space-y-3">
              {[
                { action: 'Belanja Rp10.000', reward: '1 poin' },
                { action: 'Membuat akun member', reward: '50 poin' },
                { action: 'Ulang tahun', reward: '100 poin' },
                { action: 'Mengajak teman berbelanja', reward: '150 poin' },
                { action: 'Review produk', reward: '20 poin' },
                { action: 'Promo tertentu', reward: 'Double Point Day' },
              ].map(r => (
                <div key={r.action} className="flex items-center justify-between py-2 px-4 rounded-xl" style={{ background: '#fff' }}>
                  <span className="text-sm" style={{ color: '#718EBF' }}>{r.action}</span>
                  <span className="text-sm font-bold" style={{ color: '#2D60FF' }}>{r.reward}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl" style={{ background: '#fff' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: '#343C6A' }}>Contoh Perhitungan</p>
              <table className="w-full text-xs">
                <thead><tr style={{ color: '#718EBF' }}><th className="text-left py-1">Total Belanja</th><th className="text-right py-1">Poin Didapat</th></tr></thead>
                <tbody style={{ color: '#343C6A' }}>
                  {[['Rp100.000', '10 poin'], ['Rp250.000', '25 poin'], ['Rp500.000', '50 poin'], ['Rp1.000.000', '100 poin']].map(([a, b]) => (
                    <tr key={a} style={{ borderTop: '1px solid #E6EFF5' }}><td className="py-1.5">{a}</td><td className="text-right font-semibold">{b}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: '#F5F7FA', border: '1px solid #E6EFF5' }}>
            <h3 className="text-lg font-bold mb-5" style={{ color: '#343C6A' }}>Penukaran Poin</h3>
            <div className="space-y-3">
              {[
                { poin: '100 poin', reward: 'Voucher Rp20.000', icon: '🎟️' },
                { poin: '250 poin', reward: 'Voucher Rp50.000', icon: '🎟️' },
                { poin: '500 poin', reward: 'Gratis ongkir 5 kali', icon: '📦' },
                { poin: '750 poin', reward: 'Diskon tambahan 10% sekali pakai', icon: '🏷️' },
                { poin: '1.000 poin', reward: 'Gift box eksklusif Ris.Style', icon: '🎁' },
                { poin: '1.500 poin', reward: 'Voucher Rp250.000', icon: '💳' },
              ].map(r => (
                <div key={r.poin} className="flex items-center gap-3 py-3 px-4 rounded-xl" style={{ background: '#fff' }}>
                  <span style={{ fontSize: '20px' }}>{r.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: '#343C6A' }}>{r.reward}</p>
                    <p className="text-xs" style={{ color: '#718EBF' }}>{r.poin}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
