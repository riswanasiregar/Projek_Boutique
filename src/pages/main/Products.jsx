import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

const initialProducts = [
  { id: 'PRD-001', name: 'Floral Summer Dress', category: 'Dress', price: 350000, stock: 15 },
  { id: 'PRD-002', name: 'Classic White Blouse', category: 'Top', price: 180000, stock: 30 },
  { id: 'PRD-003', name: 'High-Waist Trousers', category: 'Bottom', price: 275000, stock: 20 },
  { id: 'PRD-004', name: 'Knit Cardigan', category: 'Outerwear', price: 420000, stock: 12 },
  { id: 'PRD-005', name: 'Silk Midi Skirt', category: 'Bottom', price: 310000, stock: 18 },
  { id: 'PRD-006', name: 'Linen Blazer', category: 'Outerwear', price: 580000, stock: 8 },
  { id: 'PRD-007', name: 'Wrap Maxi Dress', category: 'Dress', price: 450000, stock: 10 },
  { id: 'PRD-008', name: 'Crop Cami Top', category: 'Top', price: 120000, stock: 25 },
  { id: 'PRD-009', name: 'Wide Leg Jeans', category: 'Bottom', price: 390000, stock: 14 },
  { id: 'PRD-010', name: 'Trench Coat', category: 'Outerwear', price: 850000, stock: 5 },
];

const categoryColors = {
  Dress:       { bg: '#f7f3e8', color: '#8a6d2f' },
  Top:         { bg: '#eef4ee', color: '#4a7c59' },
  Bottom:      { bg: '#f0f4f8', color: '#4a6080' },
  Outerwear:   { bg: '#f5eeec', color: '#8a5a4a' },
  Accessories: { bg: '#f0e8f8', color: '#6a4a8a' },
};

const emptyForm = { name: '', category: 'Dress', price: '', stock: '' };
const inputStyle = {
  background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#3d2e22',
  borderRadius: '12px', padding: '10px 16px', fontSize: '14px', width: '100%', outline: 'none',
};

export default function Products() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const categories = ['All', 'Dress', 'Top', 'Bottom', 'Outerwear', 'Accessories'];

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleSubmit(e) {
    e.preventDefault();
    const newId = `PRD-${String(products.length + 1).padStart(3, '0')}`;
    setProducts([{ id: newId, name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock) }, ...products]);
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <div>
      <PageHeader title="Products" breadcrumb={['Dashboard', 'Products']}>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: '#3d2e22', color: '#c9a96e' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </PageHeader>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
              style={isActive
                ? { background: '#3d2e22', color: '#c9a96e', border: '1.5px solid #3d2e22' }
                : { background: '#fff', color: '#5a4535', border: '1.5px solid #e2d9ce' }}>
              {cat}
              <span className="px-1.5 py-0.5 rounded-md text-xs font-bold"
                style={isActive
                  ? { background: 'rgba(201,169,110,0.2)', color: '#c9a96e' }
                  : { background: '#f0ebe4', color: '#8b7355' }}>
                {count}
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
                {['Product ID', 'Name', 'Category', 'Price', 'Stock', 'Status'].map((h, i) => (
                  <th key={h} className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider ${i >= 3 ? 'text-right' : 'text-left'}`}
                    style={{ color: '#9a8878' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">👗</span>
                    <p className="text-sm font-medium" style={{ color: '#9a8878' }}>No products found</p>
                  </div>
                </td></tr>
              ) : filtered.map((p, i) => {
                const catStyle = categoryColors[p.category] || { bg: '#f5f0eb', color: '#8b7355' };
                const lowStock = p.stock <= 5;
                return (
                  <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid #f5f0eb' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#faf7f4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md"
                        style={{ background: '#f5f0eb', color: '#8b7355' }}>{p.id}</span>
                    </td>
                    <td className="px-6 py-3.5 font-medium" style={{ color: '#3d2e22' }}>{p.name}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: catStyle.bg, color: catStyle.color }}>{p.category}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium" style={{ color: '#3d2e22' }}>
                      Rp {p.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold"
                      style={{ color: lowStock ? '#8a4a3a' : '#3d2e22' }}>{p.stock}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={lowStock
                          ? { background: '#f5eeec', color: '#8a4a3a' }
                          : { background: '#eef4ee', color: '#4a7c59' }}>
                        {lowStock ? '⚠ Low Stock' : '✓ In Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3" style={{ borderTop: '1px solid #f5f0eb', background: '#faf7f4' }}>
            <p className="text-xs" style={{ color: '#9a8878' }}>
              Showing <span className="font-semibold" style={{ color: '#3d2e22' }}>{filtered.length}</span> of {products.length} products
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
                <h3 className="text-base font-bold" style={{ color: '#f5f0eb' }}>New Product</h3>
                <p className="text-xs" style={{ color: '#7a6a5a' }}>Add to your fashion catalog</p>
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
                { label: 'Product Name', name: 'name', type: 'text', placeholder: 'e.g. Floral Summer Dress' },
                { label: 'Price (Rp)', name: 'price', type: 'number', placeholder: 'e.g. 350000' },
                { label: 'Stock', name: 'stock', type: 'number', placeholder: 'e.g. 15' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>{f.label}</label>
                  <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder} required min={f.type === 'number' ? '0' : undefined}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#c9a96e'}
                    onBlur={e => e.target.style.borderColor = '#d4c4b0'} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = '#d4c4b0'}>
                  <option>Dress</option><option>Top</option><option>Bottom</option>
                  <option>Outerwear</option><option>Accessories</option>
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
