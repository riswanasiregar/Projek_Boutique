import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import customersData from '../../data/customers.json';
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

const DELIVERY_MODE_OPTIONS = [
  { value: 'draft',    label: 'Simpan sebagai Draft' },
  { value: 'send_now', label: 'Kirim Sekarang' },
  { value: 'schedule', label: 'Jadwalkan' },
];

const STATUS_BADGE = {
  Sent:      { bgClass: 'bg-accent-green-shadow',  textClass: 'text-accent-green'  },
  Scheduled: { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-accent-blue'   },
  Draft:     { bgClass: 'bg-accent-yellow-shadow', textClass: 'text-accent-yellow' },
};
const CHANNEL_BADGE = {
  Email:    { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-accent-blue'   },
  WhatsApp: { bgClass: 'bg-accent-green-shadow',  textClass: 'text-accent-green'  },
  Both:     { bgClass: 'bg-accent-yellow-shadow', textClass: 'text-accent-yellow' },
};

const initialBroadcasts = [
  { id: 'BC-001', title: 'Promo Hari Valentine',     message: 'Dapatkan diskon 20% untuk semua produk dress!',        channel: 'Email',    target: 'All',    recipients: customersData,                                   status: 'Sent',      createdAt: '2026-02-10T09:00:00', sentAt: '2026-02-10T10:00:00', scheduledAt: null },
  { id: 'BC-002', title: 'Flash Sale Weekend',        message: 'Flash sale 50% untuk koleksi outerwear!',             channel: 'WhatsApp', target: 'Gold',   recipients: customersData.filter(c => c.loyalty === 'Gold'),   status: 'Sent',      createdAt: '2026-02-14T08:00:00', sentAt: '2026-02-15T09:00:00', scheduledAt: null },
  { id: 'BC-003', title: 'Info Koleksi Baru',         message: 'Koleksi summer terbaru sudah tersedia!',              channel: 'Both',     target: 'Silver', recipients: customersData.filter(c => c.loyalty === 'Silver'), status: 'Draft',     createdAt: '2026-03-01T10:00:00', sentAt: null,                  scheduledAt: null },
  { id: 'BC-004', title: 'Reminder Restock Favorit',  message: 'Produk favorit Anda sudah kembali tersedia.',         channel: 'Email',    target: 'All',    recipients: customersData,                                   status: 'Scheduled', createdAt: '2026-03-05T11:00:00', sentAt: null,                  scheduledAt: '2026-03-15T10:00:00' },
  { id: 'BC-005', title: 'Ucapan Terima Kasih Gold',  message: 'Terima kasih telah menjadi pelanggan setia kami!',    channel: 'WhatsApp', target: 'Gold',   recipients: customersData.filter(c => c.loyalty === 'Gold'),   status: 'Draft',     createdAt: '2026-03-07T08:00:00', sentAt: null,                  scheduledAt: null },
];

const emptyForm = { title: '', message: '', channel: 'Email', target: 'All' };

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function IconEdit()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>; }
function IconTrash() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }

function getRecipients(target, manual) {
  if (target === 'All')    return customersData;
  if (target === 'Manual') return manual;
  return customersData.filter(c => c.loyalty === target);
}

