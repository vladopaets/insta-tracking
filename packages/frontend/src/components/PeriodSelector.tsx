import dayjs from 'dayjs';

interface PeriodSelectorProps {
  period: 'week' | 'month';
  date: string;
  onPeriodChange: (period: 'week' | 'month') => void;
  onDateChange: (date: string) => void;
}

export function PeriodSelector({
  period,
  date,
  onPeriodChange,
  onDateChange,
}: PeriodSelectorProps) {
  const d = dayjs(date);
  const label =
    period === 'week'
      ? `${d.startOf('week').format('MMM D')} — ${d.endOf('week').format('MMM D, YYYY')}`
      : d.format('MMMM YYYY');

  const prev = () => onDateChange(d.subtract(1, period).format('YYYY-MM-DD'));
  const next = () => onDateChange(d.add(1, period).format('YYYY-MM-DD'));
  const today = () => onDateChange(dayjs().format('YYYY-MM-DD'));

  const isToday = d.isSame(dayjs(), period);

  return (
    <div className="it-period">
      <div className="it-seg" role="tablist" aria-label="Period">
        <button
          type="button"
          className={period === 'week' ? 'active' : ''}
          onClick={() => onPeriodChange('week')}
          role="tab"
          aria-selected={period === 'week'}
        >
          Week
        </button>
        <button
          type="button"
          className={period === 'month' ? 'active' : ''}
          onClick={() => onPeriodChange('month')}
          role="tab"
          aria-selected={period === 'month'}
        >
          Month
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          type="button"
          className="it-nav-btn"
          onClick={prev}
          aria-label={`Previous ${period}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="it-period-label">
          <span
            key={label}
            style={{
              display: 'inline-block',
              animation: 'it-fade 0.35s ease',
            }}
          >
            {label}
          </span>
        </div>
        <button
          type="button"
          className="it-nav-btn"
          onClick={next}
          aria-label={`Next ${period}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {!isToday && (
        <button type="button" className="it-today-pill" onClick={today}>
          · Today
        </button>
      )}

      <div style={{ flex: 1 }} />

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--muted)',
          letterSpacing: '0.06em',
        }}
      >
        {d.format('YYYY.MM.DD')}
      </div>
    </div>
  );
}
