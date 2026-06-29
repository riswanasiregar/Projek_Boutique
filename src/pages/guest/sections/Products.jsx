import { Link } from 'react-router-dom';
import { SectionHeading, getProductImage, fmtRp } from '../../shared/utils';

const CATEGORIES = ['All', 'Dress', 'Top', 'Bottom', 'Outerwear', 'Accessories'];

export default function Products({ products, activeCategory, setCategory, loading, selectedProduct, setSelected }) {
  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  return (
    <>
      <section id="products" className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Our Collection"
            title="Koleksi Produk Kami"
            subtitle="Jelajahi berbagai pilihan fashion terbaik yang kami kurasi untuk Anda"
          />

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                style={activeCategory === cat
                  ? { background: '#2D60FF', color: '#fff' }
                  : { background: '#F5F7FA', color: '#718EBF', border: '1px solid #E6EFF5' }
                }>{cat}</button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-sm py-12" style={{ color: '#718EBF' }}>Memuat produk...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm py-12" style={{ color: '#718EBF' }}>Belum ada produk di kategori ini.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map(p => (
                <div key={p.id} onClick={() => setSelected(p)}
                  className="group rounded-2xl overflow-hidden cursor-pointer transition-all"
                  style={{ background: '#fff', border: '1px solid #E6EFF5' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="aspect-square overflow-hidden" style={{ background: '#F5F7FA' }}>
                    <img src={getProductImage(p)} alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={e => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                      style={{ background: '#E7EDFF', color: '#2D60FF' }}>{p.category}</span>
                    <p className="text-sm font-semibold mb-1 truncate" style={{ color: '#343C6A' }}>{p.name}</p>
                    <p className="text-base font-bold" style={{ color: '#2D60FF' }}>{fmtRp(p.price)}</p>
                    {p.stock <= 0 && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: '#FFE0EB', color: '#FE5C73' }}>Sold Out</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden" style={{ background: '#fff' }}
            onClick={e => e.stopPropagation()}>
            <div className="aspect-video overflow-hidden" style={{ background: '#F5F7FA' }}>
              <img src={getProductImage(selectedProduct)} alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                    style={{ background: '#E7EDFF', color: '#2D60FF' }}>{selectedProduct.category}</span>
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
                <Link to="/login"
                  className="flex-1 text-center px-6 py-3 rounded-full text-sm font-semibold text-white transition-all"
                  style={{ background: '#2D60FF' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                  Pesan Sekarang
                </Link>
                <button onClick={() => setSelected(null)}
                  className="px-6 py-3 rounded-full text-sm font-semibold transition-all"
                  style={{ border: '1.5px solid #E6EFF5', color: '#718EBF' }}>
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
