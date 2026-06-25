import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { supabase } from '../lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const F = { fontFamily: '"Inter", sans-serif' };

const pageTitles = {
  '/': 'Dashboard', '/orders': 'Orders', '/customers': 'Customers',
  '/products': 'Products', '/support': 'Support', '/feedback': 'Feedback',
  '/broadcast': 'Broadcast', '/campaigns': 'Campaigns', '/analytics': 'Analytics',
  '/strategic': 'Strategic', '/users': 'Users',
  '/error-400': 'Error 400', '/error-401': 'Error 401', '/error-403': 'Error 403',
};

const searchablePages = ['/orders', '/customers'];

/** Helper: inisial dari nama (max 2 huruf) */
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Header({ onSearch, onMenuToggle }) {
  const [search, setSearch] = useState('');
  const [user, setUser]     = useState(null);
  const searchInputRef = useRef(null); // useRef: akses langsung ke search input DOM
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Page';
  const showSearch = searchablePages.includes(location.pathname);

  // Fetch profil user saat mount + subscribe auth changes
  useEffect(() => {
    getCurrentUser().then(setUser);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        getCurrentUser().then(setUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const notifications = [
    { id: 1, text: 'New order from Andi Saputra',       time: '2m ago',  unread: true  },
    { id: 2, text: 'Citra Anggraini joined as customer', time: '15m ago', unread: true  },
    { id: 3, text: 'Order ORD-028 completed',            time: '1h ago',  unread: false },
    { id: 4, text: 'Dian Permata placed new order',      time: '2h ago',  unread: false },
  ];

  function handleSearchChange(e) {
    setSearch(e.target.value);
    onSearch?.(e.target.value);
  }

  if (!showSearch && search) { setSearch(''); onSearch?.(''); }

  return (
    <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-30"
      style={{ background: '#FFFFFF', borderBottom: '1px solid #E6EFF5', ...F }}>

      {/* Left — hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        {/* Hamburger menu — hanya tampil di mobile */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
            style={{ background: '#F5F7FA' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E7EDFF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F5F7FA'}>
            <svg className="w-5 h-5" fill="none" stroke="#718EBF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: '#343C6A', ...F }}>
          {pageTitle}
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Search pill */}
        {showSearch && (
          <div className="relative hidden sm:block">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#B1B1B1' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text" value={search} onChange={handleSearchChange}
              placeholder="Search for something"
              className="pl-11 pr-5 py-2.5 text-sm rounded-full w-64 outline-none transition-all"
              style={{ background: '#F5F7FA', border: '1px solid #E6EFF5', color: '#343C6A', ...F }}
              onFocus={e => { e.target.style.borderColor = '#2D60FF'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#E6EFF5'; e.target.style.background = '#F5F7FA'; }}
            />
          </div>
        )}

        {/* Settings icon */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
          style={{ background: '#F5F7FA' }}
          onMouseEnter={e => e.currentTarget.style.background = '#E7EDFF'}
          onMouseLeave={e => e.currentTarget.style.background = '#F5F7FA'}>
          <svg className="w-5 h-5" fill="none" stroke="#718EBF" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full relative transition-colors outline-none"
              style={{ background: '#FFF5D9' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFE0EB'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFF5D9'}>
              <svg className="w-5 h-5" fill="none" stroke="#FFBB38" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                  style={{ background: '#FE5C73' }} />
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[300px] p-0" align="end">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: '1px solid #F5F7FA', background: '#FAFAFA' }}>
              <DropdownMenuLabel className="p-0 text-sm font-semibold" style={{ color: '#343C6A', ...F }}>
                Notifications
              </DropdownMenuLabel>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#FFE0EB', color: '#FE5C73' }}>
                {notifications.filter(n => n.unread).length} new
              </span>
            </div>

            {/* Items */}
            {notifications.map((n, i) => (
              <div key={n.id}>
                {i > 0 && <DropdownMenuSeparator className="my-0" style={{ borderColor: '#F5F7FA' }} />}
                <DropdownMenuItem className="px-4 py-3 cursor-pointer flex items-start gap-3 rounded-none focus:bg-neutral-bg">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: n.unread ? '#E7EDFF' : '#F5F7FA' }}>
                    <svg className="w-4 h-4" fill="none" stroke={n.unread ? '#2D60FF' : '#B1B1B1'} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium" style={{ color: '#343C6A', ...F }}>{n.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#B1B1B1' }}>{n.time}</p>
                  </div>
                  {n.unread && <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: '#2D60FF' }} />}
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile avatar — dari Supabase */}
        {user?.avatar_url ? (
          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer flex-shrink-0"
            style={{ border: '2px solid #E6EFF5' }}>
            <img src={user.avatar_url} alt={user.name}
              className="w-full h-full object-cover"
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.style.background = '#E7EDFF';
                e.currentTarget.parentElement.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;height:100%;font-size:14px;font-weight:700;color:#2D60FF">${getInitials(user.name)}</span>`;
              }} />
          </div>
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 text-sm font-bold"
            style={{ background: '#E7EDFF', color: '#2D60FF', border: '2px solid #E6EFF5' }}
            title={user?.name ?? ''}
          >
            {getInitials(user?.name)}
          </div>
        )}
      </div>
    </header>
  );
}
