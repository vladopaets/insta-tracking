import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get()
  getDashboard(
    @CurrentUser() user: { id: string },
    @Query('period') period: 'week' | 'month' = 'month',
    @Query('date') date?: string,
  ) {
    return this.service.getDashboard(user.id, period, date);
  }
}
