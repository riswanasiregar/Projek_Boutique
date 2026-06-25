import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

import { LabelBadge } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import BackButton from '../../components/BackButton';
import InfoRow from '../../components/InfoRow';
import EmptyState from '../../components/EmptyState';
import { Button } from '../../components/ui/button';
import Container, { PageSection } from '../../components/Container';

const CATEGORY_BADGE = {
  Dress:       { bgClass: 'bg-accent-pink-shadow',   textClass: 'text-secondary'     },
  Top:         { bgClass: 'bg-accent-green-shadow',  textClass: 'text-accent-green'  },
  Bottom:      { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-accent-blue'   },
  Outerwear:   { bgClass: 'bg-accent-yellow-shadow', textClass: 'text-accent-yellow' },
  Accessories: { bgClass: 'bg-accent-blue-shadow',   textClass: 'text-primary-3'     },
};

// Simulasi riwayat stok per produk
const stockHistoryMap = {
  'PRD-001': [
    { date: '2026-03-01', type: 'Restock',  qty: 20, note: 'Restock bulanan' },
    { date: '2026-02-15', type: 'Sold',     qty: 8,  note: 'Penjualan batch' },
    { date: '2026-01-20', type: 'Restock',  qty: 15, note: 'Stok awal' },
  ],
  'PRD-006': [
    { date: '2026-03-05', type: 'Sold',     qty: 4,  note: 'Penjualan promosi' },
    { date: '2026-02-01', type: 'Restock',  qty: 12, note: 'Restock' },
  ],
  'PRD-010': [
    { date: '2026-02-20', type: 'Sold',     qty: 7,  note: 'Penjualan musim hujan' },
    { date: '2026-01-10', type: 'Restock',  qty: 12, note: 'Stok awal' },
  ],
};

function getStockHistory(id) {
  return stockHistoryMap[id] || [
    { date: '2026-03-01', type: 'Restock', qty: 20, note: 'Restock bulanan' },
    { date: '2026-02-01', type: 'Sold',    qty: 10, note: 'Penjualan batch'  },
    { date: '2026-01-01', type: 'Restock', qty: 15, note: 'Stok awal'        },
  ];
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (data) setProduct(data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return (
    <Container>
      <p className="text-center py-20 text-neutral-teks font-inter">Memuat data...</p>
    </Container>
  );

  if (!product) return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      }
      title="Produk tidak ditemukan"
      description={`ID ${id} tidak ada dalam data.`}
      action={
        <Button variant="default" onClick={() => navigate('/products')} className="rounded-full">
          ← Kembali ke Products
        </Button>
      }
    />
  );

  const catBadge  = CATEGORY_BADGE[product.category] || { bgClass: 'bg-accent-blue-shadow', textClass: 'text-primary-3' };
  const lowStock  = product.stock <= 10;
  const totalValue = product.price * product.stock;
  const history   = getStockHistory(product.id);

  const infoRows = [
    { label: 'Product ID', value: product.id,       mono: true },
    { label: 'Name',       value: product.name                  },
    { label: 'Category',   value: product.category              },
    { label: 'Price',      value: `Rp ${product.price.toLocaleString('id-ID')}` },
    { label: 'Stock',      value: `${product.stock} unit`       },
  ];

  const statCards = [
    {
      label: 'Harga Satuan', value: `Rp ${(product.price / 1000).toFixed(0)}K`,
      iconBg: 'bg-accent-blue-shadow', iconColor: 'text-accent-blue',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: 'Stok',         value: `${product.stock} unit`,
      iconBg: lowStock ? 'bg-accent-pink-shadow' : 'bg-accent-green-shadow',
      iconColor: lowStock ? 'text-secondary' : 'text-accent-green',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    },
    {
      label: 'Nilai Inventori', value: `Rp ${(totalValue / 1e6).toFixed(1)}M`,
      iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    },
    {
      label: 'Status',       value: lowStock ? 'Low Stock' : 'In Stock',
      iconBg: lowStock ? 'bg-accent-pink-shadow' : 'bg-accent-green-shadow',
      iconColor: lowStock ? 'text-secondary' : 'text-accent-green',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ];

  return (
    <Container>

      {/* Back button */}
      <BackButton
        onClick={() => navigate('/products')}
        title="Product Detail"
        breadcrumb={`Dashboard / Products / ${product.id}`}
      />

      {/* Stat cards */}
      <PageSection cols={4} gap="sm">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </PageSection>

      <PageSection cols={3} gap="md">

        {/* ── Kiri ── */}
        <div className="space-y-4">

          {/* Info produk */}
          <InfoRow
            title="Informasi Produk"
            rows={infoRows}
            action={<LabelBadge label={product.category} bgClass={catBadge.bgClass} textClass={catBadge.textClass} />}
          />

          {/* Status stok card */}
          <div className={`rounded-2xl p-5 ${lowStock ? 'bg-accent-pink-shadow' : 'bg-accent-green-shadow'} border border-neutral-border`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                ${lowStock ? 'bg-neutral text-secondary' : 'bg-neutral text-accent-green'}`}>
                {lowStock ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold font-inter ${lowStock ? 'text-secondary' : 'text-accent-green'}`}>
                  {lowStock ? 'Low Stock' : 'Stok Tersedia'}
                </p>
                <p className="text-xs text-neutral-teks font-inter">
                  {lowStock ? 'Segera lakukan restock' : 'Stok dalam kondisi baik'}
                </p>
              </div>
            </div>
            <p className={`text-3xl font-bold font-inter ${lowStock ? 'text-secondary' : 'text-accent-green'}`}>
              {product.stock} <span className="text-sm font-medium text-neutral-teks">unit</span>
            </p>
          </div>
        </div>

        {/* ── Kanan ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Detail produk lengkap */}
          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <CardHeader
              title="Detail Produk"
              subtitle={product.id}
              action={
                <LabelBadge
                  label={lowStock ? 'Low Stock' : 'In Stock'}
                  bgClass={lowStock ? 'bg-accent-pink-shadow' : 'bg-accent-green-shadow'}
                  textClass={lowStock ? 'text-secondary' : 'text-accent-green'}
                />
              }
            />

            {/* Produk info grid */}
            <div className="p-5 grid grid-cols-2 gap-4">
              {[
                { label: 'Nama Produk',     value: product.name              },
                { label: 'Kategori',        value: product.category          },
                { label: 'Harga Satuan',    value: `Rp ${product.price.toLocaleString('id-ID')}` },
                { label: 'Stok Tersisa',    value: `${product.stock} unit`   },
                { label: 'Nilai Inventori', value: `Rp ${totalValue.toLocaleString('id-ID')}` },
                { label: 'Product ID',      value: product.id, mono: true    },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-4 bg-neutral-bg">
                  <p className="text-xs text-neutral-teks font-inter mb-1">{item.label}</p>
                  <p className={`text-sm font-semibold text-primary-2 ${item.mono ? 'font-mono' : 'font-inter'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Riwayat stok */}
          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <CardHeader
              title="Riwayat Stok"
              subtitle={`${history.length} entri`}
            />

            {/* Header kolom */}
            <div className="grid grid-cols-4 px-5 py-3 bg-neutral-bg border-b border-neutral-border">
              {['Tanggal', 'Tipe', 'Qty', 'Keterangan'].map((h, i) => (
                <p key={h} className={`text-xs font-semibold text-neutral-teks font-inter ${i === 2 ? 'text-right' : ''}`}>
                  {h}
                </p>
              ))}
            </div>

            {history.map((entry, i) => (
              <div key={i}
                className={`grid grid-cols-4 px-5 py-4 items-center hover:bg-neutral-bg transition-colors
                  ${i > 0 ? 'border-t border-neutral-border' : ''}`}>
                <p className="text-xs text-neutral-teks font-inter">{entry.date}</p>
                <div>
                  <LabelBadge
                    label={entry.type}
                    bgClass={entry.type === 'Restock' ? 'bg-accent-green-shadow' : 'bg-accent-blue-shadow'}
                    textClass={entry.type === 'Restock' ? 'text-accent-green' : 'text-accent-blue'}
                  />
                </div>
                <p className={`text-sm font-bold text-right font-inter
                  ${entry.type === 'Restock' ? 'text-accent-green' : 'text-accent-blue'}`}>
                  {entry.type === 'Restock' ? '+' : '-'}{entry.qty}
                </p>
                <p className="text-xs text-neutral-teks font-inter">{entry.note}</p>
              </div>
            ))}
          </div>

        </div>
      </PageSection>
    </Container>
  );
}
