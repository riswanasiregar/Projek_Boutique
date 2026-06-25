import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LabelBadge, FilterChip } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import Modal, { ModalFooter } from '../../components/Modal';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
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

const CATEGORY_BADGE = {
  Dress:       { bgClass: 'bg-accent-pink-shadow',   textClass: 'text-secondary'     },
  Top:         { bgClass: 'bg-accent-green-shadow',  textClass: 'text-accent-green'  },
  Bottom:      { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-accent-blue'   },
  Outerwear:   { bgClass: 'bg-accent-yellow-shadow', textClass: 'text-accent-yellow' },
  Accessories: { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-primary-3'     },
};

const CATEGORIES = ['All', 'Dress', 'Top', 'Bottom', 'Outerwear', 'Accessories'];
const emptyForm  = { name: '', category: 'Dress', price: '', stock: '' };

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

function IconEdit() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function Products() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setFilter]   = useState('All');
  const [showAdd, setShowAdd]       = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [page, setPage]             = useState(1);

  // useRef: auto-focus input Name saat modal Add/Edit dibuka
  const productNameRef = useRef(null);

  // Fetch products from Supabase
  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    if (!error && data) setProducts(data);
    setLoading(false);
  }
  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p => {
    const matchCat = activeFilter === 'All' || p.category === activeFilter;
    const q = searchQuery.toLowerCase();
    return matchCat && (!q || p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [activeFilter, searchQuery]);

  // Auto-focus input Name saat modal Add atau Edit dibuka
  useEffect(() => {
    if (showAdd || showEdit) {
      const t = setTimeout(() => productNameRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [showAdd, showEdit]);

  const lowStockCount    = products.filter(p => p.stock <= 10).length;
  const inventoryValue   = products.reduce((s, p) => s + p.price * p.stock, 0);
  const uniqueCategories = new Set(products.map(p => p.category)).size;

  // Add
  function handleAddClose()   { setShowAdd(false); setForm(emptyForm); }
  async function handleAddSubmit(e) {
    e.preventDefault();
    const { data: last } = await supabase
      .from('products')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();
    const lastNum = last ? parseInt(last.id.replace('PRD-', ''), 10) : 0;
    const newId = `PRD-${String(lastNum + 1).padStart(3, '0')}`;

    const { error } = await supabase
      .from('products')
      .insert({ id: newId, name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock) });

    if (!error) { await fetchProducts(); handleAddClose(); }
    else alert('Gagal menambah produk: ' + error.message);
  }

  // Edit
  function openEdit(product) {
    setSelected(product);
    setForm({ name: product.name, category: product.category, price: String(product.price), stock: String(product.stock) });
    setShowEdit(true);
  }
  function handleEditClose()   { setShowEdit(false); setSelected(null); setForm(emptyForm); }
  async function handleEditSubmit(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('products')
      .update({ name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock) })
      .eq('id', selected.id);

    if (!error) { await fetchProducts(); handleEditClose(); }
    else alert('Gagal mengedit produk: ' + error.message);
  }

  // Delete
  function openDelete(product)      { setSelected(product); setShowDelete(true); }
  function handleDeleteClose()      { setShowDelete(false); setSelected(null); }
  async function handleDeleteConfirm() {
    const { error } = await supabase.from('products').delete().eq('id', selected.id);
    if (!error) { await fetchProducts(); handleDeleteClose(); }
    else alert('Gagal menghapus produk: ' + error.message);
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  const summaryCards = [
    { label: 'Total Products',  value: products.length,
      iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    { label: 'Low Stock',       value: lowStockCount,
      iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-secondary',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
    { label: 'Inventory Value', value: `Rp ${(inventoryValue / 1e6).toFixed(1)}M`,
      iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Categories',      value: uniqueCategories,
      iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
  ];

  const productForm = (
    <form onSubmit={showEdit ? handleEditSubmit : handleAddSubmit} className="space-y-4">
      {showEdit && (
        <div className="px-3 py-2 rounded-xl bg-neutral-bg text-xs text-neutral-teks font-mono">
          {selected?.id}
        </div>
      )}
      <InputField ref={productNameRef} label="Product Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Floral Summer Dress" required />
      <InputField label="Price (Rp)"   name="price" value={form.price} onChange={handleChange} placeholder="e.g. 350000" required type="number" />
      <InputField label="Stock"        name="stock" value={form.stock} onChange={handleChange} placeholder="e.g. 15"     required type="number" />
      <SelectField label="Category" name="category" value={form.category} onChange={handleChange}
        options={['Dress', 'Top', 'Bottom', 'Outerwear', 'Accessories']} />
      <ModalFooter onCancel={showEdit ? handleEditClose : handleAddClose} submitLabel={showEdit ? 'Simpan Perubahan' : 'Save Product'} />
    </form>
  );

  return (
    <Container>

      <PageSection cols={4} gap="sm">
        {summaryCards.map(card => <StatCard key={card.label} {...card} />)}
      </PageSection>

      <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
        <CardHeader
          title="Products Overview"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map(f => (
                <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setFilter(f)} />
              ))}
              <Button size="sm" variant="default" onClick={() => setShowAdd(true)} className="rounded-full text-xs">
                + Add Product
              </Button>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['SL No', 'Product ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Action'].map(h => (
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
                    No products found
                  </td>
                </tr>
              ) : paginated.map((p, i) => {
                const catBadge = CATEGORY_BADGE[p.category] || { bgClass: 'bg-accent-blue-shadow', textClass: 'text-primary-3' };
                const lowStock = p.stock <= 10;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className="text-neutral-teks">{String((page - 1) * ITEMS_PER_PAGE + i + 1).padStart(2, '0')}.</span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/products/${p.id}`} className="text-xs font-semibold text-primary-3 hover:underline font-mono">
                        {p.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-primary-2">{p.name}</span>
                    </TableCell>
                    <TableCell>
                      <LabelBadge label={p.category} bgClass={catBadge.bgClass} textClass={catBadge.textClass} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-primary-2">
                        Rp {p.price.toLocaleString('id-ID')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-bold ${lowStock ? 'text-secondary' : 'text-primary-2'}`}>
                        {p.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <LabelBadge
                        label={lowStock ? 'Low Stock' : 'In Stock'}
                        bgClass={lowStock ? 'bg-accent-pink-shadow' : 'bg-accent-green-shadow'}
                        textClass={lowStock ? 'text-secondary' : 'text-accent-green'}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-accent-blue hover:bg-accent-blue-shadow transition-colors"
                          title="Edit produk">
                          <IconEdit />
                        </button>
                        <button onClick={() => openDelete(p)}
                          className="p-1.5 rounded-lg text-secondary hover:bg-accent-pink-shadow transition-colors"
                          title="Hapus produk">
                          <IconTrash />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <TableFooter showing={paginated.length} total={filtered.length} label="products" />
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
      <Modal isOpen={showAdd} onClose={handleAddClose} title="New Product" subtitle="Add to your product catalog">
        {productForm}
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={showEdit} onClose={handleEditClose} title="Edit Product" subtitle={`Edit data untuk ${selected?.id}`}>
        {productForm}
      </Modal>

      {/* Modal Delete */}
      <Modal isOpen={showDelete} onClose={handleDeleteClose} title="Hapus Produk" subtitle="Tindakan ini tidak dapat dibatalkan">
        <div className="space-y-4">
          <p className="text-sm text-neutral-teks font-inter">
            Apakah Anda yakin ingin menghapus produk{' '}
            <span className="font-semibold text-primary-2">{selected?.name}</span>{' '}
            (<span className="font-mono text-xs">{selected?.id}</span>)?
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
