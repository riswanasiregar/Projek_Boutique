import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard', '/products': 'Products', '/orders': 'Orders',
  '/customers': 'Customers', '/analytics': 'Analytics', '/promotions': 'Promotions',
  '/reports': 'Reports', '/settings': 'Settings', '/collections': 'Collections',
  '/inventory': 'Inventory', '/suppliers': 'Suppliers',
  '/error-400': 'Error 400', '/error-401': 'Error 401', '/error-403': 'Error 403',
};

// Pages that use search
const searchablePages = ['/products', '/orders', '/customers', '/collections', '/inventory', '/suppliers', '/promotions'];

export default function Header({ onSearch }) {
  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Page';
  const showSearch = searchablePages.includes(location.pathname);

  const notifications = [
    { id: 1, text: 'New order from Andi Saputra', time: '2m ago', unread: true, icon: '🛍️' },
    { id: 2, text: 'Citra Anggraini joined as customer', time: '15m ago', unread: true, icon: '👤' },
    { id: 3, text: 'Order ORD-028 completed', time: '1h ago', unread: false, icon: '✅' },
    { id: 4, text: 'Low stock: Trench Coat (5 left)', time: '2h ago', unread: false, icon: '⚠️' },
  ];

  function handleSearchChange(e) {
    setSearch(e.target.value);
    onSearch?.(e.target.value);
  }

  // Reset search when navigating away
  if (!showSearch && search) {
    setSearch('');
    onSearch?.('');
  }

  return (
    <header className="px-6 py-3.5 flex items-center justify-between sticky top-0 z-30"
      style={{ background: '#f5f0eb', borderBottom: '1px solid #e2d9ce' }}>

      {/* Left */}
      <div>
        <h2 className="text-base font-bold" style={{ color: '#3d2e22' }}>{pageTitle}</h2>
        <p className="text-xs mt-0.5" style={{ color: '#9a8878' }}>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search — only on searchable pages */}
        {showSearch && (
          <div className="relative hidden sm:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9a8878' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={`Search ${pageTitle.toLowerCase()}...`}
              className="pl-9 pr-4 py-2 text-xs rounded-xl w-56 outline-none transition-all"
              style={{ background: '#ede5d8', border: '1.5px solid #d4c4b0', color: '#3d2e22' }}
              onFocus={e => { e.target.style.borderColor = '#c9a96e'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#d4c4b0'; e.target.style.background = '#ede5d8'; }}
            />
          </div>
        )}

        {/* Notification */}
        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
            style={{ background: showNotif ? '#ede5d8' : 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ede5d8'}
            onMouseLeave={e => { if (!showNotif) e.currentTarget.style.background = 'transparent'; }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" style={{ color: '#5a4535' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
              style={{ background: '#c9a96e', borderColor: '#f5f0eb' }} />
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 rounded-2xl shadow-xl z-50 overflow-hidden"
              style={{ background: '#fff', border: '1px solid #e2d9ce', width: '288px' }}>
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid #f0ebe4', background: '#faf7f4' }}>
                <p className="text-sm font-bold" style={{ color: '#3d2e22' }}>Notifications</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#f0e8d8', color: '#8b7355' }}>
                  {notifications.filter(n => n.unread).length} new
                </span>
              </div>
              {notifications.map((n, i) => (
                <div key={n.id} className="px-4 py-3 cursor-pointer transition-colors"
                  style={{ borderTop: i > 0 ? '1px solid #f5f0eb' : 'none', background: n.unread ? '#faf7f4' : '#fff' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f0eb'}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#faf7f4' : '#fff'}>
                  <div className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{n.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium leading-snug" style={{ color: '#3d2e22' }}>{n.text}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9a8878' }}>{n.time}</p>
                    </div>
                    {n.unread && <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: '#c9a96e' }} />}
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid #f0ebe4' }}>
                <button className="text-xs font-semibold" style={{ color: '#8b7355' }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: '#d4c4b0' }} />

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer rounded-xl px-2 py-1 transition-colors"
          onMouseEnter={e => e.currentTarget.style.background = '#ede5d8'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
            style={{ background: '#3d2e22', color: '#c9a96e' }}>A</div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold leading-none" style={{ color: '#3d2e22' }}>Admin</p>
            <p className="text-xs mt-0.5" style={{ color: '#9a8878' }}>Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
