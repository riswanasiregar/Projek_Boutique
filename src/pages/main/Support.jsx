import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import customersData from '../../data/customers.json';
import { StatusBadge, LabelBadge, FilterChip } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import Modal, { ModalFooter } from '../../components/Modal';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import TextArea from '../../components/TextArea';
import Avatar from '../../components/Avatar';
import { Button } from '../../components/ui/button';
import Container, { PageSection } from '../../components/Container';
import { TableFooter } from '../../components/Footer';

const PRIORITY_BADGE = {
  High:   { bgClass: 'bg-accent-pink-shadow',   textClass: 'text-secondary'     },
  Medium: { bgClass: 'bg-accent-yellow-shadow', textClass: 'text-accent-yellow' },
  Low:    { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-accent-blue'   },
};

const initialComplaints = [
  { id: 'COMP-001', customerId: 'CUST-001', customerName: 'Andi Saputra',    subject: 'Pesanan belum tiba',           description: 'Pesanan ORD-001 sudah 7 hari belum sampai.', priority: 'High',   status: 'Open',        createdAt: '2026-03-01T09:00:00' },
  { id: 'COMP-002', customerId: 'CUST-004', customerName: 'Dewi Lestari',    subject: 'Produk tidak sesuai deskripsi', description: 'Warna produk berbeda dari foto di katalog.', priority: 'Medium', status: 'In Progress', createdAt: '2026-03-03T10:30:00' },
  { id: 'COMP-003', customerId: 'CUST-008', customerName: 'Hana Pertiwi',    subject: 'Permintaan pengembalian dana',  description: 'Ingin refund karena ukuran tidak pas.',     priority: 'High',   status: 'Resolved',    createdAt: '2026-03-05T14:00:00' },
  { id: 'COMP-004', customerId: 'CUST-010', customerName: 'Joko Widodo',     subject: 'Kode promo tidak berfungsi',   description: 'Kode SAVE10 tidak bisa dipakai di checkout.', priority: 'Low',  status: 'Closed',      createdAt: '2026-03-06T11:00:00' },
  { id: 'COMP-005', customerId: 'CUST-014', customerName: 'Nanda Putra',     subject: 'Paket rusak saat diterima',    description: 'Kotak paket sobek dan produk lecet.',       priority: 'High',   status: 'Open',        createdAt: '2026-03-07T08:45:00' },
  { id: 'COMP-006', customerId: 'CUST-016', customerName: 'Pandu Wijaya',    subject: 'Pertanyaan stok produk',       description: 'Apakah Floral Summer Dress ukuran M masih ada?', priority: 'Low', status: 'Resolved', createdAt: '2026-03-07T15:20:00' },
];

const initialResponses = [
  { id: 'RESP-001', complaintId: 'COMP-001', message: 'Kami sedang mengecek status pengiriman dengan pihak ekspedisi.', author: 'Admin', createdAt: '2026-03-02T10:00:00' },
  { id: 'RESP-002', complaintId: 'COMP-002', message: 'Mohon kirimkan foto produk yang diterima agar kami dapat memproses keluhan ini.', author: 'Admin', createdAt: '2026-03-04T09:00:00' },
  { id: 'RESP-003', complaintId: 'COMP-003', message: 'Permintaan refund Anda sudah kami proses. Dana akan kembali dalam 3-5 hari kerja.', author: 'Admin', createdAt: '2026-03-05T16:00:00' },
];

const emptyForm = { customerId: '', subject: '', description: '', priority: 'Medium', status: 'Open' };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDateTime(iso) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function IconEdit() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
}
function IconTrash() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
}
function IconChat() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}

