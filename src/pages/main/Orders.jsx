import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import ordersData from '../../data/orders.json';

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

export function StatusBadge({ status }) {
  const map = {
    Completed: { bg: '#DCFAF8', color: '#16DBCC' },
    Pending:   { bg: '#FFF5D9', color: '#FFBB38' },
    Cancelled: { bg: '#FFE0EB', color: '#FE5C73' },
  };
  const s = map[status] || { bg: '#E7EDFF', color: '#396AFF' };
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color, ...F }}>
      {status}
    </span>
  );
}

const emptyForm = { customerName: '', status: 'Pending', totalPrice: '', orderDate: '', address: '' };

export default function Orders() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [orders, setOrders] = useState(ordersData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = orders.filter(o => {
    const matchStatus = activeFilter === 'All' || o.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    All: orders.length,
    Completed: orders.filter(o => o.status === 'Completed').length,
    Pending:   orders.filter(o => o.status === 'Pending').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalPrice, 0);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleSubmit(e) {
    e.preventDefault();
    const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    setOrders([{ id: newId, ...form, totalPrice: Number(form.totalPrice) }, ...orders]);
    setForm(emptyForm); setShowForm(false);
  }

  /* Summary cards */
  const summaryCards = [
    { label: 'Total Orders',    value: orders.length,                                    iconBg: C.accentBlueBg,   iconColor: C.accentBlue,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { label: 'Completed',       value: counts.Completed,                                 iconBg: C.accentGreenBg,  iconColor: C.accentGreen,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
    { label: 'Pending',         value: counts.Pending,                                   iconBg: C.accentYellowBg, iconColor: C.accentYellow,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Total Revenue',   value: `Rp ${(totalRevenue/1000000).toFixed(1)}M`,       iconBg: C.accentPinkBg,   iconColor: C.accentPink,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
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
          <p className="text-base font-semibold" style={{ color: C.primary2 }}>Orders Overview</p>
          <div className="flex items-center gap-2">
            {/* Filter chips */}
            {['All', 'Completed', 'Pending', 'Cancelled'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={activeFilter === f
                  ? { background: C.primary3, color: '#fff' }
                  : { background: C.bg, color: C.teks }}>
                {f}
              </button>
            ))}
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90"
              style={{ background: C.primary3, color: '#fff' }}>
              + Add Order
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: C.bg }}>
                {['SL No', 'Order ID', 'Customer', 'Address', 'Date', 'Status', 'Total'].map((h, i) => (
                  <th key={h}
                    className={`px-5 py-3.5 text-xs font-semibold text-left`}
                    style={{ color: C.teks, ...F }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm" style={{ color: C.teks }}>
                  No orders found
                </td></tr>
              ) : filtered.map((order, i) => (
                <tr key={order.id} style={{ borderTop: `1px solid ${C.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-5 py-4 text-sm font-medium" style={{ color: C.teks }}>
                    {String(i + 1).padStart(2, '0')}.
                  </td>
                  <td className="px-5 py-4">
                    <Link to={`/orders/${order.id}`}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: C.primary3 }}>
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: C.accentBlueBg, color: C.primary3 }}>
                        {order.customerName[0]}
                      </div>
                      <span className="text-sm font-medium" style={{ color: C.primary2 }}>
                        {order.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs max-w-[160px]" style={{ color: C.teks }}>
                    {order.address || '-'}
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: C.teks }}>{order.orderDate}</td>
                  <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-4 text-sm font-semibold" style={{ color: C.primary2 }}>
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Total row */}
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ borderTop: `2px solid ${C.border}`, background: C.bg }}>
                  <td className="px-5 py-3.5 text-sm font-bold" style={{ color: C.primary3 }} colSpan={2}>Total</td>
                  <td colSpan={4} />
                  <td className="px-5 py-3.5 text-sm font-bold" style={{ color: C.primary3 }}>
                    Rp {filtered.reduce((s, o) => s + o.totalPrice, 0).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(52,60,106,0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ background: '#fff' }}>
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: C.primary3 }}>
              <div>
                <h3 className="text-base font-bold text-white" style={F}>New Order</h3>
                <p className="text-xs text-white/70">Fill in the order details</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Customer Name', name: 'customerName', type: 'text', placeholder: 'e.g. Andi Saputra' },
                { label: 'Total Price (Rp)', name: 'totalPrice', type: 'number', placeholder: 'e.g. 150000' },
                { label: 'Order Date', name: 'orderDate', type: 'date' },
                { label: 'Alamat Pengiriman', name: 'address', type: 'text', placeholder: 'e.g. Jl. Sudirman No. 12' },
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
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.primary2, ...F }}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.primary3}
                  onBlur={e => e.target.style.borderColor = C.border}>
                  <option>Pending</option><option>Completed</option><option>Cancelled</option>
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
