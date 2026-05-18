export default function BackButton({ onClick, title, breadcrumb }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onClick}
        className="w-9 h-9 flex items-center justify-center rounded-full
          bg-accent-blue-shadow text-primary-3
          hover:bg-primary-3 hover:text-neutral transition-all">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div>
        <h1 className="text-xl font-semibold text-primary-2 font-inter">{title}</h1>
        {breadcrumb && (
          <p className="text-xs text-neutral-teks font-inter">{breadcrumb}</p>
        )}
      </div>
    </div>
  );
}
