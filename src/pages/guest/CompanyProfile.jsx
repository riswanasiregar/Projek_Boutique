import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const CATEGORIES = ['All', 'Dress', 'Top', 'Bottom', 'Outerwear', 'Accessories'];

/* ── Product image lookup ── */
const PRODUCT_IMAGES = [
  { keywords: ['blouse', 'white'],             src: '/img/Classic Blouse white.png' },
  { keywords: ['cami', 'crop'],                src: '/img/crop cami top.png' },
  { keywords: ['waist', 'weist', 'high'],      src: '/img/high-weist.png' },
  { keywords: ['cardigan', 'knit'],            src: '/img/knit cardigan.png' },
  { keywords: ['blazer', 'linen'],             src: '/img/linen blazer.png' },
  { keywords: ['skirt', 'silk', 'midi'],       src: '/img/silk midi skirt.png' },
  { keywords: ['summer', 'dress'],             src: '/img/summer dress.png' },
  { keywords: ['trench', 'tren', 'coat'],      src: '/img/tren coatch.png' },
  { keywords: ['jeans', 'wide', 'widi', 'leg'],src: '/img/widi lig jeans.png' },
  { keywords: ['wrap', 'maxi'],                src: '/img/wrap maxi dress.png' },
];

function getProductImage(product) {
  const name = (product?.name || '').toLowerCase();
  const match = PRODUCT_IMAGES.find(img =>
    img.keywords.some(kw => name.includes(kw))
  );
  return match?.src || '/img/summer dress.png';
}

function fmtRp(v) {
  return 'Rp ' + (v || 0).toLocaleString('id-ID');
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? 'text-accent-yellow' : 'text-neutral-border'} style={{ fontSize: '16px' }}>★</span>
      ))}
    </div>
  );
}

/* ── Section heading helper ── */
function SectionHeading({ badge, title, subtitle }) {
  return (
    <div className="text-center mb-12">
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-3"
          style={{ background: '#E7EDFF', color: '#2D60FF' }}>
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#343C6A' }}>{title}</h2>
      {subtitle && <p className="text-base max-w-xl mx-auto" style={{ color: '#718EBF' }}>{subtitle}</p>}
    </div>
  );
}

