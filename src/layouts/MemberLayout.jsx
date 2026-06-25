import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, signOut } from '../utils/auth';
import Loading from '../components/Loading';

const NAV_ITEMS = [
  { label: 'Beranda',      href: '#home' },
  { label: 'Membership',   href: '#membership' },
  { label: 'Poin Saya',    href: '#points' },
  { label: 'Reward',       href: '#rewards' },
];

export default function MemberLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(undefined); // undefined = loading
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser().then(setUser);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) getCurrentUser().then(setUser);
      else setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Masih loading
  if (user === undefined) return <Loading />;

  // Belum login → redirect ke login
  if (!user) return <Navigate to="/login" replace />;

  // Bukan member → redirect ke admin dashboard
  if (user.role !== 'member') return <Navigate to="/" replace />;

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  function scrollTo(href) {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F7FA' }}>

      {/* ── Top Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E6EFF5' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/member" className="flex items-center">
            <img src="/img/logoboutique.svg" alt="Boutique" className="object-contain" style={{ width: 110, height: 45 }} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map(item => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-sm font-medium transition-colors"
                style={{ color: '#718EBF', fontFamily: '"Inter", sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#2D60FF'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#718EBF'; }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop user section */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/guest"
              className="text-xs font-medium transition-colors"
              style={{ color: '#718EBF' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#2D60FF'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#718EBF'; }}>
              ← Guest Page
            </Link>
            <div className="w-px h-5" style={{ background: '#E6EFF5' }} />
            <div className="flex items-center gap-2">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" style={{ border: '2px solid #E6EFF5' }} />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: '#E7EDFF', color: '#2D60FF' }}>
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <span className="text-sm font-semibold" style={{ color: '#343C6A' }}>
                {user?.name || '...'}
              </span>
            </div>
            <button onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold rounded-full transition-all"
              style={{ color: '#718EBF', border: '1px solid #E6EFF5' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FEE8E8'; e.currentTarget.style.color = '#FE5C73'; e.currentTarget.style.borderColor = '#FE5C73'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#718EBF'; e.currentTarget.style.borderColor = '#E6EFF5'; }}>
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ background: '#F5F7FA' }}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <svg className="w-5 h-5" fill="none" stroke="#718EBF" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-2" style={{ borderTop: '1px solid #E6EFF5' }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="block w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-colors"
                style={{ color: '#718EBF' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F5F7FA'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2" style={{ borderTop: '1px solid #E6EFF5' }}>
              <Link to="/guest" className="text-sm font-medium px-4 py-2 rounded-xl" style={{ color: '#718EBF' }}>← Guest Page</Link>
              <button onClick={handleLogout}
                className="text-left px-4 py-2 text-sm font-semibold rounded-xl"
                style={{ color: '#FE5C73', background: '#FEE8E8' }}>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Main content ── */}
      <main className="flex-1" style={{ paddingTop: '64px' }}>
        <Outlet context={{ user }} />
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 text-center" style={{ background: '#343C6A' }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          &copy; {new Date().getFullYear()} Boutique Member. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
