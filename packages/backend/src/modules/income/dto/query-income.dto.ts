import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QueryIncomeDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  source?: string;
}
