interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  kind?: 'spending' | 'income' | 'roi';
  trend?: { value: string; direction: 'up' | 'down' };
  caption?: string;
}

export function StatsCard({ title, value, subtitle, kind = 'roi', trend, caption }: StatsCardProps) {
  const strValue = String(value);
  const [num, decimals] = strValue.split('.');

  return (
    <div className={`it-card it-stat it-stat-${kind}`}>
      <div className="it-card-accent" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <span className="it-eyebrow">{title}</span>
        {trend && (
          <span className={`it-trend it-trend-${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className="it-stat-value">
        {num}
        {decimals && <sup>.{decimals}</sup>}
      </div>
      {caption && (
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: 'var(--muted)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-display)',
          }}
        >
          {caption}
        </div>
      )}
      {subtitle && (
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>{subtitle}</div>
      )}
    </div>
  );
}
