interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  color?: string;
}

export function ProgressBar({ current, total, label, color = 'bg-saffron-500' }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-semibold text-stone-700">{label}</span>
          <span className="text-sm font-bold text-stone-800 tabular-nums">
            {current}/{total}
          </span>
        </div>
      )}
      <div
        className="w-full h-3 bg-cream-200 rounded-full overflow-hidden border border-cream-300"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
