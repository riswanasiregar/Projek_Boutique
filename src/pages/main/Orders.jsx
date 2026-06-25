import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
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

const emptyForm = { customer_id: '', status: 'Pending', order_date: '', address: '' };

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
  const [orders, setOrders]         = useState([]);
  const [customers, setCustomers]   = useState([]);
  const [products, setProducts]     = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setFilter]   = useState('All');
  const [showAdd, setShowAdd]       = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [selected, setSelected]     = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [page, setPage]             = useState(1);

  // useRef: auto-focus input Customer Name saat modal Add/Edit dibuka
  const customerNameRef = useRef(null);

  // Fetch orders with customer name
  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, customers(name)')
      .order('order_date', { ascending: false });
    if (!error && data) setOrders(data);
    setLoading(false);
  }

  // Fetch customers for dropdown
  async function fetchCustomers() {
    const { data } = await supabase
      .from('customers')
      .select('id, name')
      .order('name');
    if (data) setCustomers(data);
  }

  // Fetch products for dropdown
  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('id, name, price')
      .order('name');
    if (data) setProducts(data);
  }

  useEffect(() => { fetchOrders(); fetchCustomers(); fetchProducts(); }, []);

  const filtered = orders.filter(o => {
    const matchStatus = activeFilter === 'All' || o.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const custName = o.customers?.name || '';
    return matchStatus && (!q || o.id.toLowerCase().includes(q) || custName.toLowerCase().includes(q));
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
  const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.total_price, 0);

  const computedTotal = orderItems.reduce((sum, it) => sum + it.price * it.qty, 0);

  // Add
  function handleAddClose()   { setShowAdd(false); setForm(emptyForm); setOrderItems([]); }
  async function handleAddSubmit(e) {
    e.preventDefault();
    if (orderItems.length === 0) { alert('Tambahkan minimal 1 produk'); return; }
    const { data: last } = await supabase
      .from('orders')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();
    const lastNum = last ? parseInt(last.id.replace('ORD-', ''), 10) : 0;
    const newId = `ORD-${String(lastNum + 1).padStart(3, '0')}`;

    const { error } = await supabase
      .from('orders')
      .insert({ id: newId, customer_id: form.customer_id, total_price: computedTotal, status: form.status, order_date: form.order_date, address: form.address });
    if (error) { alert('Gagal menambah order: ' + error.message); return; }

    // Insert order items
    const itemsPayload = orderItems.map(it => ({
      order_id: newId,
      product_id: it.product_id,
      product_name: it.product_name,
      qty: it.qty,
      price: it.price,
    }));
    const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
    if (itemsErr) { alert('Order tersimpan tapi item gagal: ' + itemsErr.message); }

    await fetchOrders(); handleAddClose();
  }

  // Edit
  async function openEdit(order) {
    setSelected(order);
    setForm({ customer_id: order.customer_id, status: order.status, order_date: order.order_date, address: order.address });
    // Fetch existing items for this order
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
      .order('id');
    setOrderItems((items || []).map(it => ({ product_id: it.product_id || '', product_name: it.product_name, qty: it.qty, price: it.price })));
    setShowEdit(true);
  }
  function handleEditClose()   { setShowEdit(false); setSelected(null); setForm(emptyForm); setOrderItems([]); }
  async function handleEditSubmit(e) {
    e.preventDefault();
    if (orderItems.length === 0) { alert('Tambahkan minimal 1 produk'); return; }
    const { error } = await supabase
      .from('orders')
      .update({ customer_id: form.customer_id, status: form.status, total_price: computedTotal, order_date: form.order_date, address: form.address })
      .eq('id', selected.id);
    if (error) { alert('Gagal mengedit order: ' + error.message); return; }

    // Delete old items and re-insert
    await supabase.from('order_items').delete().eq('order_id', selected.id);
    const itemsPayload = orderItems.map(it => ({
      order_id: selected.id,
      product_id: it.product_id,
      product_name: it.product_name,
      qty: it.qty,
      price: it.price,
    }));
    const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
    if (itemsErr) { alert('Order tersimpan tapi item gagal: ' + itemsErr.message); }

    await fetchOrders(); handleEditClose();
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  // Order items management
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQty, setSelectedQty]         = useState(1);

  function handleAddItem() {
    if (!selectedProduct) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;
    const existing = orderItems.findIndex(it => it.product_id === prod.id);
    if (existing >= 0) {
      const updated = [...orderItems];
      updated[existing] = { ...updated[existing], qty: updated[existing].qty + Number(selectedQty) };
      setOrderItems(updated);
    } else {
      setOrderItems([...orderItems, { product_id: prod.id, product_name: prod.name, qty: Number(selectedQty), price: prod.price }]);
    }
    setSelectedProduct('');
    setSelectedQty(1);
  }

  function handleRemoveItem(idx) {
    setOrderItems(orderItems.filter((_, i) => i !== idx));
  }

  function handleItemQtyChange(idx, val) {
    const updated = [...orderItems];
    updated[idx] = { ...updated[idx], qty: Math.max(1, Number(val) || 1) };
    setOrderItems(updated);
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

  const orderForm = (
    <form onSubmit={showEdit ? handleEditSubmit : handleAddSubmit} className="space-y-4">
      {showEdit && (
        <div className="px-3 py-2 rounded-xl bg-neutral-bg text-xs text-neutral-teks font-mono">
          {selected?.id}
        </div>
      )}
      <SelectField ref={customerNameRef} label="Customer" name="customer_id" value={form.customer_id} onChange={handleChange}
        options={[{ value: '', label: '— Pilih customer —' }, ...customers.map(c => ({ value: c.id, label: `${c.name} (${c.id})` }))]}
        required />
  
      {/* ── Order Items ── */}
      <div>
        <p className="block text-xs font-semibold mb-1.5 text-primary-2 font-inter">Produk</p>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <SelectField name="selectedProduct" value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
              options={[{ value: '', label: '— Pilih produk —' }, ...products.map(p => ({ value: p.id, label: `${p.name} (Rp ${p.price.toLocaleString('id-ID')})` }))]} />
          </div>
          <div className="w-20">
            <InputField name="qty" value={selectedQty} type="number" min={1}
              onChange={e => setSelectedQty(e.target.value)} placeholder="Qty" />
          </div>
          <button type="button" onClick={handleAddItem}
            className="px-3 py-2.5 rounded-xl bg-accent-blue-shadow text-accent-blue text-sm font-semibold hover:bg-accent-blue-shadow/80 transition-colors flex-shrink-0">
            + Tambah
          </button>
        </div>
        {orderItems.length > 0 && (
          <div className="mt-2 rounded-xl border border-neutral-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-bg">
                  <th className="px-3 py-2 text-xs text-left text-neutral-teks font-inter">Produk</th>
                  <th className="px-3 py-2 text-xs text-center text-neutral-teks font-inter w-16">Qty</th>
                  <th className="px-3 py-2 text-xs text-right text-neutral-teks font-inter w-24">Harga</th>
                  <th className="px-3 py-2 text-xs text-right text-neutral-teks font-inter w-28">Subtotal</th>
                  <th className="px-3 py-2 text-xs text-center w-10"></th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((it, idx) => (
                  <tr key={idx} className="border-t border-neutral-border">
                    <td className="px-3 py-2 text-sm text-primary-2">{it.product_name}</td>
                    <td className="px-3 py-2">
                      <input type="number" min={1} value={it.qty}
                        onChange={e => handleItemQtyChange(idx, e.target.value)}
                        className="w-14 px-2 py-1 rounded-lg border border-neutral-border bg-neutral-bg text-sm text-center text-primary-2" />
                    </td>
                    <td className="px-3 py-2 text-sm text-right text-neutral-teks">Rp {it.price.toLocaleString('id-ID')}</td>
                    <td className="px-3 py-2 text-sm text-right font-semibold text-primary-2">Rp {(it.price * it.qty).toLocaleString('id-ID')}</td>
                    <td className="px-3 py-2 text-center">
                      <button type="button" onClick={() => handleRemoveItem(idx)} className="text-secondary hover:text-secondary/80">
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-neutral-border bg-neutral-bg">
                  <td colSpan={3} className="px-3 py-2 text-sm font-bold text-primary-2">Total</td>
                  <td className="px-3 py-2 text-sm font-bold text-right text-primary-2">Rp {computedTotal.toLocaleString('id-ID')}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
  
      <InputField label="Order Date"        name="order_date"    value={form.order_date}    onChange={handleChange} required type="date" />
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
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
                      <Avatar name={order.customers?.name || '-'} size="sm" bgClass="bg-accent-blue-shadow" textClass="text-primary-3" />
                      <span className="text-sm font-medium text-primary-2">{order.customers?.name || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-neutral-teks max-w-[160px] block">{order.address || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-neutral-teks">{order.order_date}</span>
                  </TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-primary-2">
                      Rp {order.total_price.toLocaleString('id-ID')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => openEdit(order)}
                      className="p-1.5 rounded-lg text-accent-blue hover:bg-accent-blue-shadow transition-colors"
                      title="Edit order">
                      <IconEdit />
                    </button>
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
                    Rp {filtered.reduce((s, o) => s + o.total_price, 0).toLocaleString('id-ID')}
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
      <Modal isOpen={showAdd} onClose={handleAddClose} title="New Order" subtitle="Fill in the order details" wide>
        {orderForm}
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={showEdit} onClose={handleEditClose} title="Edit Order" subtitle={`Edit data untuk ${selected?.id}`} wide>
        {orderForm}
      </Modal>
    </Container>
  );
}
