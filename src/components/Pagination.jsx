/**
 * Pagination — navigasi halaman untuk tabel/list
 *
 * Props:
 * - page: number (halaman aktif, 1-based)
 * - totalPages: number
 * - onPageChange: function(page: number)
 * - showInfo: boolean (tampilkan "Page X of Y", default: true)
 * - className: string
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  showInfo = true,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(page, totalPages);

  return (
    <div className={`flex items-center justify-between px-5 py-3
      border-t border-neutral-border font-inter ${className}`}>

      {/* Info */}
      {showInfo ? (
        <p className="text-xs text-neutral-teks">
          Page <span className="font-semibold text-primary-2">{page}</span> of{' '}
          <span className="font-semibold text-primary-2">{totalPages}</span>
        </p>
      ) : <div />}

      {/* Buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <PageBtn
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </PageBtn>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-xs text-neutral-teks">…</span>
          ) : (
            <PageBtn
              key={p}
              active={p === page}
              onClick={() => onPageChange(p)}>
              {p}
            </PageBtn>
          )
        )}

        {/* Next */}
        <PageBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </PageBtn>
      </div>
    </div>
  );
}

/* ── Internal: single page button ── */
function PageBtn({ children, active, disabled, onClick, ...rest }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[30px] h-[30px] px-2 rounded-lg text-xs font-semibold
        transition-all flex items-center justify-center
        ${active
          ? 'bg-primary-3 text-neutral'
          : disabled
            ? 'text-neutral-teks opacity-40 cursor-not-allowed'
            : 'text-neutral-teks hover:bg-neutral-bg'
        }`}
      {...rest}>
      {children}
    </button>
  );
}

/* ── Build page range with ellipsis ── */
function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}
