import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LabelBadge, FilterChip } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import Modal, { ModalFooter } from '../../components/Modal';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import TextArea from '../../components/TextArea';
import { Button } from '../../components/ui/button';
import Container, { PageSection } from '../../components/Container';
import { TableFooter } from '../../components/Footer';

const STATUS_BADGE = {
  Published: { bgClass: 'bg-accent-green-shadow',  textClass: 'text-accent-green'  },
  Pending:   { bgClass: 'bg-accent-yellow-shadow', textClass: 'text-accent-yellow' },
  Hidden:    { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-accent-blue'   },
};

const initialFeedbacks = [
  { id: 'REV-001', customerName: 'Andi Saputra',    rating: 5, comment: 'Produk sangat bagus dan pengiriman cepat! Puas banget.',   status: 'Published', createdAt: '2026-02-10T10:00:00' },
  { id: 'REV-002', customerName: 'Dewi Lestari',    rating: 4, comment: 'Kualitas sesuai harga. Kemasan rapi dan aman.',           status: 'Published', createdAt: '2026-02-12T14:30:00' },
  { id: 'REV-003', customerName: 'Budi Santoso',    rating: 2, comment: 'Warna sedikit berbeda dari foto, tapi masih oke.',        status: 'Pending',   createdAt: '2026-02-15T09:00:00' },
  { id: 'REV-004', customerName: 'Hana Pertiwi',    rating: 5, comment: 'Seller terpercaya! Sudah beli berkali-kali, selalu puas.', status: 'Published', createdAt: '2026-02-18T11:00:00' },
  { id: 'REV-005', customerName: 'Irfan Maulana',   rating: 3, comment: 'Ukuran sedikit lebih kecil dari ekspektasi.',            status: 'Published', createdAt: '2026-02-20T16:00:00' },
  { id: 'REV-006', customerName: 'Kartika Sari',    rating: 1, comment: 'Kecewa dengan kualitas jahitan, ada yang lepas.',        status: 'Hidden',    createdAt: '2026-02-22T08:30:00' },
  { id: 'REV-007', customerName: 'Nanda Putra',     rating: 5, comment: 'Sangat memuaskan! Bahan premium dan nyaman dipakai.',    status: 'Published', createdAt: '2026-02-25T12:00:00' },
  { id: 'REV-008', customerName: 'Vina Oktavia',    rating: 4, comment: 'Pelayanan ramah dan produk sesuai deskripsi.',           status: 'Pending',   createdAt: '2026-03-01T10:00:00' },
];

const emptyForm = { customerName: '', rating: '5', comment: '', status: 'Published' };

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? 'text-accent-yellow' : 'text-neutral-border'} style={{ fontSize: '14px' }}>★</span>
      ))}
    </div>
  );
}

function IconEdit()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>; }
function IconTrash() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }

function formatDate(iso) { return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); }

