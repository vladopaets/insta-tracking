import { Group, SegmentedControl, ActionIcon, Text } from '@mantine/core';
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
      ? `${d.startOf('week').format('MMM D')} - ${d.endOf('week').format('MMM D, YYYY')}`
      : d.format('MMMM YYYY');

  const prev = () => onDateChange(d.subtract(1, period).format('YYYY-MM-DD'));
  const next = () => onDateChange(d.add(1, period).format('YYYY-MM-DD'));

  return (
    <Group mb="md">
      <SegmentedControl
        value={period}
        onChange={(v) => onPeriodChange(v as 'week' | 'month')}
        data={[
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ]}
      />
      <Group gap="xs">
        <ActionIcon variant="default" onClick={prev}>
          ←
        </ActionIcon>
        <Text fw={500} size="sm" style={{ minWidth: 180, textAlign: 'center' }}>
          {label}
        </Text>
        <ActionIcon variant="default" onClick={next}>
          →
        </ActionIcon>
      </Group>
    </Group>
  );
}
