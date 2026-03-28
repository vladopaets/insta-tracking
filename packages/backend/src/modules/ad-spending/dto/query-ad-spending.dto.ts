import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QueryAdSpendingDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  campaignName?: string;
}