export default function CompanyProfile() {
  const [products, setProducts]       = useState([]);
  const [feedbacks, setFeedbacks]     = useState([]);
  const [activeCategory, setCategory] = useState('All');
  const [selectedProduct, setSelected] = useState(null);
  const [loadingProducts, setLoadingP] = useState(true);
  const [loadingFeedbacks, setLoadingF] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => { if (!error && data) setProducts(data); setLoadingP(false); });
    supabase.from('feedbacks').select('*').eq('status', 'Published').order('created_at', { ascending: false })
      .then(({ data, error }) => { if (!error && data) setFeedbacks(data); setLoadingF(false); });
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <>
      {/* ════════ HERO ════════ */}
      <section id="home" className="relative overflow-hidden" style={{ minHeight: '600px', background: 'linear-gradient(135deg, #123288 0%, #2D60FF 100%)' }}>
        {/* Decorative circles */}
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
              { value: `${products.length}+`, label: 'Products' },
              { value: `${feedbacks.length}+`, label: 'Reviews' },
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

      {/* ════════ ABOUT US ════════ */}
      <section id="about" className="py-20" style={{ background: '#F5F7FA' }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="About Us"
            title="Cerita di Balik Ris.Style"
            subtitle="Menghadirkan fashion berkualitas tinggi dengan sentuhan elegan untuk wanita modern"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left — image */}
            <div className="rounded-3xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
              <img
                src="/img/backround.png"
                alt="Ris.Style Store"
                className="w-full h-80 object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            </div>

            {/* Right — text */}
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#343C6A' }}>Kualitas Premium, Desain Eksklusif</h3>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#718EBF' }}>
                Ris.Style didirikan dengan visi untuk menyediakan koleksi fashion berkualitas tinggi yang menggabungkan keanggunan klasik dengan tren modern. Setiap produk kami dipilih dengan cermat untuk memastikan kualitas bahan, jahitan, dan desain terbaik.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '✦', title: 'Visi', desc: 'Menjadi destinasi fashion utama yang menginspirasi kepercayaan diri.' },
                  { icon: '✦', title: 'Misi', desc: 'Menyediakan produk berkualitas premium dengan pelayanan terbaik.' },
                  { icon: '✦', title: 'Kualitas', desc: 'Material pilihan terbaik dengan standar kualitas tinggi.' },
                  { icon: '✦', title: 'Eksklusif', desc: 'Desain unik dan terbatas untuk tampilan yang istimewa.' },
                ].map(v => (
                  <div key={v.title} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
                    <span className="text-lg" style={{ color: '#2D60FF' }}>{v.icon}</span>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#343C6A' }}>{v.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#718EBF' }}>{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PRODUCTS ════════ */}
      <section id="products" className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Our Collection"
            title="Koleksi Produk Kami"
            subtitle="Jelajahi berbagai pilihan fashion terbaik yang kami kurasi untuk Anda"
          />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                style={activeCategory === cat
                  ? { background: '#2D60FF', color: '#fff' }
                  : { background: '#F5F7FA', color: '#718EBF', border: '1px solid #E6EFF5' }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {loadingProducts ? (
            <p className="text-center text-sm py-12" style={{ color: '#718EBF' }}>Memuat produk...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-sm py-12" style={{ color: '#718EBF' }}>Belum ada produk di kategori ini.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="group rounded-2xl overflow-hidden cursor-pointer transition-all"
                  style={{ background: '#fff', border: '1px solid #E6EFF5' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Product image */}
                  <div className="aspect-square overflow-hidden" style={{ background: '#F5F7FA' }}>
                    <img
                      src={getProductImage(p)}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                      style={{ background: '#E7EDFF', color: '#2D60FF' }}>
                      {p.category}
                    </span>
                    <p className="text-sm font-semibold mb-1 truncate" style={{ color: '#343C6A' }}>{p.name}</p>
                    <p className="text-base font-bold" style={{ color: '#2D60FF' }}>{fmtRp(p.price)}</p>
                    {p.stock <= 0 && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: '#FFE0EB', color: '#FE5C73' }}>Sold Out</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section id="testimonials" className="py-20" style={{ background: '#F5F7FA' }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Testimonials"
            title="Apa Kata Mereka?"
            subtitle="Review jujur dari pelanggan setia Ris.Style"
          />

          {loadingFeedbacks ? (
            <p className="text-center text-sm py-12" style={{ color: '#718EBF' }}>Memuat testimonial...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-center text-sm py-12" style={{ color: '#718EBF' }}>Belum ada testimonial.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.slice(0, 6).map(f => (
                <div key={f.id} className="p-6 rounded-2xl transition-shadow" style={{ background: '#fff', border: '1px solid #E6EFF5' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
                  {/* Stars */}
                  <Stars rating={f.rating} />
                  {/* Comment */}
                  <p className="text-sm mt-4 mb-5 leading-relaxed" style={{ color: '#718EBF' }}>
                    "{f.comment}"
                  </p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: '#E7EDFF', color: '#2D60FF' }}>
                      {f.customer_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#343C6A' }}>{f.customer_name}</p>
                      <p className="text-xs" style={{ color: '#B1B1B1' }}>Customer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════ MEMBERSHIP ════════ */}
      <section id="membership" className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Membership"
            title="Program Loyalitas Ris.Style"
            subtitle="Dapatkan poin dari setiap transaksi dan nikmati benefit eksklusif di setiap tier membership"
          />

          {/* Tier cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                tier: 'Bronze',
                emoji: '\uD83E\uDD49',
                points: '0–749 POIN',
                benefit: 'Welcome Member & Promo Eksklusif',
                color: '#CD7F32',
                shadow: '#FDF0E2',
                perks: ['1 poin setiap transaksi Rp10.000', 'Diskon ulang tahun 5%', 'Akses promo member setiap bulan', 'Notifikasi koleksi terbaru lebih awal', 'Gratis gift wrapping', 'Giveaway khusus member'],
              },
              {
                tier: 'Silver',
                emoji: '\uD83E\uDD48',
                points: '750–1.499 POIN',
                benefit: 'Diskon Belanja 5%',
                color: '#718EBF',
                shadow: '#E7EDFF',
                perks: ['Semua benefit Bronze', 'Diskon 5% seluruh produk reguler', 'Gratis ongkir min. Rp300.000', 'Prioritas pre-order koleksi baru', 'Voucher ulang tahun Rp50.000', 'Bonus 50 poin (belanja >Rp1jt)'],
              },
              {
                tier: 'Gold',
                emoji: '\uD83E\uDD47',
                points: '1.500–2.999 POIN',
                benefit: 'Diskon Belanja 10%',
                color: '#FFBB38',
                shadow: '#FFF5D9',
                perks: ['Semua benefit Silver', 'Diskon 10% seluruh produk reguler', 'Early access 2 hari lebih awal', 'Free personal styling consultation', 'Gratis gift eksklusif tiap semester', 'Bonus poin 2x saat event tertentu', 'Prioritas stok limited edition'],
              },
            ].map(t => (
              <div key={t.tier} className="rounded-2xl p-6 flex flex-col" style={{ background: '#fff', border: '1px solid #E6EFF5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                {/* Tier header */}
                <div className="rounded-xl p-4 mb-4 text-center" style={{ background: t.shadow }}>
                  <span style={{ fontSize: '36px' }}>{t.emoji}</span>
                  <p className="text-lg font-bold mt-1" style={{ color: t.color }}>{t.tier} Member</p>
                  <p className="text-xs font-semibold" style={{ color: '#718EBF' }}>{t.points}</p>
                </div>
                {/* Benefit utama */}
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#B1B1B1' }}>Benefit Utama</p>
                  <p className="text-sm font-bold" style={{ color: '#343C6A' }}>{t.benefit}</p>
                </div>
                {/* Perks */}
                <ul className="space-y-2 flex-1">
                  {t.perks.map(p => (
                    <li key={p} className="flex items-start gap-2 text-xs" style={{ color: '#718EBF' }}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: t.color }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Point system + redemption */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cara mendapatkan poin */}
            <div className="rounded-2xl p-6" style={{ background: '#F5F7FA', border: '1px solid #E6EFF5' }}>
              <h3 className="text-lg font-bold mb-5" style={{ color: '#343C6A' }}>Cara Mendapatkan Poin</h3>
              <div className="space-y-3">
                {[
                  { action: 'Belanja Rp10.000', reward: '1 poin' },
                  { action: 'Membuat akun member', reward: '50 poin' },
                  { action: 'Ulang tahun', reward: '100 poin' },
                  { action: 'Mengajak teman berbelanja', reward: '150 poin' },
                  { action: 'Review produk', reward: '20 poin' },
                  { action: 'Promo tertentu', reward: 'Double Point Day' },
                ].map(r => (
                  <div key={r.action} className="flex items-center justify-between py-2 px-4 rounded-xl" style={{ background: '#fff' }}>
                    <span className="text-sm" style={{ color: '#718EBF' }}>{r.action}</span>
                    <span className="text-sm font-bold" style={{ color: '#2D60FF' }}>{r.reward}</span>
                  </div>
                ))}
              </div>
              {/* Contoh perhitungan */}
              <div className="mt-5 p-4 rounded-xl" style={{ background: '#fff' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: '#343C6A' }}>Contoh Perhitungan</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ color: '#718EBF' }}>
                      <th className="text-left py-1">Total Belanja</th>
                      <th className="text-right py-1">Poin Didapat</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: '#343C6A' }}>
                    {[
                      ['Rp100.000', '10 poin'],
                      ['Rp250.000', '25 poin'],
                      ['Rp500.000', '50 poin'],
                      ['Rp1.000.000', '100 poin'],
                    ].map(([a, b]) => (
                      <tr key={a} style={{ borderTop: '1px solid #E6EFF5' }}>
                        <td className="py-1.5">{a}</td>
                        <td className="text-right font-semibold">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Penukaran poin */}
            <div className="rounded-2xl p-6" style={{ background: '#F5F7FA', border: '1px solid #E6EFF5' }}>
              <h3 className="text-lg font-bold mb-5" style={{ color: '#343C6A' }}>Penukaran Poin</h3>
              <div className="space-y-3">
                {[
                  { poin: '100 poin',  reward: 'Voucher Rp20.000',                  icon: '🎟️' },
                  { poin: '250 poin',  reward: 'Voucher Rp50.000',                  icon: '🎟️' },
                  { poin: '500 poin',  reward: 'Gratis ongkir 5 kali',              icon: '📦' },
                  { poin: '750 poin',  reward: 'Diskon tambahan 10% sekali pakai',  icon: '🏷️' },
                  { poin: '1.000 poin', reward: 'Gift box eksklusif Ris.Style',      icon: '🎁' },
                  { poin: '1.500 poin', reward: 'Voucher Rp250.000',                icon: '💳' },
                ].map(r => (
                  <div key={r.poin} className="flex items-center gap-3 py-3 px-4 rounded-xl" style={{ background: '#fff' }}>
                    <span style={{ fontSize: '20px' }}>{r.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: '#343C6A' }}>{r.reward}</p>
                      <p className="text-xs" style={{ color: '#718EBF' }}>{r.poin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section id="faq" className="py-20" style={{ background: '#F5F7FA' }}>
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading
            badge="FAQ"
            title="Pertanyaan yang Sering Diajukan"
            subtitle="Temukan jawaban untuk pertanyaan umum seputar pemesanan, pembayaran, dan membership Ris.Style"
          />

          <div className="space-y-3">
            {[
              {
                q: 'Bagaimana cara melakukan pemesanan?',
                a: 'Pilih produk yang diinginkan, tambahkan ke keranjang, lalu lanjutkan ke proses checkout dan lakukan pembayaran sesuai metode yang tersedia.',
              },
              {
                q: 'Metode pembayaran apa saja yang tersedia?',
                a: 'Kami menerima pembayaran melalui:\n\u2022 Transfer bank\n\u2022 E-wallet (OVO, GoPay, DANA, ShopeePay)\n\u2022 QRIS\n\u2022 Kartu debit/kredit',
              },
              {
                q: 'Berapa lama proses pengiriman?',
                a: 'Pesanan diproses dalam waktu 1\u20132 hari kerja setelah pembayaran dikonfirmasi. Estimasi pengiriman bergantung pada lokasi tujuan dan jasa ekspedisi yang dipilih.',
              },
              {
                q: 'Apakah saya bisa menukar atau mengembalikan barang?',
                a: 'Ya. Penukaran dapat dilakukan maksimal 3 hari setelah barang diterima dengan syarat:\n\u2022 Produk belum digunakan\n\u2022 Label dan kemasan masih lengkap\n\u2022 Tidak ada kerusakan akibat penggunaan',
              },
              {
                q: 'Bagaimana jika ukuran pakaian tidak sesuai?',
                a: 'Kami menyediakan panduan ukuran pada setiap produk. Jika ukuran tidak sesuai, pelanggan dapat mengajukan penukaran sesuai kebijakan toko.',
              },
              {
                q: 'Apakah produk yang ditampilkan sesuai dengan foto?',
                a: 'Kami berusaha menampilkan foto produk seakurat mungkin. Namun, perbedaan warna dapat terjadi karena pencahayaan atau pengaturan layar perangkat masing-masing.',
              },
              {
                q: 'Bagaimana cara menjadi member Ris.Style?',
                a: 'Pelanggan akan otomatis menjadi Bronze Member setelah mendaftar akun dan melakukan pembelian pertama. Poin akan terkumpul dari setiap transaksi untuk meningkatkan level keanggotaan.',
              },
              {
                q: 'Bagaimana sistem poin member bekerja?',
                a: 'Setiap pembelian Rp10.000 akan mendapatkan 1 poin. Poin dapat digunakan untuk naik tingkat member dan ditukarkan dengan berbagai keuntungan eksklusif.',
              },
              {
                q: 'Apakah ada diskon khusus untuk member?',
                a: 'Ya. Setiap tingkat member memperoleh keuntungan yang berbeda:\n\u2022 Bronze: Promo khusus member\n\u2022 Silver: Diskon 5%\n\u2022 Gold: Diskon 10% dan akses prioritas',
              },
              {
                q: 'Bagaimana cara menghubungi customer service?',
                a: 'Anda dapat menghubungi kami melalui:\n\u2022 WhatsApp: +62 xxx-xxxx-xxxx\n\u2022 Instagram: @ris.style\n\u2022 Email: hello@risstyle.com',
              },
              {
                q: 'Apakah tersedia layanan pre-order?',
                a: 'Ya, beberapa koleksi eksklusif tersedia melalui sistem pre-order. Estimasi waktu produksi akan dicantumkan pada halaman produk.',
              },
              {
                q: 'Apakah tersedia gift wrapping?',
                a: 'Ya, kami menyediakan layanan gift wrapping gratis untuk member dan pembelian tertentu.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-all"
                  style={{ color: openFaq === i ? '#2D60FF' : '#343C6A' }}
                >
                  <span className="text-sm font-semibold pr-4">{i + 1}. {item.q}</span>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform"
                    style={{
                      background: openFaq === i ? '#2D60FF' : '#F5F7FA',
                      color: openFaq === i ? '#fff' : '#718EBF',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s, background 0.2s',
                    }}
                  >
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5" style={{ borderTop: '1px solid #E6EFF5' }}>
                    <p className="text-sm leading-relaxed pt-4" style={{ color: '#718EBF', whiteSpace: 'pre-line' }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA Section ════════ */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #123288 0%, #2D60FF 100%)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Siap untuk Berbelanja?</h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Daftar sekarang dan nikmati pengalaman berbelanja fashion premium dengan koleksi eksklusif kami.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-full text-base font-semibold transition-all"
              style={{ background: '#FFBB38', color: '#343C6A' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,187,56,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-full text-base font-semibold transition-all"
              style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden" style={{ background: '#fff' }}
            onClick={e => e.stopPropagation()}>
            {/* Header image */}
            <div className="aspect-video overflow-hidden" style={{ background: '#F5F7FA' }}>
              <img
                src={getProductImage(selectedProduct)}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                    style={{ background: '#E7EDFF', color: '#2D60FF' }}>
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-lg font-bold" style={{ color: '#343C6A' }}>{selectedProduct.name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#F5F7FA' }}>
                  <svg className="w-4 h-4" fill="none" stroke="#718EBF" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-2xl font-bold mb-4" style={{ color: '#2D60FF' }}>{fmtRp(selectedProduct.price)}</p>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm" style={{ color: '#718EBF' }}>Stock:</span>
                <span className={`text-sm font-bold ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-secondary'}`}>
                  {selectedProduct.stock > 0 ? `${selectedProduct.stock} tersedia` : 'Habis'}
                </span>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 text-center px-6 py-3 rounded-full text-sm font-semibold text-white transition-all"
                  style={{ background: '#2D60FF' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  Pesan Sekarang
                </Link>
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-3 rounded-full text-sm font-semibold transition-all"
                  style={{ border: '1.5px solid #E6EFF5', color: '#718EBF' }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
