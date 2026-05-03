import { NavLink, useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';

const mainMenu = [
  { to: '/', label: 'Dashboard', end: true,
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { to: '/collections', label: 'Collections',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { to: '/products', label: 'Products',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
  { to: '/inventory', label: 'Inventory',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { to: '/orders', label: 'Orders',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
  { to: '/customers', label: 'Customers',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { to: '/suppliers', label: 'Suppliers',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
];

const businessMenu = [
  { to: '/analytics', label: 'Analytics',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { to: '/promotions', label: 'Promotions', badge: 'NEW',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
  { to: '/reports', label: 'Reports',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { to: '/settings', label: 'Settings',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

const errorItems = [
  { to: '/error-400', label: 'Error 400' },
  { to: '/error-401', label: 'Error 401' },
  { to: '/error-403', label: 'Error 403' },
];

function NavItem({ item }) {
  return (
    <NavLink to={item.to} end={item.end}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={({ isActive }) => isActive ? { background: '#c9a96e', color: '#3d2e22' } : { color: '#c4b5a5' }}>
      {({ isActive }) => (
        <>
          <span className="flex-shrink-0" style={{ opacity: isActive ? 1 : 0.65 }}>{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          {item.badge && !isActive && (
            <span className="text-xs px-1.5 py-0.5 rounded-md font-bold"
              style={{ background: '#c9a96e22', color: '#c9a96e', fontSize: '9px' }}>{item.badge}</span>
          )}
          {isActive && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#3d2e22' }} />}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  function handleLogout() { removeToken(); navigate('/login'); }

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#3d2e22' }}>
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid #4e3c2e' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: '#c9a96e', color: '#3d2e22' }}>B</div>
          <div>
            <h1 className="text-base font-bold leading-none" style={{ color: '#f5f0eb' }}>
              Boutique<span style={{ color: '#c9a96e' }}>.</span>
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#7a6a5a' }}>Fashion Admin</p>
          </div>
        </div>
      </div>

      {/* Season badge */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#4e3c2e' }}>
          <span style={{ color: '#c9a96e', fontSize: '10px' }}>✦</span>
          <span className="text-xs font-medium" style={{ color: '#a09080' }}>Spring / Summer 2026</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-4">
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#5a4a3a' }}>Store</p>
          <div className="space-y-0.5">{mainMenu.map(item => <NavItem key={item.to} item={item} />)}</div>
        </div>
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#5a4a3a' }}>Business</p>
          <div className="space-y-0.5">{businessMenu.map(item => <NavItem key={item.to} item={item} />)}</div>
        </div>
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#5a4a3a' }}>Error Pages</p>
          <div className="space-y-0.5">
            {errorItems.map(item => (
              <NavLink key={item.to} to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={({ isActive }) => isActive ? { background: '#c9a96e', color: '#3d2e22' } : { color: '#7a6a5a' }}>
                <svg className="w-4 h-4 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid #4e3c2e' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2" style={{ background: '#4e3c2e' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: '#c9a96e', color: '#3d2e22' }}>A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#f5f0eb' }}>Admin</p>
            <p className="text-xs truncate" style={{ color: '#7a6a5a' }}>boutique@admin.com</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#7a6a5a' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#5a2a2a'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7a6a5a'; }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
