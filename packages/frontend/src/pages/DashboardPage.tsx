import { useState } from 'react';
import { SimpleGrid, LoadingOverlay, Box } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import dayjs from 'dayjs';
import { getDashboard } from '../api/dashboard';
import { StatsCard } from '../components/StatsCard';
import { PeriodSelector } from '../components/PeriodSelector';
import { TutorialSection } from '../components/TutorialSection';

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
      if (existing) existing.spending += Number(e.amount);
      else acc.push({ date: d, spending: Number(e.amount), income: 0, net: 0 });
      return acc;
    },
    [] as { date: string; spending: number; income: number; net: number }[],
  );

  (data?.incomeEntries ?? []).forEach((e) => {
    const d = dayjs(e.date).format('MMM D');
    const existing = chartData.find((a) => a.date === d);
    if (existing) existing.income += Number(e.amount);
    else chartData.push({ date: d, spending: 0, income: Number(e.amount), net: 0 });
  });

  chartData.sort((a, b) => dayjs(a.date, 'MMM D').unix() - dayjs(b.date, 'MMM D').unix());
  let running = 0;
  chartData.forEach((row) => {
    running += row.income - row.spending;
    row.net = running;
  });

  const totalSpending = data?.totalAdSpending ?? 0;
  const totalIncome = data?.totalIncome ?? 0;
  const roi = data?.roi ?? 0;
  const net = totalIncome - totalSpending;

  const roiClamped = Math.max(-100, Math.min(200, roi));
  const roiData = [{ name: 'ROI', value: roiClamped, fill: roi >= 0 ? '#4a6b4f' : '#a6483a' }];

  const topClients = (data?.incomeEntries ?? [])
    .reduce((acc, e) => {
      const key = e.clientName || e.source || 'Other';
      const existing = acc.find((a) => a.name === key);
      if (existing) existing.value += Number(e.amount);
      else acc.push({ name: key, value: Number(e.amount) });
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const maxClient = Math.max(...topClients.map((c) => c.value), 1);

  return (
    <Box style={{ position: 'relative' }}>
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ backgroundOpacity: 0.4, color: '#f5efe4' }}
      />

      {/* Header */}
      <div className="it-section-head it-stagger" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="it-eyebrow" style={{ marginBottom: 8 }}>
            §01 · Overview
          </div>
          <h1 className="it-pagetitle">
            The <em>Ledger</em>
          </h1>
          <div className="it-pagesub">
            A considered view of your practice's advertising investments & returns.
          </div>
        </div>
        <div
          style={{
            textAlign: 'right',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            color: 'var(--muted)',
            fontSize: 13,
          }}
        >
          <div>{dayjs().format('dddd')}</div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontStyle: 'normal',
              fontSize: 11,
              letterSpacing: '0.12em',
              marginTop: 4,
            }}
          >
            {dayjs().format('YYYY · MM · DD')}
          </div>
        </div>
      </div>

      {/* Period selector */}
      <Box mb="xl" className="it-stagger">
        <PeriodSelector
          period={period}
          date={date}
          onPeriodChange={setPeriod}
          onDateChange={setDate}
        />
      </Box>

      {/* Stats row */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" className="it-stagger">
        <StatsCard
          title="Ad Spending"
          value={`$${totalSpending.toFixed(2)}`}
          kind="spending"
          caption={`across ${data?.adSpendingEntries?.length ?? 0} entries`}
        />
        <StatsCard
          title="Income"
          value={`$${totalIncome.toFixed(2)}`}
          kind="income"
          caption={`across ${data?.incomeEntries?.length ?? 0} entries`}
        />
        <StatsCard
          title="Net"
          value={`$${net.toFixed(2)}`}
          kind={net >= 0 ? 'income' : 'spending'}
          caption={net >= 0 ? 'in the black' : 'in the red'}
          trend={
            net !== 0
              ? {
                  value: `${((Math.abs(net) / (totalSpending || 1)) * 100).toFixed(0)}%`,
                  direction: net >= 0 ? 'up' : 'down',
                }
              : undefined
          }
        />
        <StatsCard
          title="Return on Ad Spend"
          value={`${roi.toFixed(1)}%`}
          kind="roi"
          caption={
            roi >= 100 ? 'exceptional' : roi >= 0 ? 'in balance' : 'reassess campaigns'
          }
        />
      </SimpleGrid>

      {/* Main chart + ROI dial */}
      <SimpleGrid cols={{ base: 1, lg: 3 }} mb="xl" spacing="md">
        <Box style={{ gridColumn: 'span 2' }} className="it-chart-panel">
          <div className="it-chart-header">
            <div>
              <h3 className="it-chart-title">
                Spending <em>vs</em> Income
              </h3>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                Daily distribution · running net
              </div>
            </div>
            <div className="it-legend">
              <span>
                <span className="it-legend-dot" style={{ background: 'var(--terracotta)' }} />
                Spending
              </span>
              <span>
                <span className="it-legend-dot" style={{ background: 'var(--sage)' }} />
                Income
              </span>
              <span>
                <span
                  className="it-legend-dot"
                  style={{
                    background: 'var(--brass)',
                    height: 2,
                    borderRadius: 0,
                    marginBottom: 3,
                  }}
                />
                Running Net
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c97560" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#a6483a" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7a9c7f" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#4a6b4f" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#c9bda4' }} />
              <YAxis tickLine={false} axisLine={false} width={50} />
              <Tooltip
                cursor={{ fill: 'rgba(176, 139, 71, 0.08)' }}
                formatter={(v) => `$${Number(v).toFixed(2)}`}
              />
              <Bar
                dataKey="spending"
                fill="url(#gradSpending)"
                name="Spending"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
                animationDuration={800}
              />
              <Bar
                dataKey="income"
                fill="url(#gradIncome)"
                name="Income"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
                animationDuration={800}
                animationBegin={150}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#b08b47"
                strokeWidth={2.5}
                strokeDasharray="0"
                dot={{ r: 3, fill: '#b08b47', strokeWidth: 2, stroke: '#fdfaf3' }}
                activeDot={{ r: 6, fill: '#8e6d30', stroke: '#fdfaf3', strokeWidth: 3 }}
                name="Running Net"
                animationDuration={1200}
                animationBegin={300}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        <Box className="it-chart-panel">
          <div className="it-chart-header">
            <div>
              <h3 className="it-chart-title">
                Return <em>dial</em>
              </h3>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                ROI · clamped ±100%
              </div>
            </div>
          </div>
          <Box style={{ position: 'relative', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="72%"
                outerRadius="100%"
                data={roiData}
                startAngle={210}
                endAngle={-30}
              >
                <PolarAngleAxis type="number" domain={[-100, 200]} tick={false} />
                <RadialBar
                  background={{ fill: '#ebe2d1' }}
                  dataKey="value"
                  cornerRadius={20}
                  animationDuration={1200}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 44,
                  fontWeight: 500,
                  color: roi >= 0 ? 'var(--sage)' : 'var(--terracotta)',
                  lineHeight: 1,
                  fontVariationSettings: "'SOFT' 20, 'opsz' 144",
                  letterSpacing: '-0.02em',
                }}
              >
                {roi.toFixed(0)}
                <span style={{ fontSize: 24, color: 'var(--muted)' }}>%</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: 'var(--muted)',
                  marginTop: 4,
                }}
              >
                {roi >= 100
                  ? 'flourishing'
                  : roi >= 25
                  ? 'healthy'
                  : roi >= 0
                  ? 'sustaining'
                  : 'attention needed'}
              </div>
            </div>
          </Box>
        </Box>
      </SimpleGrid>

      {/* Secondary row: income trend area + top clients */}
      <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl" spacing="md">
        <Box className="it-chart-panel">
          <div className="it-chart-header">
            <div>
              <h3 className="it-chart-title">
                Net <em>arc</em>
              </h3>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                Cumulative balance over period
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b08b47" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#b08b47" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#c9bda4' }} />
              <YAxis tickLine={false} axisLine={false} width={50} />
              <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
              <Area
                type="monotone"
                dataKey="net"
                stroke="#b08b47"
                strokeWidth={2.5}
                fill="url(#gradNet)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box className="it-chart-panel">
          <div className="it-chart-header">
            <div>
              <h3 className="it-chart-title">
                Top <em>sources</em>
              </h3>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                Five highest earning clients · channels
              </div>
            </div>
          </div>
          {topClients.length === 0 ? (
            <div
              style={{
                padding: '40px 0',
                textAlign: 'center',
                color: 'var(--muted)',
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
              }}
            >
              No income recorded for this period.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10, paddingBottom: 12 }}>
              {topClients.map((c, i) => (
                <div key={c.name} style={{ display: 'grid', gap: 4 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: 'var(--ink)', fontWeight: 500 }}>
                      <span
                        className="it-mono"
                        style={{ color: 'var(--muted)', marginRight: 8, fontSize: 11 }}
                      >
                        0{i + 1}
                      </span>
                      {c.name}
                    </span>
                    <span
                      className="it-mono"
                      style={{ color: 'var(--ink)', fontWeight: 500 }}
                    >
                      ${c.value.toFixed(2)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: 'var(--paper-deep)',
                      borderRadius: 999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(c.value / maxClient) * 100}%`,
                        height: '100%',
                        background:
                          'linear-gradient(90deg, var(--sage-soft), var(--sage))',
                        borderRadius: 999,
                        transition: 'width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Box>
      </SimpleGrid>

      {/* Tutorial */}
      <TutorialSection
        eyebrow="Field guide"
        title="How to *read* this dashboard"
        intro="A brief orientation for new visitors. Use it to understand each panel, and to make the most of the tools at your disposal."
        defaultOpen
        steps={[
          {
            title: 'Set the window',
            body: 'Choose Week or Month at the top, then step through time with the chevron buttons. The Today pill appears when you have wandered away from the present.',
          },
          {
            title: 'Scan the four figures',
            body: 'Spending, Income, Net, and Return on Ad Spend summarise the selected period at a glance. The small caption beneath tells you the health of each.',
          },
          {
            title: 'Follow the daily rhythm',
            body: 'The main chart lays spending against income bar by bar, and draws a gold line for your running net. Hover any day for precise figures.',
          },
          {
            title: 'Read the return dial',
            body: 'The dial shows ROI on a ±100% arc — sage when positive, terracotta when attention is needed. It reacts to the window you select.',
          },
          {
            title: 'Identify top sources',
            body: 'Your five highest-earning clients or channels appear in the lower right — useful when deciding where to invest more time or advertising spend.',
          },
          {
            title: 'Record new entries',
            body: 'Visit Ad Spending (§02) or Income (§03) from the sidebar to add, edit, or remove entries. The dashboard will refresh automatically.',
          },
        ]}
      />

    </Box>
  );
}
