/* ── Shared UI helpers for guest & member pages ── */

/* ── Product image lookup ── */
const PRODUCT_IMAGES = [
  { keywords: ['blouse', 'white'],              src: '/img/Classic Blouse white.png' },
  { keywords: ['cami', 'crop'],                 src: '/img/crop cami top.png' },
  { keywords: ['waist', 'weist', 'high'],       src: '/img/high-weist.png' },
  { keywords: ['cardigan', 'knit'],             src: '/img/knit cardigan.png' },
  { keywords: ['blazer', 'linen'],              src: '/img/linen blazer.png' },
  { keywords: ['skirt', 'silk', 'midi'],        src: '/img/silk midi skirt.png' },
  { keywords: ['summer', 'dress'],              src: '/img/summer dress.png' },
  { keywords: ['trench', 'tren', 'coat'],       src: '/img/tren coatch.png' },
  { keywords: ['jeans', 'wide', 'widi', 'leg'], src: '/img/widi lig jeans.png' },
  { keywords: ['wrap', 'maxi'],                 src: '/img/wrap maxi dress.png' },
];

export function getProductImage(product) {
  const name = (product?.name || '').toLowerCase();
  const match = PRODUCT_IMAGES.find(img =>
    img.keywords.some(kw => name.includes(kw))
  );
  return match?.src || '/img/summer dress.png';
}

export function fmtRp(v) {
  return 'Rp ' + (v || 0).toLocaleString('id-ID');
}

export function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'text-accent-yellow' : 'text-neutral-border'} style={{ fontSize: '16px' }}>★</span>
      ))}
    </div>
  );
}

export function SectionHeading({ badge, title, subtitle }) {
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
