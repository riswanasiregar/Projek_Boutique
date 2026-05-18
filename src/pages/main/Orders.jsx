import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import ordersData from '../../data/orders.json';

import { StatusBadge, FilterChip } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import Modal, { ModalFooter } from '../../components/Modal';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Container, { PageSection } from '../../components/Container';
import { TableFooter } from '../../components/Footer';

const emptyForm = { customerName: '', status: 'Pending', totalPrice: '', orderDate: '', address: '' };

export default function Orders() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [orders, setOrders]       = useState(ordersData);
  const [activeFilter, setFilter] = useState('All');
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);

  const filtered = orders.filter(o => {
    const matchStatus = activeFilter === 'All' || o.status === activeFilter;
    const q = searchQuery.toLowerCase();
    return matchStatus && (!q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
  });

  const counts = {
    All:       orders.length,
    Completed: orders.filter(o => o.status === 'Completed').length,
    Pending:   orders.filter(o => o.status === 'Pending').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };
  const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalPrice, 0);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleClose()   { setShowForm(false); setForm(emptyForm); }
  function handleSubmit(e) {
    e.preventDefault();
    const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    setOrders([{ id: newId, ...form, totalPrice: Number(form.totalPrice) }, ...orders]);
    handleClose();
  }

  const summaryCards = [
    { label: 'Total Orders',  value: orders.length,                          iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { label: 'Completed',     value: counts.Completed,                       iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
    { label: 'Pending',       value: counts.Pending,                         iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Total Revenue', value: `Rp ${(totalRevenue/1e6).toFixed(1)}M`, iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-accent-pink',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  return (
    <Container>

      {/* Summary cards */}
      <PageSection cols={4} gap="sm">
        {summaryCards.map(card => <StatCard key={card.label} {...card} />)}
      </PageSection>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
        <CardHeader
          title="Orders Overview"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'Completed', 'Pending', 'Cancelled'].map(f => (
                <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setFilter(f)} />
              ))}
              <Button size="sm" variant="primary" onClick={() => setShowForm(true)}
                className="rounded-full text-xs">
                + Add Order
              </Button>
            </div>
          }
        />

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
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">
                    No orders found
                  </td>
                </tr>
              ) : filtered.map((order, i) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className="text-neutral-teks">{String(i + 1).padStart(2, '0')}.</span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/orders/${order.id}`} className="text-xs font-semibold text-primary-3 hover:underline font-mono">
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={order.customerName} size="sm" bgClass="bg-accent-blue-shadow" textClass="text-primary-3" />
                      <span className="text-sm font-medium text-primary-2">{order.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-neutral-teks max-w-[160px] block">{order.address || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-neutral-teks">{order.orderDate}</span>
                  </TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-primary-2">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-neutral-border bg-neutral-bg">
                  <td className="px-5 py-3.5 text-sm font-bold text-primary-3 font-inter" colSpan={2}>Total</td>
                  <td colSpan={4} />
                  <td className="px-5 py-3.5 text-sm font-bold text-primary-3 font-inter">
                    Rp {filtered.reduce((s, o) => s + o.totalPrice, 0).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {filtered.length > 0 && (
          <TableFooter showing={filtered.length} total={orders.length} label="orders" />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleClose}
        title="New Order"
        subtitle="Fill in the order details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Customer Name"     name="customerName" value={form.customerName} onChange={handleChange} placeholder="e.g. Andi Saputra"   required />
          <InputField label="Total Price (Rp)"  name="totalPrice"   value={form.totalPrice}   onChange={handleChange} placeholder="e.g. 150000"         required type="number" />
          <InputField label="Order Date"        name="orderDate"    value={form.orderDate}    onChange={handleChange} required type="date" />
          <InputField label="Alamat Pengiriman" name="address"      value={form.address}      onChange={handleChange} placeholder="e.g. Jl. Sudirman 12" required />
          <SelectField label="Status" name="status" value={form.status} onChange={handleChange}
            options={['Pending', 'Completed', 'Cancelled']} />
          <ModalFooter onCancel={handleClose} submitLabel="Save Order" />
        </form>
      </Modal>

    </Container>
  );
}
