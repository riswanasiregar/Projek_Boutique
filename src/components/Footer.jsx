export default function Footer({ text }) {
  const year = new Date().getFullYear();
  return (
    <footer className="px-6 py-4 border-t border-neutral-border bg-neutral font-inter">
      <p className="text-xs text-neutral-teks text-center">
        {text || `© ${year} Boutique Fashion Admin. All rights reserved.`}
      </p>
    </footer>
  );
}
export function TableFooter({ showing, total, label = 'items' }) {
  return (
    <div className="px-6 py-3 border-t border-neutral-border bg-neutral-bg font-inter">
      <p className="text-xs text-neutral-teks">
        Showing{' '}
        <span className="font-semibold text-primary-2">{showing}</span>
        {' '}of{' '}
        <span className="font-semibold text-primary-2">{total}</span>
        {' '}{label}
      </p>
    </div>
  );
}
export function TotalFooter({ colSpan = 2, totalLabel = 'Total', totalValue }) {
  return (
    <tfoot>
      <tr className="border-t-2 border-neutral-border bg-neutral-bg">
        <td className="px-5 py-3.5 text-sm font-bold text-primary-3 font-inter" colSpan={colSpan}>
          {totalLabel}
        </td>
        <td colSpan={4} />
        <td className="px-5 py-3.5 text-sm font-bold text-primary-3 font-inter text-right">
          {totalValue}
        </td>
      </tr>
    </tfoot>
  );
}
