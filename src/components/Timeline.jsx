export default function Timeline({ steps = [], title = 'Status Timeline' }) {
  return (
    <div className="rounded-2xl p-5 bg-neutral border border-neutral-border">
      <p className="text-sm font-semibold text-primary-2 mb-4 font-inter">{title}</p>
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
              ${step.cancelled
                ? 'bg-accent-pink-shadow text-secondary'
                : step.done
                  ? 'bg-primary-3 text-neutral'
                  : 'bg-neutral-bg text-neutral-teks'
              }`}>
              {step.cancelled ? '✕' : step.done ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-px flex-1 my-1 ${step.done ? 'bg-primary-3' : 'bg-neutral-border'}`}
                style={{ minHeight: '16px' }}
              />
            )}
          </div>
          <div className="pb-3">
            <p className={`text-xs font-semibold font-inter
              ${step.done ? 'text-primary-2' : 'text-neutral-teks'}`}>
              {step.label}
            </p>
            <p className="text-xs text-neutral-teks font-inter">{step.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