export default function Broadcast() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [broadcasts, setBroadcasts]         = useState(initialBroadcasts);
  const [statusFilter, setStatus]           = useState('All');
  const [showAdd, setShowAdd]               = useState(false);
  const [showEdit, setShowEdit]             = useState(false);
  const [showDelete, setShowDelete]         = useState(false);
  const [selected, setSelected]             = useState(null);
  const [form, setForm]                     = useState(emptyForm);
  const [manualSelected, setManualSelected] = useState([]);
  const [scheduleDate, setScheduleDate]         = useState('');
  const [deliveryMode, setDeliveryMode]         = useState('draft');
  const [formErrors, setFormErrors]             = useState({});
  const [editDeliveryMode, setEditDeliveryMode] = useState('draft');
  const [editScheduleDate, setEditScheduleDate] = useState('');
  const [editScheduleError, setEditScheduleError] = useState('');

 
  const intervalRef = useRef(null);
  const addTitleRef  = useRef(null);
  const editTitleRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = new Date();
      setBroadcasts(prev =>
        prev.map(b =>
          b.status === 'Scheduled' && new Date(b.scheduledAt) <= now
            ? { ...b, status: 'Sent', sentAt: now.toISOString(), scheduledAt: null }
            : b
        )
      );
    }, 30_000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Auto-focus input Judul saat modal Add dibuka
  useEffect(() => {
    if (showAdd) {
      const t = setTimeout(() => addTitleRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [showAdd]);

  // Auto-focus input Judul saat modal Edit dibuka
  useEffect(() => {
    if (showEdit) {
      const t = setTimeout(() => editTitleRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [showEdit]);

  const filtered = broadcasts.filter(b => {
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    return matchStatus && (!q || b.title.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  });

  const sentCount       = broadcasts.filter(b => b.status === 'Sent').length;
  const scheduledCount  = broadcasts.filter(b => b.status === 'Scheduled').length;
  const totalRecipients = broadcasts.filter(b => b.status === 'Sent').reduce((s, b) => s + b.recipients.length, 0);
  const previewRecipients = getRecipients(form.target, manualSelected);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'target' && value !== 'Manual') setManualSelected([]);
    if (name === 'title')   setFormErrors(prev => ({ ...prev, title: undefined }));
    if (name === 'message') setFormErrors(prev => ({ ...prev, message: undefined }));
  }
  function toggleManual(cust) {
    setManualSelected(prev =>
      prev.find(c => c.id === cust.id) ? prev.filter(c => c.id !== cust.id) : [...prev, cust]
    );
  }

  // Add
  function handleAddClose() {
    setShowAdd(false);
    setForm(emptyForm);
    setManualSelected([]);
    setScheduleDate('');
    setDeliveryMode('draft');
    setFormErrors({});
  }
  function handleAddSubmit(e) {
    e.preventDefault();
    const errors = {};

    if (!form.title.trim())   errors.title   = 'Judul tidak boleh kosong';
    if (!form.message.trim()) errors.message = 'Pesan tidak boleh kosong';
    if (form.target === 'Manual' && manualSelected.length === 0)
      errors.manualRecipients = 'Pilih minimal satu penerima';
    if (deliveryMode === 'schedule' && new Date(scheduleDate) <= new Date())
      errors.scheduleDate = 'Waktu jadwal harus di masa depan';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const now = new Date().toISOString();
    let status = 'Draft', sentAt = null, scheduledAt = null;

    if (deliveryMode === 'send_now') { status = 'Sent';      sentAt = now; }
    if (deliveryMode === 'schedule') { status = 'Scheduled'; scheduledAt = scheduleDate; }

    const recs  = getRecipients(form.target, manualSelected);
    const newId = `BC-${String(broadcasts.length + 1).padStart(3, '0')}`;
    setBroadcasts([{
      id: newId, title: form.title.trim(), message: form.message.trim(),
      channel: form.channel, target: form.target, recipients: recs,
      status, createdAt: now, sentAt, scheduledAt,
    }, ...broadcasts]);
    handleAddClose();
  }

  // Edit
  function openEdit(b) {
    setSelected(b);
    setForm({ title: b.title, message: b.message, channel: b.channel, target: b.target });
    setEditDeliveryMode('draft');
    setEditScheduleDate('');
    setEditScheduleError('');
    setShowEdit(true);
  }
  function handleEditClose() {
    setShowEdit(false);
    setSelected(null);
    setForm(emptyForm);
    setEditDeliveryMode('draft');
    setEditScheduleDate('');
    setEditScheduleError('');
  }
  function handleEditSubmit(e) {
    e.preventDefault();
    // Validasi jadwal jika mode schedule
    if (selected?.status === 'Draft' && editDeliveryMode === 'schedule') {
      if (!editScheduleDate) return;
      if (new Date(editScheduleDate) <= new Date()) {
        setEditScheduleError('Waktu jadwal harus di masa depan');
        return;
      }
    }

    const now = new Date().toISOString();
    let statusUpdate = {};

    if (selected?.status === 'Draft') {
      if (editDeliveryMode === 'send_now') {
        statusUpdate = { status: 'Sent', sentAt: now, scheduledAt: null };
      } else if (editDeliveryMode === 'schedule') {
        statusUpdate = { status: 'Scheduled', scheduledAt: editScheduleDate, sentAt: null };
      }
      // 'draft' → tidak ubah status
    }

    setBroadcasts(broadcasts.map(b => b.id === selected.id
      ? { ...b, title: form.title, message: form.message, channel: form.channel, ...statusUpdate }
      : b
    ));
    handleEditClose();
  }

  // Delete
  function openDelete(b)         { setSelected(b); setShowDelete(true); }
  function handleDeleteClose()   { setShowDelete(false); setSelected(null); }
  function handleDeleteConfirm() { setBroadcasts(broadcasts.filter(b => b.id !== selected.id)); handleDeleteClose(); }

  // Detail - removed

  const summaryCards = [
    { label: 'Total Broadcast', value: broadcasts.length, iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg> },
    { label: 'Sent',            value: sentCount,          iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
    { label: 'Scheduled',       value: scheduledCount,     iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Total Penerima',  value: totalRecipients,    iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-secondary',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <Container>
      <PageSection cols={4} gap="sm">
        {summaryCards.map(c => <StatCard key={c.label} {...c} />)}
      </PageSection>

      <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
        <CardHeader
          title="Daftar Broadcast"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'Draft', 'Sent', 'Scheduled'].map(f => (
                <FilterChip key={f} label={f} active={statusFilter === f} onClick={() => setStatus(f)} />
              ))}
              <Button size="sm" variant="default" onClick={() => setShowAdd(true)} className="rounded-full text-xs">
                + Buat Broadcast
              </Button>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['No', 'ID', 'Judul', 'Channel', 'Penerima', 'Tanggal', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">Tidak ada broadcast ditemukan</td></tr>
              ) : filtered.map((b, i) => {
                const sb = STATUS_BADGE[b.status]  || STATUS_BADGE.Draft;
                const cb = CHANNEL_BADGE[b.channel] || CHANNEL_BADGE.Email;
                return (
                  <TableRow key={b.id}>
                    <TableCell><span className="text-neutral-teks">{String(i + 1).padStart(2, '0')}.</span></TableCell>
                    <TableCell><span className="text-xs font-mono text-primary-3">{b.id}</span></TableCell>
                    <TableCell><span className="text-sm font-medium text-primary-2">{b.title}</span></TableCell>
                    <TableCell><LabelBadge label={b.channel} bgClass={cb.bgClass} textClass={cb.textClass} /></TableCell>
                    <TableCell><span className="text-sm font-semibold text-primary-2">{b.recipients.length}</span></TableCell>
                    <TableCell>
                      <span className="text-xs text-neutral-teks">
                        {b.sentAt
                          ? `Dikirim: ${formatDate(b.sentAt)}`
                          : b.scheduledAt
                            ? `Jadwal: ${formatDate(b.scheduledAt)}`
                            : formatDate(b.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell><LabelBadge label={b.status} bgClass={sb.bgClass} textClass={sb.textClass} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {/* Edit — semua status */}
                        <button onClick={() => openEdit(b)}
                          className="p-1.5 rounded-lg text-accent-blue hover:bg-accent-blue-shadow transition-colors"
                          title="Edit">
                          <IconEdit />
                        </button>

                        {/* Hapus — semua status */}
                        <button onClick={() => openDelete(b)}
                          className="p-1.5 rounded-lg text-secondary hover:bg-accent-pink-shadow transition-colors"
                          title="Hapus">
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
        <TableFooter showing={filtered.length} total={broadcasts.length} label="broadcast" />
      </div>

      {/* ── Modal Add ── */}
      <Modal isOpen={showAdd} onClose={handleAddClose} title="Buat Broadcast" subtitle="Buat pesan massal baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField ref={addTitleRef} label="Judul" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Promo Hari Raya" />
          {formErrors.title && <p className="text-xs text-secondary font-inter mt-1">{formErrors.title}</p>}
          <TextArea   label="Isi Pesan" name="message" value={form.message} onChange={handleChange} placeholder="Tulis pesan broadcast..." rows={3} />
          {formErrors.message && <p className="text-xs text-secondary font-inter mt-1">{formErrors.message}</p>}
          <SelectField label="Channel"  name="channel" value={form.channel} onChange={handleChange} options={['Email', 'WhatsApp', 'Both']} />
          <SelectField label="Target"   name="target"  value={form.target}  onChange={handleChange} options={['All', 'Gold', 'Silver', 'Bronze', 'Manual']} />
          {form.target === 'Manual' && (
            <div>
              <div className="max-h-40 overflow-y-auto rounded-xl border border-neutral-border bg-neutral-bg p-3 space-y-1">
                {customersData.map(c => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!manualSelected.find(m => m.id === c.id)} onChange={() => toggleManual(c)} className="rounded" />
                    <span className="text-xs text-primary-2 font-inter">{c.name} <span className="text-neutral-teks">({c.loyalty})</span></span>
                  </label>
                ))}
              </div>
              {formErrors.manualRecipients && <p className="text-xs text-secondary font-inter mt-1">{formErrors.manualRecipients}</p>}
            </div>
          )}
          <SelectField
            label="Cara Pengiriman"
            name="deliveryMode"
            value={deliveryMode}
            onChange={e => setDeliveryMode(e.target.value)}
            options={DELIVERY_MODE_OPTIONS}
          />
          {deliveryMode === 'schedule' && (
            <InputField
              label="Waktu Jadwal"
              name="scheduleDate"
              type="datetime-local"
              value={scheduleDate}
              onChange={e => {
                setScheduleDate(e.target.value);
                setFormErrors(prev => ({ ...prev, scheduleDate: undefined }));
              }}
              error={formErrors.scheduleDate}
              required
            />
          )}
          <div className="rounded-xl px-4 py-3 bg-neutral-bg border border-neutral-border">
            <p className="text-xs font-semibold text-primary-2 font-inter mb-1">Preview Penerima — {previewRecipients.length} customer</p>
            <div className="max-h-24 overflow-y-auto space-y-0.5">
              {previewRecipients.slice(0, 5).map(c => (
                <p key={c.id} className="text-xs text-neutral-teks font-inter">
                  {c.name} — {form.channel === 'WhatsApp' ? c.phone : form.channel === 'Both' ? `${c.email} / ${c.phone}` : c.email}
                </p>
              ))}
              {previewRecipients.length > 5 && (
                <p className="text-xs text-neutral-teks font-inter">...dan {previewRecipients.length - 5} lainnya</p>
              )}
            </div>
            {deliveryMode === 'send_now' && (
              <p className="text-xs text-accent-green font-inter mt-1.5">Akan dikirim segera</p>
            )}
            {deliveryMode === 'schedule' && scheduleDate && (
              <p className="text-xs text-accent-blue font-inter mt-1.5">
                Jadwal: {new Date(scheduleDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAddClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter border border-neutral-border text-neutral-teks bg-neutral-bg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={deliveryMode === 'schedule' && !scheduleDate}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter bg-primary-3 text-neutral hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {deliveryMode === 'draft' ? 'Simpan Draft' : deliveryMode === 'send_now' ? 'Kirim Sekarang' : 'Jadwalkan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Modal Edit ── */}
      <Modal isOpen={showEdit} onClose={handleEditClose} title="Edit Broadcast" subtitle={selected?.id}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <InputField ref={editTitleRef} label="Judul" name="title" value={form.title} onChange={handleChange} placeholder="Judul broadcast" required />
          <TextArea   label="Isi Pesan" name="message" value={form.message} onChange={handleChange} rows={3} required />
          <SelectField label="Channel"  name="channel" value={form.channel} onChange={handleChange} options={['Email', 'WhatsApp', 'Both']} />

          {/* Delivery mode — hanya untuk Draft */}
          {selected?.status === 'Draft' && (
            <>
              <SelectField
                label="Cara Pengiriman"
                name="editDeliveryMode"
                value={editDeliveryMode}
                onChange={e => { setEditDeliveryMode(e.target.value); setEditScheduleError(''); setEditScheduleDate(''); }}
                options={DELIVERY_MODE_OPTIONS}
              />
              {editDeliveryMode === 'schedule' && (
                <>
                  <InputField
                    label="Waktu Jadwal"
                    name="editScheduleDate"
                    type="datetime-local"
                    value={editScheduleDate}
                    onChange={e => { setEditScheduleDate(e.target.value); setEditScheduleError(''); }}
                  />
                  {editScheduleError && <p className="text-xs text-secondary font-inter -mt-2">{editScheduleError}</p>}
                </>
              )}
            </>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleEditClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter border border-neutral-border text-neutral-teks bg-neutral-bg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={selected?.status === 'Draft' && editDeliveryMode === 'schedule' && !editScheduleDate}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter bg-primary-3 text-neutral hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {selected?.status !== 'Draft'
                ? 'Simpan Perubahan'
                : editDeliveryMode === 'send_now'
                  ? 'Kirim Sekarang'
                  : editDeliveryMode === 'schedule'
                    ? 'Jadwalkan'
                    : 'Simpan Draft'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Modal Delete ── */}
      <Modal isOpen={showDelete} onClose={handleDeleteClose} title="Hapus Broadcast" subtitle="Tindakan ini tidak dapat dibatalkan">
        <div className="space-y-4">
          <p className="text-sm text-neutral-teks font-inter">
            Hapus broadcast <span className="font-semibold text-primary-2">"{selected?.title}"</span>?
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
