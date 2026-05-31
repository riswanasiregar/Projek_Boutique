import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import customersData from '../../data/customers.json';

import { LoyaltyBadge, FilterChip } from '../../components/Badge';
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

const emptyForm = { name: '', email: '', phone: '', loyalty: 'Bronze' };

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

export default function Customers() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [customers, setCustomers] = useState(customersData);
  const [activeFilter, setFilter] = useState('All');
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [page, setPage]           = useState(1);

  const filtered = customers.filter(c => {
    const matchLoyalty = activeFilter === 'All' || c.loyalty === activeFilter;
    const q = searchQuery.toLowerCase();
    return matchLoyalty && (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset ke halaman 1 saat filter atau search berubah
  useEffect(() => { setPage(1); }, [activeFilter, searchQuery]);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleClose()   { setShowForm(false); setForm(emptyForm); }
  function handleSubmit(e) {
    e.preventDefault();
    const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    setCustomers([{ id: newId, ...form }, ...customers]);
    handleClose();
  }

  const summaryCards = [
    { label: 'Total Customers', value: customers.length,                                    iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { label: 'Gold Members',    value: customers.filter(c => c.loyalty === 'Gold').length,   iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
    { label: 'Silver Members',  value: customers.filter(c => c.loyalty === 'Silver').length, iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
    { label: 'Bronze Members',  value: customers.filter(c => c.loyalty === 'Bronze').length, iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-accent-pink',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
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
          title="Customers List"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'Gold', 'Silver', 'Bronze'].map(f => (
                <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setFilter(f)} />
              ))}
              <Button size="sm" variant="default" onClick={() => setShowForm(true)}
                className="rounded-full text-xs">
                + Add Customer
              </Button>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['SL No', 'Name', 'Email', 'Phone', 'Loyalty', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">
                    No customers found
                  </td>
                </tr>
              ) : paginated.map((c, i) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <span className="text-neutral-teks">{String((page - 1) * ITEMS_PER_PAGE + i + 1).padStart(2, '0')}.</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size="md" bgClass="bg-accent-green-shadow" textClass="text-accent-green" />
                      <div>
                        <p className="text-sm font-semibold text-primary-2">{c.name}</p>
                        <p className="text-xs text-neutral-teks">{c.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-neutral-teks">{c.email}</span></TableCell>
                  <TableCell><span className="text-neutral-teks">{c.phone}</span></TableCell>
                  <TableCell><LoyaltyBadge loyalty={c.loyalty} /></TableCell>
                  <TableCell>
                    <Link to={`/customers/${c.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full text-xs border-primary-3 text-primary-3 hover:bg-primary-3 hover:text-white">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>

        <TableFooter showing={paginated.length} total={filtered.length} label="customers" />
        {totalPages > 1 && (
          <div className="border-t border-neutral-border px-5 py-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                    className={page === 1 ? 'pointer-events-none opacity-40' : ''}
                  />
                </PaginationItem>

                {buildPageRange(page, totalPages).map((p, i) =>
                  p === '...' ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={e => { e.preventDefault(); setPage(p); }}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                    className={page === totalPages ? 'pointer-events-none opacity-40' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleClose}
        title="New Customer"
        subtitle="Add a new customer">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" name="name"  value={form.name}  onChange={handleChange} placeholder="e.g. Andi Saputra"   required />
          <InputField label="Email"     name="email" value={form.email} onChange={handleChange} placeholder="e.g. andi@email.com" required type="email" />
          <InputField label="Phone"     name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 081234567890"   required />
          <SelectField label="Loyalty Tier" name="loyalty" value={form.loyalty} onChange={handleChange}
            options={['Bronze', 'Silver', 'Gold']} />
          <ModalFooter onCancel={handleClose} submitLabel="Save Customer" />
        </form>
      </Modal>
    </Container>
  );
}
