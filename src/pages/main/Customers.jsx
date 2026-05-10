import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import customersData from '../../data/customers.json';

const F = { fontFamily: '"Inter", sans-serif' };
const C = {
  primary3:    '#2D60FF',
  primary2:    '#343C6A',
  teks:        '#718EBF',
  border:      '#E6EFF5',
  bg:          '#F5F7FA',
  accentGreen: '#16DBCC', accentGreenBg: '#DCFAF8',
  accentPink:  '#FF82AC', accentPinkBg:  '#FFE0EB',
  accentBlue:  '#396AFF', accentBlueBg:  '#E7EDFF',
  accentYellow:'#FFBB38', accentYellowBg:'#FFF5D9',
};

export function LoyaltyBadge({ loyalty }) {
  const map = {
    Gold:   { bg: '#FFF5D9', color: '#FFBB38' },
    Silver: { bg: '#E7EDFF', color: '#396AFF' },
    Bronze: { bg: '#FFE0EB', color: '#FE5C73' },
  };
  const s = map[loyalty] || { bg: '#E7EDFF', color: '#396AFF' };
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color, ...F }}>
      {loyalty}
    </span>
  );
}

const emptyForm = { name: '', email: '', phone: '', loyalty: 'Bronze' };

export default function Customers() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [customers, setCustomers] = useState(customersData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = customers.filter(c => {
    const matchLoyalty = activeFilter === 'All' || c.loyalty === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    return matchLoyalty && matchSearch;
  });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleSubmit(e) {
    e.preventDefault();
    const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    setCustomers([{ id: newId, ...form }, ...customers]);
    setForm(emptyForm); setShowForm(false);
  }

  /* Summary cards */
  const summaryCards = [
    { label: 'Total Customers', value: customers.length,                                          iconBg: C.accentBlueBg,   iconColor: C.accentBlue,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { label: 'Gold Members',    value: customers.filter(c => c.loyalty === 'Gold').length,        iconBg: C.accentYellowBg, iconColor: C.accentYellow,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
    { label: 'Silver Members',  value: customers.filter(c => c.loyalty === 'Silver').length,      iconBg: C.accentGreenBg,  iconColor: C.accentGreen,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
    { label: 'Bronze Members',  value: customers.filter(c => c.loyalty === 'Bronze').length,      iconBg: C.accentPinkBg,   iconColor: C.accentPink,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: `1.5px solid ${C.border}`, background: C.bg,
    color: C.primary2, fontSize: '14px', outline: 'none', ...F,
  };

  return (
    <div className="space-y-6" style={{ ...F }}>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: '#fff', border: `1px solid ${C.border}` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: card.iconBg, color: card.iconColor }}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: C.teks }}>{card.label}</p>
              <p className="text-xl font-bold" style={{ color: C.primary2 }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${C.border}` }}>
          <p className="text-base font-semibold" style={{ color: C.primary2 }}>Customers List</p>
          <div className="flex items-center gap-2">
            {['All', 'Gold', 'Silver', 'Bronze'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={activeFilter === f
                  ? { background: C.primary3, color: '#fff' }
                  : { background: C.bg, color: C.teks }}>
                {f}
              </button>
            ))}
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
              style={{ background: C.primary3, color: '#fff' }}>
              + Add Customer
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: C.bg }}>
                {['SL No', 'Name', 'Email', 'Phone', 'Loyalty', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left"
                    style={{ color: C.teks, ...F }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: C.teks }}>
                  No customers found
                </td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${C.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-5 py-4 text-sm font-medium" style={{ color: C.teks }}>
                    {String(i + 1).padStart(2, '0')}.
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: C.accentGreenBg, color: C.accentGreen }}>
                        {c.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.primary2 }}>{c.name}</p>
                        <p className="text-xs" style={{ color: C.teks }}>{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: C.teks }}>{c.email}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: C.teks }}>{c.phone}</td>
                  <td className="px-5 py-4"><LoyaltyBadge loyalty={c.loyalty} /></td>
                  <td className="px-5 py-4">
                    <Link to={`/customers/${c.id}`}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all hover:bg-primary-3 hover:text-white"
                      style={{ border: `1.5px solid ${C.primary3}`, color: C.primary3, ...F }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.primary3; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.primary3; }}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3" style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
            <p className="text-xs" style={{ color: C.teks }}>
              Showing <span className="font-semibold" style={{ color: C.primary2 }}>{filtered.length}</span> of {customers.length} customers
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(52,60,106,0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ background: '#fff' }}>
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: C.primary3 }}>
              <div>
                <h3 className="text-base font-bold text-white" style={F}>New Customer</h3>
                <p className="text-xs text-white/70">Add a new customer</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'e.g. Andi Saputra' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'e.g. andi@email.com' },
                { label: 'Phone', name: 'phone', type: 'text', placeholder: 'e.g. 081234567890' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.primary2, ...F }}>{f.label}</label>
                  <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary3}
                    onBlur={e => e.target.style.borderColor = C.border} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.primary2, ...F }}>Loyalty Tier</label>
                <select name="loyalty" value={form.loyalty} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.primary3}
                  onBlur={e => e.target.style.borderColor = C.border}>
                  <option>Bronze</option><option>Silver</option><option>Gold</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ border: `1.5px solid ${C.border}`, color: C.teks, background: C.bg, ...F }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: C.primary3, color: '#fff', ...F }}>
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
