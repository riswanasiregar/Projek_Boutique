import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import ordersData from '../../data/orders.json';
import { StatusBadge, FilterChip } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import Modal, { ModalFooter } from '../../components/Modal';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import Avatar from '../../components/Avatar';
import { Button } from '../../components/ui/button';
import Container, { PageSection } from '../../components/Container';
import { TableFooter } from '../../components/Footer';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';

const ITEMS_PER_PAGE = 10;

const emptyForm = { customerName: '', status: 'Pending', totalPrice: '', orderDate: '', address: '' };

function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

// Ikon Edit
function IconEdit() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

// Ikon Hapus
function IconTrash() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function Orders() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [orders, setOrders]         = useState(ordersData);
  const [activeFilter, setFilter]   = useState('All');
  const [showAdd, setShowAdd]       = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [page, setPage]             = useState(1);

  // useRef: auto-focus input Customer Name saat modal Add/Edit dibuka
  const customerNameRef = useRef(null);

  const filtered = orders.filter(o => {
    const matchStatus = activeFilter === 'All' || o.status === activeFilter;
    const q = searchQuery.toLowerCase();
    return matchStatus && (!q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [activeFilter, searchQuery]);

  // Auto-focus input Customer Name saat modal Add atau Edit dibuka
  useEffect(() => {
    if (showAdd || showEdit) {
      const t = setTimeout(() => customerNameRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [showAdd, showEdit]);

  const counts = {
    All:       orders.length,
    Completed: orders.filter(o => o.status === 'Completed').length,
    Pending:   orders.filter(o => o.status === 'Pending').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };
  const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalPrice, 0);

  // Add
  function handleAddClose()   { setShowAdd(false); setForm(emptyForm); }
  function handleAddSubmit(e) {
    e.preventDefault();
    const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    setOrders([{ id: newId, ...form, totalPrice: Number(form.totalPrice) }, ...orders]);
    handleAddClose();
  }

  // Edit
  function openEdit(order) {
    setSelected(order);
    setForm({ customerName: order.customerName, status: order.status, totalPrice: String(order.totalPrice), orderDate: order.orderDate, address: order.address });
    setShowEdit(true);
  }
  function handleEditClose()   { setShowEdit(false); setSelected(null); setForm(emptyForm); }
  function handleEditSubmit(e) {
    e.preventDefault();
    setOrders(orders.map(o => o.id === selected.id ? { ...o, ...form, totalPrice: Number(form.totalPrice) } : o));
    handleEditClose();
  }

  // Delete
  function openDelete(order)    { setSelected(order); setShowDelete(true); }
  function handleDeleteClose()  { setShowDelete(false); setSelected(null); }
  function handleDeleteConfirm(){ setOrders(orders.filter(o => o.id !== selected.id)); handleDeleteClose(); }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

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

  const orderForm = (
    <form onSubmit={showEdit ? handleEditSubmit : handleAddSubmit} className="space-y-4">
      {showEdit && (
        <div className="px-3 py-2 rounded-xl bg-neutral-bg text-xs text-neutral-teks font-mono">
          {selected?.id}
        </div>
      )}
      <InputField ref={customerNameRef} label="Customer Name" name="customerName" value={form.customerName} onChange={handleChange} placeholder="e.g. Andi Saputra" required />
      <InputField label="Total Price (Rp)"  name="totalPrice"   value={form.totalPrice}   onChange={handleChange} placeholder="e.g. 150000"         required type="number" />
      <InputField label="Order Date"        name="orderDate"    value={form.orderDate}    onChange={handleChange} required type="date" />
      <InputField label="Alamat Pengiriman" name="address"      value={form.address}      onChange={handleChange} placeholder="e.g. Jl. Sudirman 12" required />
      <SelectField label="Status" name="status" value={form.status} onChange={handleChange}
        options={['Pending', 'Completed', 'Cancelled']} />
      <ModalFooter onCancel={showEdit ? handleEditClose : handleAddClose} submitLabel={showEdit ? 'Simpan Perubahan' : 'Save Order'} />
    </form>
  );

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
              <Button size="sm" variant="default" onClick={() => setShowAdd(true)}
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
                {['SL No', 'Order ID', 'Customer', 'Address', 'Date', 'Status', 'Total', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">
                    No orders found
                  </td>
                </tr>
              ) : paginated.map((order, i) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className="text-neutral-teks">{String((page - 1) * ITEMS_PER_PAGE + i + 1).padStart(2, '0')}.</span>
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
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(order)}
                        className="p-1.5 rounded-lg text-accent-blue hover:bg-accent-blue-shadow transition-colors"
                        title="Edit order">
                        <IconEdit />
                      </button>
                      <button onClick={() => openDelete(order)}
                        className="p-1.5 rounded-lg text-secondary hover:bg-accent-pink-shadow transition-colors"
                        title="Hapus order">
                        <IconTrash />
                      </button>
                    </div>
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
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {filtered.length > 0 && (
          <TableFooter showing={paginated.length} total={filtered.length} label="orders" />
        )}
        {totalPages > 1 && (
          <div className="border-t border-neutral-border px-5 py-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#"
                    onClick={e => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                    className={page === 1 ? 'pointer-events-none opacity-40' : ''} />
                </PaginationItem>
                {buildPageRange(page, totalPages).map((p, i) =>
                  p === '...' ? (
                    <PaginationItem key={`ellipsis-${i}`}><PaginationEllipsis /></PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink href="#" isActive={p === page}
                        onClick={e => { e.preventDefault(); setPage(p); }}>{p}</PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext href="#"
                    onClick={e => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                    className={page === totalPages ? 'pointer-events-none opacity-40' : ''} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modal Add */}
      <Modal isOpen={showAdd} onClose={handleAddClose} title="New Order" subtitle="Fill in the order details">
        {orderForm}
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={showEdit} onClose={handleEditClose} title="Edit Order" subtitle={`Edit data untuk ${selected?.id}`}>
        {orderForm}
      </Modal>

      {/* Modal Delete */}
      <Modal isOpen={showDelete} onClose={handleDeleteClose} title="Hapus Order" subtitle="Tindakan ini tidak dapat dibatalkan">
        <div className="space-y-4">
          <p className="text-sm text-neutral-teks font-inter">
            Apakah Anda yakin ingin menghapus order{' '}
            <span className="font-semibold text-primary-2 font-mono">{selected?.id}</span>{' '}
            dari <span className="font-semibold text-primary-2">{selected?.customerName}</span>?
          </p>
          <ModalFooter
            onCancel={handleDeleteClose}
            onSubmit={handleDeleteConfirm}
            submitLabel="Hapus"
            submitVariant="destructive"
          />
        </div>
      </Modal>

    </Container>
  );
}
