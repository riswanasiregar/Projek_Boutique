import { useState, useMemo, useRef, useEffect } from 'react';
import ordersData from '../../data/orders.json';
import customersData from '../../data/customers.json';
import { FilterChip, LabelBadge, LoyaltyBadge } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import LineChart from '../../components/LineChart';
import Container, { PageSection } from '../../components/Container';

/* ── helpers ── */
function fmtRp(v) { return 'Rp ' + Math.round(v || 0).toLocaleString('id-ID'); }
function fmtDate(d) {
  if (!d) return 'Belum pernah order';
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
function monthLabel(ym) {
  const [yr, mo] = ym.split('-');
  return MONTH_NAMES[parseInt(mo) - 1] + "'" + yr.slice(2);
}

/* ── static data ── */
const productsData = [
  { id:'PRD-001', name:'Floral Summer Dress',  category:'Dress',     price:350000, stock:15 },
  { id:'PRD-002', name:'Classic White Blouse',  category:'Top',       price:180000, stock:30 },
  { id:'PRD-003', name:'High-Waist Trousers',   category:'Bottom',    price:275000, stock:20 },
  { id:'PRD-004', name:'Knit Cardigan',          category:'Outerwear', price:420000, stock:12 },
  { id:'PRD-005', name:'Silk Midi Skirt',        category:'Bottom',    price:310000, stock:18 },
  { id:'PRD-006', name:'Linen Blazer',           category:'Outerwear', price:580000, stock:8  },
  { id:'PRD-007', name:'Wrap Maxi Dress',        category:'Dress',     price:450000, stock:10 },
  { id:'PRD-008', name:'Crop Cami Top',          category:'Top',       price:120000, stock:25 },
  { id:'PRD-009', name:'Wide Leg Jeans',         category:'Bottom',    price:390000, stock:14 },
  { id:'PRD-010', name:'Trench Coat',            category:'Outerwear', price:850000, stock:5  },
];
const orderItemsMap = {
  'ORD-001': [{ name:'Floral Midi Dress' }, { name:'Pastel Cardigan' }],
  'ORD-002': [{ name:'Linen Blouse' }],
  'ORD-003': [{ name:'Summer Shorts' }],
  'ORD-004': [{ name:'Evening Gown' }, { name:'Silk Scarf' }],
};

/* ── sub-charts ── */
const DONUT_COLORS = { Completed:'#16DBCC', Pending:'#FFBB38', Cancelled:'#FE5C73' };

function DonutChart({ data }) {
  const total = Object.values(data).reduce((a,b) => a+b, 0);
  const r=55, cx=70, cy=70, circ=2*Math.PI*r;
  let off=0;
  const segs = Object.entries(data).map(([status,val]) => {
    const pct = total ? val/total : 0;
    const dash = pct*circ;
    const s = { status, val, pct, dash, off };
    off += dash;
    return s;
  });
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg viewBox="0 0 140 140" className="w-36 h-36 flex-shrink-0">
        {total===0
          ? <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E6EFF5" strokeWidth="18"/>
          : segs.map(s=>(
            <circle key={s.status} cx={cx} cy={cy} r={r} fill="none"
              stroke={DONUT_COLORS[s.status]} strokeWidth="18"
              strokeDasharray={`${s.dash} ${circ-s.dash}`}
              strokeDashoffset={circ*0.25-s.off}/>
          ))}
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="9" fontWeight="700" fill="#343C6A">Total</text>
        <text x={cx} y={cy+8} textAnchor="middle" fontSize="8" fill="#343C6A">{fmtRp(total)}</text>
      </svg>
      <div className="space-y-2">
        {segs.map(s=>(
          <div key={s.status} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{background:DONUT_COLORS[s.status]}}/>
            <span className="text-xs text-neutral-teks font-inter w-16">{s.status}</span>
            <span className="text-xs font-semibold text-primary-2 font-inter">{fmtRp(s.val)}</span>
            <span className="text-xs text-neutral-teks font-inter">({(s.pct*100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizBar({ label, value, total, color='#2D60FF' }) {
  const pct = total ? value/total : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-inter">
        <span className="text-neutral-teks">{label}</span>
        <span className="font-semibold text-primary-2">{value} <span className="text-neutral-teks font-normal">({(pct*100).toFixed(1)}%)</span></span>
      </div>
      <svg viewBox="0 0 300 10" className="w-full" style={{height:10}}>
        <rect x={0} y={0} width={300} height={10} rx={5} fill="#F5F7FA"/>
        <rect x={0} y={0} width={Math.max(pct*300, pct>0?4:0)} height={10} rx={5} fill={color}/>
      </svg>
    </div>
  );
}

function ScatterChart({ points }) {
  const W=320, H=180, PAD=44;
  const maxX = Math.max(...points.map(p=>p.price), 1);
  const maxY = Math.max(...points.map(p=>p.demand), 1);
  const sx = x => PAD + ((x/maxX)*(W-PAD*2));
  const sy = y => H-PAD - ((y/maxY)*(H-PAD*2));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{height:H}}>
      <line x1={PAD} y1={H-PAD} x2={W-PAD} y2={H-PAD} stroke="#E6EFF5" strokeWidth="1"/>
      <line x1={PAD} y1={PAD/2} x2={PAD} y2={H-PAD} stroke="#E6EFF5" strokeWidth="1"/>
      <text x={W/2} y={H-6} textAnchor="middle" fontSize="8" fill="#B1B1B1">Harga (Rp)</text>
      <text x={10} y={H/2} textAnchor="middle" fontSize="8" fill="#B1B1B1" transform={`rotate(-90,10,${H/2})`}>Demand</text>
      {points.map((p,i)=>(
        <g key={i}>
          <circle cx={sx(p.price)} cy={sy(p.demand)} r={5} fill="#2D60FF" opacity={0.7}/>
          <text x={sx(p.price)+7} y={sy(p.demand)+4} fontSize="6.5" fill="#343C6A">
            {p.name.split(' ').slice(0,2).join(' ')}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [period, setPeriod]       = useState('All Time');

  // useRef: scroll tab aktif ke tengah saat berpindah
  const tabContainerRef = useRef(null);
  const activeTabBtnRef = useRef(null);

  useEffect(() => {
    activeTabBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  const periodStart = useMemo(() => {
    if (period === '30 Hari') return new Date(Date.now() - 30*24*60*60*1000);
    if (period === '3 Bulan') return new Date(Date.now() - 90*24*60*60*1000);
    return null;
  }, [period]);

  const filteredOrders = useMemo(() =>
    periodStart ? ordersData.filter(o => new Date(o.orderDate) >= periodStart) : ordersData,
  [periodStart]);

  /* KPI */
  const avgCLV = useMemo(() => {
    const map = {};
    ordersData.filter(o=>o.status==='Completed').forEach(o=>{
      map[o.customerName] = (map[o.customerName]||0) + o.totalPrice;
    });
    const v = Object.values(map);
    return v.length ? v.reduce((a,b)=>a+b,0)/v.length : 0;
  }, []);

  const churnRiskCustomers = useMemo(() => {
    const cutoff = new Date(Date.now() - 30*24*60*60*1000);
    return customersData.filter(c => {
      const last = ordersData.filter(o=>o.customerName===c.name)
        .sort((a,b)=>new Date(b.orderDate)-new Date(a.orderDate))[0];
      return !last || new Date(last.orderDate) < cutoff;
    }).map(c => {
      const last = ordersData.filter(o=>o.customerName===c.name)
        .sort((a,b)=>new Date(b.orderDate)-new Date(a.orderDate))[0];
      const days = last ? Math.floor((Date.now()-new Date(last.orderDate))/86400000) : null;
      return { ...c, lastOrderDate: last?.orderDate||null, daysSince: days };
    });
  }, []);

  const conversionRate = useMemo(() => {
    if (!filteredOrders.length) return 0;
    return filteredOrders.filter(o=>o.status==='Completed').length / filteredOrders.length * 100;
  }, [filteredOrders]);

  const repeatRate = useMemo(() => {
    const map = {};
    filteredOrders.filter(o=>o.status==='Completed').forEach(o=>{
      map[o.customerName] = (map[o.customerName]||0)+1;
    });
    const total = Object.keys(map).length;
    const repeat = Object.values(map).filter(v=>v>1).length;
    return total ? (repeat/total)*100 : 0;
  }, [filteredOrders]);

  /* Revenue trend */
  const revenueTrend = useMemo(() => {
    const m = {};
    filteredOrders.filter(o=>o.status==='Completed').forEach(o=>{
      const k = o.orderDate.substring(0,7);
      m[k] = (m[k]||0) + o.totalPrice;
    });
    const s = Object.keys(m).sort();
    return { data: s.map(k=>m[k]), labels: s.map(monthLabel) };
  }, [filteredOrders]);

  /* Order status counts */
  const statusCounts = useMemo(() => {
    const c = {Pending:0, Completed:0, Cancelled:0};
    filteredOrders.forEach(o=>{ if(c[o.status]!==undefined) c[o.status]++; });
    return c;
  }, [filteredOrders]);

  /* CLV ranking */
  const clvRanking = useMemo(() => {
    const clv={}, cnt={};
    ordersData.filter(o=>o.status==='Completed').forEach(o=>{
      clv[o.customerName]=(clv[o.customerName]||0)+o.totalPrice;
      cnt[o.customerName]=(cnt[o.customerName]||0)+1;
    });
    return customersData
      .map(c=>({...c, clv:clv[c.name]||0, orderCount:cnt[c.name]||0}))
      .sort((a,b)=>b.clv-a.clv);
  }, []);

  /* Cohort retention */
  const cohortData = useMemo(() => {
    const first = {};
    ordersData.forEach(o=>{
      const m = o.orderDate.substring(0,7);
      if (!first[o.customerName] || m < first[o.customerName]) first[o.customerName]=m;
    });
    const cohorts = {};
    Object.entries(first).forEach(([cust,m])=>{
      if (!cohorts[m]) cohorts[m]=[];
      cohorts[m].push(cust);
    });
    return Object.entries(cohorts).sort().map(([m, custs])=>{
      const retained = custs.filter(c=>{
        const months = [...new Set(ordersData.filter(o=>o.customerName===c).map(o=>o.orderDate.substring(0,7)))];
        return months.length > 1;
      }).length;
      const [yr,mo] = m.split('-');
      return {
        cohort: MONTH_NAMES[parseInt(mo)-1]+' '+yr,
        size: custs.length,
        rate: custs.length ? (retained/custs.length)*100 : 0,
      };
    });
  }, []);

  /* Monthly active customers */
  const monthlyActive = useMemo(() => {
    const m = {};
    filteredOrders.forEach(o=>{
      const k = o.orderDate.substring(0,7);
      if (!m[k]) m[k]=new Set();
      m[k].add(o.customerName);
    });
    const s = Object.keys(m).sort();
    return { data: s.map(k=>m[k].size), labels: s.map(k=>MONTH_NAMES[parseInt(k.split('-')[1])-1]) };
  }, [filteredOrders]);

  /* Purchase frequency */
  const purchaseFreq = useMemo(() => {
    return customersData.flatMap(c=>{
      const orders = ordersData.filter(o=>o.customerName===c.name)
        .sort((a,b)=>new Date(a.orderDate)-new Date(b.orderDate));
      if (orders.length < 2) return [];
      const diffs = orders.slice(1).map((o,i)=>
        (new Date(o.orderDate)-new Date(orders[i].orderDate))/86400000);
      return [{ name:c.name, orderCount:orders.length, avgFreq:diffs.reduce((a,b)=>a+b,0)/diffs.length }];
    }).sort((a,b)=>a.avgFreq-b.avgFreq);
  }, []);

  /* AOV trend */
  const aovTrend = useMemo(() => {
    const m = {};
    filteredOrders.filter(o=>o.status==='Completed').forEach(o=>{
      const k = o.orderDate.substring(0,7);
      if (!m[k]) m[k]={total:0,count:0};
      m[k].total+=o.totalPrice; m[k].count++;
    });
    const s = Object.keys(m).sort();
    return {
      data: s.map(k=>m[k].count ? m[k].total/m[k].count : 0),
      labels: s.map(k=>MONTH_NAMES[parseInt(k.split('-')[1])-1]),
    };
  }, [filteredOrders]);

  /* Revenue by status */
  const revByStatus = useMemo(() => {
    const m={Completed:0, Pending:0, Cancelled:0};
    filteredOrders.forEach(o=>{ if(m[o.status]!==undefined) m[o.status]+=o.totalPrice; });
    return m;
  }, [filteredOrders]);

  /* Products */
  const topProducts = useMemo(() => {
    const c={};
    Object.values(orderItemsMap).forEach(items=>items.forEach(item=>{
      c[item.name]=(c[item.name]||0)+1;
    }));
    return Object.entries(c).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
  }, []);

  const categoryPerf = useMemo(() => {
    const c={};
    Object.values(orderItemsMap).forEach(items=>items.forEach(item=>{
      const cat = productsData.find(p=>p.name.toLowerCase().includes(item.name.split(' ')[0].toLowerCase()))?.category || 'Other';
      c[cat]=(c[cat]||0)+1;
    }));
    const total = Object.values(c).reduce((a,b)=>a+b,0);
    return Object.entries(c).map(([cat,count])=>({cat,count,pct:total?count/total:0})).sort((a,b)=>b.count-a.count);
  }, []);

  const stockTurnover = useMemo(() =>
    [...productsData].map(p=>({...p,invVal:p.price*p.stock})).sort((a,b)=>b.invVal-a.invVal),
  []);

  const scatterPoints = useMemo(() => {
    const d={};
    Object.values(orderItemsMap).forEach(items=>items.forEach(i=>{ d[i.name]=(d[i.name]||0)+1; }));
    return productsData.map(p=>({name:p.name, price:p.price, demand:d[p.name]||0}));
  }, []);

  const totalStatus = Object.values(statusCounts).reduce((a,b)=>a+b,0);
  const avgFreqAll  = purchaseFreq.length ? purchaseFreq.reduce((a,b)=>a+b.avgFreq,0)/purchaseFreq.length : 0;

  return (
    <Container>
      {/* Tabs + Period */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap" ref={tabContainerRef}>
          {['Overview','Customer','Sales','Products'].map(tab=>(
            <button key={tab}
              ref={tab === activeTab ? activeTabBtnRef : null}
              onClick={()=>setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium font-inter transition-colors
                ${activeTab===tab ? 'bg-primary-3 text-neutral' : 'bg-neutral border border-neutral-border text-neutral-teks hover:bg-neutral-bg'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['30 Hari','3 Bulan','All Time'].map(p=>(
            <FilterChip key={p} label={p} active={period===p} onClick={()=>setPeriod(p)}/>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'Overview' && (
        <>
          <PageSection cols={4} gap="sm">
            {[
              { label:'Avg CLV', value:fmtRp(avgCLV), iconBg:'bg-accent-blue-shadow', iconColor:'text-accent-blue',
                icon:<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
              { label:'Churn Risk', value:churnRiskCustomers.length+' customer', iconBg:'bg-accent-pink-shadow', iconColor:'text-secondary',
                icon:<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
              { label:'Conversion Rate', value:conversionRate.toFixed(1)+'%', iconBg:'bg-accent-green-shadow', iconColor:'text-accent-green',
                icon:<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
              { label:'Repeat Purchase', value:repeatRate.toFixed(1)+'%', iconBg:'bg-accent-yellow-shadow', iconColor:'text-accent-yellow',
                icon:<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> },
            ].map(c=><StatCard key={c.label} {...c}/>)}
          </PageSection>
          <PageSection cols={2} gap="md">
            <LineChart title="Revenue Trend"
              data={revenueTrend.data.length ? revenueTrend.data : [0]}
              xLabels={revenueTrend.labels.length ? revenueTrend.labels : ['-']}
              badge={revenueTrend.data.length ? fmtRp(revenueTrend.data[revenueTrend.data.length-1]) : 'Rp 0'}/>
            <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
              <p className="text-base font-semibold text-primary-2 font-inter mb-4">Order Status Funnel</p>
              <div className="space-y-4">
                {[{k:'Completed',c:'#16DBCC'},{k:'Pending',c:'#FFBB38'},{k:'Cancelled',c:'#FE5C73'}].map(({k,c})=>(
                  <HorizBar key={k} label={k} value={statusCounts[k]} total={totalStatus} color={c}/>
                ))}
              </div>
            </div>
          </PageSection>
        </>
      )}

      {/* ── CUSTOMER ── */}
      {activeTab === 'Customer' && (
        <>
          {/* CLV Ranking */}
          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <CardHeader title="CLV Ranking" subtitle="Customer Lifetime Value — all time"/>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-bg">
                    {['#','Customer','Loyalty','Order Completed','Total CLV'].map(h=>(
                      <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clvRanking.map((c,i)=>(
                    <TableRow key={c.id}>
                      <TableCell><span className="text-xs text-neutral-teks">{i+1}</span></TableCell>
                      <TableCell><span className="text-sm font-medium text-primary-2">{c.name}</span></TableCell>
                      <TableCell><LoyaltyBadge loyalty={c.loyalty}/></TableCell>
                      <TableCell><span className="text-sm text-neutral-teks">{c.orderCount}</span></TableCell>
                      <TableCell><span className="text-sm font-semibold text-primary-2">{fmtRp(c.clv)}</span></TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <PageSection cols={2} gap="md">
            {/* Churn Risk */}
            <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
              <CardHeader title="Churn Risk" subtitle="Tidak ada order 30 hari terakhir"/>
              {churnRiskCustomers.length === 0
                ? <p className="px-5 py-8 text-sm text-center text-neutral-teks font-inter">Tidak ada customer berisiko churn saat ini</p>
                : <div className="divide-y divide-neutral-border">
                    {churnRiskCustomers.map(c=>(
                      <div key={c.id} className="px-5 py-3.5 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary-2 font-inter truncate">{c.name}</p>
                          <p className="text-xs text-neutral-teks font-inter mt-0.5">
                            {c.lastOrderDate ? `Last order: ${fmtDate(c.lastOrderDate)} · ${c.daysSince} hari lalu` : 'Belum pernah order'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <LoyaltyBadge loyalty={c.loyalty}/>
                          <LabelBadge label="Churn Risk" bgClass="bg-accent-pink-shadow" textClass="text-secondary"/>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>

            {/* Cohort Retention */}
            <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
              <CardHeader title="Cohort Retention" subtitle="Persentase customer yang order kembali"/>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-bg">
                      {['Cohort','Ukuran','Retention Rate'].map(h=>(
                        <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((r,i)=>(
                      <TableRow key={i}>
                        <TableCell><span className="text-sm text-primary-2 font-inter">{r.cohort}</span></TableCell>
                        <TableCell><span className="text-sm text-neutral-teks">{r.size}</span></TableCell>
                        <TableCell><span className={`text-sm font-semibold ${r.rate>0?'text-accent-green':'text-neutral-teks'}`}>{r.rate.toFixed(1)}%</span></TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PageSection>

          <PageSection cols={2} gap="md">
            {/* Monthly Active Customers */}
            <LineChart title="Monthly Active Customers"
              data={monthlyActive.data.length ? monthlyActive.data : [0]}
              xLabels={monthlyActive.labels.length ? monthlyActive.labels : ['-']}
              color="#16DBCC"
              badge={monthlyActive.data.length ? monthlyActive.data[monthlyActive.data.length-1]+' customer' : '0 customer'}/>

            {/* Purchase Frequency */}
            <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
              <CardHeader title="Purchase Frequency"
                subtitle={purchaseFreq.length ? `Rata-rata: ${avgFreqAll.toFixed(0)} hari antar order` : 'Data tidak cukup'}/>
              {purchaseFreq.length === 0
                ? <p className="px-5 py-8 text-sm text-center text-neutral-teks font-inter">Data tidak cukup untuk menghitung frekuensi pembelian</p>
                : <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-neutral-bg">
                          {['Customer','Order','Avg Frekuensi'].map(h=>(
                            <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseFreq.slice(0,5).map((r,i)=>(
                          <TableRow key={i}>
                            <TableCell><span className="text-sm text-primary-2">{r.name}</span></TableCell>
                            <TableCell><span className="text-sm text-neutral-teks">{r.orderCount}</span></TableCell>
                            <TableCell><span className="text-sm font-semibold text-accent-blue">{r.avgFreq.toFixed(0)} hari</span></TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </div>
          </PageSection>
        </>
      )}

      {/* ── SALES ── */}
      {activeTab === 'Sales' && (
        <>
          <PageSection cols={4} gap="sm">
            <StatCard label="Conversion Rate" value={conversionRate.toFixed(1)+'%'}
              iconBg="bg-accent-green-shadow" iconColor="text-accent-green"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}/>
            <StatCard label="Total Completed" value={statusCounts.Completed+' order'}
              iconBg="bg-accent-blue-shadow" iconColor="text-accent-blue"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}/>
            <StatCard label="Pending" value={statusCounts.Pending+' order'}
              iconBg="bg-accent-yellow-shadow" iconColor="text-accent-yellow"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}/>
            <StatCard label="Cancelled" value={statusCounts.Cancelled+' order'}
              iconBg="bg-accent-pink-shadow" iconColor="text-secondary"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}/>
          </PageSection>

          <PageSection cols={2} gap="md">
            <LineChart title="Revenue Trend"
              data={revenueTrend.data.length ? revenueTrend.data : [0]}
              xLabels={revenueTrend.labels.length ? revenueTrend.labels : ['-']}
              badge={revenueTrend.data.length ? fmtRp(revenueTrend.data[revenueTrend.data.length-1]) : 'Rp 0'}/>
            <LineChart title="AOV Trend" color="#FFBB38"
              data={aovTrend.data.length ? aovTrend.data : [0]}
              xLabels={aovTrend.labels.length ? aovTrend.labels : ['-']}
              badge={aovTrend.data.length ? fmtRp(aovTrend.data[aovTrend.data.length-1]) : 'Rp 0'}
              badgeBg="bg-accent-yellow-shadow" badgeText="text-accent-yellow"/>
          </PageSection>

          <PageSection cols={2} gap="md">
            {/* Donut Revenue by Status */}
            <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
              <p className="text-base font-semibold text-primary-2 font-inter mb-4">Revenue by Status</p>
              <DonutChart data={revByStatus}/>
            </div>

            {/* Order breakdown table */}
            <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
              <CardHeader title="Order Breakdown" subtitle={`Total ${totalStatus} order dalam periode ini`}/>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-bg">
                      {['Status','Jumlah Order','Revenue','%'].map(h=>(
                        <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(statusCounts).map(([status,count])=>(
                      <TableRow key={status}>
                        <TableCell>
                          <span className={`text-sm font-medium font-inter
                            ${status==='Completed'?'text-accent-green':status==='Pending'?'text-accent-yellow':'text-secondary'}`}>
                            {status}
                          </span>
                        </TableCell>
                        <TableCell><span className="text-sm text-neutral-teks">{count}</span></TableCell>
                        <TableCell><span className="text-sm font-semibold text-primary-2">{fmtRp(revByStatus[status])}</span></TableCell>
                        <TableCell>
                          <span className="text-sm text-neutral-teks">
                            {totalStatus ? ((count/totalStatus)*100).toFixed(1) : '0.0'}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PageSection>
        </>
      )}

      {/* ── PRODUCTS ── */}
      {activeTab === 'Products' && (
        <>
          <PageSection cols={2} gap="md">
            {/* Top Products */}
            <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
              <CardHeader title="Top Performing Products" subtitle="Berdasarkan jumlah order"/>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-bg">
                      {['#','Produk','Jumlah Order'].map(h=>(
                        <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.length === 0
                      ? <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-neutral-teks font-inter">Tidak ada data</td></tr>
                      : topProducts.map((p,i)=>(
                        <TableRow key={i}>
                          <TableCell><span className="text-xs text-neutral-teks">{i+1}</span></TableCell>
                          <TableCell><span className="text-sm font-medium text-primary-2">{p.name}</span></TableCell>
                          <TableCell><span className="text-sm font-semibold text-accent-blue">{p.count}</span></TableCell>
                        </TableRow>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Performance */}
            <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
              <p className="text-base font-semibold text-primary-2 font-inter mb-4">Category Performance</p>
              <div className="space-y-4">
                {categoryPerf.map(({cat,count,pct})=>(
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-inter">
                      <span className="text-neutral-teks font-medium">{cat}</span>
                      <span className="font-semibold text-primary-2">{count} order <span className="text-neutral-teks font-normal">({(pct*100).toFixed(1)}%)</span></span>
                    </div>
                    <svg viewBox="0 0 300 10" className="w-full" style={{height:10}}>
                      <rect x={0} y={0} width={300} height={10} rx={5} fill="#F5F7FA"/>
                      <rect x={0} y={0} width={Math.max(pct*300, pct>0?4:0)} height={10} rx={5} fill="#2D60FF"/>
                    </svg>
                  </div>
                ))}
                {categoryPerf.length === 0 && <p className="text-sm text-neutral-teks text-center py-4 font-inter">Tidak ada data kategori</p>}
              </div>
            </div>
          </PageSection>

          {/* Stock Turnover */}
          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <CardHeader title="Stock Turnover" subtitle="Nilai inventory per produk (price × stock)"/>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-bg">
                    {['Produk','Kategori','Stok','Harga Satuan','Inventory Value'].map(h=>(
                      <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stockTurnover.map(p=>(
                    <TableRow key={p.id}>
                      <TableCell><span className="text-sm font-medium text-primary-2">{p.name}</span></TableCell>
                      <TableCell>
                        <LabelBadge label={p.category}
                          bgClass={p.category==='Dress'?'bg-accent-pink-shadow':p.category==='Top'?'bg-accent-green-shadow':p.category==='Bottom'?'bg-accent-blue-shadow':'bg-accent-yellow-shadow'}
                          textClass={p.category==='Dress'?'text-secondary':p.category==='Top'?'text-accent-green':p.category==='Bottom'?'text-accent-blue':'text-accent-yellow'}/>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${p.stock<=10?'text-secondary':'text-primary-2'}`}>{p.stock}</span>
                          {p.stock<=10 && <LabelBadge label="Low Stock" bgClass="bg-accent-pink-shadow" textClass="text-secondary"/>}
                        </div>
                      </TableCell>
                      <TableCell><span className="text-sm text-neutral-teks">{fmtRp(p.price)}</span></TableCell>
                      <TableCell><span className="text-sm font-semibold text-primary-2">{fmtRp(p.invVal)}</span></TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scatter Chart */}
          <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
            <p className="text-base font-semibold text-primary-2 font-inter mb-4">Price vs Demand</p>
            <ScatterChart points={scatterPoints}/>
          </div>
        </>
      )}
    </Container>
  );
}
