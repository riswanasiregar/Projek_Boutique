import { useParams, useNavigate, Link } from 'react-router-dom';
import ordersData from '../../data/orders.json';
import customersData from '../../data/customers.json';

import { StatusBadge, LoyaltyBadge } from '../../components/Badge';
import Avatar from '../../components/Avatar';
import BackButton from '../../components/BackButton';
import Timeline from '../../components/Timeline';
import InfoRow from '../../components/InfoRow';
import EmptyState from '../../components/EmptyState';
import { CardHeader } from '../../components/Card';
import { Button } from '../../components/ui/button';
import Container, { PageSection } from '../../components/Container';

const orderItemsMap = {
  'ORD-001': [{ name: 'Floral Midi Dress', qty: 1, price: 89000 }, { name: 'Pastel Cardigan', qty: 1, price: 61000 }],
  'ORD-002': [{ name: 'Linen Blouse', qty: 1, price: 75000 }],
  'ORD-003': [{ name: 'Summer Shorts', qty: 2, price: 20000 }],
  'ORD-004': [{ name: 'Evening Gown', qty: 1, price: 150000 }, { name: 'Silk Scarf', qty: 1, price: 50000 }],
};
function getItems(id) {
  return orderItemsMap[id] || [
    { name: 'Boutique Item A', qty: 1, price: 85000 },
    { name: 'Boutique Item B', qty: 1, price: 65000 },
  ];
}

const timelineMap = {
  Completed: [
    { label: 'Order Diterima', done: true,  time: 'Hari ke-1' },
    { label: 'Diproses',       done: true,  time: 'Hari ke-1' },
    { label: 'Dikirim',        done: true,  time: 'Hari ke-2' },
    { label: 'Selesai',        done: true,  time: 'Hari ke-3' },
  ],
  Pending: [
    { label: 'Order Diterima', done: true,  time: 'Hari ke-1' },
    { label: 'Diproses',       done: true,  time: 'Hari ke-1' },
    { label: 'Dikirim',        done: false, time: 'Menunggu'  },
    { label: 'Selesai',        done: false, time: '-'         },
  ],
  Cancelled: [
    { label: 'Order Diterima', done: true, time: 'Hari ke-1'              },
    { label: 'Dibatalkan',     done: true, time: 'Hari ke-1', cancelled: true },
  ],
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = ordersData.find(o => o.id === id);

  if (!order) return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      }
      title="Order tidak ditemukan"
      description={`ID ${id} tidak ada dalam data.`}
      action={
        <Button variant="default" onClick={() => navigate('/orders')} className="rounded-full">
          ← Kembali ke Orders
        </Button>
      }
    />
  );

  const customer = customersData.find(c => c.name.toLowerCase() === order.customerName.toLowerCase());
  const items    = getItems(order.id);
  const timeline = timelineMap[order.status] || timelineMap.Pending;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const orderInfoRows = [
    { label: 'Order ID',   value: order.id,          mono: true },
    { label: 'Tanggal',    value: order.orderDate               },
    { label: 'Customer',   value: order.customerName            },
    { label: 'Metode',     value: 'Transfer Bank'               },
    { label: 'Pengiriman', value: 'JNE Regular'                 },
  ];

  return (
    <Container>

      {/* Back button */}
      <BackButton
        onClick={() => navigate('/orders')}
        title="Order Detail"
        breadcrumb={`Dashboard / Orders / ${order.id}`}
      />

      <PageSection cols={3} gap="md">

        {/* ── Kiri ── */}
        <div className="space-y-4">

          {/* Info order */}
          <InfoRow
            title="Informasi Order"
            rows={orderInfoRows}
            action={<StatusBadge status={order.status} />}
          />

          {/* Timeline */}
          <Timeline steps={timeline} title="Status Timeline" />

          {/* Customer info */}
          {customer && (
            <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
              <p className="text-sm font-semibold text-primary-2 mb-3 font-inter">Customer</p>
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={customer.name} size="md"
                  bgClass="bg-accent-green-shadow" textClass="text-accent-green" />
                <div>
                  <p className="text-sm font-semibold text-primary-2 font-inter">{customer.name}</p>
                  <p className="text-xs text-neutral-teks font-inter">{customer.id}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <LoyaltyBadge loyalty={customer.loyalty} />
                <Link to={`/customers/${customer.id}`}>
                  <Button variant="ghost" size="sm">Lihat profil →</Button>
                </Link>
              </div>
              <p className="text-xs text-neutral-teks font-inter">{customer.email}</p>
              <p className="text-xs text-neutral-teks font-inter mt-0.5">{customer.phone}</p>
            </div>
          )}
        </div>

        {/* ── Kanan ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Item pesanan */}
          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <CardHeader
              title="Item Pesanan"
              subtitle={`${items.length} produk`}
            />
            {/* Header kolom */}
            <div className="grid grid-cols-4 px-5 py-3 bg-neutral-bg border-b border-neutral-border">
              {['Produk', 'Qty', 'Harga', 'Subtotal'].map((h, i) => (
                <p key={h} className={`text-xs font-semibold text-neutral-teks font-inter
                  ${i > 0 ? 'text-right' : ''}`}>{h}</p>
              ))}
            </div>
            {/* Baris item */}
            {items.map((item, i) => (
              <div key={i}
                className={`grid grid-cols-4 px-5 py-4 items-center
                  ${i > 0 ? 'border-t border-neutral-border' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                    bg-accent-blue-shadow text-primary-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-primary-2 font-inter">{item.name}</p>
                </div>
                <p className="text-sm text-right text-neutral-teks font-inter">{item.qty}</p>
                <p className="text-sm text-right text-neutral-teks font-inter">
                  Rp {item.price.toLocaleString('id-ID')}
                </p>
                <p className="text-sm font-semibold text-right text-primary-2 font-inter">
                  Rp {(item.price * item.qty).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
            {/* Ringkasan harga */}
            <div className="px-5 py-4 space-y-2 border-t border-neutral-border bg-neutral-bg">
              {[
                { label: 'Subtotal',     value: subtotal },
                { label: 'Ongkos Kirim', value: 15000   },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-xs text-neutral-teks font-inter">{row.label}</span>
                  <span className="text-xs font-semibold text-primary-2 font-inter">
                    Rp {row.value.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-border">
                <span className="text-sm font-semibold text-primary-2 font-inter">Total</span>
                <span className="text-base font-bold text-primary-3 font-inter">
                  Rp {order.totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Alamat pengiriman */}
          <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
            <p className="text-sm font-semibold text-primary-2 mb-3 font-inter">Alamat Pengiriman</p>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                bg-accent-pink-shadow text-accent-pink">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-2 font-inter">{order.customerName}</p>
                <p className="text-xs mt-1 leading-relaxed text-neutral-teks font-inter">
                  {order.address || `Jl. Boutique No. ${order.id.replace('ORD-', '')}, Jakarta Pusat 10310`}
                </p>
              </div>
            </div>
          </div>

        </div>
      </PageSection>
    </Container>
  );
}
