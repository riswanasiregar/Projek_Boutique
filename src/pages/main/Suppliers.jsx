import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

const P = { primary: '#3d2e22', accent: '#c9a96e', text: '#3d2e22', muted: '#9a8878' };

const initialSuppliers = [
  { id: 'SUP-001', name: 'Batik Nusantara', contact: 'Ibu Sari', email: 'sari@batiknusantara.com', phone: '021-5551234', category: 'Fabric', status: 'Active', rating: 5, lastOrder: '2026-03-01', totalOrders: 24, avatar: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=80' },
  { id: 'SUP-002', name: 'Silk Road Textiles', contact: 'Mr. Chen', email: 'chen@silkroad.com', phone: '021-5555678', category: 'Fabric', status: 'Active', rating: 4, lastOrder: '2026-02-20', totalOrders: 18, avatar: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&q=80' },
  { id: 'SUP-003', name: 'Lace & Thread Co.', contact: 'Ms. Dewi', email: 'dewi@lacethread.com', phone: '021-5559012', category: 'Accessories', status: 'Active', rating: 5, lastOrder: '2026-03-05', totalOrders: 31, avatar: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=200&q=80' },
  { id: 'SUP-004', name: 'Premium Buttons', contact: 'Pak Budi', email: 'budi@prembuttons.com', phone: '021-5553456', category: 'Accessories', status: 'Inactive', rating: 3, lastOrder: '2025-12-10', totalOrders: 8, avatar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
  { id: 'SUP-005', name: 'EcoFabric Indonesia', contact: 'Ibu Rina', email: 'rina@ecofabric.id', phone: '021-5557890', category: 'Sustainable', status: 'Active', rating: 5, lastOrder: '2026-03-08', totalOrders: 12, avatar: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80' },
  { id: 'SUP-006', name: 'Zipper World', contact: 'Mr. Hasan', email: 'hasan@zipperworld.com', phone: '021-5552345', category: 'Accessories', status: 'Active', rating: 4, lastOrder: '2026-02-28', totalOrders: 20, avatar: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80' },
];

const categoryColors = {
  Fabric:      { bg: '#f7f3e8', color: '#8a6d2f' },
  Accessories: { bg: '#f0f4f8', color: '#4a6080' },
  Sustainable: { bg: '#eef4ee', color: '#4a7c59' },
};

const inputStyle = { background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#3d2e22', borderRadius: '12px', padding: '10px 16px', fontSize: '14px', width: '100%', outline: 'none' };

const emptyForm = { name: '', contact: '', email: '', phone: '', category: 'Fabric' };

export default function Suppliers() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = suppliers.filter(s => {
    const matchStatus = activeFilter === 'All' || s.status === activeFilter || s.category === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.contact.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleSubmit(e) {
    e.preventDefault();
    const newId = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`;
    setSuppliers([{ id: newId, ...form, status: 'Active', rating: 5, lastOrder: '-', totalOrders: 0 }, ...suppliers]);
    setForm(emptyForm);
    setShowForm(false);
  }

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#c9a96e' : '#d4c4b0', fontSize: '12px' }}>★</span>
    ));
  }

  return (
    <div>
      <PageHeader title="Suppliers" breadcrumb={['Dashboard', 'Suppliers']}>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: '#3d2e22', color: '#c9a96e' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Supplier
        </button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Suppliers', value: suppliers.length, icon: '🏭' },
          { label: 'Active', value: suppliers.filter(s => s.status === 'Active').length, icon: '✅' },
          { label: 'Categories', value: [...new Set(suppliers.map(s => s.category))].length, icon: '🏷️' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-bold" style={{ color: P.text }}>{s.value}</p>
              <p className="text-xs" style={{ color: P.muted }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['All', 'Active', 'Inactive', 'Fabric', 'Accessories', 'Sustainable'].map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={activeFilter === f
              ? { background: '#3d2e22', color: '#c9a96e', border: '1.5px solid #3d2e22' }
              : { background: '#fff', color: '#6b5040', border: '1.5px solid #e2d9ce' }}>
            {f}
          </button>
        ))}
        {searchQuery && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ background: '#f0e8d8', color: '#8b7355', border: '1px solid #d4c4b0' }}>
            🔍 "{searchQuery}" — {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => {
          const catStyle = categoryColors[s.category] || { bg: '#f5f0eb', color: '#8b7355' };
          return (
            <div key={s.id} className="rounded-2xl p-5 transition-shadow hover:shadow-md"
              style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ border: '1px solid #e2d9ce' }}>
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.style.background = '#f5f0eb'; e.currentTarget.parentElement.innerHTML = '<span style="font-size:20px;display:flex;align-items:center;justify-content:center;height:100%">🏭</span>'; }}
                  />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={s.status === 'Active' ? { background: '#eef4ee', color: '#4a7c59' } : { background: '#f5eeec', color: '#8a4a3a' }}>
                  {s.status}
                </span>
              </div>
              <h3 className="text-sm font-bold mb-0.5" style={{ color: P.text }}>{s.name}</h3>
              <p className="text-xs mb-3" style={{ color: P.muted }}>{s.contact}</p>
              <div className="flex items-center gap-1 mb-3">{renderStars(s.rating)}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: P.muted }}>📧</span>
                  <span className="text-xs truncate" style={{ color: P.text }}>{s.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: P.muted }}>📞</span>
                  <span className="text-xs" style={{ color: P.text }}>{s.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #f5f0eb' }}>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: catStyle.bg, color: catStyle.color }}>{s.category}</span>
                <span className="text-xs" style={{ color: P.muted }}>{s.totalOrders} orders</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(61,46,34,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ background: '#fff' }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#3d2e22' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: '#f5f0eb' }}>New Supplier</h3>
                <p className="text-xs" style={{ color: '#7a6a5a' }}>Add a new boutique supplier</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: '#c9a96e' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Company Name', name: 'name', type: 'text', placeholder: 'e.g. Batik Nusantara' },
                { label: 'Contact Person', name: 'contact', type: 'text', placeholder: 'e.g. Ibu Sari' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'contact@company.com' },
                { label: 'Phone', name: 'phone', type: 'text', placeholder: '021-xxxxxxx' },
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
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = '#d4c4b0'}>
                  <option>Fabric</option><option>Accessories</option><option>Sustainable</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="flex-1 font-semibold py-2.5 rounded-xl text-sm"
                  style={{ border: '1.5px solid #d4c4b0', color: '#6b5040', background: '#f5f0eb' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 font-semibold py-2.5 rounded-xl text-sm transition-opacity hover:opacity-90"
                  style={{ background: '#3d2e22', color: '#c9a96e' }}>
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
