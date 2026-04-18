import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import type { DashboardData } from '../api/dashboard';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  headerBlock: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 8,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },
  metaLine: {
    fontSize: 9,
    marginTop: 2,
  },
  periodText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  summary: {
    fontSize: 10,
    marginBottom: 14,
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000000',
    marginBottom: 16,
  },
  statCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  statCellLast: {
    borderRightWidth: 0,
  },
  statLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#bbbbbb',
    paddingVertical: 4,
  },
  tableCell: {
    fontSize: 9,
  },
  tableTotalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 4,
    marginTop: 2,
  },
  tableTotalCell: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  colDate: { width: '18%' },
  colName: { width: '37%' },
  colNotes: { width: '30%' },
  colAmount: { width: '15%', textAlign: 'right' },
  empty: {
    fontSize: 10,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  sourcesList: {
    marginBottom: 12,
  },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#bbbbbb',
  },
  sourceName: {
    fontSize: 10,
  },
  sourceAmount: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#444444',
    borderTopWidth: 0.5,
    borderTopColor: '#888888',
    paddingTop: 6,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    borderBottomWidth: 0.25,
    borderBottomColor: '#dddddd',
  },
  chartDate: {
    width: '14%',
    fontSize: 8,
  },
  chartBars: {
    flex: 1,
    paddingRight: 8,
  },
  chartBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0.75,
  },
  chartBarLabel: {
    width: 48,
    fontSize: 7,
    color: '#555555',
  },
  chartBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#eeeeee',
  },
  chartBarFill: {
    height: 6,
  },
  chartAmount: {
    width: 46,
    fontSize: 7,
    textAlign: 'right',
  },
  chartNet: {
    width: '16%',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  chartLegend: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 10,
    fontSize: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  legendSwatch: {
    width: 10,
    height: 8,
    marginRight: 4,
  },
  netTrack: {
    height: 10,
    backgroundColor: '#eeeeee',
    position: 'relative',
    marginTop: 4,
    marginBottom: 4,
  },
  netZeroTick: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 0.5,
    backgroundColor: '#888888',
  },
  netBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#1a1a1a',
  },
  netRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1.5,
    borderBottomWidth: 0.25,
    borderBottomColor: '#dddddd',
  },
});

const money = (n: number) => `$${n.toFixed(2)}`;

interface DailyPoint {
  date: string;
  spending: number;
  income: number;
  net: number;
}

function buildChartData(data: DashboardData): DailyPoint[] {
  const map = new Map<string, DailyPoint>();
  const keyOf = (iso: string) => dayjs(iso).format('YYYY-MM-DD');

  for (const e of data.adSpendingEntries) {
    const k = keyOf(e.date);
    const row = map.get(k) ?? { date: k, spending: 0, income: 0, net: 0 };
    row.spending += Number(e.amount);
    map.set(k, row);
  }
  for (const e of data.incomeEntries) {
    const k = keyOf(e.date);
    const row = map.get(k) ?? { date: k, spending: 0, income: 0, net: 0 };
    row.income += Number(e.amount);
    map.set(k, row);
  }
  const rows = Array.from(map.values()).sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );
  let running = 0;
  for (const r of rows) {
    running += r.income - r.spending;
    r.net = running;
  }
  return rows;
}

interface BarChartProps {
  data: DailyPoint[];
}

function BarChart({ data }: BarChartProps) {
  if (data.length === 0) {
    return <Text style={styles.empty}>No entries recorded.</Text>;
  }
  const maxBar = Math.max(
    1,
    ...data.map((d) => Math.max(d.spending, d.income)),
  );
  return (
    <View>
      {data.map((d) => {
        const spendPct = (d.spending / maxBar) * 100;
        const incomePct = (d.income / maxBar) * 100;
        return (
          <View key={d.date} style={styles.chartRow} wrap={false}>
            <Text style={styles.chartDate}>{dayjs(d.date).format('MMM D')}</Text>
            <View style={styles.chartBars}>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Spending</Text>
                <View style={styles.chartBarTrack}>
                  <View
                    style={[
                      styles.chartBarFill,
                      { width: `${spendPct}%`, backgroundColor: '#1a1a1a' },
                    ]}
                  />
                </View>
                <Text style={styles.chartAmount}>{money(d.spending)}</Text>
              </View>
              <View style={styles.chartBarRow}>
                <Text style={styles.chartBarLabel}>Income</Text>
                <View style={styles.chartBarTrack}>
                  <View
                    style={[
                      styles.chartBarFill,
                      { width: `${incomePct}%`, backgroundColor: '#888888' },
                    ]}
                  />
                </View>
                <Text style={styles.chartAmount}>{money(d.income)}</Text>
              </View>
            </View>
            <Text style={styles.chartNet}>{money(d.net)}</Text>
          </View>
        );
      })}
    </View>
  );
}

