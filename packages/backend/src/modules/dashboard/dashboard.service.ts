import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import * as dayjs from 'dayjs';
import { AdSpending } from '../ad-spending/entities/ad-spending.entity';
import { Income } from '../income/entities/income.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(AdSpending)
    private adSpendingRepo: Repository<AdSpending>,
    @InjectRepository(Income)
    private incomeRepo: Repository<Income>,
  ) {}

  async getDashboard(userId: string, period: 'week' | 'month', date?: string) {
    const baseDate = date ? dayjs(date) : dayjs();
    const start = baseDate.startOf(period).format('YYYY-MM-DD');
    const end = baseDate.endOf(period).format('YYYY-MM-DD');
    const dateRange = { start, end };

    const [spending, income] = await Promise.all([
      this.adSpendingRepo.find({
        where: { userId, date: Between(start, end) },
        order: { date: 'ASC' },
      }),
      this.incomeRepo.find({
        where: { userId, date: Between(start, end) },
        order: { date: 'ASC' },
      }),
    ]);

    const totalAdSpending = spending.reduce(
      (sum, s) => sum + Number(s.amount),
      0,
    );
    const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
    const roi =
      totalAdSpending > 0
        ? Math.round(
            ((totalIncome - totalAdSpending) / totalAdSpending) * 100 * 100,
          ) / 100
        : 0;

    return {
      period,
      dateRange,
      totalAdSpending: Math.round(totalAdSpending * 100) / 100,
      totalIncome: Math.round(totalIncome * 100) / 100,
      roi,
      adSpendingEntries: spending,
      incomeEntries: income,
    };
  }
}