export default function Feedback() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [feedbacks, setFeedbacks]     = useState(initialFeedbacks);
  const [ratingFilter, setRating]     = useState('All');
  const [statusFilter, setStatus]     = useState('All');
  const [showAdd, setShowAdd]         = useState(false);
  const [showEdit, setShowEdit]       = useState(false);
  const [showDelete, setShowDelete]   = useState(false);
  const [selected, setSelected]       = useState(null);
  const [form, setForm]               = useState(emptyForm);

  const filtered = feedbacks.filter(f => {
    const matchRating = ratingFilter === 'All' || f.rating === Number(ratingFilter.replace('★',''));
    const matchStatus = statusFilter === 'All' || f.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || f.customerName.toLowerCase().includes(q) || f.comment.toLowerCase().includes(q);
    return matchRating && matchStatus && matchSearch;
  });

  const avgRating   = feedbacks.length ? (feedbacks.reduce((s,f) => s+f.rating, 0) / feedbacks.length).toFixed(1) : '0.0';
  const satisfied   = feedbacks.filter(f => f.rating >= 4).length;
  const satPct      = feedbacks.length ? Math.round(satisfied / feedbacks.length * 100) : 0;
  const pendingCount = feedbacks.filter(f => f.status === 'Pending').length;

  // Distribution
  const distribution = [5,4,3,2,1].map(r => ({
    star: r,
    count: feedbacks.filter(f => f.rating === r).length,
    pct: feedbacks.length ? Math.round(feedbacks.filter(f=>f.rating===r).length / feedbacks.length * 100) : 0,
  }));

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleAddClose()   { setShowAdd(false); setForm(emptyForm); }
  function handleAddSubmit(e) {
    e.preventDefault();
    const newId = `REV-${String(feedbacks.length + 1).padStart(3,'0')}`;
    setFeedbacks([{ id: newId, customerName: form.customerName, rating: Number(form.rating), comment: form.comment, status: form.status, createdAt: new Date().toISOString() }, ...feedbacks]);
    handleAddClose();
  }

  function openEdit(f)         { setSelected(f); setForm({ customerName: f.customerName, rating: String(f.rating), comment: f.comment, status: f.status }); setShowEdit(true); }
  function handleEditClose()   { setShowEdit(false); setSelected(null); setForm(emptyForm); }
  function handleEditSubmit(e) {
    e.preventDefault();
    setFeedbacks(feedbacks.map(f => f.id === selected.id ? { ...f, customerName: form.customerName, rating: Number(form.rating), comment: form.comment, status: form.status } : f));
    handleEditClose();
  }

  function openDelete(f)         { setSelected(f); setShowDelete(true); }
  function handleDeleteClose()   { setShowDelete(false); setSelected(null); }
  function handleDeleteConfirm() { setFeedbacks(feedbacks.filter(f => f.id !== selected.id)); handleDeleteClose(); }

  const summaryCards = [
    { label: 'Total Review',  value: feedbacks.length, iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue',   icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
    { label: 'Average Rating', value: `${avgRating} ★`, iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
    { label: '% Satisfied',    value: `${satPct}%`,    iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green',  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Pending Review', value: pendingCount,    iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-secondary',     icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  return (
    <Container>
      <PageSection cols={4} gap="sm">
        {summaryCards.map(c => <StatCard key={c.label} {...c} />)}
      </PageSection>

      {/* Rating distribution */}
      <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
        <p className="text-sm font-semibold text-primary-2 font-inter mb-4">Distribusi Rating</p>
        <div className="space-y-2">
          {distribution.map(d => (
            <div key={d.star} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-neutral-teks font-inter w-8">{d.star}★</span>
              <div className="flex-1 rounded-full bg-neutral-bg h-2 overflow-hidden">
                <div className="h-full rounded-full bg-accent-yellow" style={{ width: `${d.pct}%`, transition: 'width 0.3s' }} />
              </div>
              <span className="text-xs text-neutral-teks font-inter w-16 text-right">{d.count} ({d.pct}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
        <CardHeader
          title="Daftar Review"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {['All','5★','4★','3★','2★','1★'].map(f => (
                <FilterChip key={f} label={f} active={ratingFilter === f} onClick={() => setRating(f)} />
              ))}
              {['All','Published','Pending','Hidden'].map(f => (
                <FilterChip key={f} label={f} active={statusFilter === f} onClick={() => setStatus(f)} />
              ))}
              <Button size="sm" variant="default" onClick={() => setShowAdd(true)} className="rounded-full text-xs">
                + Tambah Review
              </Button>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['No','Customer','Rating','Komentar','Status','Tanggal','Aksi'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">Tidak ada review ditemukan</td></tr>
              ) : filtered.map((f, i) => {
                const sb = STATUS_BADGE[f.status];
                return (
                  <TableRow key={f.id}>
                    <TableCell><span className="text-neutral-teks">{String(i+1).padStart(2,'0')}.</span></TableCell>
                    <TableCell><span className="text-sm font-medium text-primary-2">{f.customerName}</span></TableCell>
                    <TableCell><Stars rating={f.rating} /></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks max-w-[240px] block truncate">{f.comment}</span></TableCell>
                    <TableCell><LabelBadge label={f.status} bgClass={sb.bgClass} textClass={sb.textClass} /></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks">{formatDate(f.createdAt)}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(f)}   className="p-1.5 rounded-lg text-accent-blue hover:bg-accent-blue-shadow transition-colors"><IconEdit /></button>
                        <button onClick={() => openDelete(f)} className="p-1.5 rounded-lg text-secondary hover:bg-accent-pink-shadow transition-colors"><IconTrash /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </div>
        <TableFooter showing={filtered.length} total={feedbacks.length} label="review" />
      </div>

      {/* Modal Add/Edit shared form */}
      {(showAdd || showEdit) && (
        <Modal isOpen={showAdd || showEdit} onClose={showEdit ? handleEditClose : handleAddClose}
          title={showEdit ? 'Edit Review' : 'Tambah Review'}
          subtitle={showEdit ? selected?.id : 'Input review baru'}>
          <form onSubmit={showEdit ? handleEditSubmit : handleAddSubmit} className="space-y-4">
            <InputField label="Nama Customer" name="customerName" value={form.customerName} onChange={handleChange} placeholder="e.g. Andi Saputra" required />
            <SelectField label="Rating" name="rating" value={form.rating} onChange={handleChange} options={['5','4','3','2','1']} />
            <TextArea label="Komentar" name="comment" value={form.comment} onChange={handleChange} placeholder="Tulis komentar customer..." rows={3} required />
            <SelectField label="Status" name="status" value={form.status} onChange={handleChange} options={['Published','Pending','Hidden']} />
            <ModalFooter onCancel={showEdit ? handleEditClose : handleAddClose} submitLabel={showEdit ? 'Simpan Perubahan' : 'Tambah Review'} />
          </form>
        </Modal>
      )}

      {/* Modal Delete */}
      <Modal isOpen={showDelete} onClose={handleDeleteClose} title="Hapus Review" subtitle="Tindakan ini tidak dapat dibatalkan">
        <div className="space-y-4">
          <p className="text-sm text-neutral-teks font-inter">
            Hapus review dari <span className="font-semibold text-primary-2">{selected?.customerName}</span>?
            <span className="block mt-1 text-xs italic">"{selected?.comment?.slice(0,60)}..."</span>
          </p>
          <div className="flex gap-3">
            <button onClick={handleDeleteClose}   type="button" className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-border text-neutral-teks bg-neutral-bg font-inter">Batal</button>
            <button onClick={handleDeleteConfirm} type="button" className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-secondary text-neutral hover:opacity-90 font-inter">Hapus</button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