interface NetArcProps {
  data: DailyPoint[];
}

function NetArc({ data }: NetArcProps) {
  if (data.length === 0) {
    return <Text style={styles.empty}>No entries recorded.</Text>;
  }
  const nets = data.map((d) => d.net);
  const minNet = Math.min(0, ...nets);
  const maxNet = Math.max(0, ...nets);
  const range = Math.max(1, maxNet - minNet);
  const zeroPct = ((0 - minNet) / range) * 100;

  return (
    <View>
      {data.map((d) => {
        const fromPct = ((Math.min(0, d.net) - minNet) / range) * 100;
        const widthPct = (Math.abs(d.net) / range) * 100;
        return (
          <View key={d.date} style={styles.netRow} wrap={false}>
            <Text style={[styles.chartDate, { width: '18%' }]}>
              {dayjs(d.date).format('MMM D')}
            </Text>
            <View style={[styles.netTrack, { flex: 1 }]}>
              <View style={[styles.netZeroTick, { left: `${zeroPct}%` }]} />
              <View
                style={[
                  styles.netBar,
                  { left: `${fromPct}%`, width: `${widthPct}%` },
                ]}
              />
            </View>
            <Text style={[styles.chartNet, { width: '18%' }]}>
              {money(d.net)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

interface DashboardPdfDocumentProps {
  data: DashboardData;
  periodLabel: string;
  generatedAt: Date;
}

export function DashboardPdfDocument({
  data,
  periodLabel,
  generatedAt,
}: DashboardPdfDocumentProps) {
  const chartData = buildChartData(data);
  const totalSpending = Number(data.totalAdSpending ?? 0);
  const totalIncome = Number(data.totalIncome ?? 0);
  const roi = Number(data.roi ?? 0);
  const net = totalIncome - totalSpending;

  const topSources = [...data.incomeEntries]
    .reduce((acc, e) => {
      const key = e.clientName || e.source || 'Other';
      const existing = acc.find((a) => a.name === key);
      if (existing) existing.value += Number(e.amount);
      else acc.push({ name: key, value: Number(e.amount) });
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const spendingRows = [...data.adSpendingEntries].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );
  const incomeRows = [...data.incomeEntries].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );

  return (
    <Document
      title={`Ledger — ${periodLabel}`}
      author="Insta Tracking"
      subject="Ad spending and income report"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBlock}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Ledger</Text>
              <Text style={styles.metaLine}>Ad spending &amp; income report</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.periodText}>{periodLabel}</Text>
              <Text style={styles.metaLine}>
                Generated {dayjs(generatedAt).format('MMM D, YYYY · HH:mm')}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.summary}>
          This period: {money(totalSpending)} spent, {money(totalIncome)} earned, net
          {' '}
          {money(net)}, ROI {roi.toFixed(1)}%.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Ad Spending</Text>
            <Text style={styles.statValue}>{money(totalSpending)}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statValue}>{money(totalIncome)}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Net</Text>
            <Text style={styles.statValue}>{money(net)}</Text>
          </View>
          <View style={[styles.statCell, styles.statCellLast]}>
            <Text style={styles.statLabel}>ROI</Text>
            <Text style={styles.statValue}>{roi.toFixed(1)}%</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Daily spending vs income · running net</Text>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: '#1a1a1a' }]} />
            <Text>Spending</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: '#888888' }]} />
            <Text>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <Text>· Right column: running net</Text>
          </View>
        </View>
        <BarChart data={chartData} />

        <Text style={styles.sectionTitle}>Cumulative net</Text>
        <NetArc data={chartData} />

        <Text style={styles.sectionTitle}>Top sources</Text>
        {topSources.length === 0 ? (
          <Text style={styles.empty}>No income recorded.</Text>
        ) : (
          <View style={styles.sourcesList}>
            {topSources.map((s, i) => (
              <View key={s.name} style={styles.sourceRow}>
                <Text style={styles.sourceName}>
                  {String(i + 1).padStart(2, '0')}  {s.name}
                </Text>
                <Text style={styles.sourceAmount}>{money(s.value)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>Ledger · {periodLabel}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.sectionTitle}>Ad spending — line items</Text>
        <View style={styles.tableHeader} fixed>
          <Text style={[styles.tableHeaderCell, styles.colDate]}>Date</Text>
          <Text style={[styles.tableHeaderCell, styles.colName]}>Source / campaign</Text>
          <Text style={[styles.tableHeaderCell, styles.colNotes]}>Notes</Text>
          <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
        </View>
        {spendingRows.length === 0 ? (
          <Text style={styles.empty}>No entries recorded.</Text>
        ) : (
          <>
            {spendingRows.map((e) => (
              <View key={e.id} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCell, styles.colDate]}>
                  {dayjs(e.date).format('YYYY-MM-DD')}
                </Text>
                <Text style={[styles.tableCell, styles.colName]}>
                  {[e.platform, e.campaignName].filter(Boolean).join(' · ') || '—'}
                </Text>
                <Text style={[styles.tableCell, styles.colNotes]}>
                  {e.description || ''}
                </Text>
                <Text style={[styles.tableCell, styles.colAmount]}>
                  {money(Number(e.amount))}
                </Text>
              </View>
            ))}
            <View style={styles.tableTotalRow} wrap={false}>
              <Text style={[styles.tableTotalCell, styles.colDate]}>Total</Text>
              <Text style={[styles.tableTotalCell, styles.colName]}></Text>
              <Text style={[styles.tableTotalCell, styles.colNotes]}></Text>
              <Text style={[styles.tableTotalCell, styles.colAmount]}>
                {money(totalSpending)}
              </Text>
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Income — line items</Text>
        <View style={styles.tableHeader} fixed>
          <Text style={[styles.tableHeaderCell, styles.colDate]}>Date</Text>
          <Text style={[styles.tableHeaderCell, styles.colName]}>Client / source</Text>
          <Text style={[styles.tableHeaderCell, styles.colNotes]}>Notes</Text>
          <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
        </View>
        {incomeRows.length === 0 ? (
          <Text style={styles.empty}>No entries recorded.</Text>
        ) : (
          <>
            {incomeRows.map((e) => (
              <View key={e.id} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCell, styles.colDate]}>
                  {dayjs(e.date).format('YYYY-MM-DD')}
                </Text>
                <Text style={[styles.tableCell, styles.colName]}>
                  {[e.source, e.clientName].filter(Boolean).join(' · ') || '—'}
                </Text>
                <Text style={[styles.tableCell, styles.colNotes]}>
                  {e.description || ''}
                </Text>
                <Text style={[styles.tableCell, styles.colAmount]}>
                  {money(Number(e.amount))}
                </Text>
              </View>
            ))}
            <View style={styles.tableTotalRow} wrap={false}>
              <Text style={[styles.tableTotalCell, styles.colDate]}>Total</Text>
              <Text style={[styles.tableTotalCell, styles.colName]}></Text>
              <Text style={[styles.tableTotalCell, styles.colNotes]}></Text>
              <Text style={[styles.tableTotalCell, styles.colAmount]}>
                {money(totalIncome)}
              </Text>
            </View>
          </>
        )}

        <View style={styles.footer} fixed>
          <Text>Ledger · {periodLabel}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function generateDashboardPdfBlob(
  data: DashboardData,
  periodLabel: string,
  generatedAt: Date,
): Promise<Blob> {
  return pdf(
    <DashboardPdfDocument
      data={data}
      periodLabel={periodLabel}
      generatedAt={generatedAt}
    />,
  ).toBlob();
}
