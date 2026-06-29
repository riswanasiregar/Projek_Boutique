import { LoaderCircleIcon } from 'lucide-react';
import { SectionHeading, getProductImage, fmtRp } from '../../shared/utils';

export default function Shop({ products, loadingProducts, cart, addToCart }) {
  return (
    <section id="products" className="py-16" style={{ background: '#F5F7FA' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading badge="Katalog Produk" title="Belanja Koleksi Terbaru" subtitle="Pilih produk favorit kamu dan dapatkan poin setiap pembelian" />

        {loadingProducts ? (
          <div className="flex justify-center py-20">
            <LoaderCircleIcon className="animate-spin w-8 h-8" style={{ color: '#2D60FF' }} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.filter(p => p.stock > 0).map(product => {
              const inCart = cart.find(c => c.product.id === product.id);
              return (
                <div key={product.id} className="group rounded-2xl overflow-hidden transition-all"
                  style={{ background: '#fff', border: '1px solid #E6EFF5' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="aspect-[3/4] overflow-hidden" style={{ background: '#F5F7FA' }}>
                    <img src={getProductImage(product)} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                      style={{ background: '#E7EDFF', color: '#2D60FF' }}>{product.category}</span>
                    <p className="text-sm font-bold mb-1" style={{ color: '#343C6A' }}>{product.name}</p>
                    <p className="text-lg font-bold mb-3" style={{ color: '#2D60FF' }}>{fmtRp(product.price)}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => addToCart(product)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: inCart ? '#E7EDFF' : '#2D60FF', color: inCart ? '#2D60FF' : '#fff' }}>
                        {inCart ? `✓ ${inCart.qty} di keranjang` : '+ Keranjang'}
                      </button>
                    </div>
                    <p className="text-[10px] mt-2" style={{ color: '#B1B1B1' }}>Stok: {product.stock} · +{Math.floor(product.price / 10000)} poin</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
