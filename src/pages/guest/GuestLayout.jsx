import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Categories',   href: '#categories' },
  { label: 'Products',     href: '#products' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Membership',   href: '#membership' },
  { label: 'Rewards',      href: '#rewards' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Contact',      href: '#contact' },
];

export default function GuestLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  function scrollTo(href) {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFFFF' }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E6EFF5' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/guest" className="flex items-center">
            <img src="/img/logoboutique.svg" alt="Ris.Style" className="object-contain" style={{ width: 250, height: 84 }} />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-sm font-medium transition-colors hover:text-primary-3"
                style={{ color: '#718EBF', fontFamily: '"Inter", sans-serif' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold rounded-full transition-colors"
              style={{ color: '#2D60FF', border: '1.5px solid #2D60FF', fontFamily: '"Inter", sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E7EDFF'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold rounded-full text-white transition-colors"
              style={{ background: '#2D60FF', fontFamily: '"Inter", sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              Register
            </Link>
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
                style={{ color: '#718EBF', fontFamily: '"Inter", sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F5F7FA'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {item.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 text-center px-5 py-2.5 text-sm font-semibold rounded-full" style={{ color: '#2D60FF', border: '1.5px solid #2D60FF' }}>
                Login
              </Link>
              <Link to="/register" className="flex-1 text-center px-5 py-2.5 text-sm font-semibold rounded-full text-white" style={{ background: '#2D60FF' }}>
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Main content ── */}
      <main className="flex-1" style={{ paddingTop: '72px' }}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#343C6A' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              &copy; {new Date().getFullYear()} Ris.Style. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
