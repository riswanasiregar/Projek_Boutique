import { SectionHeading } from '../../shared/utils';

export default function PointSystem() {
  return (
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
  );
}
