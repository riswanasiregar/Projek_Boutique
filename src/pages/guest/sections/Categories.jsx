import { SectionHeading } from '../../shared/utils';

export default function Categories({ products = [], onCategoryClick }) {
  return (
    <section id="categories" className="py-20" style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Categories"
          title="Shop by Category"
          subtitle="Explore our curated collections across different fashion categories"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {[
            { name: 'Dress',       icon: '👗', desc: 'Elegant dresses for every occasion' },
            { name: 'Top',         icon: '👚', desc: 'Stylish blouses, tees & crop tops' },
            { name: 'Bottom',      icon: '👖', desc: 'Skirts, pants & jeans collection' },
            { name: 'Outerwear',   icon: '🧥', desc: 'Blazers, cardigans & coats' },
            { name: 'Accessories', icon: '👜', desc: 'Bags, scarves & fashion accessories' },
          ].map(cat => (
            <div
              key={cat.name}
              onClick={() => onCategoryClick?.(cat.name)}
              className="group cursor-pointer rounded-2xl p-6 text-center transition-all"
              style={{ background: '#F5F7FA', border: '1px solid #E6EFF5' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(45,96,255,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#2D60FF'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E6EFF5'; }}
            >
              <span className="text-4xl block mb-3">{cat.icon}</span>
              <p className="text-sm font-bold mb-1" style={{ color: '#343C6A' }}>{cat.name}</p>
              <p className="text-xs mb-2" style={{ color: '#718EBF' }}>{cat.desc}</p>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold"
                style={{ background: '#E7EDFF', color: '#2D60FF' }}>
                {products.filter(p => p.category === cat.name).length} items
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
