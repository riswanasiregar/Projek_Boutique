export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: '#FFFFFF' }}>
      <div className="flex flex-col items-center gap-5">
        {/* Boutique logo mark */}
        <div className="relative">
          <img src="/img/logoboutique.svg" alt="Boutique" className="object-contain" style={{ width: 400, height: 134 }} />
          {/* Spinning ring */}
          <div className="absolute -inset-2 rounded-2xl border-2 border-transparent animate-spin"
            style={{ borderTopColor: '#2D60FF', borderRightColor: '#2D60FF33' }} />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <p className="text-base font-bold" style={{ color: '#343C6A' }}>
            Boutique<span style={{ color: '#2D60FF' }}>.</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#718EBF' }}>Loading...</p>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{
                background: '#2D60FF',
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s',
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}
