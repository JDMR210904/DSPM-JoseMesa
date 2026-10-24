import { ReactNode, useId } from 'react';

interface Props {
  value: number;          // 0 a 1
  size?: number;
  stroke?: number;
  colors?: [string, string];
  children?: ReactNode;
}

// Anillo circular de progreso con degradado
const ProgressRing: React.FC<Props> = ({ value, size = 120, stroke = 12, colors = ['#ff3d81', '#00e0ff'], children }) => {
  const id = useId().replace(/:/g, '');
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="ring-wrap" style={{ width: size, height: size, ['--ring-glow' as any]: colors[0] }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle className="track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          className="value" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          stroke={`url(#g${id})`} strokeDasharray={c} strokeDashoffset={c * (1 - v)}
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
};

export default ProgressRing;
