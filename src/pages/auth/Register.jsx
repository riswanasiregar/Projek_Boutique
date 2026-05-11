import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsEnvelope, BsLock, BsEye, BsEyeSlash, BsCheckCircle } from 'react-icons/bs';

export default function Register() {
  const [dataForm, setDataForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]           = useState({});

  const hasMin8  = dataForm.password.length >= 8;
  const hasUpper = /[A-Z]/.test(dataForm.password);

  function handleChange(e) {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  }

  function validate() {
    const e = {};
    if (!dataForm.email.trim()) e.email = 'Email wajib diisi.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataForm.email)) e.email = 'Format email tidak valid.';
    if (!dataForm.password) e.password = 'Password wajib diisi.';
    else if (!hasMin8 || !hasUpper) e.password = 'Password belum memenuhi syarat.';
    if (!dataForm.confirmPassword) e.confirmPassword = 'Konfirmasi password wajib diisi.';
    else if (dataForm.password !== dataForm.confirmPassword) e.confirmPassword = 'Password tidak cocok.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    alert('Register berhasil!');
  }

  const FieldError = ({ name }) => errors[name]
    ? <p className="text-xs mt-1 text-error/80 font-jakarta">⚠ {errors[name]}</p>
    : null;

  const inputClass = (hasErr) =>
    `w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all font-jakarta
     bg-neutral/15 text-neutral placeholder:text-neutral/50
     border ${hasErr ? 'border-error/60' : 'border-neutral/35'}
     focus:border-neutral focus:bg-neutral/25`;

  return (
    <div className="font-jakarta">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-neutral/90">Type Email Here</label>
          <div className="relative">
            <BsEnvelope size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral/60" />
            <input type="text" name="email" value={dataForm.email} onChange={handleChange}
              placeholder="example@email.com" required className={inputClass(errors.email)} />
          </div>
          <FieldError name="email" />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-neutral/90">Type Password Here</label>
          <div className="relative">
            <BsLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral/60" />
            <input type={showPass ? 'text' : 'password'} name="password" value={dataForm.password} onChange={handleChange}
              placeholder="at least 8 characters" required className={`${inputClass(errors.password)} pr-11`} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/70 hover:text-neutral transition-colors">
              {showPass ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
            </button>
          </div>
          {/* Hint chips */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {[
              { label: 'Minimum 8 Character', met: hasMin8  },
              { label: '1 upper Alphabet',    met: hasUpper },
            ].map(hint => (
              <div key={hint.label}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all font-jakarta
                  ${hint.met ? 'bg-neutral/25 text-neutral border border-neutral/50' : 'bg-neutral/10 text-neutral/55 border border-neutral/20'}`}>
                <BsCheckCircle size={11} className={hint.met ? 'text-neutral' : 'text-neutral/40'} />
                {hint.label}
              </div>
            ))}
          </div>
          <FieldError name="password" />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold mb-2 text-neutral/90">Retype-Password Here</label>
          <div className="relative">
            <BsLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral/60" />
            <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={dataForm.confirmPassword} onChange={handleChange}
              placeholder="at least 8 characters" required className={`${inputClass(errors.confirmPassword)} pr-11`} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/70 hover:text-neutral transition-colors">
              {showConfirm ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
            </button>
          </div>
          <FieldError name="confirmPassword" />
        </div>

        {/* Submit */}
        <button type="submit"
          className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all
            hover:opacity-90 bg-gradient-primary text-neutral font-jakarta"
          style={{ boxShadow: '0 4px 20px #12328840' }}>
          Signup
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-neutral/25" />
        <span className="text-xs text-neutral/60 font-jakarta">or</span>
        <div className="flex-1 h-px bg-neutral/25" />
      </div>

      {/* Social */}
      <div className="space-y-3 mb-5">
        <button type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold
            bg-neutral text-primary-2 hover:bg-auth-bg transition-colors font-jakarta">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>
        <button type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold
            bg-neutral text-primary-2 hover:bg-auth-bg transition-colors font-jakarta">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Sign up with Facebook
        </button>
      </div>

      <p className="text-center text-xs text-neutral/75 font-jakarta">
        Already Account?{' '}
        <Link to="/login" className="font-bold text-primary-1 hover:underline">Login Here</Link>
      </p>
    </div>
  );
}
