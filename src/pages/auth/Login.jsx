import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsEnvelope, BsLock, BsEye, BsEyeSlash } from 'react-icons/bs';
import { AlertCircleIcon, LoaderCircleIcon } from 'lucide-react';

import { signIn, getCurrentUser } from '../../utils/auth';
import InputField from '../../components/InputField';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import Divider from '../../components/Divider';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await signIn({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login')) {
          setError('Email atau password salah.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Email belum dikonfirmasi. Cek inbox kamu.');
        } else {
          setError(authError.message);
        }
        return;
      }

      // Cek role untuk redirect
      const user = await getCurrentUser();
      if (user?.role === 'member') {
        navigate('/member');
      } else {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-jakarta">
      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircleIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <InputField
          variant="auth"
          label="Email Here"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          required
          icon={<BsEnvelope size={15} />}
        />

        {/* Password */}
        <div>
          <InputField
            variant="auth"
            label="Password Here"
            name="password"
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            placeholder="at least 8 characters"
            required
            icon={<BsLock size={15} />}
            rightIcon={showPass ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
            onRightIconClick={() => setShowPass(!showPass)}
          />
          <div className="flex justify-end mt-1.5">
            <Link to="/forgot" className="text-xs text-neutral/75 hover:underline font-jakarta">
              Forget password?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          disabled={loading}
          className="w-full font-bold tracking-wide font-jakarta"
          style={{ boxShadow: '0 4px 20px #12328840' }}>
          {loading
            ? <><LoaderCircleIcon className="animate-spin w-4 h-4 mr-2" /> Mohon Tunggu...</>
            : 'Login'}
        </Button>
      </form>

      <Divider variant="auth" label="or" className="my-5" />

      {/* Social login placeholder */}
      <div className="space-y-3 mb-6">
        <button type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold
            bg-neutral text-primary-2 hover:bg-auth-bg transition-colors font-jakarta opacity-50 cursor-not-allowed"
          disabled>
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>

      <p className="text-center text-xs text-neutral/75 font-jakarta">
        New Account?{' '}
        <Link to="/register" className="font-bold text-primary-1 hover:underline">Get Started</Link>
      </p>
    </div>
  );
}
