import { useState } from 'react';
import { Link } from 'react-router-dom';

const inputStyle = {
  background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#3d2e22',
  borderRadius: '12px', padding: '10px 16px', fontSize: '14px', width: '100%', outline: 'none',
};

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
          style={{ background: '#ede5d8' }}>✉️</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#3d2e22' }}>Check your email</h2>
        <p className="text-sm mb-6" style={{ color: '#9a8878' }}>
          We've sent a reset link to <span className="font-semibold" style={{ color: '#3d2e22' }}>{email}</span>
        </p>
        <Link to="/login"
          className="inline-block px-6 py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
          style={{ background: '#3d2e22', color: '#c9a96e' }}>
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
          style={{ background: '#ede5d8', border: '1px solid #d4c4b0' }}>
          <span className="text-xs" style={{ color: '#c9a96e' }}>✦</span>
          <span className="text-xs font-medium" style={{ color: '#8b7355' }}>Password Reset</span>
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: '#3d2e22' }}>Forgot Password?</h2>
        <p className="text-sm" style={{ color: '#9a8878' }}>
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Email Address</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9a8878' }}>✉️</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required
              style={{ ...inputStyle, paddingLeft: '40px' }}
              onFocus={e => { e.target.style.borderColor = '#c9a96e'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#d4c4b0'; e.target.style.background = '#f5f0eb'; }} />
          </div>
        </div>

        <button type="submit"
          className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-opacity hover:opacity-90"
          style={{ background: '#3d2e22', color: '#c9a96e' }}>
          SEND RESET LINK
        </button>
      </form>

      <p className="mt-6 text-center text-xs" style={{ color: '#9a8878' }}>
        Remember your password?{' '}
        <Link to="/login" className="font-bold hover:underline" style={{ color: '#8b7355' }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
