import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Income } from './entities/income.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { QueryIncomeDto } from './dto/query-income.dto';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private repo: Repository<Income>,
  ) {}

  create(userId: string, dto: CreateIncomeDto) {
    const entry = this.repo.create({ ...dto, userId });
    return this.repo.save(entry);
  }

  findAll(userId: string, query: QueryIncomeDto) {
    const where: any = { userId };
    if (query.startDate && query.endDate) {
      where.date = Between(query.startDate, query.endDate);
    }
    if (query.source) {
      where.source = Like(`%${query.source}%`);
    }
    return this.repo.find({ where, order: { date: 'DESC' } });
  }

  async findOne(userId: string, id: string) {
    const entry = await this.repo.findOne({ where: { id, userId } });
    if (!entry) throw new NotFoundException('Income entry not found');
    return entry;
  }

  async update(userId: string, id: string, dto: UpdateIncomeDto) {
    const entry = await this.findOne(userId, id);
    Object.assign(entry, dto);
    return this.repo.save(entry);
  }

  async remove(userId: string, id: string) {
    const entry = await this.findOne(userId, id);
    return this.repo.remove(entry);
  }

  async summary(userId: string, period: 'week' | 'month') {
    const trunc = period === 'week' ? 'week' : 'month';
    return this.repo
      .createQueryBuilder('i')
      .select(`DATE_TRUNC('${trunc}', i.date)`, 'period')
      .addSelect('SUM(i.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('i.userId = :userId', { userId })
      .groupBy('period')
      .orderBy('period', 'DESC')
      .limit(12)
      .getRawMany();
  }
}
