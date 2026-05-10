import { NavLink, useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';

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
    to: '/customers', label: 'Customers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

function NavItem({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
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
          <span className="flex-1 font-medium">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  function handleLogout() { removeToken(); navigate('/login'); }

  return (
    <aside className="w-64 min-h-screen flex flex-col"
      style={{ background: C.bg, borderRight: `1px solid ${C.border}`, ...F }}>

      {/* Logo */}
      <div className="px-6 py-6" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#E7EDFF' }}>
            <svg className="w-6 h-6" fill="none" stroke="#2D60FF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ color: C.text, ...F }}>
            Boutique
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1">
        {mainMenu.map(item => <NavItem key={item.to} item={item} />)}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-5" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ background: '#E7EDFF' }}>
            <img src="/img/profile.jpg" alt="Admin"
              className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: C.text }}>Admin</p>
            <p className="text-xs truncate" style={{ color: C.muted }}>boutique@admin.com</p>
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
