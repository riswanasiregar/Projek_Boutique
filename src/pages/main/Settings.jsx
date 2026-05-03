import { useState } from 'react';
import PageHeader from '../../components/PageHeader';

const B = { primary: '#3d2e22', accent: '#c9a96e', text: '#3d2e22', muted: '#9a8878', border: '#d4c4b0', surface: '#ede5d8' };

const inputStyle = {
  background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#3d2e22',
  borderRadius: '12px', padding: '10px 16px', fontSize: '14px', width: '100%', outline: 'none',
};

export default function Settings() {
  const [profile, setProfile] = useState({ storeName: 'Boutique.', email: 'boutique@admin.com', phone: '081234567890', address: 'Jl. Fashion No. 1, Jakarta' });
  const [notif, setNotif] = useState({ newOrder: true, lowStock: true, newCustomer: false, promotions: true });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <PageHeader title="Settings" breadcrumb={['Dashboard', 'Settings']}>
        <button onClick={handleSave}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          style={{ background: saved ? '#eef4ee' : '#3d2e22', color: saved ? '#4a7c59' : '#c9a96e' }}>
          {saved ? (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Saved!</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save Changes</>
          )}
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Store Profile */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: B.text }}>Store Profile</h3>
            <div className="space-y-4">
              {[
                { label: 'Store Name', key: 'storeName', type: 'text' },
                { label: 'Email Address', key: 'email', type: 'email' },
                { label: 'Phone Number', key: 'phone', type: 'text' },
                { label: 'Store Address', key: 'address', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>{f.label}</label>
                  <input type={f.type} value={profile[f.key]}
                    onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#c9a96e'}
                    onBlur={e => e.target.style.borderColor = '#d4c4b0'} />
                </div>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: B.text }}>Appearance</h3>
            <div className="space-y-3">
              <p className="text-xs font-semibold mb-2" style={{ color: '#5a4535' }}>Color Theme</p>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Warm Brown', primary: '#3d2e22', accent: '#c9a96e', active: true },
                  { name: 'Navy Gold', primary: '#3d2e22', accent: '#c9a96e', active: false },
                  { name: 'Forest', primary: '#1a3322', accent: '#a8c9a0', active: false },
                ].map(theme => (
                  <div key={theme.name}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
                    style={theme.active
                      ? { background: '#f7f3e8', border: '2px solid #c9a96e' }
                      : { background: '#f5f0eb', border: '1.5px solid #d4c4b0' }}>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ background: theme.accent }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: B.text }}>{theme.name}</span>
                    {theme.active && <span className="text-xs" style={{ color: '#c9a96e' }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #e2d9ce' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: B.text }}>Notifications</h3>
            <div className="space-y-4">
              {[
                { key: 'newOrder', label: 'New Orders', desc: 'Get notified for new orders' },
                { key: 'lowStock', label: 'Low Stock Alert', desc: 'When stock drops below 5' },
                { key: 'newCustomer', label: 'New Customers', desc: 'When new customer registers' },
                { key: 'promotions', label: 'Promotions', desc: 'Promo expiry reminders' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold" style={{ color: B.text }}>{n.label}</p>
                    <p className="text-xs" style={{ color: B.muted }}>{n.desc}</p>
                  </div>
                  <button onClick={() => setNotif({ ...notif, [n.key]: !notif[n.key] })}
                    className="w-10 h-5 rounded-full transition-all flex-shrink-0 relative"
                    style={{ background: notif[n.key] ? '#c9a96e' : '#d4c4b0' }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                      style={{ left: notif[n.key] ? '22px' : '2px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Store info */}
          <div className="rounded-2xl p-5" style={{ background: '#3d2e22' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ background: '#c9a96e', color: '#3d2e22' }}>B</div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#f5f0eb' }}>Boutique.</p>
                <p className="text-xs" style={{ color: '#7a6a5a' }}>Fashion Admin v1.0</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Version', value: '1.0.0' },
                { label: 'Last Updated', value: 'Mar 2026' },
                { label: 'License', value: 'Pro' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#7a6a5a' }}>{item.label}</span>
                  <span className="text-xs font-semibold" style={{ color: '#c9a96e' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
