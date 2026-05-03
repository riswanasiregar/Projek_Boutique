import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

const P = { primary: '#3d2e22', accent: '#c9a96e', text: '#3d2e22', muted: '#9a8878' };

const inventoryData = [
  { id: 'INV-001', product: 'Floral Summer Dress', sku: 'FSD-S-BLU', size: 'S', color: 'Blue', stock: 8, reorder: 5, location: 'Rack A1', lastUpdated: '2026-03-10' },
  { id: 'INV-002', product: 'Floral Summer Dress', sku: 'FSD-M-BLU', size: 'M', color: 'Blue', stock: 12, reorder: 5, location: 'Rack A1', lastUpdated: '2026-03-10' },
  { id: 'INV-003', product: 'Classic White Blouse', sku: 'CWB-S-WHT', size: 'S', color: 'White', stock: 3, reorder: 5, location: 'Rack B2', lastUpdated: '2026-03-08' },
  { id: 'INV-004', product: 'Classic White Blouse', sku: 'CWB-M-WHT', size: 'M', color: 'White', stock: 15, reorder: 5, location: 'Rack B2', lastUpdated: '2026-03-08' },
  { id: 'INV-005', product: 'Knit Cardigan', sku: 'KC-L-BEI', size: 'L', color: 'Beige', stock: 2, reorder: 3, location: 'Rack C3', lastUpdated: '2026-03-05' },
  { id: 'INV-006', product: 'Silk Midi Skirt', sku: 'SMS-M-BLK', size: 'M', color: 'Black', stock: 9, reorder: 4, location: 'Rack D1', lastUpdated: '2026-03-12' },
  { id: 'INV-007', product: 'Linen Blazer', sku: 'LB-S-CRM', size: 'S', color: 'Cream', stock: 4, reorder: 3, location: 'Rack E2', lastUpdated: '2026-03-11' },
  { id: 'INV-008', product: 'Trench Coat', sku: 'TC-M-TAN', size: 'M', color: 'Tan', stock: 1, reorder: 3, location: 'Rack F1', lastUpdated: '2026-03-01' },
  { id: 'INV-009', product: 'Wide Leg Jeans', sku: 'WLJ-L-IND', size: 'L', color: 'Indigo', stock: 7, reorder: 4, location: 'Rack G2', lastUpdated: '2026-03-09' },
  { id: 'INV-010', product: 'Wrap Maxi Dress', sku: 'WMD-S-FLR', size: 'S', color: 'Floral', stock: 5, reorder: 4, location: 'Rack A3', lastUpdated: '2026-03-07' },
];

const inputStyle = { background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#3d2e22', borderRadius: '12px', padding: '10px 16px', fontSize: '14px', width: '100%', outline: 'none' };

export default function Inventory() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [inventory, setInventory] = useState(inventoryData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showRestock, setShowRestock] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQty, setRestockQty] = useState('');

  const lowStock = inventory.filter(i => i.stock <= i.reorder);
  const outOfStock = inventory.filter(i => i.stock === 0);

  const filtered = inventory.filter(item => {
    const matchFilter = activeFilter === 'All' || (activeFilter === 'Low Stock' && item.stock <= item.reorder) || (activeFilter === 'In Stock' && item.stock > item.reorder);
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || item.product.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.color.toLowerCase().includes(q) || item.size.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  function handleRestock(e) {
    e.preventDefault();
    setInventory(inventory.map(i => i.id === selectedItem.id ? { ...i, stock: i.stock + Number(restockQty), lastUpdated: new Date().toISOString().split('T')[0] } : i));
    setShowRestock(false);
    setSelectedItem(null);
    setRestockQty('');
  }

  return (
    <div>
      <PageHeader title="Inventory" breadcrumb={['Dashboard', 'Inventory']}>
        <div className="flex items-center gap-2">
          {lowStock.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: '#f5eeec', color: '#8a4a3a', border: '1px solid #e8c4b8' }}>
              ⚠️ {lowStock.length} low stock
            </div>
          )}
        </div>
      </PageHeader>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total SKUs', value: inventory.length, icon: '📦', bg: '#fff' },
          { label: 'Low Stock', value: lowStock.length, icon: '⚠️', bg: '#fef9f0' },
          { label: 'Out of Stock', value: outOfStock.length, icon: '❌', bg: '#fef5f5' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: s.bg, border: '1px solid #e2d9ce' }}>
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
        {['All', 'Low Stock', 'In Stock'].map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
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

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#faf7f4', borderBottom: '1px solid #ede5d8' }}>
                {['SKU', 'Product', 'Size', 'Color', 'Stock', 'Reorder At', 'Location', 'Action'].map((h, i) => (
                  <th key={h} className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider ${i >= 4 && i <= 5 ? 'text-center' : 'text-left'}`}
                    style={{ color: '#9a8878' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const isLow = item.stock <= item.reorder;
                return (
                  <tr key={item.id} style={{ borderTop: i > 0 ? '1px solid #f5f0eb' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#faf7f4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md"
                        style={{ background: '#f5f0eb', color: '#8b7355' }}>{item.sku}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-sm" style={{ color: P.text }}>{item.product}</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: P.muted }}>{item.size}</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: P.muted }}>{item.color}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="font-bold text-sm px-2.5 py-1 rounded-full"
                        style={isLow
                          ? { background: '#f5eeec', color: '#8a4a3a' }
                          : { background: '#eef4ee', color: '#4a7c59' }}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs" style={{ color: P.muted }}>{item.reorder}</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: P.muted }}>{item.location}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setSelectedItem(item); setShowRestock(true); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                        style={{ background: '#3d2e22', color: '#c9a96e' }}>
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {showRestock && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(61,46,34,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ background: '#fff' }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#3d2e22' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: '#f5f0eb' }}>Restock Item</h3>
                <p className="text-xs" style={{ color: '#7a6a5a' }}>{selectedItem.sku}</p>
              </div>
              <button onClick={() => { setShowRestock(false); setSelectedItem(null); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: '#c9a96e' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleRestock} className="p-6 space-y-4">
              <div className="rounded-xl p-3" style={{ background: '#f5f0eb' }}>
                <p className="text-xs font-semibold" style={{ color: P.text }}>{selectedItem.product}</p>
                <p className="text-xs mt-0.5" style={{ color: P.muted }}>Size: {selectedItem.size} · Color: {selectedItem.color}</p>
                <p className="text-xs mt-1 font-bold" style={{ color: '#8a4a3a' }}>Current stock: {selectedItem.stock}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Add Quantity</label>
                <input type="number" value={restockQty} onChange={e => setRestockQty(e.target.value)}
                  placeholder="e.g. 10" required min="1" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = '#d4c4b0'} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowRestock(false); setSelectedItem(null); }}
                  className="flex-1 font-semibold py-2.5 rounded-xl text-sm"
                  style={{ border: '1.5px solid #d4c4b0', color: '#6b5040', background: '#f5f0eb' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 font-semibold py-2.5 rounded-xl text-sm transition-opacity hover:opacity-90"
                  style={{ background: '#3d2e22', color: '#c9a96e' }}>
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
