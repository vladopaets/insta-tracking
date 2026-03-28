import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AdSpending } from '../ad-spending/entities/ad-spending.entity';
import { Income } from '../income/entities/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdSpending, Income])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
