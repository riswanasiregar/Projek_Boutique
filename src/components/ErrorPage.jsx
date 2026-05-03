import { useNavigate } from 'react-router-dom';

/* ── Per-code illustration config ── */
const illustrationConfig = {
  400: {
    label: 'Bad Request',
    illustration: (
      <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Ground shadow */}
        <ellipse cx="200" cy="245" rx="130" ry="10" fill="#d4c4b0" opacity="0.4"/>

        {/* Big 400 text */}
        <text x="200" y="185" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900"
          fontSize="140" fill="#ede5d8" letterSpacing="-4">400</text>
        <text x="200" y="182" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900"
          fontSize="138" fill="none" stroke="#d4c4b0" strokeWidth="2" letterSpacing="-4">400</text>

        {/* Monitor / screen */}
        <rect x="120" y="60" width="160" height="110" rx="10" fill="#3d2e22"/>
        <rect x="128" y="68" width="144" height="90" rx="6" fill="#f5f0eb"/>
        <rect x="185" y="170" width="30" height="18" rx="2" fill="#3d2e22"/>
        <rect x="165" y="186" width="70" height="6" rx="3" fill="#3d2e22"/>

        {/* Screen content — broken document */}
        <rect x="145" y="82" width="60" height="8" rx="3" fill="#d4c4b0"/>
        <rect x="145" y="96" width="90" height="6" rx="3" fill="#e2d9ce"/>
        <rect x="145" y="108" width="75" height="6" rx="3" fill="#e2d9ce"/>
        <rect x="145" y="120" width="50" height="6" rx="3" fill="#e2d9ce"/>

        {/* Warning icon on screen */}
        <circle cx="235" cy="100" r="16" fill="#c9a96e" opacity="0.9"/>
        <text x="235" y="106" textAnchor="middle" fontFamily="Arial" fontWeight="900"
          fontSize="18" fill="#3d2e22">!</text>

        {/* Person left — looking confused */}
        {/* Body */}
        <ellipse cx="80" cy="200" rx="18" ry="8" fill="#d4c4b0" opacity="0.3"/>
        <rect x="70" y="155" width="20" height="40" rx="8" fill="#c9a96e"/>
        {/* Head */}
        <circle cx="80" cy="143" r="14" fill="#f5d5b0"/>
        {/* Hair */}
        <ellipse cx="80" cy="133" rx="14" ry="8" fill="#3d2e22"/>
        {/* Eyes */}
        <circle cx="75" cy="143" r="2" fill="#3d2e22"/>
        <circle cx="85" cy="143" r="2" fill="#3d2e22"/>
        {/* Mouth — frown */}
        <path d="M76 151 Q80 148 84 151" stroke="#3d2e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Arm pointing */}
        <path d="M88 165 Q105 150 118 140" stroke="#f5d5b0" strokeWidth="6" strokeLinecap="round" fill="none"/>
        {/* Legs */}
        <rect x="72" y="192" width="8" height="20" rx="4" fill="#6b5040"/>
        <rect x="82" y="192" width="8" height="20" rx="4" fill="#6b5040"/>

        {/* Person right — arms up */}
        <ellipse cx="320" cy="200" rx="18" ry="8" fill="#d4c4b0" opacity="0.3"/>
        <rect x="310" y="155" width="20" height="40" rx="8" fill="#8b7355"/>
        <circle cx="320" cy="143" r="14" fill="#f5d5b0"/>
        <ellipse cx="320" cy="133" rx="14" ry="8" fill="#6b5040"/>
        <circle cx="315" cy="143" r="2" fill="#3d2e22"/>
        <circle cx="325" cy="143" r="2" fill="#3d2e22"/>
        <path d="M316 150 Q320 153 324 150" stroke="#3d2e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Arms up */}
        <path d="M312 162 Q298 145 290 135" stroke="#f5d5b0" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M328 162 Q342 145 350 135" stroke="#f5d5b0" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <rect x="312" y="192" width="8" height="20" rx="4" fill="#6b5040"/>
        <rect x="322" y="192" width="8" height="20" rx="4" fill="#6b5040"/>

        {/* Floating question marks */}
        <text x="55" y="120" fontFamily="Georgia,serif" fontWeight="900" fontSize="28" fill="#c9a96e" opacity="0.7">?</text>
        <text x="340" y="110" fontFamily="Georgia,serif" fontWeight="900" fontSize="22" fill="#c9a96e" opacity="0.5">?</text>
        <text x="160" y="45" fontFamily="Georgia,serif" fontWeight="900" fontSize="18" fill="#8b7355" opacity="0.6">?</text>

        {/* Gear decorations */}
        <circle cx="355" cy="55" r="18" fill="none" stroke="#d4c4b0" strokeWidth="3" strokeDasharray="6 4"/>
        <circle cx="355" cy="55" r="8" fill="#ede5d8"/>
        <circle cx="45" cy="65" r="12" fill="none" stroke="#d4c4b0" strokeWidth="2.5" strokeDasharray="5 3"/>
        <circle cx="45" cy="65" r="5" fill="#ede5d8"/>
      </svg>
    ),
  },
  401: {
    label: 'Unauthorized',
    illustration: (
      <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Ground shadow */}
        <ellipse cx="200" cy="245" rx="130" ry="10" fill="#d4c4b0" opacity="0.4"/>

        {/* Big 401 text */}
        <text x="200" y="185" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900"
          fontSize="140" fill="#ede5d8" letterSpacing="-4">401</text>
        <text x="200" y="182" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900"
          fontSize="138" fill="none" stroke="#d4c4b0" strokeWidth="2" letterSpacing="-4">401</text>

        {/* Big padlock */}
        <rect x="162" y="110" width="76" height="65" rx="10" fill="#3d2e22"/>
        <path d="M178 110 Q178 75 200 75 Q222 75 222 110" stroke="#3d2e22" strokeWidth="12"
          fill="none" strokeLinecap="round"/>
        <circle cx="200" cy="138" r="12" fill="#c9a96e"/>
        <rect x="196" y="138" width="8" height="16" rx="4" fill="#3d2e22"/>

        {/* Key floating */}
        <g transform="translate(290,60) rotate(35)">
          <circle cx="0" cy="0" r="14" fill="none" stroke="#c9a96e" strokeWidth="5"/>
          <rect x="10" y="-3" width="35" height="6" rx="3" fill="#c9a96e"/>
          <rect x="32" y="3" width="6" height="10" rx="2" fill="#c9a96e"/>
          <rect x="40" y="3" width="6" height="8" rx="2" fill="#c9a96e"/>
        </g>

        {/* Person blocked */}
        <ellipse cx="75" cy="205" rx="20" ry="8" fill="#d4c4b0" opacity="0.3"/>
        <rect x="65" y="158" width="20" height="42" rx="8" fill="#c9a96e"/>
        <circle cx="75" cy="146" r="14" fill="#f5d5b0"/>
        <ellipse cx="75" cy="136" rx="14" ry="8" fill="#3d2e22"/>
        <circle cx="70" cy="146" r="2" fill="#3d2e22"/>
        <circle cx="80" cy="146" r="2" fill="#3d2e22"/>
        {/* Sad mouth */}
        <path d="M71 154 Q75 151 79 154" stroke="#3d2e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Arm reaching */}
        <path d="M83 168 Q110 155 130 148" stroke="#f5d5b0" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <rect x="67" y="197" width="8" height="20" rx="4" fill="#6b5040"/>
        <rect x="77" y="197" width="8" height="20" rx="4" fill="#6b5040"/>

        {/* Shield / no-entry sign */}
        <circle cx="148" cy="148" r="16" fill="#8a4a3a" opacity="0.85"/>
        <rect x="138" y="145" width="20" height="6" rx="3" fill="white"/>

        {/* Stars / sparkles */}
        <text x="330" y="160" fontFamily="Arial" fontSize="20" fill="#c9a96e" opacity="0.6">✦</text>
        <text x="50" y="80" fontFamily="Arial" fontSize="14" fill="#c9a96e" opacity="0.5">✦</text>
        <text x="350" y="80" fontFamily="Arial" fontSize="16" fill="#8b7355" opacity="0.5">✦</text>

        {/* Decorative circles */}
        <circle cx="360" cy="200" r="22" fill="none" stroke="#e2d9ce" strokeWidth="2.5" strokeDasharray="6 4"/>
        <circle cx="40" cy="190" r="15" fill="none" stroke="#e2d9ce" strokeWidth="2" strokeDasharray="5 3"/>
      </svg>
    ),
  },
  403: {
    label: 'Forbidden',
    illustration: (
      <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Ground shadow */}
        <ellipse cx="200" cy="245" rx="130" ry="10" fill="#d4c4b0" opacity="0.4"/>

        {/* Big 403 text */}
        <text x="200" y="185" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900"
          fontSize="140" fill="#ede5d8" letterSpacing="-4">403</text>
        <text x="200" y="182" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900"
          fontSize="138" fill="none" stroke="#d4c4b0" strokeWidth="2" letterSpacing="-4">403</text>

        {/* Barrier / fence */}
        <rect x="100" y="155" width="200" height="14" rx="7" fill="#3d2e22"/>
        <rect x="100" y="175" width="200" height="14" rx="7" fill="#3d2e22"/>
        <rect x="108" y="148" width="12" height="48" rx="6" fill="#6b5040"/>
        <rect x="148" y="148" width="12" height="48" rx="6" fill="#6b5040"/>
        <rect x="188" y="148" width="12" height="48" rx="6" fill="#6b5040"/>
        <rect x="228" y="148" width="12" height="48" rx="6" fill="#6b5040"/>
        <rect x="268" y="148" width="12" height="48" rx="6" fill="#6b5040"/>
        {/* Diagonal stripes on barrier */}
        <rect x="100" y="155" width="200" height="14" rx="7" fill="url(#stripe403)" opacity="0.3"/>

        {/* No-entry circle */}
        <circle cx="200" cy="100" r="38" fill="#8a4a3a" opacity="0.12"/>
        <circle cx="200" cy="100" r="32" fill="none" stroke="#8a4a3a" strokeWidth="5"/>
        <line x1="177" y1="77" x2="223" y2="123" stroke="#8a4a3a" strokeWidth="5" strokeLinecap="round"/>

        {/* Person stopped */}
        <ellipse cx="75" cy="205" rx="20" ry="8" fill="#d4c4b0" opacity="0.3"/>
        <rect x="65" y="158" width="20" height="42" rx="8" fill="#c9a96e"/>
        <circle cx="75" cy="146" r="14" fill="#f5d5b0"/>
        <ellipse cx="75" cy="136" rx="14" ry="8" fill="#3d2e22"/>
        <circle cx="70" cy="146" r="2" fill="#3d2e22"/>
        <circle cx="80" cy="146" r="2" fill="#3d2e22"/>
        <path d="M71 154 Q75 151 79 154" stroke="#3d2e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Hand up — stop gesture */}
        <path d="M83 165 Q100 155 112 148" stroke="#f5d5b0" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <rect x="67" y="197" width="8" height="20" rx="4" fill="#6b5040"/>
        <rect x="77" y="197" width="8" height="20" rx="4" fill="#6b5040"/>

        {/* Guard person right */}
        <ellipse cx="325" cy="205" rx="20" ry="8" fill="#d4c4b0" opacity="0.3"/>
        <rect x="315" y="158" width="20" height="42" rx="8" fill="#8b7355"/>
        <circle cx="325" cy="146" r="14" fill="#f5d5b0"/>
        <ellipse cx="325" cy="136" rx="14" ry="8" fill="#6b5040"/>
        <circle cx="320" cy="146" r="2" fill="#3d2e22"/>
        <circle cx="330" cy="146" r="2" fill="#3d2e22"/>
        <path d="M321 152 Q325 155 329 152" stroke="#3d2e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Guard arm — stop */}
        <path d="M317 165 Q300 155 288 148" stroke="#f5d5b0" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <rect x="317" y="197" width="8" height="20" rx="4" fill="#6b5040"/>
        <rect x="327" y="197" width="8" height="20" rx="4" fill="#6b5040"/>
        {/* Guard hat */}
        <rect x="314" y="130" width="22" height="8" rx="4" fill="#3d2e22"/>
        <rect x="318" y="122" width="14" height="10" rx="3" fill="#3d2e22"/>

        {/* Decorative */}
        <text x="45" y="120" fontFamily="Arial" fontSize="20" fill="#c9a96e" opacity="0.5">✦</text>
        <text x="350" y="130" fontFamily="Arial" fontSize="16" fill="#c9a96e" opacity="0.5">✦</text>
        <circle cx="360" cy="60" r="18" fill="none" stroke="#e2d9ce" strokeWidth="2.5" strokeDasharray="6 4"/>
        <circle cx="40" cy="70" r="12" fill="none" stroke="#e2d9ce" strokeWidth="2" strokeDasharray="5 3"/>

        <defs>
          <pattern id="stripe403" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
            <rect width="6" height="12" fill="#c9a96e"/>
          </pattern>
        </defs>
      </svg>
    ),
  },
  404: {
    label: 'Not Found',
    illustration: (
      <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Ground shadow */}
        <ellipse cx="200" cy="245" rx="130" ry="10" fill="#d4c4b0" opacity="0.4"/>

        {/* Big 404 text */}
        <text x="200" y="185" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900"
          fontSize="140" fill="#ede5d8" letterSpacing="-4">404</text>
        <text x="200" y="182" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900"
          fontSize="138" fill="none" stroke="#d4c4b0" strokeWidth="2" letterSpacing="-4">404</text>

        {/* Magnifying glass */}
        <circle cx="195" cy="100" r="38" fill="none" stroke="#3d2e22" strokeWidth="8"/>
        <circle cx="195" cy="100" r="28" fill="#f5f0eb" opacity="0.8"/>
        <line x1="222" y1="127" x2="248" y2="155" stroke="#3d2e22" strokeWidth="10" strokeLinecap="round"/>

        {/* Question mark inside glass */}
        <text x="195" y="115" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900"
          fontSize="36" fill="#c9a96e">?</text>

        {/* Person searching left */}
        <ellipse cx="72" cy="205" rx="20" ry="8" fill="#d4c4b0" opacity="0.3"/>
        <rect x="62" y="158" width="20" height="42" rx="8" fill="#c9a96e"/>
        <circle cx="72" cy="146" r="14" fill="#f5d5b0"/>
        <ellipse cx="72" cy="136" rx="14" ry="8" fill="#3d2e22"/>
        <circle cx="67" cy="146" r="2" fill="#3d2e22"/>
        <circle cx="77" cy="146" r="2" fill="#3d2e22"/>
        <path d="M68 153 Q72 156 76 153" stroke="#3d2e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Arm with magnifier */}
        <path d="M80 165 Q100 150 118 138" stroke="#f5d5b0" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <rect x="64" y="197" width="8" height="20" rx="4" fill="#6b5040"/>
        <rect x="74" y="197" width="8" height="20" rx="4" fill="#6b5040"/>

        {/* Person right — shrugging */}
        <ellipse cx="328" cy="205" rx="20" ry="8" fill="#d4c4b0" opacity="0.3"/>
        <rect x="318" y="158" width="20" height="42" rx="8" fill="#8b7355"/>
        <circle cx="328" cy="146" r="14" fill="#f5d5b0"/>
        <ellipse cx="328" cy="136" rx="14" ry="8" fill="#6b5040"/>
        <circle cx="323" cy="146" r="2" fill="#3d2e22"/>
        <circle cx="333" cy="146" r="2" fill="#3d2e22"/>
        <path d="M324 153 Q328 150 332 153" stroke="#3d2e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Shrug arms */}
        <path d="M320 163 Q305 148 295 140" stroke="#f5d5b0" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M336 163 Q351 148 361 140" stroke="#f5d5b0" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <rect x="320" y="197" width="8" height="20" rx="4" fill="#6b5040"/>
        <rect x="330" y="197" width="8" height="20" rx="4" fill="#6b5040"/>

        {/* Floating dots */}
        <circle cx="155" cy="45" r="5" fill="#c9a96e" opacity="0.5"/>
        <circle cx="250" cy="38" r="3.5" fill="#c9a96e" opacity="0.4"/>
        <circle cx="355" cy="90" r="4" fill="#8b7355" opacity="0.4"/>
        <circle cx="45" cy="100" r="4" fill="#8b7355" opacity="0.4"/>
        <text x="48" y="65" fontFamily="Arial" fontSize="18" fill="#c9a96e" opacity="0.5">✦</text>
        <text x="345" y="55" fontFamily="Arial" fontSize="14" fill="#c9a96e" opacity="0.5">✦</text>
      </svg>
    ),
  },
};

export default function ErrorPage({ code, title, description }) {
  const navigate = useNavigate();
  const config = illustrationConfig[code] || illustrationConfig[404];

  return (
    <div
      className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4"
      style={{ background: 'transparent' }}
    >
      <div className="text-center w-full max-w-xl">

        {/* Illustration */}
        <div className="w-full max-w-md mx-auto mb-2" style={{ height: '220px' }}>
          {config.illustration}
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
          style={{ background: '#ede5d8', border: '1px solid #d4c4b0' }}
        >
          <span style={{ color: '#c9a96e', fontSize: '10px' }}>✦</span>
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: '#8b7355' }}
          >
            Boutique · {config.label}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#3d2e22' }}>
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p
            className="text-sm mb-8 max-w-xs mx-auto leading-relaxed"
            style={{ color: '#9a8878' }}
          >
            {description}
          </p>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#3d2e22', color: '#c9a96e' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Kembali ke Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: '#ede5d8', color: '#6b5040', border: '1.5px solid #d4c4b0' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>

        {/* Decorative tags */}
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          {['Dress', 'Top', 'Bottom', 'Outerwear'].map(cat => (
            <span
              key={cat}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: '#ede5d8', color: '#9a8878', border: '1px solid #d4c4b0' }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
