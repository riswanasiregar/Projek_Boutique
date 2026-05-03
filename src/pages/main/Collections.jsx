import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

const P = { primary: '#3d2e22', accent: '#c9a96e', bg: '#f5f0eb', surface: '#ede5d8', border: '#d4c4b0', text: '#3d2e22', muted: '#9a8878' };

const initialCollections = [
  { id: 'COL-001', name: 'Spring Bloom 2026', season: 'Spring', year: 2026, items: 24, status: 'Active', cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80', desc: 'Fresh florals and pastel tones for the new season', tags: ['Floral', 'Pastel', 'Casual'] },
  { id: 'COL-002', name: 'Summer Luxe', season: 'Summer', year: 2026, items: 18, status: 'Active', cover: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', desc: 'Lightweight fabrics and vibrant colors for summer days', tags: ['Linen', 'Vibrant', 'Resort'] },
  { id: 'COL-003', name: 'Autumn Elegance', season: 'Autumn', year: 2025, items: 32, status: 'Archived', cover: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80', desc: 'Rich earth tones and layered looks for the cooler months', tags: ['Earth Tones', 'Layered', 'Formal'] },
  { id: 'COL-004', name: 'Winter Noir', season: 'Winter', year: 2025, items: 20, status: 'Archived', cover: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80', desc: 'Dark, sophisticated pieces for the winter wardrobe', tags: ['Dark', 'Sophisticated', 'Outerwear'] },
  { id: 'COL-005', name: 'Capsule Essentials', season: 'All Season', year: 2026, items: 15, status: 'Active', cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', desc: 'Timeless wardrobe staples that work year-round', tags: ['Minimal', 'Timeless', 'Versatile'] },
  { id: 'COL-006', name: 'Bridal Edit', season: 'All Season', year: 2026, items: 12, status: 'Draft', cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', desc: 'Elegant pieces for the modern bride and her entourage', tags: ['Bridal', 'Elegant', 'White'] },
];

const seasonColors = {
  Spring:     { bg: '#fef0f5', color: '#c06080' },
  Summer:     { bg: '#fef9e8', color: '#a07820' },
  Autumn:     { bg: '#fef3e8', color: '#a05820' },
  Winter:     { bg: '#eef4f8', color: '#406080' },
  'All Season': { bg: '#f0ede8', color: '#6a5040' },
};

const statusColors = {
  Active:   { bg: '#eef4ee', color: '#4a7c59' },
  Archived: { bg: '#f5f0eb', color: '#8b7355' },
  Draft:    { bg: '#f7f3e8', color: '#8a6d2f' },
};

const emptyForm = { name: '', season: 'Spring', year: 2026, desc: '', tags: '' };
const inputStyle = { background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#3d2e22', borderRadius: '12px', padding: '10px 16px', fontSize: '14px', width: '100%', outline: 'none' };

export default function Collections() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [collections, setCollections] = useState(initialCollections);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [viewMode, setViewMode] = useState('grid');

  const filters = ['All', 'Active', 'Draft', 'Archived'];

  const filtered = collections.filter(c => {
    const matchStatus = activeFilter === 'All' || c.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.season.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleSubmit(e) {
    e.preventDefault();
    const newId = `COL-${String(collections.length + 1).padStart(3, '0')}`;
    setCollections([{ id: newId, ...form, year: Number(form.year), items: 0, status: 'Draft', cover: '✨', tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }, ...collections]);
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <div>
      <PageHeader title="Collections" breadcrumb={['Dashboard', 'Collections']}>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
            style={{ background: '#ede5d8', color: '#6b5040', border: '1px solid #d4c4b0' }}>
            {viewMode === 'grid'
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            }
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: '#3d2e22', color: '#c9a96e' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Collection
          </button>
        </div>
      </PageHeader>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={activeFilter === f
              ? { background: '#3d2e22', color: '#c9a96e', border: '1.5px solid #3d2e22' }
              : { background: '#fff', color: '#6b5040', border: '1.5px solid #e2d9ce' }}>
            {f}
            <span className="ml-1.5 px-1.5 py-0.5 rounded-md text-xs"
              style={activeFilter === f
                ? { background: 'rgba(201,169,110,0.2)', color: '#c9a96e' }
                : { background: '#f0ebe4', color: '#8b7355' }}>
              {f === 'All' ? collections.length : collections.filter(c => c.status === f).length}
            </span>
          </button>
        ))}
        {searchQuery && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ background: '#f0e8d8', color: '#8b7355', border: '1px solid #d4c4b0' }}>
            🔍 "{searchQuery}" — {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Grid view */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(col => {
            const seasonStyle = seasonColors[col.season] || { bg: '#f5f0eb', color: '#8b7355' };
            const statusStyle = statusColors[col.status] || { bg: '#f5f0eb', color: '#8b7355' };
            return (
              <div key={col.id} className="rounded-2xl overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
                style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
                {/* Cover */}
                <div className="h-36 relative overflow-hidden">
                  <img
                    src={col.cover}
                    alt={col.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.style.background = `linear-gradient(135deg, ${seasonStyle.bg}, #ede5d8)`; }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(61,46,34,0.45) 0%, transparent 60%)' }} />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}>
                      {col.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: seasonStyle.bg, color: seasonStyle.color }}>
                      {col.season} {col.year}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-bold" style={{ color: P.text }}>{col.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg ml-2 flex-shrink-0"
                      style={{ background: '#f0e8d8', color: '#8b7355' }}>
                      {col.items} items
                    </span>
                  </div>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: P.muted }}>{col.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {col.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: '#f5f0eb', color: '#8b7355', border: '1px solid #d4c4b0' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#faf7f4', borderBottom: '1px solid #ede5d8' }}>
                {['Collection', 'Season', 'Items', 'Tags', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#9a8878' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((col, i) => {
                const seasonStyle = seasonColors[col.season] || { bg: '#f5f0eb', color: '#8b7355' };
                const statusStyle = statusColors[col.status] || { bg: '#f5f0eb', color: '#8b7355' };
                return (
                  <tr key={col.id} style={{ borderTop: i > 0 ? '1px solid #f5f0eb' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#faf7f4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={col.cover} alt={col.name} className="w-full h-full object-cover"
                            onError={e => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: P.text }}>{col.name}</p>
                          <p className="text-xs" style={{ color: P.muted }}>{col.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: seasonStyle.bg, color: seasonStyle.color }}>
                        {col.season} {col.year}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold" style={{ color: P.text }}>{col.items}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {col.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
                            style={{ background: '#f5f0eb', color: '#8b7355' }}>{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}>{col.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(61,46,34,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ background: '#fff' }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#3d2e22' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: '#f5f0eb' }}>New Collection</h3>
                <p className="text-xs" style={{ color: '#7a6a5a' }}>Create a new fashion collection</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ color: '#c9a96e' }}
                onMouseEnter={e => e.currentTarget.style.background = '#4e3c2e'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Collection Name', name: 'name', type: 'text', placeholder: 'e.g. Spring Bloom 2026' },
                { label: 'Year', name: 'year', type: 'number', placeholder: '2026' },
                { label: 'Description', name: 'desc', type: 'text', placeholder: 'Brief description...' },
                { label: 'Tags (comma separated)', name: 'tags', type: 'text', placeholder: 'Floral, Pastel, Casual' },
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
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Season</label>
                <select name="season" value={form.season} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = '#d4c4b0'}>
                  <option>Spring</option><option>Summer</option><option>Autumn</option>
                  <option>Winter</option><option>All Season</option>
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
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
