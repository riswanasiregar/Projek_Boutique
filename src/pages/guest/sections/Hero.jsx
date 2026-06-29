export default function Hero({ productCount = 0, reviewCount = 0 }) {
  return (
    <section id="home" className="relative overflow-hidden" style={{ minHeight: '600px', background: 'linear-gradient(135deg, #123288 0%, #2D60FF 100%)' }}>
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10" style={{ background: '#fff' }} />
      <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full opacity-10" style={{ background: '#fff' }} />

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: '600px' }}>
        <span className="inline-block px-5 py-2 rounded-full text-sm font-semibold mb-6"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
          Welcome to Ris.Style
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Fashion Elegance<br />
          <span style={{ color: '#FFBB38' }}>for Every Moment</span>
        </h1>
        <p className="text-lg max-w-2xl mb-10" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Temukan koleksi pakaian premium dengan desain eksklusif yang menampilkan keanggunan dan kenyamanan untuk setiap kesempatan istimewa Anda.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-full text-base font-semibold transition-all"
            style={{ background: '#FFBB38', color: '#343C6A' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,187,56,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Lihat Koleksi
          </button>
          <button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-full text-base font-semibold transition-all"
            style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Tentang Kami
          </button>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
          {[
            { value: `${productCount}+`, label: 'Products' },
            { value: `${reviewCount}+`, label: 'Reviews' },
            { value: '100%', label: 'Premium' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
