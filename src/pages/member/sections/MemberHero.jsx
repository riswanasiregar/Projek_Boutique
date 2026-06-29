export default function MemberHero({ user, tier, points, orderCount, tierColor }) {
  return (
    <section id="home" className="relative overflow-hidden" style={{ minHeight: '380px', background: 'linear-gradient(135deg, #123288 0%, #2D60FF 100%)' }}>
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: '#fff' }} />
      <div className="absolute bottom-0 -left-16 w-60 h-60 rounded-full opacity-10" style={{ background: '#fff' }} />
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: '380px' }}>
        <span className="inline-block px-5 py-2 rounded-full text-sm font-semibold mb-4"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
          Selamat Datang, {user?.name || 'Member'}! 👋
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Member Dashboard</h1>
        <div className="grid grid-cols-3 gap-5 max-w-md">
          <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <p className="text-2xl font-bold text-white" style={{ color: tierColor === '#CD7F32' ? '#FFBB38' : tierColor }}>{tier}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Tier Saat Ini</p>
          </div>
          <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <p className="text-2xl font-bold text-white">{points}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Poin Saya</p>
          </div>
          <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <p className="text-2xl font-bold text-white">{orderCount}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Transaksi</p>
          </div>
        </div>
      </div>
    </section>
  );
}
