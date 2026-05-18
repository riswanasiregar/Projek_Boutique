export function StatusBadge({ status }) {
  const types = {
    Completed: 'bg-accent-green-shadow text-accent-green',
    Pending:   'bg-accent-yellow-shadow text-accent-yellow',
    Cancelled: 'bg-accent-pink-shadow text-secondary',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold font-inter
      ${types[status] || 'bg-accent-blue-shadow text-accent-blue'}`}>
      {status}
    </span>
  );
}
export function LoyaltyBadge({ loyalty }) {
  const types = {
    Gold:   'bg-accent-yellow-shadow text-accent-yellow',
    Silver: 'bg-accent-blue-shadow text-accent-blue',
    Bronze: 'bg-accent-pink-shadow text-secondary',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold font-inter
      ${types[loyalty] || 'bg-accent-blue-shadow text-accent-blue'}`}>
      {loyalty}
    </span>
  );
}
export function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all font-inter
        ${active ? 'bg-primary-3 text-neutral' : 'bg-neutral-bg text-neutral-teks'}`}>
      {label}
    </button>
  );
}
export function LabelBadge({ label, bgClass = 'bg-accent-blue-shadow', textClass = 'text-primary-3' }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium font-inter ${bgClass} ${textClass}`}>
      {label}
    </span>
  );
}
