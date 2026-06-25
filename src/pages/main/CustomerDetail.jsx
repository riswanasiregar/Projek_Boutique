import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

import { LoyaltyBadge, StatusBadge } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import Avatar from '../../components/Avatar';
import BackButton from '../../components/BackButton';
import EmptyState from '../../components/EmptyState';
import { Button } from '../../components/ui/button';
import Container, { PageSection } from '../../components/Container';
import InfoRow from '../../components/InfoRow';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer]     = useState(null);
  const [customerOrders, setOrders] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch customer
      const { data: cust } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (cust) {
        setCustomer(cust);
        // Fetch orders for this customer
        const { data: ords } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', cust.id)
          .order('order_date', { ascending: false });
        if (ords) setOrders(ords);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return (
    <Container>
      <p className="text-center py-20 text-neutral-teks font-inter">Memuat data...</p>
    </Container>
  );

  if (!customer) return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      }
      title="Customer tidak ditemukan"
      description={`ID ${id} tidak ada dalam data.`}
      action={
        <Button variant="default" onClick={() => navigate('/customers')} className="rounded-full">
          ← Kembali ke Customers
        </Button>
      }
    />
  );

  const totalSpend = customerOrders
    .filter(o => o.status === 'Completed')
    .reduce((s, o) => s + o.total_price, 0);

  const loyaltyIconClass = {
    Gold:   'bg-accent-yellow-shadow text-accent-yellow',
    Silver: 'bg-accent-blue-shadow text-accent-blue',
    Bronze: 'bg-accent-pink-shadow text-secondary',
  }[customer.loyalty] || 'bg-accent-blue-shadow text-accent-blue';

  const statCards = [
    { label: 'Total Orders', value: customerOrders.length,                                      iconBg: 'bg-accent-blue-shadow',   iconColor: 'text-accent-blue',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { label: 'Completed',    value: customerOrders.filter(o => o.status === 'Completed').length, iconBg: 'bg-accent-green-shadow',  iconColor: 'text-accent-green',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
    { label: 'Pending',      value: customerOrders.filter(o => o.status === 'Pending').length,   iconBg: 'bg-accent-yellow-shadow', iconColor: 'text-accent-yellow',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Cancelled',    value: customerOrders.filter(o => o.status === 'Cancelled').length, iconBg: 'bg-accent-pink-shadow',   iconColor: 'text-accent-pink',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> },
  ];

  const contactRows = [
    { label: 'Email', value: customer.email },
    { label: 'Phone', value: customer.phone },
    { label: 'ID',    value: customer.id, mono: true },
  ];

  return (
    <Container>

      {/* Back button */}
      <BackButton
        onClick={() => navigate('/customers')}
        title="Customer Detail"
        breadcrumb={`Dashboard / Customers / ${customer.name}`}
      />

      {/* Stat cards */}
      <PageSection cols={4} gap="sm">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </PageSection>

      <PageSection cols={3} gap="md">

        {/* ── Kiri: profil ── */}
        <div className="space-y-4">

          {/* Profile card */}
          <div className="rounded-2xl p-6 text-center bg-neutral border border-neutral-border">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center
              text-3xl font-bold mx-auto mb-3 ${loyaltyIconClass}`}>
              {customer.name[0]}
            </div>
            <p className="text-lg font-bold text-primary-2 mb-0.5 font-inter">{customer.name}</p>
            <p className="text-xs text-neutral-teks mb-3 font-inter">{customer.id}</p>
            <div className="flex justify-center mb-4">
              <LoyaltyBadge loyalty={customer.loyalty} />
            </div>
            <Avatar
              name={customer.name}
              size="lg"
              bgClass={loyaltyIconClass.split(' ')[0]}
              textClass={loyaltyIconClass.split(' ')[1]}
              className="mx-auto mb-4 hidden"
            />
          </div>

          {/* Contact info */}
          <InfoRow title="Informasi Kontak" rows={contactRows} />

          {/* Total belanja card */}
          <div className="rounded-2xl p-5 bg-primary-3">
            <p className="text-xs font-medium mb-1 text-neutral/70 font-inter">Total Belanja</p>
            <p className="text-2xl font-bold text-neutral font-inter">
              Rp {totalSpend.toLocaleString('id-ID')}
            </p>
            <p className="text-xs mt-1 text-neutral/60 font-inter">
              dari {customerOrders.filter(o => o.status === 'Completed').length} order selesai
            </p>
          </div>
        </div>

        {/* ── Kanan: riwayat order ── */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
            <CardHeader
              title="Riwayat Order"
              subtitle={`${customerOrders.length} transaksi`}
              action={
                <Link to="/orders">
                  <Button variant="ghost" size="sm">Lihat semua →</Button>
                </Link>
              }
            />

            {customerOrders.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-neutral-teks font-inter">Belum ada order</p>
              </div>
            ) : (
              <>
                {/* Header kolom */}
                <div className="grid grid-cols-4 px-5 py-3 bg-neutral-bg border-b border-neutral-border">
                  {['Order ID', 'Tanggal', 'Status', 'Total'].map((h, i) => (
                    <p key={h} className={`text-xs font-semibold text-neutral-teks font-inter
                      ${i === 3 ? 'text-right' : ''}`}>{h}</p>
                  ))}
                </div>
                {/* Baris order */}
                {customerOrders.map((order, i) => (
                  <div key={order.id}
                    className={`grid grid-cols-4 px-5 py-4 items-center
                      hover:bg-neutral-bg transition-colors
                      ${i > 0 ? 'border-t border-neutral-border' : ''}`}>
                    <Link to={`/orders/${order.id}`}
                      className="text-xs font-semibold text-primary-3 hover:underline font-mono">
                      {order.id}
                    </Link>
                    <p className="text-xs text-neutral-teks font-inter">{order.order_date}</p>
                    <StatusBadge status={order.status} />
                    <p className="text-xs font-semibold text-right text-primary-2 font-inter">
                      Rp {order.total_price.toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
                {/* Footer total */}
                <div className="flex items-center justify-between px-5 py-3
                  border-t-2 border-neutral-border bg-neutral-bg">
                  <p className="text-xs font-semibold text-neutral-teks font-inter">
                    Total dari {customerOrders.filter(o => o.status === 'Completed').length} order selesai
                  </p>
                  <p className="text-sm font-bold text-primary-3 font-inter">
                    Rp {totalSpend.toLocaleString('id-ID')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

      </PageSection>
    </Container>
  );
}
