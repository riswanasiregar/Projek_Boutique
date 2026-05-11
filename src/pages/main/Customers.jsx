import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import customersData from '../../data/customers.json';

export function LoyaltyBadge({ loyalty }) {
  const map = {
    Gold:   'bg-accent-yellow-shadow text-accent-yellow',
    Silver: 'bg-accent-blue-shadow text-accent-blue',
    Bronze: 'bg-accent-pink-shadow text-secondary',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold font-inter ${map[loyalty] || 'bg-accent-blue-shadow text-accent-blue'}`}>
      {loyalty}
    </span>
  );
}

const emptyForm = { name: '', email: '', phone: '', loyalty: 'Bronze' };

export default function Customers() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [customers, setCustomers]       = useState(customersData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState(emptyForm);

  const filtered = customers.filter(c => {
    const matchLoyalty = activeFilter === 'All' || c.loyalty === activeFilter;
    const q = searchQuery.toLowerCase();
    return matchLoyalty && (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleSubmit(e) {
    e.preventDefault();
    const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    setCustomers([{ id: newId, ...form }, ...customers]);
    setForm(emptyForm); setShowForm(false);
  }

  const summaryCards = [
    { label: 'Total Customers', value: customers.length,                                   iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue'   },
    { label: 'Gold Members',    value: customers.filter(c => c.loyalty === 'Gold').length,  iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow' },
    { label: 'Silver Members',  value: customers.filter(c => c.loyalty === 'Silver').length,iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green'  },
    { label: 'Bronze Members',  value: customers.filter(c => c.loyalty === 'Bronze').length,iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-accent-pink'   },
  ];

  return (
    <div className="space-y-6 font-inter">

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-2xl p-5 flex items-center gap-4 bg-neutral border border-neutral-border">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg} ${card.iconColor}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5 text-neutral-teks">{card.label}</p>
              <p className="text-xl font-bold text-primary-2">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
          <p className="text-base font-semibold text-primary-2">Customers List</p>
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Gold', 'Silver', 'Bronze'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all font-inter
                  ${activeFilter === f ? 'bg-primary-3 text-neutral' : 'bg-neutral-bg text-neutral-teks'}`}>
                {f}
              </button>
            ))}
            <button onClick={() => setShowForm(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-3 text-neutral hover:opacity-90 transition-opacity font-inter">
              + Add Customer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['SL No', 'Name', 'Email', 'Phone', 'Loyalty', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">
                  No customers found
                </td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} className="border-t border-neutral-border hover:bg-neutral-bg transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-neutral-teks font-inter">{String(i+1).padStart(2,'0')}.</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-accent-green-shadow text-accent-green">
                        {c.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-2 font-inter">{c.name}</p>
                        <p className="text-xs text-neutral-teks font-inter">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-teks font-inter">{c.email}</td>
                  <td className="px-5 py-4 text-sm text-neutral-teks font-inter">{c.phone}</td>
                  <td className="px-5 py-4"><LoyaltyBadge loyalty={c.loyalty} /></td>
                  <td className="px-5 py-4">
                    <Link to={`/customers/${c.id}`}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold border border-primary-3 text-primary-3
                        hover:bg-primary-3 hover:text-neutral transition-all font-inter">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-neutral-border bg-neutral-bg">
            <p className="text-xs text-neutral-teks font-inter">
              Showing <span className="font-semibold text-primary-2">{filtered.length}</span> of {customers.length} customers
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-primary-2/50 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden bg-neutral">
            <div className="px-6 py-4 flex items-center justify-between bg-primary-3">
              <div>
                <h3 className="text-base font-bold text-neutral font-inter">New Customer</h3>
                <p className="text-xs text-neutral/70 font-inter">Add a new customer</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral/70 hover:text-neutral transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Full Name', name: 'name',  type: 'text',  placeholder: 'e.g. Andi Saputra'    },
                { label: 'Email',     name: 'email', type: 'email', placeholder: 'e.g. andi@email.com'  },
                { label: 'Phone',     name: 'phone', type: 'text',  placeholder: 'e.g. 081234567890'    },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold mb-1.5 text-primary-2 font-inter">{f.label}</label>
                  <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder} required
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all font-inter
                      bg-neutral-bg border border-neutral-border text-primary-2 focus:border-primary-3" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-primary-2 font-inter">Loyalty Tier</label>
                <select name="loyalty" value={form.loyalty} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all font-inter
                    bg-neutral-bg border border-neutral-border text-primary-2 focus:border-primary-3">
                  <option>Bronze</option><option>Silver</option><option>Gold</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter
                    border border-neutral-border text-neutral-teks bg-neutral-bg">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter
                    bg-primary-3 text-neutral hover:opacity-90 transition-opacity">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
