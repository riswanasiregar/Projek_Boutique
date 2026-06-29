import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #123288 0%, #2D60FF 100%)' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Siap untuk Berbelanja?</h2>
        <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Daftar sekarang dan nikmati pengalaman berbelanja fashion premium dengan koleksi eksklusif kami.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register"
            className="px-8 py-3.5 rounded-full text-base font-semibold transition-all"
            style={{ background: '#FFBB38', color: '#343C6A' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,187,56,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            Daftar Sekarang
          </Link>
          <Link to="/login"
            className="px-8 py-3.5 rounded-full text-base font-semibold transition-all"
            style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
