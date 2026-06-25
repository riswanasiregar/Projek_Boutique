export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  wide = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4
      bg-primary-2/50 backdrop-blur-sm"
    >
      <div className={`rounded-2xl shadow-2xl w-full overflow-hidden bg-neutral ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-primary-3">
          <div>
            <h3 className="text-base font-bold text-neutral font-inter">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-neutral/70 font-inter">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center
              text-neutral/70 hover:text-neutral transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">{children}</div>

        {/* Footer */}
        {footer && <div className="px-6 pb-6">{footer}</div>}
      </div>
    </div>
  );
}

/* ── Modal Footer dengan tombol Cancel + Submit ── */
export function ModalFooter({
  onCancel,
  cancelLabel = "Cancel",
  submitLabel = "Save",
  loading = false,
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter
          border border-neutral-border text-neutral-teks bg-neutral-bg"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-inter
          bg-primary-3 text-neutral hover:opacity-90 transition-opacity disabled:opacity-50
          flex items-center justify-center gap-2"
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-neutral border-t-transparent rounded-full animate-spin" />
        )}
        {submitLabel}
      </button>
    </div>
  );
}
