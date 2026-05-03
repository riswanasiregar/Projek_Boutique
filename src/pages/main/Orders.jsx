import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ordersData from '../../data/orders.json';
import PageHeader from '../../components/PageHeader';

export function StatusBadge({ status }) {
  const map = {
    Completed: { bg: '#eef4ee', color: '#4a7c59', dot: '#6aab7a' },
    Pending:   { bg: '#f7f3e8', color: '#8a6d2f', dot: '#c9a84c' },
    Cancelled: { bg: '#f5eeec', color: '#8a4a3a', dot: '#c97060' },
  };
  const s = map[status] || { bg: '#f5f0eb', color: '#8a7060', dot: '#c9b99a' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

const emptyForm = { customerName: '', status: 'Pending', totalPrice: '', orderDate: '' };

const inputStyle = {
  background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#3d2e22',
  borderRadius: '12px', padding: '10px 16px', fontSize: '14px', width: '100%', outline: 'none',
};

export default function Orders() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [orders, setOrders] = useState(ordersData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Filter by status chip + search
  const filtered = orders.filter(o => {
    const matchStatus = activeFilter === 'All' || o.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.status.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    All: orders.length,
    Completed: orders.filter(o => o.status === 'Completed').length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleSubmit(e) {
    e.preventDefault();
    const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    setOrders([{ id: newId, customerName: form.customerName, status: form.status, totalPrice: Number(form.totalPrice), orderDate: form.orderDate }, ...orders]);
    setForm(emptyForm);
    setShowForm(false);
  }

  const chips = [
    { key: 'All', label: 'All Orders' },
    { key: 'Completed', label: '✓ Completed' },
    { key: 'Pending', label: '◷ Pending' },
    { key: 'Cancelled', label: '✕ Cancelled' },
  ];

  return (
    <div>
      <PageHeader title="Orders" breadcrumb={['Dashboard', 'Orders']}>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: '#3d2e22', color: '#c9a96e' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Order
        </button>
      </PageHeader>

      {/* Clickable filter chips */}
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
                {counts[chip.key]}
              </span>
            </button>
          );
        })}

        {/* Search result indicator */}
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
                {['Order ID', 'Customer', 'Date', 'Status', 'Total'].map((h, i) => (
                  <th key={h} className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}
                    style={{ color: '#9a8878' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">🔍</span>
                      <p className="text-sm font-medium" style={{ color: '#9a8878' }}>No orders found</p>
                      <p className="text-xs" style={{ color: '#b8a898' }}>Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((order, i) => (
                <tr key={order.id} style={{ borderTop: i > 0 ? '1px solid #f5f0eb' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#faf7f4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md"
                      style={{ background: '#f5f0eb', color: '#8b7355' }}>{order.id}</span>
                  </td>
                  <td className="px-6 py-3.5 font-medium" style={{ color: '#3d2e22' }}>{order.customerName}</td>
                  <td className="px-6 py-3.5 text-xs" style={{ color: '#9a8878' }}>{order.orderDate}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-3.5 text-right font-bold" style={{ color: '#3d2e22' }}>
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between"
            style={{ borderTop: '1px solid #f5f0eb', background: '#faf7f4' }}>
            <p className="text-xs" style={{ color: '#9a8878' }}>
              Showing <span className="font-semibold" style={{ color: '#3d2e22' }}>{filtered.length}</span> of {orders.length} orders
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
                <h3 className="text-base font-bold" style={{ color: '#f5f0eb' }}>New Order</h3>
                <p className="text-xs" style={{ color: '#7a6a5a' }}>Fill in the order details below</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
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
                { label: 'Customer Name', name: 'customerName', type: 'text', placeholder: 'e.g. Andi Saputra' },
                { label: 'Total Price (Rp)', name: 'totalPrice', type: 'number', placeholder: 'e.g. 150000' },
                { label: 'Order Date', name: 'orderDate', type: 'date' },
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
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = '#d4c4b0'}>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
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
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
