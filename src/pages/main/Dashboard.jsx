import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

import { StatCard, CardHeader } from '../../components/Card';
import { StatusBadge, LoyaltyBadge } from '../../components/Badge';
import Avatar from '../../components/Avatar';
import LineChart from '../../components/LineChart';
import Container, { PageSection } from '../../components/Container';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Dashboard() {
  const { searchQuery = '' } = useOutletContext?.() || {};
  const [orders, setOrders]       = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: ords } = await supabase
        .from('orders')
        .select('*, customers(name)')
        .order('order_date', { ascending: false });
      if (ords) setOrders(ords);

      const { data: custs } = await supabase
        .from('customers')
        .select('*')
        .order('id', { ascending: true });
      if (custs) setCustomers(custs);
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalOrders  = orders.length;
  const completed    = orders.filter(o => o.status === 'Completed').length;
  const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.total_price, 0);
  const totalCust    = customers.length;

  const recentOrders = orders.slice(0, 5).filter(o => {
    const q = searchQuery.toLowerCase();
    const custName = o.customers?.name || '';
    return !q || custName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
  });

  const statCards = [
    {
      label: 'Total Orders', value: totalOrders, sub: `${completed} completed`,
      iconBg: 'bg-accent-green-shadow', iconColor: 'text-accent-green',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    },
    {
      label: 'Total Customers', value: totalCust, sub: `${customers.filter(c => c.loyalty === 'Gold').length} gold members`,
      iconBg: 'bg-accent-pink-shadow', iconColor: 'text-accent-pink',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: 'Total Revenue', value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`, sub: 'from completed orders',
      iconBg: 'bg-accent-blue-shadow', iconColor: 'text-accent-blue',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ];

  const orderChartData   = [8, 12, 7, 15, 10, 18, 14, 20, 16, 22, 18, completed];
  const revenueChartData = [320, 480, 290, 610, 520, 740, 680, 800, 720, 900, 850, Math.round(totalRevenue / 50000)];

  return (
    <Container className="bg-neutral-bg min-h-full">

      {/* Stat Cards */}
      <PageSection cols={3} gap="md" className="grid-cols-1 sm:grid-cols-3">
        {statCards.map(card => <StatCard key={card.label} {...card} />)}
      </PageSection>

      {/* Charts */}
      <PageSection cols={2} gap="md">
        <LineChart
          data={orderChartData}
          color="#FEAA09"
          height={120}
          title="Yearly Total Orders"
          badge="2026"
          badgeBg="bg-accent-blue-shadow"
          badgeText="text-primary-3"
          yLabels={['20', '15', '10', '5', '0']}
          xLabels={MONTHS}
        />
        <LineChart
          data={revenueChartData}
          color="#16DBCC"
          height={120}
          title="Monthly Revenue"
          badge="2026"
          badgeBg="bg-accent-green-shadow"
          badgeText="text-accent-green"
          yLabels={['900K', '600K', '300K', '100K', '0']}
          xLabels={MONTHS}
        />
      </PageSection>

      {/* Tables */}
      <PageSection cols={2} gap="md">

        {/* Recent Orders */}
        <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
          <CardHeader
            title="Recent Orders"
            action={
              <Link to="/orders" className="text-xs font-semibold text-primary-3 hover:underline font-inter">
                View All
              </Link>
            }
          />
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['Order ID', 'Customer', 'Date', 'Status', 'Total'].map((h, i) => (
                  <th key={h}
                    className={`px-4 py-3 text-xs font-semibold text-neutral-teks font-inter
                      ${i === 4 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}
                  className="border-t border-neutral-border hover:bg-neutral-bg transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/orders/${order.id}`}
                      className="text-xs font-mono text-primary-3 hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={order.customers?.name || '-'} size="sm"
                        bgClass="bg-accent-blue-shadow" textClass="text-primary-3" />
                      <span className="text-xs font-medium text-primary-2 font-inter">
                        {order.customers?.name || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-teks font-inter">{order.order_date}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-primary-2 font-inter">
                    Rp {order.total_price.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Customers */}
        <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
          <CardHeader
            title="Top Customers"
            action={
              <Link to="/customers" className="text-xs font-semibold text-primary-3 hover:underline font-inter">
                View All
              </Link>
            }
          />
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['No', 'Name', 'Email', 'Loyalty'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 5).map((c, i) => (
                <tr key={c.id}
                  className="border-t border-neutral-border hover:bg-neutral-bg transition-colors">
                  <td className="px-4 py-3 text-xs font-medium text-neutral-teks font-inter">
                    {String(i + 1).padStart(2, '0')}.
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/customers/${c.id}`} className="flex items-center gap-2 hover:underline">
                      <Avatar name={c.name} size="sm"
                        bgClass="bg-accent-green-shadow" textClass="text-accent-green" />
                      <span className="text-xs font-medium text-primary-2 font-inter">{c.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-teks font-inter">{c.email}</td>
                  <td className="px-4 py-3"><LoyaltyBadge loyalty={c.loyalty} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </PageSection>
    </Container>
  );
}
