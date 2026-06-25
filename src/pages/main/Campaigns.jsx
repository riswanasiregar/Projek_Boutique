import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
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

const emptyForm = { name: '', type: 'Giveaway', description: '', startDate: '', endDate: '', maxParticipants: '' };

function formatDate(iso) { if (!iso) return '-'; return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); }
function IconEdit()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>; }
function IconTrash() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }
function IconUsers() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }

export default function Campaigns() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [campaigns, setCampaigns]     = useState([]);
  const [participants, setParticipants] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatus]     = useState('All');
  const [showAdd, setShowAdd]         = useState(false);
  const [showEdit, setShowEdit]       = useState(false);
  const [showDelete, setShowDelete]   = useState(false);
  const [showPart, setShowPart]       = useState(false);
  const [selected, setSelected]       = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [addPartId, setAddPartId]     = useState('');

  async function fetchCampaigns() {
    setLoading(true);
    const { data: camps } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (camps) setCampaigns(camps);

    const { data: parts } = await supabase
      .from('campaign_participants')
      .select('*, customers(name)')
      .order('joined_at', { ascending: false });
    if (parts) setParticipants(parts);
    setLoading(false);
  }

  async function fetchCustomers() {
    const { data } = await supabase
      .from('customers')
      .select('id, name, email, phone, loyalty')
      .order('name');
    if (data) setCustomersData(data);
  }

  useEffect(() => { fetchCampaigns(); fetchCustomers(); }, []);

  const campaignsWithStatus = useMemo(() =>
    campaigns.map(c => ({ ...c, status: getCampaignStatus(c.start_date, c.end_date) })),
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
    const counts = campaigns.map(c => ({ name: c.name, count: participants.filter(p => p.campaign_id === c.id).length }));
    return counts.reduce((a,b) => b.count > a.count ? b : a, counts[0]).name;
  }, [campaigns, participants]);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  // Add
  function handleAddClose()   { setShowAdd(false); setForm(emptyForm); }
  async function handleAddSubmit(e) {
    e.preventDefault();
    if (form.endDate && form.startDate && form.endDate <= form.startDate) { alert('Tanggal berakhir harus setelah tanggal mulai'); return; }
    const { data: last } = await supabase.from('campaigns').select('id').order('id', { ascending: false }).limit(1).maybeSingle();
    const lastNum = last ? parseInt(last.id.replace('CAMP-', ''), 10) : 0;
    const newId = `CAMP-${String(lastNum + 1).padStart(3, '0')}`;
    const { error } = await supabase.from('campaigns').insert({
      id: newId, name: form.name, type: form.type, description: form.description,
      start_date: form.startDate, end_date: form.endDate,
      max_participants: form.maxParticipants ? Number(form.maxParticipants) : null
    });
    if (!error) { await fetchCampaigns(); handleAddClose(); }
    else alert('Gagal membuat campaign: ' + error.message);
  }

  function openEdit(c) {
    setSelected(c);
    setForm({ name: c.name, type: c.type, description: c.description, startDate: c.start_date, endDate: c.end_date, maxParticipants: c.max_participants ? String(c.max_participants) : '' });
    setShowEdit(true);
  }
  function handleEditClose()   { setShowEdit(false); setSelected(null); setForm(emptyForm); }
  async function handleEditSubmit(e) {
    e.preventDefault();
    if (form.endDate && form.startDate && form.endDate <= form.startDate) { alert('Tanggal berakhir harus setelah tanggal mulai'); return; }
    const { error } = await supabase.from('campaigns').update({
      name: form.name, type: form.type, description: form.description,
      start_date: form.startDate, end_date: form.endDate,
      max_participants: form.maxParticipants ? Number(form.maxParticipants) : null
    }).eq('id', selected.id);
    if (!error) { await fetchCampaigns(); handleEditClose(); }
    else alert('Gagal mengedit campaign: ' + error.message);
  }

  function openDelete(c)         { setSelected(c); setShowDelete(true); }
  function handleDeleteClose()   { setShowDelete(false); setSelected(null); }
  async function handleDeleteConfirm() {
    const { error } = await supabase.from('campaigns').delete().eq('id', selected.id);
    if (!error) { await fetchCampaigns(); handleDeleteClose(); }
    else alert('Gagal menghapus campaign: ' + error.message);
  }

  function openParticipants(c) { setSelected(c); setAddPartId(''); setShowPart(true); }
  function handlePartClose()   { setShowPart(false); setSelected(null); setAddPartId(''); }

  const campParticipants = selected ? participants.filter(p => p.campaign_id === selected.id) : [];
  const availableCustomers = selected ? customersData.filter(c => !participants.find(p => p.campaign_id === selected.id && p.customer_id === c.id)) : [];

  async function handleAddParticipant() {
    if (!addPartId) return;
    const cust = customersData.find(c => c.id === addPartId);
    if (!cust) return;
    const camp = campaignsWithStatus.find(c => c.id === selected.id);
    if (camp?.max_participants && campParticipants.length >= camp.max_participants) { alert('Kuota peserta penuh.'); return; }
    const { data: last } = await supabase.from('campaign_participants').select('id').order('id', { ascending: false }).limit(1).maybeSingle();
    const lastNum = last ? parseInt(last.id.replace('CP-', ''), 10) : 0;
    const newId = `CP-${String(lastNum + 1).padStart(3, '0')}`;
    const { error } = await supabase.from('campaign_participants').insert({
      id: newId, campaign_id: selected.id, customer_id: cust.id, loyalty_tier: cust.loyalty
    });
    if (!error) { await fetchCampaigns(); setAddPartId(''); }
    else alert('Gagal menambah peserta: ' + error.message);
  }

  async function removeParticipant(partId) {
    const { error } = await supabase.from('campaign_participants').delete().eq('id', partId);
    if (!error) await fetchCampaigns();
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
                const partCount = participants.filter(p => p.campaign_id === c.id).length;
                const isActive  = c.status === 'Active';
                return (
                  <TableRow key={c.id} className={isActive ? 'bg-accent-green-shadow/30' : ''}>
                    <TableCell><span className="text-neutral-teks">{String(i+1).padStart(2,'0')}.</span></TableCell>
                    <TableCell><span className="text-xs font-mono text-primary-3">{c.id}</span></TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${isActive ? 'text-accent-green' : 'text-primary-2'}`}>{c.name}</span>
                    </TableCell>
                    <TableCell><LabelBadge label={c.type} bgClass={tb.bgClass} textClass={tb.textClass} /></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks">{formatDate(c.start_date)}</span></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks">{formatDate(c.end_date)}</span></TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-primary-2">
                        {partCount}{c.max_participants ? ` / ${c.max_participants}` : ''}
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
                <p className="text-xs text-neutral/70 font-inter">{selected.name} · {campParticipants.length}{selected.max_participants ? ` / ${selected.max_participants}` : ''} peserta</p>
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
                              <Avatar name={p.customers?.name || '-'} size="sm" bgClass="bg-accent-green-shadow" textClass="text-accent-green" />
                              <span className="text-sm font-medium text-primary-2">{p.customers?.name || '-'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <LabelBadge label={p.loyalty_tier}
                              bgClass={p.loyalty_tier==='Gold' ? 'bg-accent-yellow-shadow' : p.loyalty_tier==='Silver' ? 'bg-accent-blue-shadow' : 'bg-accent-pink-shadow'}
                              textClass={p.loyalty_tier==='Gold' ? 'text-accent-yellow' : p.loyalty_tier==='Silver' ? 'text-accent-blue' : 'text-secondary'} />
                          </td>
                          <td className="px-4 py-3 text-xs text-neutral-teks font-inter">{formatDate(p.joined_at)}</td>
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