export default function Support() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [complaints, setComplaints]   = useState(initialComplaints);
  const [responses, setResponses]     = useState(initialResponses);
  const [statusFilter, setStatus]     = useState('All');
  const [priorityFilter, setPriority] = useState('All');
  const [showAdd, setShowAdd]         = useState(false);
  const [showEdit, setShowEdit]       = useState(false);
  const [showDelete, setShowDelete]   = useState(false);
  const [showDetail, setShowDetail]   = useState(false);
  const [selected, setSelected]       = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [replyText, setReplyText]     = useState('');
  const [detailStatus, setDetailStatus] = useState('');

  const filtered = complaints.filter(c => {
    const matchStatus   = statusFilter   === 'All' || c.status   === statusFilter;
    const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.customerName.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    return matchStatus && matchPriority && matchSearch;
  });

  const counts = {
    total:      complaints.length,
    open:       complaints.filter(c => c.status === 'Open').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved').length,
  };

  const selectedCustomer = customersData.find(c => c.id === form.customerId);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  // Add
  function handleAddClose()   { setShowAdd(false); setForm(emptyForm); }
  function handleAddSubmit(e) {
    e.preventDefault();
    const cust  = customersData.find(c => c.id === form.customerId);
    const newId = `COMP-${String(complaints.length + 1).padStart(3, '0')}`;
    setComplaints([{ id: newId, customerId: form.customerId, customerName: cust?.name || '', subject: form.subject, description: form.description, priority: form.priority, status: 'Open', createdAt: new Date().toISOString() }, ...complaints]);
    handleAddClose();
  }

  // Edit
  function openEdit(c) { setSelected(c); setForm({ customerId: c.customerId, subject: c.subject, description: c.description, priority: c.priority, status: c.status }); setShowEdit(true); }
  function handleEditClose()   { setShowEdit(false); setSelected(null); setForm(emptyForm); }
  function handleEditSubmit(e) {
    e.preventDefault();
    setComplaints(complaints.map(c => c.id === selected.id ? { ...c, subject: form.subject, description: form.description, priority: form.priority, status: form.status } : c));
    handleEditClose();
  }

  // Delete
  function openDelete(c)         { setSelected(c); setShowDelete(true); }
  function handleDeleteClose()   { setShowDelete(false); setSelected(null); }
  function handleDeleteConfirm() { setComplaints(complaints.filter(c => c.id !== selected.id)); setResponses(responses.filter(r => r.complaintId !== selected.id)); handleDeleteClose(); }

  // Detail
  function openDetail(c) { setSelected(c); setDetailStatus(c.status); setReplyText(''); setShowDetail(true); }
  function handleDetailClose() { setShowDetail(false); setSelected(null); setReplyText(''); }
  function handleReply() {
    if (!replyText.trim()) return;
    const newResp = { id: `RESP-${String(responses.length + 1).padStart(3, '0')}`, complaintId: selected.id, message: replyText.trim(), author: 'Admin', createdAt: new Date().toISOString() };
    setResponses([...responses, newResp]);
    setReplyText('');
  }
  function handleDetailStatusChange(e) {
    const newStatus = e.target.value;
    setDetailStatus(newStatus);
    setComplaints(complaints.map(c => c.id === selected.id ? { ...c, status: newStatus } : c));
    setSelected(prev => ({ ...prev, status: newStatus }));
  }

  const threadResponses = selected ? responses.filter(r => r.complaintId === selected.id) : [];

  const summaryCards = [
    { label: 'Total Komplain', value: counts.total,      iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue',   icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { label: 'Open',           value: counts.open,       iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-secondary',     icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
    { label: 'In Progress',    value: counts.inProgress, iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Resolved',       value: counts.resolved,   iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green',  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
  ];

  return (
    <Container>
      <PageSection cols={4} gap="sm">
        {summaryCards.map(c => <StatCard key={c.label} {...c} />)}
      </PageSection>

      <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
        <CardHeader
          title="Daftar Komplain"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {['All','Open','In Progress','Resolved','Closed'].map(f => (
                <FilterChip key={f} label={f} active={statusFilter === f} onClick={() => setStatus(f)} />
              ))}
              <select value={priorityFilter} onChange={e => setPriority(e.target.value)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold font-inter border border-neutral-border bg-neutral-bg text-neutral-teks">
                {['All','High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
              </select>
              <Button size="sm" variant="default" onClick={() => setShowAdd(true)} className="rounded-full text-xs">
                + Tambah Komplain
              </Button>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['No','ID','Customer','Subjek','Prioritas','Status','Tanggal','Aksi'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">Tidak ada komplain ditemukan</td></tr>
              ) : filtered.map((c, i) => {
                const pb = PRIORITY_BADGE[c.priority] || PRIORITY_BADGE.Low;
                return (
                  <TableRow key={c.id}>
                    <TableCell><span className="text-neutral-teks">{String(i+1).padStart(2,'0')}.</span></TableCell>
                    <TableCell><span className="text-xs font-mono text-primary-3">{c.id}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar name={c.customerName} size="sm" bgClass="bg-accent-blue-shadow" textClass="text-primary-3" />
                        <span className="text-sm font-medium text-primary-2">{c.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm text-primary-2 max-w-[200px] block truncate">{c.subject}</span></TableCell>
                    <TableCell><LabelBadge label={c.priority} bgClass={pb.bgClass} textClass={pb.textClass} /></TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks">{formatDate(c.createdAt)}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openDetail(c)} className="p-1.5 rounded-lg text-accent-green hover:bg-accent-green-shadow transition-colors" title="Lihat detail"><IconChat /></button>
                        <button onClick={() => openEdit(c)}   className="p-1.5 rounded-lg text-accent-blue hover:bg-accent-blue-shadow transition-colors" title="Edit"><IconEdit /></button>
                        <button onClick={() => openDelete(c)} className="p-1.5 rounded-lg text-secondary hover:bg-accent-pink-shadow transition-colors" title="Hapus"><IconTrash /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </div>
        <TableFooter showing={filtered.length} total={complaints.length} label="komplain" />
      </div>

      {/* Modal Add */}
      <Modal isOpen={showAdd} onClose={handleAddClose} title="Tambah Komplain" subtitle="Buat komplain baru atas nama customer">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-primary-2 font-inter">Customer</label>
            <select name="customerId" value={form.customerId} onChange={handleChange} required
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-neutral-border bg-neutral-bg text-primary-2 font-inter outline-none focus:border-primary-3">
              <option value="">-- Pilih Customer --</option>
              {customersData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {selectedCustomer && (
            <div className="px-4 py-3 rounded-xl bg-neutral-bg border border-neutral-border space-y-1">
              <p className="text-xs text-neutral-teks font-inter">Email: <span className="font-semibold text-primary-2">{selectedCustomer.email}</span></p>
              <p className="text-xs text-neutral-teks font-inter">HP: <span className="font-semibold text-primary-2">{selectedCustomer.phone}</span></p>
              <p className="text-xs text-neutral-teks font-inter">Loyalty: <span className="font-semibold text-primary-2">{selectedCustomer.loyalty}</span></p>
            </div>
          )}
          <InputField label="Subjek" name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Pesanan belum tiba" required />
          <TextArea label="Deskripsi" name="description" value={form.description} onChange={handleChange} placeholder="Jelaskan detail komplain..." rows={3} required />
          <SelectField label="Prioritas" name="priority" value={form.priority} onChange={handleChange} options={['Low','Medium','High']} />
          <ModalFooter onCancel={handleAddClose} submitLabel="Simpan Komplain" />
        </form>
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={showEdit} onClose={handleEditClose} title="Edit Komplain" subtitle={selected?.id}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <InputField label="Subjek" name="subject" value={form.subject} onChange={handleChange} placeholder="Subjek komplain" required />
          <TextArea label="Deskripsi" name="description" value={form.description} onChange={handleChange} rows={3} required />
          <SelectField label="Prioritas" name="priority" value={form.priority} onChange={handleChange} options={['Low','Medium','High']} />
          <SelectField label="Status"    name="status"   value={form.status}   onChange={handleChange} options={['Open','In Progress','Resolved','Closed']} />
          <ModalFooter onCancel={handleEditClose} submitLabel="Simpan Perubahan" />
        </form>
      </Modal>

      {/* Modal Delete */}
      <Modal isOpen={showDelete} onClose={handleDeleteClose} title="Hapus Komplain" subtitle="Tindakan ini tidak dapat dibatalkan">
        <div className="space-y-4">
          <p className="text-sm text-neutral-teks font-inter">
            Hapus komplain <span className="font-semibold text-primary-2 font-mono">{selected?.id}</span> dari{' '}
            <span className="font-semibold text-primary-2">{selected?.customerName}</span>?
          </p>
          <div className="flex gap-3">
            <button onClick={handleDeleteClose} type="button" className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-border text-neutral-teks bg-neutral-bg font-inter">Batal</button>
            <button onClick={handleDeleteConfirm} type="button" className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-secondary text-neutral hover:opacity-90 font-inter">Hapus</button>
          </div>
        </div>
      </Modal>

      {/* Modal Detail / Thread */}
      {showDetail && selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-primary-2/50 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden bg-neutral max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-primary-3 flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-neutral font-inter">{selected.subject}</h3>
                <p className="text-xs text-neutral/70 font-inter">{selected.id} · {selected.customerName}</p>
              </div>
              <button onClick={handleDetailClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral/70 hover:text-neutral text-lg leading-none">✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Customer', value: selected.customerName },
                  { label: 'Email',    value: customersData.find(c=>c.id===selected.customerId)?.email || '-' },
                  { label: 'HP',       value: customersData.find(c=>c.id===selected.customerId)?.phone || '-' },
                  { label: 'Prioritas',value: selected.priority },
                ].map(row => (
                  <div key={row.label} className="rounded-xl p-3 bg-neutral-bg">
                    <p className="text-xs text-neutral-teks font-inter">{row.label}</p>
                    <p className="text-sm font-semibold text-primary-2 font-inter">{row.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3 bg-neutral-bg">
                <p className="text-xs text-neutral-teks font-inter mb-1">Deskripsi</p>
                <p className="text-sm text-primary-2 font-inter">{selected.description}</p>
              </div>
              {/* Status */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-primary-2 font-inter">Status Komplain</label>
                <select value={detailStatus} onChange={handleDetailStatusChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-neutral-border bg-neutral-bg text-primary-2 font-inter outline-none focus:border-primary-3">
                  {['Open','In Progress','Resolved','Closed'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {/* Thread */}
              <div>
                <p className="text-xs font-semibold text-primary-2 font-inter mb-2">Riwayat Percakapan</p>
                {threadResponses.length === 0 ? (
                  <p className="text-xs text-neutral-teks font-inter px-3 py-4 rounded-xl bg-neutral-bg text-center">Belum ada respons. Tambahkan respons pertama di bawah.</p>
                ) : (
                  <div className="space-y-2">
                    {threadResponses.map(r => (
                      <div key={r.id} className="rounded-xl p-3 bg-accent-blue-shadow">
                        <p className="text-sm text-primary-2 font-inter">{r.message}</p>
                        <p className="text-xs text-neutral-teks font-inter mt-1">{r.author} · {formatDateTime(r.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Reply */}
              <div>
                <TextArea label="Kirim Respons" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Tulis balasan untuk customer..." rows={2} />
                <button onClick={handleReply} disabled={!replyText.trim()}
                  className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-primary-3 text-neutral hover:opacity-90 disabled:opacity-40 font-inter">
                  Kirim Respons
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
