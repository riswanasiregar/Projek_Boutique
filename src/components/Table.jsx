export default function Table({ columns = [], data = [], renderRow, emptyMessage = 'No data found', footer }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-neutral-bg">
            {columns.map((col, i) => (
              <th key={col.key || i}
                className={`px-5 py-3.5 text-xs font-semibold text-neutral-teks font-inter
                  ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}
                className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((row, i) => renderRow(row, i))}
        </tbody>
        {footer && (
          <tfoot>
            <tr className="border-t-2 border-neutral-border bg-neutral-bg">
              {footer}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
export function TableRow({ children, onClick }) {
  return (
    <tr
      className="border-t border-neutral-border hover:bg-neutral-bg transition-colors cursor-default"
      onClick={onClick}>
      {children}
    </tr>
  );
}
export function TableCell({ children, align = 'left', className = '' }) {
  return (
    <td className={`px-5 py-4 text-sm font-inter
      ${align === 'right' ? 'text-right' : ''}
      ${className}`}>
      {children}
    </td>
  );
}
