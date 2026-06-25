import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { StatusBadge, LabelBadge, FilterChip } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import TextArea from '../../components/TextArea';
import Avatar from '../../components/Avatar';
import Container, { PageSection } from '../../components/Container';
import { TableFooter } from '../../components/Footer';

const PRIORITY_BADGE = {
  High:   { bgClass: 'bg-accent-pink-shadow',   textClass: 'text-secondary'     },
  Medium: { bgClass: 'bg-accent-yellow-shadow', textClass: 'text-accent-yellow' },
  Low:    { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-accent-blue'   },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDateTime(iso) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function IconChat() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}

export default function Support() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [complaints, setComplaints]   = useState([]);
  const [responses, setResponses]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatus]     = useState('All');
  const [priorityFilter, setPriority] = useState('All');
  const [showDetail, setShowDetail]   = useState(false);
  const [selected, setSelected]       = useState(null);
  const [replyText, setReplyText]     = useState('');
  const [detailStatus, setDetailStatus] = useState('');

  async function fetchComplaints() {
    setLoading(true);
    const { data: comps } = await supabase
      .from('complaints')
      .select('*, customers(name, email, phone)')
      .order('created_at', { ascending: false });
    if (comps) setComplaints(comps);

    const { data: resps } = await supabase
      .from('complaint_responses')
      .select('*')
      .order('created_at', { ascending: true });
    if (resps) setResponses(resps);
    setLoading(false);
  }

  useEffect(() => { fetchComplaints(); }, []);

  const filtered = complaints.filter(c => {
    const matchStatus   = statusFilter   === 'All' || c.status   === statusFilter;
    const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const q = searchQuery.toLowerCase();
    const custName = c.customers?.name || '';
    const matchSearch = !q || custName.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    return matchStatus && matchPriority && matchSearch;
  });

  const counts = {
    total:      complaints.length,
    open:       complaints.filter(c => c.status === 'Open').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved').length,
  };

  // Detail
  function openDetail(c) { setSelected(c); setDetailStatus(c.status); setReplyText(''); setShowDetail(true); }
  function handleDetailClose() { setShowDetail(false); setSelected(null); setReplyText(''); }
  async function handleReply() {
    if (!replyText.trim()) return;
    const { error } = await supabase.from('complaint_responses').insert({
      complaint_id: selected.id, message: replyText.trim(), author: 'Admin'
    });
    if (!error) { await fetchComplaints(); setReplyText(''); }
    else alert('Gagal mengirim respons: ' + error.message);
  }
  async function handleDetailStatusChange(e) {
    const newStatus = e.target.value;
    setDetailStatus(newStatus);
    await supabase.from('complaints').update({ status: newStatus }).eq('id', selected.id);
    await fetchComplaints();
    setSelected(prev => ({ ...prev, status: newStatus }));
  }

  const threadResponses = selected ? responses.filter(r => r.complaint_id === selected.id) : [];

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
                        <Avatar name={c.customers?.name || '-'} size="sm" bgClass="bg-accent-blue-shadow" textClass="text-primary-3" />
                        <span className="text-sm font-medium text-primary-2">{c.customers?.name || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm text-primary-2 max-w-[200px] block truncate">{c.subject}</span></TableCell>
                    <TableCell><LabelBadge label={c.priority} bgClass={pb.bgClass} textClass={pb.textClass} /></TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks">{formatDate(c.created_at)}</span></TableCell>
                    <TableCell>
                      <button onClick={() => openDetail(c)} className="p-1.5 rounded-lg text-accent-green hover:bg-accent-green-shadow transition-colors" title="Lihat detail"><IconChat /></button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </div>
        <TableFooter showing={filtered.length} total={complaints.length} label="komplain" />
      </div>

      {/* Modal Detail / Thread */}
      {showDetail && selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-primary-2/50 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden bg-neutral max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-primary-3 flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-neutral font-inter">{selected.subject}</h3>
                <p className="text-xs text-neutral/70 font-inter">{selected.id} · {selected.customers?.name || '-'}</p>
              </div>
              <button onClick={handleDetailClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral/70 hover:text-neutral text-lg leading-none">✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Customer', value: selected.customers?.name || '-' },
                  { label: 'Email',    value: selected.customers?.email || '-' },
                  { label: 'HP',       value: selected.customers?.phone || '-' },
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
                        <p className="text-xs text-neutral-teks font-inter mt-1">{r.author} · {formatDateTime(r.created_at)}</p>
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
