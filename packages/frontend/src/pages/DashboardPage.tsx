import { useState } from 'react';
import { SimpleGrid, Title, Paper, Text, LoadingOverlay } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import { getDashboard } from '../api/dashboard';
import { StatsCard } from '../components/StatsCard';
import { PeriodSelector } from '../components/PeriodSelector';

export function DashboardPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', period, date],
    queryFn: () => getDashboard(period, date),
  });

  const chartData = (data?.adSpendingEntries ?? []).reduce(
    (acc, e) => {
      const d = dayjs(e.date).format('MMM D');
      const existing = acc.find((a) => a.date === d);
      if (existing) {
        existing.spending += Number(e.amount);
      } else {
        acc.push({ date: d, spending: Number(e.amount), income: 0 });
      }
      return acc;
    },
    [] as { date: string; spending: number; income: number }[],
  );

  (data?.incomeEntries ?? []).forEach((e) => {
    const d = dayjs(e.date).format('MMM D');
    const existing = chartData.find((a) => a.date === d);
    if (existing) {
      existing.income += Number(e.amount);
    } else {
      chartData.push({ date: d, spending: 0, income: Number(e.amount) });
    }
  });

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} />
      <Title order={2} mb="md">
        Dashboard
      </Title>
      <PeriodSelector
        period={period}
        date={date}
        onPeriodChange={setPeriod}
        onDateChange={setDate}
      />

      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
        <StatsCard
          title="Ad Spending"
          value={`$${data?.totalAdSpending?.toFixed(2) ?? '0.00'}`}
          color="red"
        />
        <StatsCard
          title="Income"
          value={`$${data?.totalIncome?.toFixed(2) ?? '0.00'}`}
          color="green"
        />
        <StatsCard
          title="ROI"
          value={`${data?.roi ?? 0}%`}
          color={data && data.roi >= 0 ? 'green' : 'red'}
        />
      </SimpleGrid>

      <Paper withBorder p="md" radius="md">
        <Text fw={600} mb="sm">
          Spending vs Income
        </Text>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="spending" fill="#fa5252" name="Spending" />
            <Bar dataKey="income" fill="#40c057" name="Income" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
}
