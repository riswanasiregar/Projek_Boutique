import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Products',     href: '#products' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Membership',   href: '#membership' },
  { label: 'FAQ',          href: '#faq' },
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
            <img src="/img/logoboutique.svg" alt="Boutique" className="object-contain" style={{ width: 250, height: 84 }} />
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
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Brand */}
            <div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Temukan koleksi fashion terbaik dengan kualitas premium. Gaya elegan untuk setiap kesempatan.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_ITEMS.map(item => (
                  <li key={item.href}>
                    <button
                      onClick={() => scrollTo(item.href)}
                      className="text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@boutique.com
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +62 812-3456-7890
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Jl. Fashion Boulevard No. 88, Jakarta
                </li>
              </ul>
            </div>
          </div>

          {/* Divider + copyright */}
          <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              &copy; {new Date().getFullYear()} Boutique. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* Social icons */}
              {['instagram', 'facebook', 'twitter'].map(social => (
                <a key={social} href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2D60FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />}
                    {social === 'facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />}
                    {social === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
