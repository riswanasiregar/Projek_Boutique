import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import customersData from '../../data/customers.json';
import PageHeader from '../../components/PageHeader';

export function LoyaltyBadge({ loyalty }) {
  const map = {
    Gold:   { bg: '#f7f3e8', color: '#8a6d2f', icon: '👑' },
    Silver: { bg: '#f0f4f8', color: '#4a6080', icon: '⭐' },
    Bronze: { bg: '#f5eeec', color: '#8a5a4a', icon: '🥉' },
  };
  const s = map[loyalty] || { bg: '#f5f0eb', color: '#8a7060', icon: '•' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}>
      <span className="text-xs">{s.icon}</span>
      {loyalty}
    </span>
  );
}

const emptyForm = { name: '', email: '', phone: '', loyalty: 'Bronze' };
const inputStyle = {
  background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#3d2e22',
  borderRadius: '12px', padding: '10px 16px', fontSize: '14px', width: '100%', outline: 'none',
};

export default function Customers() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [customers, setCustomers] = useState(customersData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = customers.filter(c => {
    const matchLoyalty = activeFilter === 'All' || c.loyalty === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
    return matchLoyalty && matchSearch;
  });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleSubmit(e) {
    e.preventDefault();
    const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    setCustomers([{ id: newId, ...form }, ...customers]);
    setForm(emptyForm);
    setShowForm(false);
  }

  const chips = [
    { key: 'All', label: 'All', count: customers.length },
    { key: 'Gold', label: '👑 Gold', count: customers.filter(c => c.loyalty === 'Gold').length },
    { key: 'Silver', label: '⭐ Silver', count: customers.filter(c => c.loyalty === 'Silver').length },
    { key: 'Bronze', label: '🥉 Bronze', count: customers.filter(c => c.loyalty === 'Bronze').length },
  ];

  return (
    <div>
      <PageHeader title="Customers" breadcrumb={['Dashboard', 'Customers']}>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: '#3d2e22', color: '#c9a96e' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </button>
      </PageHeader>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {chips.map(chip => {
          const isActive = activeFilter === chip.key;
          return (
            <button key={chip.key} onClick={() => setActiveFilter(chip.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
              style={isActive
                ? { background: '#3d2e22', color: '#c9a96e', border: '1.5px solid #3d2e22' }
                : { background: '#fff', color: '#5a4535', border: '1.5px solid #e2d9ce' }}>
              {chip.label}
              <span className="px-1.5 py-0.5 rounded-md text-xs font-bold"
                style={isActive
                  ? { background: 'rgba(201,169,110,0.2)', color: '#c9a96e' }
                  : { background: '#f0ebe4', color: '#8b7355' }}>
                {chip.count}
              </span>
            </button>
          );
        })}
        {searchQuery && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ background: '#f0e8d8', color: '#8b7355', border: '1px solid #d4c4b0' }}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            "{searchQuery}" — {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#faf7f4', borderBottom: '1px solid #ede5d8' }}>
                {['ID', 'Name', 'Email', 'Phone', 'Loyalty'].map(h => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#9a8878' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">👤</span>
                    <p className="text-sm font-medium" style={{ color: '#9a8878' }}>No customers found</p>
                  </div>
                </td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} style={{ borderTop: i > 0 ? '1px solid #f5f0eb' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#faf7f4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md"
                      style={{ background: '#f5f0eb', color: '#8b7355' }}>{c.id}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: '#ede5d8', color: '#6b5040' }}>
                        {c.name[0]}
                      </div>
                      <span className="font-medium" style={{ color: '#3d2e22' }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-xs" style={{ color: '#9a8878' }}>{c.email}</td>
                  <td className="px-6 py-3.5 text-xs" style={{ color: '#9a8878' }}>{c.phone}</td>
                  <td className="px-6 py-3.5"><LoyaltyBadge loyalty={c.loyalty} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3" style={{ borderTop: '1px solid #f5f0eb', background: '#faf7f4' }}>
            <p className="text-xs" style={{ color: '#9a8878' }}>
              Showing <span className="font-semibold" style={{ color: '#3d2e22' }}>{filtered.length}</span> of {customers.length} customers
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(61,46,34,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ background: '#fff' }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#3d2e22' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: '#f5f0eb' }}>New Customer</h3>
                <p className="text-xs" style={{ color: '#7a6a5a' }}>Add a new boutique customer</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ color: '#c4b5a5' }}
                onMouseEnter={e => e.currentTarget.style.background = '#4e3c2e'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'e.g. Andi Saputra' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'e.g. andi@email.com' },
                { label: 'Phone', name: 'phone', type: 'text', placeholder: 'e.g. 081234567890' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>{f.label}</label>
                  <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#c9a96e'}
                    onBlur={e => e.target.style.borderColor = '#d4c4b0'} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Loyalty Tier</label>
                <select name="loyalty" value={form.loyalty} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = '#d4c4b0'}>
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="flex-1 font-semibold py-2.5 rounded-xl text-sm"
                  style={{ border: '1.5px solid #d4c4b0', color: '#5a4535', background: '#f5f0eb' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 font-semibold py-2.5 rounded-xl text-sm transition-opacity hover:opacity-90"
                  style={{ background: '#3d2e22', color: '#c9a96e' }}>
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
