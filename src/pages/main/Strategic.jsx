import { useState, useMemo, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FilterChip, LabelBadge, LoyaltyBadge } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import LineChart from '../../components/LineChart';
import Container, { PageSection } from '../../components/Container';

/* ── helpers ── */
function fmtRp(v) { return 'Rp ' + Math.round(v || 0).toLocaleString('id-ID'); }
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

/* Monthly revenue targets (simulated) */
const REVENUE_TARGETS = {
  '2026-01': 2000000,
  '2026-02': 2200000,
  '2026-03': 2500000,
};

/* ── RFM segment colors & labels ── */
const RFM_SEGMENTS = {
  Champions:   { bg:'bg-accent-green-shadow',  text:'text-accent-green',  desc:'Order baru + sering + nilai tinggi' },
  Loyal:       { bg:'bg-accent-blue-shadow',   text:'text-accent-blue',   desc:'Order sering, nilai konsisten' },
  'At Risk':   { bg:'bg-accent-yellow-shadow', text:'text-accent-yellow', desc:'Dulu aktif, mulai jarang order' },
  Lost:        { bg:'bg-accent-pink-shadow',   text:'text-secondary',     desc:'Sudah lama tidak order' },
  New:         { bg:'bg-accent-blue-shadow',   text:'text-primary-3',     desc:'Customer baru' },
};

/* Progress bar SVG */
function ProgressBar({ value, max, color = '#2D60FF', height = 10 }) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <svg viewBox={`0 0 300 ${height}`} className="w-full" style={{ height }}>
      <rect x={0} y={0} width={300} height={height} rx={height/2} fill="#F5F7FA"/>
      <rect x={0} y={0} width={Math.max(pct * 300, pct > 0 ? 4 : 0)} height={height} rx={height/2} fill={color}/>
    </svg>
  );
}

/* Gauge SVG (half-circle) */
function GaugeChart({ value, max, color = '#2D60FF', label }) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = 54, cx = 70, cy = 70;
  const circ = Math.PI * r; // half circumference
  const dash = pct * circ;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 80" className="w-36" style={{ height: 80 }}>
        <path d={`M ${cx-r},${cy} A ${r},${r} 0 0,1 ${cx+r},${cy}`}
          fill="none" stroke="#F5F7FA" strokeWidth="14" strokeLinecap="round"/>
        <path d={`M ${cx-r},${cy} A ${r},${r} 0 0,1 ${cx+r},${cy}`}
          fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}/>
        <text x={cx} y={cy-4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#343C6A">
          {Math.round(pct * 100)}%
        </text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize="8" fill="#B1B1B1">{label}</text>
      </svg>
    </div>
  );
}

