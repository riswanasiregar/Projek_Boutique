import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setToken } from '../../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [dataForm, setDataForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('https://dummyjson.com/auth/login', {
        username: dataForm.username,
        password: dataForm.password,
        expiresInMins: 60,
      });
      setToken(res.data.accessToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 mb-5"
          style={{ background: '#f9ede8', color: '#8b3a2a', border: '1px solid #e8c4b8' }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>
            Email or Username
          </label>
          <input
            type="text"
            name="username"
            value={dataForm.username}
            onChange={handleChange}
            placeholder="Email or Username"
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: '#f5f0eb',
              border: '1.5px solid #d4c4b0',
              color: '#3d2e1e',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#a07850'; e.target.style.background = '#fff'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d4c4b0'; e.target.style.background = '#f5f0eb'; }}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a4535' }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
              style={{
                background: '#f5f0eb',
                border: '1.5px solid #d4c4b0',
                color: '#3d2e1e',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#a07850'; e.target.style.background = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d4c4b0'; e.target.style.background = '#f5f0eb'; }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#a07850' }}
            >
              {showPass ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex justify-end mt-1.5">
            <Link to="/forgot" className="text-xs font-medium hover:underline" style={{ color: '#a07850' }}>
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          style={{ background: '#7c6a56', color: '#f5f0eb' }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            'LOGIN'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: '#d4c4b0' }} />
        <span className="text-xs font-medium" style={{ color: '#a09080' }}>Or login with</span>
        <div className="flex-1 h-px" style={{ background: '#d4c4b0' }} />
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Demo autofill as "Facebook" */}
        <button
          type="button"
          onClick={() => setDataForm({ username: 'emilys', password: 'emilyspass' })}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
          style={{ background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#5a4535' }}
          title="Click to autofill demo credentials"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#4267B2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
          style={{ background: '#f5f0eb', border: '1.5px solid #d4c4b0', color: '#5a4535' }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
      </div>

      {/* Register link */}
      <p className="text-center text-xs" style={{ color: '#8a7060' }}>
        Not a member?{' '}
        <Link to="/register" className="font-bold hover:underline" style={{ color: '#a07850' }}>
          Sign up now
        </Link>
      </p>
    </div>
  );
}
