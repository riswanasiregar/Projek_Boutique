import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsEnvelope, BsLock, BsPerson, BsEye, BsEyeSlash, BsCheckCircle } from 'react-icons/bs';
import { AlertCircleIcon, LoaderCircleIcon, CheckCircle2Icon } from 'lucide-react';

import { signUp } from '../../utils/auth';
import InputField from '../../components/InputField';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import Divider from '../../components/Divider';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]               = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [apiError, setApiError]       = useState('');

  const hasMin8  = form.password.length >= 8;
  const hasUpper = /[A-Z]/.test(form.password);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    if (apiError) setApiError('');
  }

  function validate() {
    const e = {};
    if (!form.name.trim())        e.name    = 'Nama wajib diisi.';
    if (!form.email.trim())       e.email   = 'Email wajib diisi.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid.';
    if (!form.password)           e.password = 'Password wajib diisi.';
    else if (!hasMin8 || !hasUpper) e.password = 'Password belum memenuhi syarat.';
    if (!form.confirmPassword)    e.confirmPassword = 'Konfirmasi password wajib diisi.';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Password tidak cocok.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const { data, error: authError } = await signUp({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        name:     form.name.trim(),
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setApiError('Email sudah terdaftar. Silakan login.');
        } else {
          setApiError(authError.message);
        }
        return;
      }

      // Jika email confirmation dimatikan di Supabase → session langsung ada → redirect
      if (data?.session) {
        navigate('/');
        return;
      }

      // Jika email confirmation aktif → tampilkan pesan sukses
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="font-jakarta text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2Icon className="w-16 h-16 text-accent-green" />
        </div>
        <h3 className="text-lg font-bold text-neutral font-jakarta">Pendaftaran Berhasil!</h3>
        <p className="text-sm text-neutral/75 font-jakarta">
          Cek email <span className="font-semibold text-primary-1">{form.email}</span> dan klik link konfirmasi untuk mengaktifkan akun kamu.
        </p>
        <Button
          variant="gradient"
          size="lg"
          className="w-full font-bold tracking-wide font-jakarta"
          onClick={() => navigate('/login')}>
          Ke Halaman Login
        </Button>
      </div>
    );
  }

  return (
    <div className="font-jakarta">
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon />
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama */}
        <InputField
          variant="auth"
          label="Full Name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Andi Saputra"
          required
          error={errors.name}
          icon={<BsPerson size={15} />}
        />

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
          error={errors.email}
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
            error={errors.password}
            icon={<BsLock size={15} />}
            rightIcon={showPass ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
            onRightIconClick={() => setShowPass(!showPass)}
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {[
              { label: 'Minimum 8 Character', met: hasMin8  },
              { label: '1 upper Alphabet',    met: hasUpper },
            ].map(hint => (
              <div key={hint.label}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all font-jakarta
                  ${hint.met
                    ? 'bg-neutral/25 text-neutral border border-neutral/50'
                    : 'bg-neutral/10 text-neutral/55 border border-neutral/20'}`}>
                <BsCheckCircle size={11} className={hint.met ? 'text-neutral' : 'text-neutral/40'} />
                {hint.label}
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Password */}
        <InputField
          variant="auth"
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="at least 8 characters"
          required
          error={errors.confirmPassword}
          icon={<BsLock size={15} />}
          rightIcon={showConfirm ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
          onRightIconClick={() => setShowConfirm(!showConfirm)}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          disabled={loading}
          className="w-full font-bold tracking-wide font-jakarta"
          style={{ boxShadow: '0 4px 20px #12328840' }}>
          {loading
            ? <><LoaderCircleIcon className="animate-spin w-4 h-4 mr-2" /> Mendaftar...</>
            : 'Sign Up'}
        </Button>
      </form>

      <Divider variant="auth" label="or" className="my-4" />

      <div className="space-y-3 mb-5">
        <button type="button" disabled
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold
            bg-neutral text-primary-2 hover:bg-auth-bg transition-colors font-jakarta opacity-50 cursor-not-allowed">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>
      </div>

      <p className="text-center text-xs text-neutral/75 font-jakarta">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary-1 hover:underline">Login Here</Link>
      </p>
    </div>
  );
}
