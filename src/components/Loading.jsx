export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: '#f5f0eb' }}>
      <div className="flex flex-col items-center gap-5">
        {/* Boutique logo mark */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{ background: '#3d2e22', color: '#c9a96e' }}>
            B
          </div>
          {/* Spinning ring */}
          <div className="absolute -inset-2 rounded-2xl border-2 border-transparent animate-spin"
            style={{ borderTopColor: '#c9a96e', borderRightColor: '#c9a96e33' }} />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <p className="text-base font-bold" style={{ color: '#3d2e22' }}>
            Boutique<span style={{ color: '#c9a96e' }}>.</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#9a8878' }}>Loading your fashion dashboard...</p>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{
                background: '#c9a96e',
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s',
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}
