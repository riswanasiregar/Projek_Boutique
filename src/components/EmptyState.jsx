/**
 * EmptyState — tampilan saat data tidak ditemukan
 *
 * Props:
 * - icon: ReactNode
 * - title: string
 * - description: string
 * - action: ReactNode (tombol aksi, opsional)
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 font-inter">
      {icon && (
        <div className="w-16 h-16 rounded-full flex items-center justify-center
          bg-accent-blue-shadow text-primary-3">
          {icon}
        </div>
      )}
      {title && <p className="text-lg font-semibold text-primary-2">{title}</p>}
      {description && <p className="text-sm text-neutral-teks text-center max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
