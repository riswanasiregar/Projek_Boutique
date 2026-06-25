import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut, getCurrentUser } from '../utils/auth';
import { supabase } from '../lib/supabase';

const F = { fontFamily: '"Inter", sans-serif' };

const C = {
  bg:         '#FFFFFF',
  border:     '#E6EFF5',
  text:       '#343C6A',
  muted:      '#B1B1B1',
  activeBg:   '#E7EDFF',
  activeText: '#2D60FF',
  hoverBg:    '#F5F7FA',
  activeLine: '#2D60FF',
};

const mainMenu = [
  {
    to: '/', label: 'Dashboard', end: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/orders', label: 'Orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: '/products', label: 'Products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    to: '/customers', label: 'Customers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const engagementMenu = [
  {
    to: '/support', label: 'Support',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    to: '/feedback', label: 'Feedback',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    to: '/broadcast', label: 'Broadcast',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    to: '/campaigns', label: 'Campaigns',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
  },
];

function NavItem({ item, onClose }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all relative"
      style={({ isActive }) =>
        isActive
          ? { background: C.activeBg, color: C.activeText, ...F }
          : { color: C.muted, ...F }
      }
      onMouseEnter={e => {
        if (!e.currentTarget.style.background.includes('E7EDFF'))
          e.currentTarget.style.background = C.hoverBg;
      }}
      onMouseLeave={e => {
        if (!e.currentTarget.style.background.includes('E7EDFF'))
          e.currentTarget.style.background = 'transparent';
      }}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
              style={{ background: C.activeLine }} />
          )}
          <span className="flex-shrink-0" style={{ color: isActive ? C.activeText : C.muted }}>
            {item.icon}
          </span>
          <span className="font-medium flex-1">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

/** Helper: ambil inisial dari nama (max 2 huruf) */
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch profil user saat mount + subscribe auth changes
  useEffect(() => {
    getCurrentUser().then(setUser);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Session berubah (refresh token / login dari tab lain) → re-fetch profil
        getCurrentUser().then(setUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <aside className="w-64 h-full flex flex-col"
      style={{ background: C.bg, borderRight: `1px solid ${C.border}`, ...F }}>

      {/* Logo + mobile close button */}
      <div className="px-6 py-6 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div>
          <img src="/img/logoboutique.svg" alt="Boutique" className="object-contain" style={{ width: 220, height: 74 }} />
        </div>
        {/* Tombol close — hanya tampil di mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: C.muted }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F5F7FA'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1">
        {mainMenu.map(item => <NavItem key={item.to} item={item} onClose={onClose} />)}
        <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider font-inter"
          style={{ color: C.muted }}>CRM Engagement</p>
        {engagementMenu.map(item => <NavItem key={item.to} item={item} onClose={onClose} />)}
        <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider font-inter"
          style={{ color: C.muted }}>CRM Analytical</p>
        <NavItem item={{
          to: '/analytics', label: 'Analytics',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        }} onClose={onClose}/>
        <NavItem item={{
          to: '/strategic', label: 'Strategic',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        }} onClose={onClose}/>
        <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider font-inter"
          style={{ color: C.muted }}>Admin</p>
        <NavItem item={{
          to: '/users', label: 'Users',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        }} onClose={onClose}/>
      </nav>

      {/* User info + logout — data dari Supabase */}
      <div className="px-4 py-5" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3 mb-3">
          {user?.avatar_url ? (
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
              style={{ border: '2px solid #E6EFF5' }}>
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
              style={{ background: '#E7EDFF', color: '#2D60FF' }}
            >
              {getInitials(user?.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: C.text }}>
              {user?.name ?? '—'}
            </p>
            <p className="text-xs truncate" style={{ color: C.muted }}>
              {user?.email ?? '—'}
            </p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: C.muted, ...F }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEE8E8'; e.currentTarget.style.color = '#FE5C73'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted; }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
