import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdSpendingService } from './ad-spending.service';
import { CreateAdSpendingDto } from './dto/create-ad-spending.dto';
import { UpdateAdSpendingDto } from './dto/update-ad-spending.dto';
import { QueryAdSpendingDto } from './dto/query-ad-spending.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('ad-spending')
export class AdSpendingController {
  constructor(private service: AdSpendingService) {}

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateAdSpendingDto,
  ) {
    return this.service.create(user.id, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: { id: string },
    @Query() query: QueryAdSpendingDto,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Get('summary')
  summary(
    @CurrentUser() user: { id: string },
    @Query('period') period: 'week' | 'month' = 'month',
  ) {
    return this.service.summary(user.id, period);
  }

  @Get(':id')
  findOne(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.service.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateAdSpendingDto,
  ) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
