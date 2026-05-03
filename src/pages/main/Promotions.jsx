import { useState } from 'react';
import PageHeader from '../../components/PageHeader';

const B = { primary: '#3d2e22', accent: '#c9a96e', bg: '#f5f0eb', surface: '#ede5d8', border: '#d4c4b0', text: '#3d2e22', muted: '#9a8878' };

const initialPromos = [
  { id: 'PROMO-001', name: 'Summer Sale', code: 'SUMMER26', discount: 20, type: 'Percentage', status: 'Active', used: 45, limit: 100, expiry: '2026-06-30' },
  { id: 'PROMO-002', name: 'New Member', code: 'WELCOME10', discount: 10, type: 'Percentage', status: 'Active', used: 120, limit: 500, expiry: '2026-12-31' },
  { id: 'PROMO-003', name: 'Flash Sale', code: 'FLASH50K', discount: 50000, type: 'Fixed', status: 'Expired', used: 200, limit: 200, expiry: '2026-03-01' },
  { id: 'PROMO-004', name: 'Loyalty Gold', code: 'GOLD15', discount: 15, type: 'Percentage', status: 'Active', used: 30, limit: 200, expiry: '2026-09-30' },
  { id: 'PROMO-005', name: 'Birthday Special', code: 'BDAY25', discount: 25, type: 'Percentage', status: 'Draft', used: 0, limit: 50, expiry: '2026-12-31' },
];

function StatusBadge({ status }) {
  const map = {
    Active:  { bg: '#eef4ee', color: '#4a7c59' },
    Expired: { bg: '#f5eeec', color: '#8a4a3a' },
    Draft:   { bg: '#f7f3e8', color: '#8a6d2f' },
  };
  const s = map[status] || { bg: '#f5f0eb', color: '#9a8878' };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}>{status}</span>
  );
}

export default function Promotions() {
  const [promos] = useState(initialPromos);

  return (
    <div>
      <PageHeader title="Promotions" breadcrumb={['Dashboard', 'Promotions']}>
        <button className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: '#3d2e22', color: '#c9a96e' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Promo
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Promos', value: promos.filter(p => p.status === 'Active').length, icon: '🏷️' },
          { label: 'Total Used', value: promos.reduce((s, p) => s + p.used, 0), icon: '✅' },
          { label: 'Avg Discount', value: '17.5%', icon: '💸' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold" style={{ color: B.text }}>{s.value}</p>
              <p className="text-xs" style={{ color: B.muted }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#faf7f4', borderBottom: '1px solid #ede5d8' }}>
                {['Promo', 'Code', 'Discount', 'Type', 'Used / Limit', 'Expiry', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#9a8878' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {promos.map((p, i) => (
                <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid #f5f0eb' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#faf7f4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-sm" style={{ color: B.text }}>{p.name}</p>
                    <p className="text-xs" style={{ color: B.muted }}>{p.id}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-xs px-2 py-1 rounded-lg font-bold"
                      style={{ background: '#f7f3e8', color: '#8a6d2f', letterSpacing: '0.05em' }}>
                      {p.code}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-bold" style={{ color: '#c9a96e' }}>
                    {p.type === 'Percentage' ? `${p.discount}%` : `Rp ${p.discount.toLocaleString('id-ID')}`}
                  </td>
                  <td className="px-6 py-3.5 text-xs" style={{ color: B.muted }}>{p.type}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: '#f0ebe4' }}>
                        <div className="h-full rounded-full" style={{ width: `${(p.used/p.limit)*100}%`, background: '#c9a96e' }} />
                      </div>
                      <span className="text-xs" style={{ color: B.muted }}>{p.used}/{p.limit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-xs" style={{ color: B.muted }}>{p.expiry}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
