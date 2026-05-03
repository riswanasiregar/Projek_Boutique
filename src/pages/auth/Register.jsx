import { useState } from 'react';
import { Link } from 'react-router-dom';

const inputStyle = {
  background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#3d2e22',
  borderRadius: '12px', padding: '10px 16px', fontSize: '14px', width: '100%', outline: 'none',
};

export default function Register() {
  const [dataForm, setDataForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e) {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
          style={{ background: '#ede5d8', border: '1px solid #d4c4b0' }}>
          <span className="text-xs" style={{ color: '#c9a96e' }}>✦</span>
          <span className="text-xs font-medium" style={{ color: '#8b7355' }}>New Account</span>
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: '#3d2e22' }}>Create Account</h2>
        <p className="text-sm" style={{ color: '#9a8878' }}>Join the Boutique admin panel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Full Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9a8878' }}>👤</span>
            <input type="text" name="fullName" value={dataForm.fullName} onChange={handleChange}
              placeholder="Your full name" required
              style={{ ...inputStyle, paddingLeft: '40px' }}
              onFocus={e => { e.target.style.borderColor = '#c9a96e'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#d4c4b0'; e.target.style.background = '#f5f0eb'; }} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Email</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9a8878' }}>✉️</span>
            <input type="email" name="email" value={dataForm.email} onChange={handleChange}
              placeholder="your@email.com" required
              style={{ ...inputStyle, paddingLeft: '40px' }}
              onFocus={e => { e.target.style.borderColor = '#c9a96e'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#d4c4b0'; e.target.style.background = '#f5f0eb'; }} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9a8878' }}>🔒</span>
            <input type={showPass ? 'text' : 'password'} name="password" value={dataForm.password} onChange={handleChange}
              placeholder="Create a password" required
              style={{ ...inputStyle, paddingLeft: '40px', paddingRight: '44px' }}
              onFocus={e => { e.target.style.borderColor = '#c9a96e'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#d4c4b0'; e.target.style.background = '#f5f0eb'; }} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9a8878' }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>Confirm Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9a8878' }}>🔒</span>
            <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={dataForm.confirmPassword} onChange={handleChange}
              placeholder="Confirm your password" required
              style={{ ...inputStyle, paddingLeft: '40px', paddingRight: '44px' }}
              onFocus={e => { e.target.style.borderColor = '#c9a96e'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#d4c4b0'; e.target.style.background = '#f5f0eb'; }} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9a8878' }}>
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button type="submit"
          className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-opacity hover:opacity-90 mt-2"
          style={{ background: '#3d2e22', color: '#c9a96e' }}>
          CREATE ACCOUNT
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: '#d4c4b0' }} />
        <span className="text-xs font-medium" style={{ color: '#9a8878' }}>or</span>
        <div className="flex-1 h-px" style={{ background: '#d4c4b0' }} />
      </div>

      <p className="text-center text-xs" style={{ color: '#9a8878' }}>
        Already have an account?{' '}
        <Link to="/login" className="font-bold hover:underline" style={{ color: '#8b7355' }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
