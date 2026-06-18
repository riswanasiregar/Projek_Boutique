import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import customersData from '../../data/customers.json';
import { LabelBadge, FilterChip } from '../../components/Badge';
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

const TYPE_BADGE = {
  Giveaway: { bgClass: 'bg-accent-pink-shadow',   textClass: 'text-secondary'     },
  Discount:  { bgClass: 'bg-accent-green-shadow',  textClass: 'text-accent-green'  },
  Event:     { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-accent-blue'   },
  Referral:  { bgClass: 'bg-accent-yellow-shadow', textClass: 'text-accent-yellow' },
};
const STATUS_BADGE = {
  Active: { bgClass: 'bg-accent-green-shadow',  textClass: 'text-accent-green'  },
  Ended:  { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-accent-blue'   },
  Draft:  { bgClass: 'bg-accent-yellow-shadow', textClass: 'text-accent-yellow' },
};

function getCampaignStatus(startDate, endDate) {
  if (!startDate || !endDate) return 'Draft';
  const now   = new Date();
  const start = new Date(startDate);
  const end   = new Date(endDate);
  if (now < start) return 'Draft';
  if (now > end)   return 'Ended';
  return 'Active';
}

const today = new Date();
const initialCampaigns = [
  { id: 'CAMP-001', name: 'Giveaway Lebaran 2026',    type: 'Giveaway', description: 'Giveaway dress eksklusif untuk merayakan Lebaran.',  startDate: '2026-02-01', endDate: '2026-02-28', maxParticipants: 50,  createdAt: '2026-01-20T10:00:00' },
  { id: 'CAMP-002', name: 'Diskon Member Gold',        type: 'Discount', description: 'Diskon 30% khusus member Gold untuk semua produk.', startDate: '2026-03-01', endDate: '2026-03-31', maxParticipants: null, createdAt: '2026-02-20T09:00:00' },
  { id: 'CAMP-003', name: 'Fashion Week Event',        type: 'Event',    description: 'Event fashion week eksklusif boutique.',             startDate: '2026-03-15', endDate: '2026-03-20', maxParticipants: 100, createdAt: '2026-02-25T11:00:00' },
  { id: 'CAMP-004', name: 'Referral Program Q1',       type: 'Referral', description: 'Ajak teman dan dapatkan voucher Rp 50.000.',         startDate: '2026-01-01', endDate: '2026-03-31', maxParticipants: null, createdAt: '2025-12-20T08:00:00' },
  { id: 'CAMP-005', name: 'Summer Collection Launch',  type: 'Event',    description: 'Peluncuran koleksi musim panas terbaru.',             startDate: '2026-04-01', endDate: '2026-04-07', maxParticipants: 200, createdAt: '2026-03-01T10:00:00' },
];

const initialParticipants = [
  { id: 'CP-001', campaignId: 'CAMP-001', customerId: 'CUST-001', customerName: 'Andi Saputra',  loyaltyTier: 'Gold',   joinedAt: '2026-02-05T10:00:00' },
  { id: 'CP-002', campaignId: 'CAMP-001', customerId: 'CUST-004', customerName: 'Dewi Lestari',  loyaltyTier: 'Gold',   joinedAt: '2026-02-06T11:00:00' },
  { id: 'CP-003', campaignId: 'CAMP-002', customerId: 'CUST-008', customerName: 'Hana Pertiwi',  loyaltyTier: 'Gold',   joinedAt: '2026-03-02T09:00:00' },
  { id: 'CP-004', campaignId: 'CAMP-002', customerId: 'CUST-010', customerName: 'Joko Widodo',   loyaltyTier: 'Gold',   joinedAt: '2026-03-03T14:00:00' },
  { id: 'CP-005', campaignId: 'CAMP-004', customerId: 'CUST-002', customerName: 'Siti Rahayu',   loyaltyTier: 'Silver', joinedAt: '2026-01-10T08:00:00' },
];

const emptyForm = { name: '', type: 'Giveaway', description: '', startDate: '', endDate: '', maxParticipants: '' };

function formatDate(iso) { if (!iso) return '-'; return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); }
function IconEdit()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>; }
function IconTrash() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }
function IconUsers() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }

export default function Campaigns() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [campaigns, setCampaigns]     = useState(initialCampaigns);
  const [participants, setParticipants] = useState(initialParticipants);
  const [statusFilter, setStatus]     = useState('All');
  const [showAdd, setShowAdd]         = useState(false);
  const [showEdit, setShowEdit]       = useState(false);
  const [showDelete, setShowDelete]   = useState(false);
  const [showPart, setShowPart]       = useState(false);
  const [selected, setSelected]       = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [addPartId, setAddPartId]     = useState('');

  const campaignsWithStatus = useMemo(() =>
    campaigns.map(c => ({ ...c, status: getCampaignStatus(c.startDate, c.endDate) })),
    [campaigns]
  );

  const filtered = campaignsWithStatus.filter(c => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const activeCount = campaignsWithStatus.filter(c => c.status === 'Active').length;
  const endedCount  = campaignsWithStatus.filter(c => c.status === 'Ended').length;
  const totalPart   = participants.length;
  const mostPopular = useMemo(() => {
    if (!campaigns.length) return '-';
    const counts = campaigns.map(c => ({ name: c.name, count: participants.filter(p => p.campaignId === c.id).length }));
    return counts.reduce((a,b) => b.count > a.count ? b : a, counts[0]).name;
  }, [campaigns, participants]);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleAddClose()   { setShowAdd(false); setForm(emptyForm); }
  function handleAddSubmit(e) {
    e.preventDefault();
    if (form.endDate && form.startDate && form.endDate <= form.startDate) { alert('Tanggal berakhir harus setelah tanggal mulai'); return; }
    const newId = `CAMP-${String(campaigns.length + 1).padStart(3,'0')}`;
    setCampaigns([...campaigns, { id: newId, name: form.name, type: form.type, description: form.description, startDate: form.startDate, endDate: form.endDate, maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : null, createdAt: new Date().toISOString() }]);
    handleAddClose();
  }

  function openEdit(c)         { setSelected(c); setForm({ name: c.name, type: c.type, description: c.description, startDate: c.startDate, endDate: c.endDate, maxParticipants: c.maxParticipants ? String(c.maxParticipants) : '' }); setShowEdit(true); }
  function handleEditClose()   { setShowEdit(false); setSelected(null); setForm(emptyForm); }
  function handleEditSubmit(e) {
    e.preventDefault();
    if (form.endDate && form.startDate && form.endDate <= form.startDate) { alert('Tanggal berakhir harus setelah tanggal mulai'); return; }
    setCampaigns(campaigns.map(c => c.id === selected.id ? { ...c, name: form.name, type: form.type, description: form.description, startDate: form.startDate, endDate: form.endDate, maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : null } : c));
    handleEditClose();
  }

  function openDelete(c)         { setSelected(c); setShowDelete(true); }
  function handleDeleteClose()   { setShowDelete(false); setSelected(null); }
  function handleDeleteConfirm() {
    setCampaigns(campaigns.filter(c => c.id !== selected.id));
    setParticipants(participants.filter(p => p.campaignId !== selected.id));
    handleDeleteClose();
  }

  function openParticipants(c) { setSelected(c); setAddPartId(''); setShowPart(true); }
  function handlePartClose()   { setShowPart(false); setSelected(null); setAddPartId(''); }

  const campParticipants = selected ? participants.filter(p => p.campaignId === selected.id) : [];
  const availableCustomers = selected ? customersData.filter(c => !participants.find(p => p.campaignId === selected.id && p.customerId === c.id)) : [];

  function handleAddParticipant() {
    if (!addPartId) return;
    const cust = customersData.find(c => c.id === addPartId);
    if (!cust) return;
    const camp = campaignsWithStatus.find(c => c.id === selected.id);
    if (camp?.maxParticipants && campParticipants.length >= camp.maxParticipants) { alert('Kuota peserta penuh.'); return; }
    const newPart = { id: `CP-${String(participants.length+1).padStart(3,'0')}`, campaignId: selected.id, customerId: cust.id, customerName: cust.name, loyaltyTier: cust.loyalty, joinedAt: new Date().toISOString() };
    setParticipants([...participants, newPart]);
    setAddPartId('');
  }

  function removeParticipant(partId) {
    setParticipants(participants.filter(p => p.id !== partId));
  }

  const summaryCards = [
    { label: 'Total Campaign', value: campaigns.length, iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg> },
    { label: 'Active',         value: activeCount,      iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
    { label: 'Total Peserta',  value: totalPart,        iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { label: 'Campaign Ended', value: endedCount,       iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-secondary',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> },
  ];

  return (
    <Container>
      <PageSection cols={4} gap="sm">
        {summaryCards.map(c => <StatCard key={c.label} {...c} />)}
      </PageSection>

      <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
        <CardHeader
          title="Daftar Campaign"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {['All','Active','Draft','Ended'].map(f => (
                <FilterChip key={f} label={f} active={statusFilter === f} onClick={() => setStatus(f)} />
              ))}
              <Button size="sm" variant="default" onClick={() => setShowAdd(true)} className="rounded-full text-xs">
                + Buat Campaign
              </Button>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['No','ID','Nama Campaign','Tipe','Mulai','Berakhir','Peserta','Status','Aksi'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">Tidak ada campaign ditemukan</td></tr>
              ) : filtered.map((c, i) => {
                const tb = TYPE_BADGE[c.type]   || TYPE_BADGE.Event;
                const sb = STATUS_BADGE[c.status] || STATUS_BADGE.Draft;
                const partCount = participants.filter(p => p.campaignId === c.id).length;
                const isActive  = c.status === 'Active';
                return (
                  <TableRow key={c.id} className={isActive ? 'bg-accent-green-shadow/30' : ''}>
                    <TableCell><span className="text-neutral-teks">{String(i+1).padStart(2,'0')}.</span></TableCell>
                    <TableCell><span className="text-xs font-mono text-primary-3">{c.id}</span></TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${isActive ? 'text-accent-green' : 'text-primary-2'}`}>{c.name}</span>
                    </TableCell>
                    <TableCell><LabelBadge label={c.type} bgClass={tb.bgClass} textClass={tb.textClass} /></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks">{formatDate(c.startDate)}</span></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks">{formatDate(c.endDate)}</span></TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-primary-2">
                        {partCount}{c.maxParticipants ? ` / ${c.maxParticipants}` : ''}
                      </span>
                    </TableCell>
                    <TableCell><LabelBadge label={c.status} bgClass={sb.bgClass} textClass={sb.textClass} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openParticipants(c)} className="p-1.5 rounded-lg text-accent-green hover:bg-accent-green-shadow transition-colors" title="Kelola peserta"><IconUsers /></button>
                        <button onClick={() => openEdit(c)}         className="p-1.5 rounded-lg text-accent-blue hover:bg-accent-blue-shadow transition-colors" title="Edit"><IconEdit /></button>
                        <button onClick={() => openDelete(c)}
                          disabled={c.status !== 'Draft'}
                          className={`p-1.5 rounded-lg transition-colors ${c.status === 'Draft' ? 'text-secondary hover:bg-accent-pink-shadow' : 'text-neutral-border cursor-not-allowed'}`}
                          title={c.status === 'Draft' ? 'Hapus' : 'Tidak bisa dihapus'}><IconTrash /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </div>
        <TableFooter showing={filtered.length} total={campaigns.length} label="campaign" />
      </div>

      {/* Modal Add/Edit */}
      {(showAdd || showEdit) && (
        <Modal isOpen={showAdd || showEdit} onClose={showEdit ? handleEditClose : handleAddClose}
          title={showEdit ? 'Edit Campaign' : 'Buat Campaign Baru'}
          subtitle={showEdit ? selected?.id : 'Isi detail campaign'}>
          <form onSubmit={showEdit ? handleEditSubmit : handleAddSubmit} className="space-y-4">
            <InputField label="Nama Campaign" name="name"        value={form.name}        onChange={handleChange} placeholder="e.g. Giveaway Lebaran" required />
            <SelectField label="Tipe"          name="type"        value={form.type}        onChange={handleChange} options={['Giveaway','Discount','Event','Referral']} />
            <TextArea    label="Deskripsi"     name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi campaign..." rows={2} required />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Tanggal Mulai"    name="startDate" value={form.startDate} onChange={handleChange} type="date" required />
              <InputField label="Tanggal Berakhir" name="endDate"   value={form.endDate}   onChange={handleChange} type="date" required />
            </div>
            <InputField label="Max Peserta (opsional)" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} type="number" placeholder="Kosongkan jika tidak ada batas" />
            <ModalFooter onCancel={showEdit ? handleEditClose : handleAddClose} submitLabel={showEdit ? 'Simpan Perubahan' : 'Buat Campaign'} />
          </form>
        </Modal>
      )}

      {/* Modal Delete */}
      <Modal isOpen={showDelete} onClose={handleDeleteClose} title="Hapus Campaign" subtitle="Tindakan ini tidak dapat dibatalkan">
        <div className="space-y-4">
          <p className="text-sm text-neutral-teks font-inter">Hapus campaign <span className="font-semibold text-primary-2">"{selected?.name}"</span> beserta semua pesertanya?</p>
          <div className="flex gap-3">
            <button onClick={handleDeleteClose}   type="button" className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-border text-neutral-teks bg-neutral-bg font-inter">Batal</button>
            <button onClick={handleDeleteConfirm} type="button" className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-secondary text-neutral hover:opacity-90 font-inter">Hapus</button>
          </div>
        </div>
      </Modal>

      {/* Modal Participants */}
      {showPart && selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-primary-2/50 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden bg-neutral max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 flex items-center justify-between bg-primary-3 flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-neutral font-inter">Kelola Peserta</h3>
                <p className="text-xs text-neutral/70 font-inter">{selected.name} · {campParticipants.length}{selected.maxParticipants ? ` / ${selected.maxParticipants}` : ''} peserta</p>
              </div>
              <button onClick={handlePartClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral/70 hover:text-neutral text-lg leading-none">✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Add participant */}
              <div className="flex gap-2">
                <select value={addPartId} onChange={e => setAddPartId(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-neutral-border bg-neutral-bg text-primary-2 font-inter outline-none focus:border-primary-3">
                  <option value="">-- Pilih Customer --</option>
                  {availableCustomers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.loyalty})</option>)}
                </select>
                <button onClick={handleAddParticipant} disabled={!addPartId}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-3 text-neutral hover:opacity-90 disabled:opacity-40 font-inter">
                  Tambah
                </button>
              </div>

              {/* List */}
              {campParticipants.length === 0 ? (
                <p className="text-sm text-neutral-teks font-inter text-center py-6">Belum ada peserta untuk campaign ini.</p>
              ) : (
                <div className="rounded-2xl overflow-hidden border border-neutral-border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-neutral-bg">
                        {['No','Customer','Loyalty','Tanggal Daftar',''].map(h => (
                          <th key={h} className="px-4 py-3 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {campParticipants.map((p, i) => (
                        <tr key={p.id} className="border-t border-neutral-border hover:bg-neutral-bg transition-colors">
                          <td className="px-4 py-3 text-xs text-neutral-teks font-inter">{i+1}.</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar name={p.customerName} size="sm" bgClass="bg-accent-green-shadow" textClass="text-accent-green" />
                              <span className="text-sm font-medium text-primary-2">{p.customerName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <LabelBadge label={p.loyaltyTier}
                              bgClass={p.loyaltyTier==='Gold' ? 'bg-accent-yellow-shadow' : p.loyaltyTier==='Silver' ? 'bg-accent-blue-shadow' : 'bg-accent-pink-shadow'}
                              textClass={p.loyaltyTier==='Gold' ? 'text-accent-yellow' : p.loyaltyTier==='Silver' ? 'text-accent-blue' : 'text-secondary'} />
                          </td>
                          <td className="px-4 py-3 text-xs text-neutral-teks font-inter">{formatDate(p.joinedAt)}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => removeParticipant(p.id)} className="p-1 rounded-lg text-secondary hover:bg-accent-pink-shadow transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
