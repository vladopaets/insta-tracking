import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { AdSpending } from './entities/ad-spending.entity';
import { CreateAdSpendingDto } from './dto/create-ad-spending.dto';
import { UpdateAdSpendingDto } from './dto/update-ad-spending.dto';
import { QueryAdSpendingDto } from './dto/query-ad-spending.dto';

@Injectable()
export class AdSpendingService {
  constructor(
    @InjectRepository(AdSpending)
    private repo: Repository<AdSpending>,
  ) {}

  create(userId: string, dto: CreateAdSpendingDto) {
    const entry = this.repo.create({ ...dto, userId });
    return this.repo.save(entry);
  }

  findAll(userId: string, query: QueryAdSpendingDto) {
    const where: any = { userId };
    if (query.startDate && query.endDate) {
      where.date = Between(query.startDate, query.endDate);
    }
    if (query.campaignName) {
      where.campaignName = Like(`%${query.campaignName}%`);
    }
    return this.repo.find({ where, order: { date: 'DESC' } });
  }

  async findOne(userId: string, id: string) {
    const entry = await this.repo.findOne({ where: { id, userId } });
    if (!entry) throw new NotFoundException('Ad spending entry not found');
    return entry;
  }

  async update(userId: string, id: string, dto: UpdateAdSpendingDto) {
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
      .createQueryBuilder('a')
      .select(`DATE_TRUNC('${trunc}', a.date)`, 'period')
      .addSelect('SUM(a.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('a.userId = :userId', { userId })
      .groupBy('period')
      .orderBy('period', 'DESC')
      .limit(12)
      .getRawMany();
  }
}