/* ═════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════ */
export default function Strategic() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [ordersData, setOrdersData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [loading, setLoading] = useState(true);

  // useRef: scroll tab aktif ke tengah saat berpindah
  const activeTabBtnRef = useRef(null);

  useEffect(() => {
    activeTabBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  useEffect(() => {
    async function fetchData() {
      const [{ data: orders }, { data: customers }, { data: products }, { data: items }] = await Promise.all([
        supabase.from('orders').select('*, customers(name)').order('id'),
        supabase.from('customers').select('*').order('id'),
        supabase.from('products').select('*').order('id'),
        supabase.from('order_items').select('*').order('id'),
      ]);
      setOrdersData((orders || []).map(o => ({
        ...o,
        orderDate: o.order_date,
        totalPrice: o.total_price,
        customerName: o.customers?.name || '',
      })));
      setCustomersData(customers || []);
      setProductsData((products || []).map(p => ({
        ...p,
        price: p.price || 0,
        stock: p.stock || 0,
      })));
      const map = {};
      (items || []).forEach(i => {
        if (!map[i.order_id]) map[i.order_id] = [];
        map[i.order_id].push({ name: i.product_name || i.name });
      });
      setOrderItemsMap(map);
      setLoading(false);
    }
    fetchData();
  }, []);

  /* ── total revenue (completed) ── */
  const totalRevenue = useMemo(() =>
    ordersData.filter(o => o.status === 'Completed').reduce((a, o) => a + o.totalPrice, 0),
  [ordersData]);

  const totalOrders    = ordersData.length;
  const completedOrders = ordersData.filter(o => o.status === 'Completed').length;

  /* ── Monthly revenue vs target ── */
  const monthlyRevenue = useMemo(() => {
    const m = {};
    ordersData.filter(o => o.status === 'Completed').forEach(o => {
      const k = o.orderDate.substring(0, 7);
      m[k] = (m[k] || 0) + o.totalPrice;
    });
    return Object.entries(m).sort().map(([month, actual]) => ({
      month,
      label: MONTH_NAMES[parseInt(month.split('-')[1]) - 1] + ' ' + month.split('-')[0],
      actual,
      target: REVENUE_TARGETS[month] || 2000000,
    }));
  }, [ordersData]);

  /* ── Customer growth (new customers per month) ── */
  const customerGrowth = useMemo(() => {
    const firstOrder = {};
    ordersData.forEach(o => {
      const m = o.orderDate.substring(0, 7);
      if (!firstOrder[o.customerName] || m < firstOrder[o.customerName]) firstOrder[o.customerName] = m;
    });
    const byMonth = {};
    Object.values(firstOrder).forEach(m => { byMonth[m] = (byMonth[m] || 0) + 1; });
    const sorted = Object.keys(byMonth).sort();
    return {
      data: sorted.map(k => byMonth[k]),
      labels: sorted.map(k => MONTH_NAMES[parseInt(k.split('-')[1]) - 1]),
    };
  }, [ordersData]);

  /* ── Loyalty distribution ── */
  const loyaltyDist = useMemo(() => {
    const dist = { Gold: 0, Silver: 0, Bronze: 0 };
    customersData.forEach(c => { if (dist[c.loyalty] !== undefined) dist[c.loyalty]++; });
    return dist;
  }, [customersData]);

  const totalCustomers = customersData.length;

  /* ── RFM Segmentation ── */
  const rfmSegments = useMemo(() => {
    const now = new Date();
    const cutoff30  = new Date(now - 30  * 86400000);
    const cutoff90  = new Date(now - 90  * 86400000);
    const cutoff180 = new Date(now - 180 * 86400000);

    return customersData.map(c => {
      const custOrders = ordersData.filter(o => o.customerName === c.name)
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      const completed = custOrders.filter(o => o.status === 'Completed');
      const lastOrder = custOrders[0];
      const lastDate  = lastOrder ? new Date(lastOrder.orderDate) : null;
      const monetary  = completed.reduce((s, o) => s + o.totalPrice, 0);
      const frequency = completed.length;

      let segment = 'Lost';
      if (!lastDate) { segment = 'Lost'; }
      else if (lastDate >= cutoff30 && frequency >= 2 && monetary >= 300000) { segment = 'Champions'; }
      else if (lastDate >= cutoff90 && frequency >= 1) { segment = frequency === 1 ? 'New' : 'Loyal'; }
      else if (lastDate >= cutoff180) { segment = 'At Risk'; }
      else { segment = 'Lost'; }

      // Override: if no completed orders but has recent order → New
      if (frequency === 0 && lastDate && lastDate >= cutoff90) segment = 'New';

      return { ...c, segment, frequency, monetary, lastOrderDate: lastOrder?.orderDate || null };
    });
  }, [customersData, ordersData]);

  const segmentCounts = useMemo(() => {
    const c = { Champions: 0, Loyal: 0, 'At Risk': 0, Lost: 0, New: 0 };
    rfmSegments.forEach(r => { if (c[r.segment] !== undefined) c[r.segment]++; });
    return c;
  }, [rfmSegments]);

  /* ── Loyalty upgrade candidates (Bronze → Silver, Silver → Gold) ── */
  const upgradeCandidates = useMemo(() => {
    return rfmSegments
      .filter(c => (c.loyalty === 'Bronze' || c.loyalty === 'Silver') && c.frequency >= 1 && c.monetary >= 150000)
      .sort((a, b) => b.monetary - a.monetary)
      .slice(0, 8);
  }, [rfmSegments]);

  /* ── Product strategy: demand map ── */
  const productDemand = useMemo(() => {
    const d = {};
    Object.values(orderItemsMap).forEach(items =>
      items.forEach(i => { d[i.name] = (d[i.name] || 0) + 1; })
    );
    return d;
  }, [orderItemsMap]);

  /* ── Action recommendations ── */
  const recommendations = useMemo(() => {
    const recs = [];

    // Churn risk
    const churnRisk = rfmSegments.filter(c => c.segment === 'At Risk' || c.segment === 'Lost');
    if (churnRisk.length > 0) {
      recs.push({
        priority: 'high',
        icon: '⚠️',
        title: `${churnRisk.length} customer berisiko churn`,
        desc: 'Kirim broadcast promo untuk re-engagement segmen At Risk & Lost.',
        action: 'Buat Broadcast',
      });
    }

    // Low stock high demand
    const lowHighDemand = productsData.filter(p => p.stock <= 10 && productDemand[p.name] > 0);
    if (lowHighDemand.length > 0) {
      recs.push({
        priority: 'high',
        icon: '📦',
        title: `${lowHighDemand.length} produk stok rendah & diminati`,
        desc: lowHighDemand.map(p => p.name).join(', '),
        action: 'Tambah Stok',
      });
    }

    // Upgrade candidates
    if (upgradeCandidates.length > 0) {
      recs.push({
        priority: 'medium',
        icon: '⭐',
        title: `${upgradeCandidates.length} customer layak upgrade tier`,
        desc: 'Customer Bronze/Silver dengan spending tinggi siap naik tier.',
        action: 'Review Loyalty',
      });
    }

    // New customers
    const newCusts = rfmSegments.filter(c => c.segment === 'New');
    if (newCusts.length > 0) {
      recs.push({
        priority: 'medium',
        icon: '🎯',
        title: `${newCusts.length} customer baru perlu onboarding`,
        desc: 'Kirim welcome campaign untuk meningkatkan kemungkinan repeat order.',
        action: 'Buat Campaign',
      });
    }

    // Monthly target
    const latestMonth = monthlyRevenue[monthlyRevenue.length - 1];
    if (latestMonth && latestMonth.actual < latestMonth.target) {
      const gap = latestMonth.target - latestMonth.actual;
      recs.push({
        priority: 'medium',
        icon: '📊',
        title: `Target revenue ${latestMonth.label} belum tercapai`,
        desc: `Masih kurang ${fmtRp(gap)} dari target ${fmtRp(latestMonth.target)}.`,
        action: 'Lihat Sales',
      });
    }

    return recs;
  }, [rfmSegments, upgradeCandidates, monthlyRevenue, productDemand, productsData]);

  const PRIORITY_STYLE = {
    high:   { border: 'border-secondary', bg: 'bg-accent-pink-shadow', text: 'text-secondary', badge: 'Urgent' },
    medium: { border: 'border-accent-yellow', bg: 'bg-accent-yellow-shadow', text: 'text-accent-yellow', badge: 'Penting' },
    low:    { border: 'border-accent-blue', bg: 'bg-accent-blue-shadow', text: 'text-accent-blue', badge: 'Info' },
  };

  if (loading) return <Container><p className="text-center py-12 text-neutral-teks font-inter">Memuat data...</p></Container>;

  return (
    <Container>
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 flex-wrap">
        {['Overview','RFM','Loyalty','Revenue Goals','Rekomendasi'].map(tab => (
          <button key={tab}
            ref={tab === activeTab ? activeTabBtnRef : null}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium font-inter transition-colors
              ${activeTab === tab
                ? 'bg-primary-3 text-neutral'
                : 'bg-neutral border border-neutral-border text-neutral-teks hover:bg-neutral-bg'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'Overview' && (
        <>
          <PageSection cols={4} gap="sm">
            {[
              { label:'Total Revenue', value:fmtRp(totalRevenue), iconBg:'bg-accent-green-shadow', iconColor:'text-accent-green',
                icon:<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
              { label:'Total Customer', value:totalCustomers+' orang', iconBg:'bg-accent-blue-shadow', iconColor:'text-accent-blue',
                icon:<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
              { label:'Champions', value:segmentCounts.Champions+' customer', iconBg:'bg-accent-green-shadow', iconColor:'text-accent-green',
                icon:<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg> },
              { label:'At Risk + Lost', value:(segmentCounts['At Risk']+segmentCounts.Lost)+' customer', iconBg:'bg-accent-pink-shadow', iconColor:'text-secondary',
                icon:<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
            ].map(c => <StatCard key={c.label} {...c}/>)}
          </PageSection>

          <PageSection cols={2} gap="md">
            <LineChart title="Customer Growth" color="#16DBCC"
              data={customerGrowth.data.length ? customerGrowth.data : [0]}
              xLabels={customerGrowth.labels.length ? customerGrowth.labels : ['-']}
              badge={(customerGrowth.data.reduce((a,b)=>a+b,0))+' total'}
              badgeBg="bg-accent-green-shadow" badgeText="text-accent-green"/>

            {/* Loyalty distribution */}
            <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
              <p className="text-base font-semibold text-primary-2 font-inter mb-4">Loyalty Distribution</p>
              <div className="space-y-4">
                {[
                  { tier:'Gold',   color:'#FFBB38', bgColor:'bg-accent-yellow-shadow', textColor:'text-accent-yellow' },
                  { tier:'Silver', color:'#2D60FF', bgColor:'bg-accent-blue-shadow',   textColor:'text-accent-blue'   },
                  { tier:'Bronze', color:'#FE5C73', bgColor:'bg-accent-pink-shadow',   textColor:'text-secondary'     },
                ].map(({ tier, color, bgColor, textColor }) => (
                  <div key={tier} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <LabelBadge label={tier} bgClass={bgColor} textClass={textColor}/>
                      <span className="text-sm font-semibold text-primary-2 font-inter">
                        {loyaltyDist[tier]} <span className="text-neutral-teks font-normal text-xs">({((loyaltyDist[tier]/totalCustomers)*100).toFixed(0)}%)</span>
                      </span>
                    </div>
                    <ProgressBar value={loyaltyDist[tier]} max={totalCustomers} color={color}/>
                  </div>
                ))}
              </div>
            </div>
          </PageSection>

          {/* Segment overview */}
          <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
            <p className="text-base font-semibold text-primary-2 font-inter mb-4">RFM Segment Overview</p>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(segmentCounts).map(([seg, count]) => {
                const style = RFM_SEGMENTS[seg] || RFM_SEGMENTS.New;
                return (
                  <div key={seg} className={`rounded-xl p-4 ${style.bg}`}>
                    <p className={`text-lg font-bold font-inter ${style.text}`}>{count}</p>
                    <p className={`text-xs font-semibold font-inter mt-0.5 ${style.text}`}>{seg}</p>
                    <p className="text-xs text-neutral-teks font-inter mt-1">{style.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── RFM ── */}
      {activeTab === 'RFM' && (
        <>
          <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
            <p className="text-base font-semibold text-primary-2 font-inter mb-1">RFM Segmentation</p>
            <p className="text-xs text-neutral-teks font-inter mb-4">Segmentasi berdasarkan Recency, Frequency, dan Monetary value</p>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              {Object.entries(segmentCounts).map(([seg, count]) => {
                const style = RFM_SEGMENTS[seg] || RFM_SEGMENTS.New;
                return (
                  <div key={seg} className={`rounded-xl p-3 text-center ${style.bg}`}>
                    <p className={`text-2xl font-bold font-inter ${style.text}`}>{count}</p>
                    <p className={`text-xs font-semibold font-inter ${style.text}`}>{seg}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <CardHeader title="Customer Segments Detail" subtitle="Semua customer dengan segmen RFM"/>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-bg">
                    {['Customer','Loyalty','Segment','Order Selesai','Total Spending','Last Order'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rfmSegments
                    .sort((a,b) => {
                      const order = { Champions:0, Loyal:1, New:2, 'At Risk':3, Lost:4 };
                      return (order[a.segment]??5) - (order[b.segment]??5);
                    })
                    .map(c => {
                    const style = RFM_SEGMENTS[c.segment] || RFM_SEGMENTS.New;
                    return (
                      <TableRow key={c.id}>
                        <TableCell><span className="text-sm font-medium text-primary-2">{c.name}</span></TableCell>
                        <TableCell><LoyaltyBadge loyalty={c.loyalty}/></TableCell>
                        <TableCell><LabelBadge label={c.segment} bgClass={style.bg} textClass={style.text}/></TableCell>
                        <TableCell><span className="text-sm text-neutral-teks">{c.frequency}</span></TableCell>
                        <TableCell><span className="text-sm font-semibold text-primary-2">{fmtRp(c.monetary)}</span></TableCell>
                        <TableCell><span className="text-xs text-neutral-teks">{c.lastOrderDate ? c.lastOrderDate : 'Belum pernah'}</span></TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── LOYALTY ── */}
      {activeTab === 'Loyalty' && (
        <>
          <PageSection cols={3} gap="sm">
            {[
              { tier:'Gold',   count:loyaltyDist.Gold,   color:'#FFBB38', bg:'bg-accent-yellow-shadow', text:'text-accent-yellow', desc:'Top tier — prioritas kampanye eksklusif' },
              { tier:'Silver', count:loyaltyDist.Silver, color:'#2D60FF', bg:'bg-accent-blue-shadow',   text:'text-accent-blue',   desc:'Mid tier — dorong ke Gold' },
              { tier:'Bronze', count:loyaltyDist.Bronze, color:'#FE5C73', bg:'bg-accent-pink-shadow',   text:'text-secondary',     desc:'Entry tier — potensi naik Silver' },
            ].map(({ tier, count, color, bg, text, desc }) => (
              <div key={tier} className="rounded-2xl p-5 bg-neutral border border-neutral-border">
                <div className="flex items-center justify-between mb-3">
                  <LabelBadge label={tier} bgClass={bg} textClass={text}/>
                  <span className="text-2xl font-bold text-primary-2 font-inter">{count}</span>
                </div>
                <p className="text-xs text-neutral-teks font-inter mb-3">{desc}</p>
                <ProgressBar value={count} max={totalCustomers} color={color} height={8}/>
                <p className="text-xs text-neutral-teks font-inter mt-1.5 text-right">{((count/totalCustomers)*100).toFixed(0)}% dari total customer</p>
              </div>
            ))}
          </PageSection>

          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <CardHeader title="Kandidat Upgrade Tier" subtitle="Customer dengan spending tinggi yang layak naik tier"/>
            {upgradeCandidates.length === 0
              ? <p className="px-5 py-8 text-sm text-center text-neutral-teks font-inter">Tidak ada kandidat upgrade saat ini</p>
              : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-neutral-bg">
                        {['Customer','Tier Saat Ini','Rekomendasi','Order Selesai','Total Spending'].map(h => (
                          <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {upgradeCandidates.map(c => (
                        <TableRow key={c.id}>
                          <TableCell><span className="text-sm font-medium text-primary-2">{c.name}</span></TableCell>
                          <TableCell><LoyaltyBadge loyalty={c.loyalty}/></TableCell>
                          <TableCell>
                            <LoyaltyBadge loyalty={c.loyalty === 'Bronze' ? 'Silver' : 'Gold'}/>
                          </TableCell>
                          <TableCell><span className="text-sm text-neutral-teks">{c.frequency}</span></TableCell>
                          <TableCell><span className="text-sm font-semibold text-primary-2">{fmtRp(c.monetary)}</span></TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </>
      )}

      {/* ── REVENUE GOALS ── */}
      {activeTab === 'Revenue Goals' && (
        <>
          <PageSection cols={3} gap="sm">
            {monthlyRevenue.map(({ month, label, actual, target }) => {
              const pct = target > 0 ? Math.min(actual / target, 1) : 0;
              const achieved = actual >= target;
              return (
                <div key={month} className="rounded-2xl p-5 bg-neutral border border-neutral-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-primary-2 font-inter">{label}</p>
                    <LabelBadge
                      label={achieved ? '✓ Tercapai' : 'Belum Tercapai'}
                      bgClass={achieved ? 'bg-accent-green-shadow' : 'bg-accent-pink-shadow'}
                      textClass={achieved ? 'text-accent-green' : 'text-secondary'}/>
                  </div>
                  <GaugeChart value={actual} max={target} color={achieved ? '#16DBCC' : '#2D60FF'} label="vs Target"/>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs font-inter">
                      <span className="text-neutral-teks">Aktual</span>
                      <span className="font-semibold text-primary-2">{fmtRp(actual)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-inter">
                      <span className="text-neutral-teks">Target</span>
                      <span className="font-semibold text-neutral-teks">{fmtRp(target)}</span>
                    </div>
                    <ProgressBar value={actual} max={target} color={achieved ? '#16DBCC' : '#2D60FF'} height={8}/>
                    <p className={`text-xs font-semibold text-right font-inter ${achieved ? 'text-accent-green' : 'text-secondary'}`}>
                      {achieved
                        ? `+${fmtRp(actual - target)} di atas target`
                        : `Kurang ${fmtRp(target - actual)}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </PageSection>

          <LineChart title="Revenue Aktual vs Trend"
            data={monthlyRevenue.map(m => m.actual)}
            xLabels={monthlyRevenue.map(m => MONTH_NAMES[parseInt(m.month.split('-')[1])-1])}
            badge={fmtRp(monthlyRevenue.reduce((a,m)=>a+m.actual,0))}/>
        </>
      )}

      {/* ── REKOMENDASI ── */}
      {activeTab === 'Rekomendasi' && (
        <>
          <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
            <p className="text-base font-semibold text-primary-2 font-inter mb-1">Action Recommendations</p>
            <p className="text-xs text-neutral-teks font-inter mb-4">Rekomendasi strategis berdasarkan kondisi data saat ini</p>
            {recommendations.length === 0
              ? <p className="text-sm text-neutral-teks text-center py-8 font-inter">Tidak ada rekomendasi saat ini — semua metrik dalam kondisi baik!</p>
              : (
                <div className="space-y-3">
                  {recommendations.map((rec, i) => {
                    const s = PRIORITY_STYLE[rec.priority];
                    return (
                      <div key={i} className={`rounded-xl p-4 border-l-4 ${s.border} bg-neutral-bg`}>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-primary-2 font-inter">{rec.title}</p>
                              <LabelBadge label={s.badge} bgClass={s.bg} textClass={s.text}/>
                            </div>
                            <p className="text-xs text-neutral-teks font-inter">{rec.desc}</p>
                          </div>
                          <span className={`text-xs font-semibold font-inter px-3 py-1.5 rounded-xl cursor-pointer ${s.bg} ${s.text}`}>
                            {rec.action}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            }
          </div>

          {/* Product strategy */}
          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <CardHeader title="Product Strategy" subtitle="Prioritas stok berdasarkan demand & inventory"/>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-bg">
                    {['Produk','Kategori','Stok','Demand','Inventory Value','Prioritas'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productsData.map(p => {
                    const demand = productDemand[p.name] || 0;
                    const lowStock = p.stock <= 10;
                    const highDemand = demand > 0;
                    const priority = lowStock && highDemand ? 'Restock Segera' : lowStock ? 'Monitor Stok' : highDemand ? 'Pertahankan' : 'Normal';
                    const priorityStyle = {
                      'Restock Segera': { bg:'bg-accent-pink-shadow',   text:'text-secondary'     },
                      'Monitor Stok':   { bg:'bg-accent-yellow-shadow', text:'text-accent-yellow' },
                      'Pertahankan':    { bg:'bg-accent-green-shadow',  text:'text-accent-green'  },
                      'Normal':         { bg:'bg-neutral-bg',           text:'text-neutral-teks'  },
                    };
                    const catStyle = {
                      Dress:     { bg:'bg-accent-pink-shadow',   text:'text-secondary'    },
                      Top:       { bg:'bg-accent-green-shadow',  text:'text-accent-green' },
                      Bottom:    { bg:'bg-accent-blue-shadow',   text:'text-accent-blue'  },
                      Outerwear: { bg:'bg-accent-yellow-shadow', text:'text-accent-yellow'},
                    };
                    const cs = catStyle[p.category] || catStyle.Top;
                    const ps = priorityStyle[priority];
                    return (
                      <TableRow key={p.id}>
                        <TableCell><span className="text-sm font-medium text-primary-2">{p.name}</span></TableCell>
                        <TableCell><LabelBadge label={p.category} bgClass={cs.bg} textClass={cs.text}/></TableCell>
                        <TableCell>
                          <span className={`text-sm font-bold ${lowStock ? 'text-secondary' : 'text-primary-2'}`}>{p.stock}</span>
                        </TableCell>
                        <TableCell><span className="text-sm text-neutral-teks">{demand > 0 ? demand : '—'}</span></TableCell>
                        <TableCell><span className="text-sm font-semibold text-primary-2">{fmtRp(p.price * p.stock)}</span></TableCell>
                        <TableCell><LabelBadge label={priority} bgClass={ps.bg} textClass={ps.text}/></TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
