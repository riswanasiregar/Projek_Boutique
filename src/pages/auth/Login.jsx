import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setToken } from '../../utils/auth';
import { BsEnvelope, BsLock, BsEye, BsEyeSlash, BsExclamationTriangle } from 'react-icons/bs';

export default function Login() {
  const navigate = useNavigate();
  const [dataForm, setDataForm] = useState({ username: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!dataForm.username || !dataForm.password) {
      setError('Username dan password wajib diisi.');
      return;
    }
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
      if (err.response?.status === 401)      setError('Username atau password salah.');
      else if (err.response?.status === 400) setError('Username dan password wajib diisi.');
      else                                   setError('Login gagal. Periksa koneksi dan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-jakarta">

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs rounded-xl px-4 py-3 mb-5
          bg-error/20 text-neutral border border-error/40">
          <BsExclamationTriangle size={13} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-xs rounded-xl px-4 py-3 mb-5
          bg-neutral/15 text-neutral border border-neutral/25">
          <div className="w-3.5 h-3.5 border-2 border-neutral border-t-transparent rounded-full animate-spin flex-shrink-0" />
          Mohon Tunggu...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-neutral/90">
            Email Here
          </label>
          <div className="relative">
            <BsEnvelope size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral/60" />
            <input
              type="text" name="username"
              value={dataForm.username} onChange={handleChange}
              placeholder="example@email.com" required
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all
                bg-neutral/15 border border-neutral/35 text-neutral placeholder:text-neutral/50
                focus:border-neutral focus:bg-neutral/25 font-jakarta"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-neutral/90">
            Password Here
          </label>
          <div className="relative">
            <BsLock size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral/60" />
            <input
              type={showPass ? 'text' : 'password'} name="password"
              value={dataForm.password} onChange={handleChange}
              placeholder="at least 8 characters" required
              className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all
                bg-neutral/15 border border-neutral/35 text-neutral placeholder:text-neutral/50
                focus:border-neutral focus:bg-neutral/25 font-jakarta"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/70 hover:text-neutral transition-colors">
              {showPass ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
            </button>
          </div>
          <div className="flex justify-end mt-1.5">
            <Link to="/forgot" className="text-xs text-neutral/75 hover:underline font-jakarta">
              Forget password?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all
            disabled:opacity-50 flex items-center justify-center gap-2
            bg-gradient-primary text-neutral hover:opacity-90 font-jakarta"
          style={{ boxShadow: '0 4px 20px #12328840' }}>
          {loading
            ? <><div className="w-4 h-4 border-2 border-neutral border-t-transparent rounded-full animate-spin" /> Mohon Tunggu...</>
            : 'Login'
          }
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-neutral/25" />
        <span className="text-xs text-neutral/60 font-jakarta">or</span>
        <div className="flex-1 h-px bg-neutral/25" />
      </div>

      {/* Social */}
      <div className="space-y-3 mb-6">
        <button type="button"
          onClick={() => {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            const u = document.querySelector('[name="username"]');
            const p = document.querySelector('[name="password"]');
            setter.call(u, 'emilys');    u.dispatchEvent(new Event('input', { bubbles: true }));
            setter.call(p, 'emilyspass'); p.dispatchEvent(new Event('input', { bubbles: true }));
          }}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold
            bg-neutral text-primary-2 hover:bg-auth-bg transition-colors font-jakarta">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
        <button type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold
            bg-neutral text-primary-2 hover:bg-auth-bg transition-colors font-jakarta">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Sign in with Facebook
        </button>
      </div>

      <p className="text-center text-xs text-neutral/75 font-jakarta">
        New Account?{' '}
        <Link to="/register" className="font-bold text-primary-1 hover:underline">Get Started</Link>
      </p>
    </div>
  );
}
