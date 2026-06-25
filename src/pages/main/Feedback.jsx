import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FilterChip } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import Container, { PageSection } from '../../components/Container';
import { TableFooter } from '../../components/Footer';

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? 'text-accent-yellow' : 'text-neutral-border'} style={{ fontSize: '14px' }}>★</span>
      ))}
    </div>
  );
}
function formatDate(iso) { return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); }

export default function Feedback() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [feedbacks, setFeedbacks]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [ratingFilter, setRating]     = useState('All');

  async function fetchFeedbacks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setFeedbacks(data);
    setLoading(false);
  }
  useEffect(() => { fetchFeedbacks(); }, []);

  const filtered = feedbacks.filter(f => {
    const matchRating = ratingFilter === 'All' || f.rating === Number(ratingFilter.replace('★',''));
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || f.customer_name.toLowerCase().includes(q) || (f.comment || '').toLowerCase().includes(q);
    return matchRating && matchSearch;
  });

  const avgRating   = feedbacks.length ? (feedbacks.reduce((s,f) => s+f.rating, 0) / feedbacks.length).toFixed(1) : '0.0';
  const satisfied   = feedbacks.filter(f => f.rating >= 4).length;
  const satPct      = feedbacks.length ? Math.round(satisfied / feedbacks.length * 100) : 0;

  // Distribution
  const distribution = [5,4,3,2,1].map(r => ({
    star: r,
    count: feedbacks.filter(f => f.rating === r).length,
    pct: feedbacks.length ? Math.round(feedbacks.filter(f=>f.rating===r).length / feedbacks.length * 100) : 0,
  }));

  const summaryCards = [
    { label: 'Total Review',  value: feedbacks.length, iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue',   icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
    { label: 'Average Rating', value: `${avgRating} ★`, iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
    { label: '% Satisfied',    value: `${satPct}%`,    iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green',  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
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

            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['No','Customer','Rating','Komentar','Tanggal'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">Tidak ada review ditemukan</td></tr>
              ) : filtered.map((f, i) => {
                return (
                  <TableRow key={f.id}>
                    <TableCell><span className="text-neutral-teks">{String(i+1).padStart(2,'0')}.</span></TableCell>
                    <TableCell><span className="text-sm font-medium text-primary-2">{f.customer_name}</span></TableCell>
                    <TableCell><Stars rating={f.rating} /></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks max-w-[240px] block truncate">{f.comment}</span></TableCell>
                    <TableCell><span className="text-xs text-neutral-teks">{formatDate(f.created_at)}</span></TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </div>
        <TableFooter showing={filtered.length} total={feedbacks.length} label="review" />
      </div>
    </Container>
  );
}
