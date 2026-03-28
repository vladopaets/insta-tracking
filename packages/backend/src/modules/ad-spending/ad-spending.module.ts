import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdSpendingController } from './ad-spending.controller';
import { AdSpendingService } from './ad-spending.service';
import { AdSpending } from './entities/ad-spending.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdSpending])],
  controllers: [AdSpendingController],
  providers: [AdSpendingService],
  exports: [AdSpendingService],
})
export class AdSpendingModule {}
