export default function ProgressRing({ percentage = 0 }) {
  const size = 64;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Inset well behind the ring */}
      <div className="absolute inset-0 rounded-full bg-neu-bg shadow-neu-inset-sm" />

      <svg width={size} height={size} className="-rotate-90 relative">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(163,177,198)"
          strokeWidth={strokeWidth}
          strokeOpacity={0.4}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#38B2AC"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <span className="absolute text-xs font-bold" style={{ color: '#3D4852' }}>
        {Math.round(percentage)}%
      </span>
    </div>
  );
}
