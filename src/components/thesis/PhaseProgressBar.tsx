interface PhaseProgressBarProps {
  progress: number;
}

export function PhaseProgressBar({ progress }: PhaseProgressBarProps) {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
