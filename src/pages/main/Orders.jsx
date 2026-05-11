import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import ordersData from '../../data/orders.json';

export function StatusBadge({ status }) {
  const map = {
    Completed: 'bg-accent-green-shadow text-accent-green',
    Pending:   'bg-accent-yellow-shadow text-accent-yellow',
    Cancelled: 'bg-accent-pink-shadow text-secondary',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold font-inter ${map[status] || 'bg-accent-blue-shadow text-accent-blue'}`}>
      {status}
    </span>
  );
}

const emptyForm = { customerName: '', status: 'Pending', totalPrice: '', orderDate: '', address: '' };

export default function Orders() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [orders, setOrders]       = useState(ordersData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);

  const filtered = orders.filter(o => {
    const matchStatus = activeFilter === 'All' || o.status === activeFilter;
    const q = searchQuery.toLowerCase();
    return matchStatus && (!q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
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

  const summaryCards = [
    { label: 'Total Orders',  value: orders.length,                          iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue'   },
    { label: 'Completed',     value: counts.Completed,                       iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green'  },
    { label: 'Pending',       value: counts.Pending,                         iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow' },
    { label: 'Total Revenue', value: `Rp ${(totalRevenue/1e6).toFixed(1)}M`, iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-accent-pink'   },
  ];

  const filterBtns = ['All', 'Completed', 'Pending', 'Cancelled'];

  return (
    <div className="space-y-6 font-inter">

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-2xl p-5 flex items-center gap-4 bg-neutral border border-neutral-border">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg} ${card.iconColor}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
          <p className="text-base font-semibold text-primary-2">Orders Overview</p>
          <div className="flex items-center gap-2 flex-wrap">
            {filterBtns.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all font-inter
                  ${activeFilter === f ? 'bg-primary-3 text-neutral' : 'bg-neutral-bg text-neutral-teks'}`}>
                {f}
              </button>
            ))}
            <button onClick={() => setShowForm(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-3 text-neutral hover:opacity-90 transition-opacity font-inter">
              + Add Order
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['SL No', 'Order ID', 'Customer', 'Address', 'Date', 'Status', 'Total'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">
                  No orders found
                </td></tr>
              ) : filtered.map((order, i) => (
                <tr key={order.id} className="border-t border-neutral-border hover:bg-neutral-bg transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-neutral-teks">{String(i+1).padStart(2,'0')}.</td>
                  <td className="px-5 py-4">
                    <Link to={`/orders/${order.id}`} className="text-xs font-semibold text-primary-3 hover:underline font-inter">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-accent-blue-shadow text-primary-3">
                        {order.customerName[0]}
                      </div>
                      <span className="text-sm font-medium text-primary-2 font-inter">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-teks max-w-[160px] font-inter">{order.address || '-'}</td>
                  <td className="px-5 py-4 text-xs text-neutral-teks font-inter">{order.orderDate}</td>
                  <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-4 text-sm font-semibold text-primary-2 font-inter">
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-neutral-border bg-neutral-bg">
                  <td className="px-5 py-3.5 text-sm font-bold text-primary-3 font-inter" colSpan={2}>Total</td>
                  <td colSpan={4} />
                  <td className="px-5 py-3.5 text-sm font-bold text-primary-3 font-inter">
                    Rp {filtered.reduce((s,o) => s + o.totalPrice, 0).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-primary-2/50 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden bg-neutral">
            <div className="px-6 py-4 flex items-center justify-between bg-primary-3">
              <div>
                <h3 className="text-base font-bold text-neutral font-inter">New Order</h3>
                <p className="text-xs text-neutral/70 font-inter">Fill in the order details</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral/70 hover:text-neutral transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Customer Name',     name: 'customerName', type: 'text',   placeholder: 'e.g. Andi Saputra'    },
                { label: 'Total Price (Rp)',  name: 'totalPrice',   type: 'number', placeholder: 'e.g. 150000'          },
                { label: 'Order Date',        name: 'orderDate',    type: 'date'                                        },
                { label: 'Alamat Pengiriman', name: 'address',      type: 'text',   placeholder: 'e.g. Jl. Sudirman 12' },
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
                <label className="block text-xs font-semibold mb-1.5 text-primary-2 font-inter">Status</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all font-inter
                    bg-neutral-bg border border-neutral-border text-primary-2 focus:border-primary-3">
                  <option>Pending</option><option>Completed</option><option>Cancelled</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter
                    border border-neutral-border text-neutral-teks bg-neutral-bg">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter
                    bg-primary-3 text-neutral hover:opacity-90 transition-opacity">Save Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
