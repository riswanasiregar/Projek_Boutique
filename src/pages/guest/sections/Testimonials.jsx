import { SectionHeading, Stars } from '../../shared/utils';

export default function Testimonials({ feedbacks = [], loading = false }) {
  return (
    <section id="testimonials" className="py-20" style={{ background: '#F5F7FA' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Testimonials"
          title="Apa Kata Mereka?"
          subtitle="Review jujur dari pelanggan setia Ris.Style"
        />

        {loading ? (
          <p className="text-center text-sm py-12" style={{ color: '#718EBF' }}>Memuat testimonial...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-sm py-12" style={{ color: '#718EBF' }}>Belum ada testimonial.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.slice(0, 6).map(f => (
              <div key={f.id} className="p-6 rounded-2xl transition-shadow" style={{ background: '#fff', border: '1px solid #E6EFF5' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
                <Stars rating={f.rating} />
                <p className="text-sm mt-4 mb-5 leading-relaxed" style={{ color: '#718EBF' }}>
                  "{f.comment}"
                </p>
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
  );
}
