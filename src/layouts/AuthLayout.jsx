import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: '#f5f0eb' }}
    >
      {/* Background floating circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-16 h-16 rounded-full border-2 top-8 left-12" style={{ borderColor: '#c9b99a' }} />
        <div className="absolute w-8 h-8 rounded-full border-2 top-24 left-48" style={{ borderColor: '#c9b99a' }} />
        <div className="absolute w-12 h-12 rounded-full border-2 bottom-16 left-24" style={{ borderColor: '#c9b99a' }} />
        <div className="absolute w-6 h-6 rounded-full bottom-32 left-64" style={{ background: '#c9b99a', opacity: 0.4 }} />
        <div className="absolute w-10 h-10 rounded-full border-2 top-16 right-16" style={{ borderColor: '#c9b99a' }} />
        <div className="absolute w-6 h-6 rounded-full top-40 right-40" style={{ background: '#c9b99a', opacity: 0.4 }} />
        <div className="absolute w-14 h-14 rounded-full border-2 bottom-20 right-20" style={{ borderColor: '#c9b99a' }} />
        <div className="absolute w-5 h-5 rounded-full bottom-48 right-56" style={{ background: '#c9b99a', opacity: 0.3 }} />
        <div className="absolute w-9 h-9 rounded-full border-2 top-1/2 left-8" style={{ borderColor: '#c9b99a', opacity: 0.5 }} />
      </div>

      {/* Main card container */}
      <div
        className="relative z-10 flex w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ minHeight: '520px' }}
      >
        {/* Left — Form panel */}
        <div
          className="w-full lg:w-[45%] flex flex-col justify-center px-10 py-12"
          style={{ background: '#ede5d8' }}
        >
          {/* Brand */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ background: '#6b5040' }}
              >
                B
              </div>
              <span className="font-bold text-lg" style={{ color: '#3d2e22' }}>
                Boutique<span style={{ color: '#c9a96e' }}>.</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#3d2e22' }}>
              Login Now
            </h2>
            <p className="text-sm" style={{ color: '#9a8878' }}>
              Welcome back to your fashion dashboard
            </p>
          </div>

          <Outlet />
        </div>

        {/* Right — Decorative panel */}
        <div
          className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden"
          style={{ background: '#c9b99a' }}
        >
          {/* Large inner circle */}
          <div
            className="absolute rounded-full"
            style={{
              width: '420px',
              height: '420px',
              background: '#c9a96e',
              right: '-60px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          {/* Medium inner circle */}
          <div
            className="absolute rounded-full"
            style={{
              width: '320px',
              height: '320px',
              background: '#6b5040',
              right: '-40px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />

          {/* Floating circles on right panel */}
          <div className="absolute w-10 h-10 rounded-full border-2 top-8 left-12" style={{ borderColor: '#ede5d8', opacity: 0.6 }} />
          <div className="absolute w-6 h-6 rounded-full top-20 left-32" style={{ background: '#ede5d8', opacity: 0.3 }} />
          <div className="absolute w-8 h-8 rounded-full border-2 bottom-12 left-16" style={{ borderColor: '#ede5d8', opacity: 0.5 }} />
          <div className="absolute w-5 h-5 rounded-full bottom-28 left-40" style={{ background: '#ede5d8', opacity: 0.3 }} />
          <div className="absolute w-7 h-7 rounded-full border-2 top-12 right-24" style={{ borderColor: '#ede5d8', opacity: 0.4 }} />
          <div className="absolute w-4 h-4 rounded-full bottom-16 right-32" style={{ background: '#ede5d8', opacity: 0.3 }} />

          {/* Illustration — fashion/boutique themed SVG */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Dress hanger illustration */}
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Hanger hook */}
              <path d="M110 20 C110 20 110 10 120 10 C130 10 130 20 120 28 L110 35" stroke="#ede5d8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
              {/* Hanger bar */}
              <path d="M110 35 L60 65 M110 35 L160 65" stroke="#ede5d8" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
              {/* Dress body */}
              <path d="M60 65 Q50 90 45 130 Q42 160 55 175 Q80 190 110 190 Q140 190 165 175 Q178 160 175 130 Q170 90 160 65 Z" fill="#ede5d8" opacity="0.85"/>
              {/* Dress waist */}
              <path d="M70 110 Q110 100 150 110" stroke="#c9b99a" strokeWidth="2" fill="none" opacity="0.7"/>
              {/* Dress neckline detail */}
              <path d="M60 65 Q85 80 110 75 Q135 80 160 65" stroke="#c9b99a" strokeWidth="1.5" fill="none" opacity="0.6"/>
              {/* Dress hem detail */}
              <path d="M55 175 Q110 185 165 175" stroke="#c9b99a" strokeWidth="1.5" fill="none" opacity="0.6"/>
              {/* Floral accent left */}
              <circle cx="75" cy="145" r="8" fill="#d4a574" opacity="0.7"/>
              <circle cx="75" cy="145" r="4" fill="#ede5d8" opacity="0.8"/>
              {/* Floral accent right */}
              <circle cx="145" cy="145" r="8" fill="#d4a574" opacity="0.7"/>
              <circle cx="145" cy="145" r="4" fill="#ede5d8" opacity="0.8"/>
              {/* Small leaves */}
              <ellipse cx="90" cy="138" rx="6" ry="3" fill="#8a9e7a" opacity="0.7" transform="rotate(-30 90 138)"/>
              <ellipse cx="130" cy="138" rx="6" ry="3" fill="#8a9e7a" opacity="0.7" transform="rotate(30 130 138)"/>
            </svg>

            {/* Text below illustration */}
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: '#ede5d8' }}>Fashion Admin Portal</p>
              <p className="text-xs mt-1 opacity-70" style={{ color: '#ede5d8' }}>Manage your boutique with elegance</p>
            </div>

            {/* Small decorative dots row */}
            <div className="flex items-center gap-2 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: i === 1 ? '20px' : '8px',
                    height: '8px',
                    background: '#ede5d8',
                    opacity: i === 1 ? 0.9 : 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
