import { SectionHeading } from '../../shared/utils';

export default function About() {
  return (
    <section id="about" className="py-20" style={{ background: '#F5F7FA' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="About Us"
          title="Cerita di Balik Ris.Style"
          subtitle="Menghadirkan fashion berkualitas tinggi dengan sentuhan elegan untuk wanita modern"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
            <img
              src="/img/backround.png"
              alt="Ris.Style Store"
              className="w-full h-80 object-cover"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

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
  );
}
