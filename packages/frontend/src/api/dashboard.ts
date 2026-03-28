import client from './client';
import type { AdSpending } from './ad-spending';
import type { Income } from './income';

export interface DashboardData {
  period: 'week' | 'month';
  dateRange: { start: string; end: string };
  totalAdSpending: number;
  totalIncome: number;
  roi: number;
  adSpendingEntries: AdSpending[];
  incomeEntries: Income[];
}

export const getDashboard = (period: 'week' | 'month', date?: string) =>
  client.get<DashboardData>('/dashboard', { params: { period, date } }).then((r) => r.data);
